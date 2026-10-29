"""Base de conhecimento: importação, processamento, atualização e remoção.

Pipeline: validar → guardar original → extrair → normalizar → dividir em
trechos → gerar embeddings → gravar trechos + índice lexical numa única
transação → registrar resultado. O processamento roda em segundo plano
(``asyncio``), com estado persistido, cancelamento e reprocessamento idempotente.
"""

import asyncio
import hashlib
import logging
import re
import struct
from pathlib import Path

from psycopg import Binary

from app.core.config import config
from app.db.database import get_conn, log_activity, new_id, now_iso, row_to_dict
from app.llm.base import LLMError
from app.llm.registry import get_embed_provider
from app.services.conversation import conversation_service
from app.services.knowledge.chunking import chunk_sections
from app.services.knowledge.extract import (
    SUPPORTED,
    ExtractionError,
    Section,
    decode_text,
    detect_type,
    extract,
    html_to_sections,
    normalize_text,
)
from app.services.knowledge.urlfetch import URLFetchError, fetch_url, validate_url
from app.services.project import NotFoundError, project_service
from app.services.settings import get_settings


logger = logging.getLogger("saite.knowledge")

EMBED_BATCH = 16


class KnowledgeError(ValueError):
    pass


def pack_embedding(vector: list[float]) -> bytes:
    return struct.pack(f"<{len(vector)}f", *vector)


def unpack_embedding(blob: bytes, dim: int) -> tuple[float, ...]:
    return struct.unpack(f"<{dim}f", blob)


def embed_prefix(model: str, kind: str) -> str:
    """Prefixos recomendados por alguns modelos de embedding (ex.: nomic-embed-text)."""
    if "nomic" in model:
        return "search_query: " if kind == "query" else "search_document: "
    return ""


def _safe_filename(name: str) -> str:
    name = Path(name).name or "arquivo"
    name = re.sub(r"[^\w.\- ]+", "_", name, flags=re.UNICODE).strip(" .") or "arquivo"
    return name[:120]


def resolve_scope(scope: str, project_id: str | None, conversation_id: str | None):
    """Valida o escopo e devolve (scope, project_id, conversation_id) consistentes."""
    if scope == "global":
        return "global", None, None
    if scope == "project":
        if not project_id:
            raise KnowledgeError("Informe o projeto para documentos de projeto.")
        project_service.get_project(project_id)
        return "project", project_id, None
    if scope == "conversation":
        if not conversation_id:
            raise KnowledgeError("Informe a conversa para documentos de conversa.")
        conversation = conversation_service.get_conversation(conversation_id)
        return "conversation", conversation["project_id"], conversation_id
    raise KnowledgeError("Escopo inválido. Use global, project ou conversation.")


def _scope_filter(scope: str, project_id: str | None, conversation_id: str | None):
    if scope == "global":
        return "scope = 'global'", []
    if scope == "project":
        return "scope = 'project' AND project_id = ?", [project_id]
    return "scope = 'conversation' AND conversation_id = ?", [conversation_id]


class KnowledgeService:

    def __init__(self):
        self._tasks: dict[str, asyncio.Task] = {}

    # ------------------------------------------------------------------ consulta

    def get_document(self, document_id: str) -> dict:
        with get_conn() as conn:
            row = conn.execute("SELECT * FROM documents WHERE id = ?", (document_id,)).fetchone()
        if row is None:
            raise NotFoundError("Documento não encontrado.")
        return row_to_dict(row)

    def list_documents(
        self,
        scope: str | None = None,
        project_id: str | None = None,
        conversation_id: str | None = None,
    ) -> list[dict]:
        clauses, params = [], []
        if scope:
            clause, params = _scope_filter(scope, project_id, conversation_id)
            clauses.append(clause)
        sql = (
            "SELECT d.*, p.name AS project_name FROM documents d"
            " LEFT JOIN projects p ON p.id = d.project_id"
        )
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY d.created_at DESC"
        with get_conn() as conn:
            return [row_to_dict(row) for row in conn.execute(sql, params)]

    def list_chunks(self, document_id: str, limit: int = 200) -> list[dict]:
        self.get_document(document_id)
        with get_conn() as conn:
            rows = conn.execute(
                "SELECT id, ord, location, content, embed_dim IS NOT NULL AS embedded"
                " FROM chunks WHERE document_id = ? ORDER BY ord LIMIT ?",
                (document_id, limit),
            )
            return [row_to_dict(row) for row in rows]

    def stats(self) -> dict:
        with get_conn() as conn:
            row = conn.execute(
                "SELECT COUNT(*) AS documents,"
                " COUNT(*) FILTER (WHERE status = 'ready'"
                "   AND (embed_model IS NULL OR embed_model != ?)) AS stale,"
                " COALESCE(SUM(chunk_count), 0) AS chunks,"
                " COUNT(*) FILTER (WHERE status = 'ready') AS ready,"
                " COUNT(*) FILTER (WHERE status = 'error') AS errors,"
                " COUNT(*) FILTER (WHERE status IN ('pending', 'processing')) AS processing"
                " FROM documents",
                (get_settings()["embed_model"],),
            ).fetchone()
        return {key: int(value) for key, value in row.items()}

    # ---------------------------------------------------------------- importação

    def add_file(
        self,
        filename: str,
        data: bytes,
        scope: str = "global",
        project_id: str | None = None,
        conversation_id: str | None = None,
    ) -> tuple[dict, bool]:
        """Registra o arquivo e retorna (documento, criado). Duplicatas não são reimportadas."""
        if len(data) > config.max_upload_bytes:
            raise KnowledgeError(
                f"Arquivo maior que o limite de {config.max_upload_bytes // (1024 * 1024)} MB."
            )
        try:
            suffix = detect_type(filename, data)
        except ExtractionError as exc:
            raise KnowledgeError(str(exc)) from exc
        scope, project_id, conversation_id = resolve_scope(scope, project_id, conversation_id)
        digest = hashlib.sha256(data).hexdigest()
        duplicate = self._find_duplicate(digest, scope, project_id, conversation_id)
        if duplicate:
            return duplicate, False

        document_id = new_id()
        safe_name = _safe_filename(filename)
        now = now_iso()
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO documents (id, scope, project_id, conversation_id, source_type, name,"
                " mime, size_bytes, sha256, status, created_at, updated_at)"
                " VALUES (?, ?, ?, ?, 'file', ?, ?, ?, ?, 'pending', ?, ?)",
                (
                    document_id, scope, project_id, conversation_id, safe_name,
                    SUPPORTED[suffix], len(data), digest, now, now,
                ),
            )
            # O original fica no banco: o disco do servidor na nuvem é temporário.
            conn.execute(
                "INSERT INTO document_blobs (document_id, data) VALUES (?, ?)", (document_id, Binary(data))
            )
            log_activity(conn, "document.added", {"name": safe_name, "scope": scope}, project_id)
        return self.get_document(document_id), True

    def add_url(
        self,
        url: str,
        scope: str = "global",
        project_id: str | None = None,
        conversation_id: str | None = None,
    ) -> tuple[dict, bool]:
        try:
            normalized, host, _ = validate_url(url)
        except URLFetchError as exc:
            raise KnowledgeError(str(exc)) from exc
        scope, project_id, conversation_id = resolve_scope(scope, project_id, conversation_id)
        clause, params = _scope_filter(scope, project_id, conversation_id)
        with get_conn() as conn:
            existing = conn.execute(
                f"SELECT * FROM documents WHERE url = ? AND {clause}", (normalized, *params)
            ).fetchone()
            if existing:
                return row_to_dict(existing), False
            document_id = new_id()
            now = now_iso()
            conn.execute(
                "INSERT INTO documents (id, scope, project_id, conversation_id, source_type, name,"
                " url, status, created_at, updated_at)"
                " VALUES (?, ?, ?, ?, 'url', ?, ?, 'pending', ?, ?)",
                (document_id, scope, project_id, conversation_id, host, normalized, now, now),
            )
            log_activity(conn, "url.added", {"host": host, "scope": scope}, project_id)
        return self.get_document(document_id), True

    def _find_duplicate(self, digest, scope, project_id, conversation_id) -> dict | None:
        clause, params = _scope_filter(scope, project_id, conversation_id)
        with get_conn() as conn:
            row = conn.execute(
                f"SELECT * FROM documents WHERE sha256 = ? AND {clause}", (digest, *params)
            ).fetchone()
        return row_to_dict(row)

    # -------------------------------------------------------------- processamento

    def schedule(self, document_id: str) -> None:
        """Agenda o processamento em segundo plano (substitui um anterior em curso)."""
        previous = self._tasks.get(document_id)
        if previous and not previous.done():
            previous.cancel()
        task = asyncio.create_task(self.process(document_id))
        self._tasks[document_id] = task

        def _forget(done: asyncio.Task) -> None:
            if self._tasks.get(document_id) is done:
                del self._tasks[document_id]

        task.add_done_callback(_forget)

    def cancel(self, document_id: str) -> bool:
        task = self._tasks.get(document_id)
        if task and not task.done():
            task.cancel()
            return True
        return False

    async def wait(self, document_id: str) -> None:
        task = self._tasks.get(document_id)
        if task:
            try:
                await task
            except asyncio.CancelledError:
                pass

    def _set_status(self, document_id: str, status: str, **fields) -> None:
        assignments = ", ".join(f"{key} = ?" for key in fields)
        sql = f"UPDATE documents SET status = ?, updated_at = ?{', ' + assignments if assignments else ''} WHERE id = ?"
        with get_conn() as conn:
            conn.execute(sql, (status, now_iso(), *fields.values(), document_id))

    async def process(self, document_id: str) -> None:
        try:
            document = self.get_document(document_id)
        except NotFoundError:
            return
        self._set_status(document_id, "processing", error=None)
        try:
            sections, extra = await self._load_sections(document)
            chunks = chunk_sections(sections)
            if not chunks:
                raise KnowledgeError("Nenhum conteúdo aproveitável após a extração.")
            embeddings, embed_model, warning = await self._embed([c.content for c in chunks])
            with get_conn() as conn:
                if conn.execute("SELECT 1 FROM documents WHERE id = ?", (document_id,)).fetchone() is None:
                    return  # removido durante o processamento
                conn.execute("DELETE FROM chunks WHERE document_id = ?", (document_id,))
                conn.executemany(
                    "INSERT INTO chunks (document_id, ord, content, location, embedding, embed_dim)"
                    " VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        (
                            document_id,
                            index,
                            chunk.content,
                            chunk.location,
                            Binary(pack_embedding(embeddings[index])) if embeddings else None,
                            len(embeddings[index]) if embeddings else None,
                        )
                        for index, chunk in enumerate(chunks)
                    ],
                )
                was_ready = document["chunk_count"] > 0
                assignments = {
                    "status": "ready",
                    "error": warning,
                    "chunk_count": len(chunks),
                    "char_count": sum(len(s.text) for s in sections),
                    "embed_model": embed_model,
                    "version": document["version"] + (1 if was_ready else 0),
                    "updated_at": now_iso(),
                    **extra,
                }
                conn.execute(
                    f"UPDATE documents SET {', '.join(f'{k} = ?' for k in assignments)} WHERE id = ?",
                    (*assignments.values(), document_id),
                )
                log_activity(
                    conn,
                    "document.indexed",
                    {"name": document["name"], "chunks": len(chunks), "embedded": bool(embeddings)},
                    document["project_id"],
                )
        except asyncio.CancelledError:
            self._set_status(document_id, "error", error="Processamento cancelado pelo usuário.")
            raise
        except (KnowledgeError, ExtractionError, URLFetchError, LLMError) as exc:
            self._set_status(document_id, "error", error=str(exc))
        except Exception as exc:  # registra qualquer falha inesperada sem derrubar o servidor
            logger.exception("Falha ao processar documento %s", document_id)
            self._set_status(document_id, "error", error=f"Erro inesperado: {type(exc).__name__}")

    async def _load_sections(self, document: dict):
        extra: dict = {}
        if document["source_type"] == "file":
            with get_conn() as conn:
                row = conn.execute(
                    "SELECT data FROM document_blobs WHERE document_id = ?", (document["id"],)
                ).fetchone()
            if row is None:
                raise KnowledgeError("Arquivo original não encontrado. Envie o arquivo novamente.")
            data = bytes(row["data"])
            return await asyncio.to_thread(extract, document["name"], data), extra

        resource = await fetch_url(document["url"], config.max_url_bytes)
        digest = hashlib.sha256(resource.data).hexdigest()
        extra.update(
            sha256=digest,
            size_bytes=len(resource.data),
            mime=resource.content_type,
            fetched_at=now_iso(),
        )
        if resource.suffix == ".html":
            title, sections = await asyncio.to_thread(html_to_sections, decode_text(resource.data))
            if title:
                extra["name"] = normalize_text(title)[:200]
            sections = [Section(normalize_text(s.text), s.location) for s in sections]
            sections = [s for s in sections if s.text]
            if not sections:
                raise KnowledgeError("A página não tem texto extraível (pode depender de JavaScript).")
        else:
            sections = await asyncio.to_thread(extract, f"pagina{resource.suffix}", resource.data)
        # Guarda a cópia capturada para auditoria.
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO document_blobs (document_id, data) VALUES (?, ?)"
                " ON CONFLICT (document_id) DO UPDATE SET data = excluded.data",
                (document["id"], Binary(resource.data)),
            )
        return sections, extra

    async def _embed(self, texts: list[str]):
        """Gera embeddings. Se indisponíveis, indexa só para busca lexical."""
        settings = get_settings()
        model = settings["embed_model"]
        provider = get_embed_provider(settings)
        prefix = embed_prefix(model, "document")
        vectors: list[list[float]] = []
        try:
            for start in range(0, len(texts), EMBED_BATCH):
                batch = [prefix + text for text in texts[start : start + EMBED_BATCH]]
                vectors.extend(await provider.embed(batch, model))
        except LLMError as exc:
            warning = (
                f"Indexado só para busca por palavras: embeddings indisponíveis ({exc}). "
                "Reprocesse após configurar o modelo de embeddings."
            )
            return None, None, warning
        return vectors, model, None

    # ---------------------------------------------------------- atualização/remoção

    def reprocess(self, document_id: str) -> dict:
        document = self.get_document(document_id)
        self._set_status(document_id, "pending", error=None)
        self.schedule(document_id)
        return {**document, "status": "pending"}

    def delete_document(self, document_id: str) -> None:
        document = self.get_document(document_id)
        self.cancel(document_id)
        with get_conn() as conn:
            conn.execute("DELETE FROM documents WHERE id = ?", (document_id,))
            log_activity(conn, "document.deleted", {"name": document["name"]}, document["project_id"])

    def reindex_stale(self) -> int:
        """Reprocessa documentos indexados com outro modelo de embeddings (ou sem embeddings)."""
        model = get_settings()["embed_model"]
        with get_conn() as conn:
            ids = [
                row["id"]
                for row in conn.execute(
                    "SELECT id FROM documents WHERE status IN ('ready', 'error')"
                    " AND (embed_model IS NULL OR embed_model != ?)",
                    (model,),
                )
            ]
        for document_id in ids:
            self.reprocess(document_id)
        return len(ids)

    def recover_interrupted(self) -> int:
        """Ao iniciar, documentos que estavam em processamento voltam para erro recuperável."""
        with get_conn() as conn:
            cursor = conn.execute(
                "UPDATE documents SET status = 'error',"
                " error = 'Processamento interrompido (servidor reiniciado). Use Reprocessar.'"
                " WHERE status IN ('pending', 'processing')"
            )
            return cursor.rowcount


knowledge_service = KnowledgeService()
