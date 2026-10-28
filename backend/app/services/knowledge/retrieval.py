"""Recuperação híbrida: lexical (FTS5/BM25) + vetorial (cosseno), fundidas por RRF.

O filtro de acesso é aplicado no SQL, antes de qualquer trecho chegar ao modelo:
uma conversa só enxerga documentos globais, do seu projeto e dela própria.
"""

import re
from dataclasses import asdict, dataclass

import numpy as np

from app.db.database import get_conn
from app.llm.base import LLMError
from app.llm.registry import get_provider
from app.services.knowledge.service import embed_prefix, unpack_embedding


RRF_K = 60
CANDIDATES = 30

STOPWORDS = set(
    """a o as os um uma uns umas de do da dos das em no na nos nas por para pra com sem
    e ou que se é são foi ser ter tem como mais menos muito muita qual quais quando onde
    porque sobre entre até isso isto esse essa este esta aquele aquela meu minha seu sua
    me te lhe nos vos eu tu ele ela eles elas você vocês já não sim ao aos à às pelo pela
    the of and or to in on for with is are was be by an at from this that it as what how""".split()
)


@dataclass
class RetrievedChunk:
    chunk_id: int
    document_id: str
    document_name: str
    location: str
    url: str | None
    scope: str
    content: str
    score: float
    similarity: float | None
    lexical_rank: int | None

    def citation(self, number: int) -> dict:
        data = asdict(self)
        data["n"] = number
        data["snippet"] = self.content[:280]
        data.pop("content")
        return data


def scope_clause(project_id: str | None, conversation_id: str | None) -> tuple[str, list]:
    """Cláusula SQL de autorização para documentos visíveis num contexto."""
    parts = ["d.scope = 'global'"]
    params: list = []
    if project_id:
        parts.append("(d.scope = 'project' AND d.project_id = ?)")
        params.append(project_id)
    if conversation_id:
        parts.append("(d.scope = 'conversation' AND d.conversation_id = ?)")
        params.append(conversation_id)
    return f"d.status = 'ready' AND ({' OR '.join(parts)})", params


def fts_query(text: str) -> str | None:
    terms = []
    for word in re.findall(r"\w+", text.lower(), flags=re.UNICODE):
        if len(word) > 1 and word not in STOPWORDS and word not in terms:
            terms.append(word)
    if not terms:
        return None
    # Cada termo entre aspas: evita que a entrada do usuário seja interpretada como sintaxe FTS.
    return " OR ".join(f'"{term}"' for term in terms[:24])


def _lexical(conn, query: str, clause: str, params: list) -> list[int]:
    match = fts_query(query)
    if not match:
        return []
    rows = conn.execute(
        "SELECT c.id FROM chunks_fts f JOIN chunks c ON c.id = f.rowid"
        " JOIN documents d ON d.id = c.document_id"
        f" WHERE chunks_fts MATCH ? AND {clause} ORDER BY bm25(chunks_fts) LIMIT ?",
        (match, *params, CANDIDATES),
    )
    return [row["id"] for row in rows]


def _vector_scores(conn, query_vector: list[float], model: str, clause: str, params: list) -> dict[int, float]:
    rows = conn.execute(
        "SELECT c.id, c.embedding, c.embed_dim FROM chunks c JOIN documents d ON d.id = c.document_id"
        f" WHERE c.embedding IS NOT NULL AND d.embed_model = ? AND c.embed_dim = ? AND {clause}",
        (model, len(query_vector), *params),
    ).fetchall()
    if not rows:
        return {}
    matrix = np.array([unpack_embedding(row["embedding"], row["embed_dim"]) for row in rows], dtype=np.float32)
    query = np.array(query_vector, dtype=np.float32)
    norms = np.linalg.norm(matrix, axis=1) * (np.linalg.norm(query) or 1.0)
    similarities = matrix @ query / np.where(norms == 0, 1.0, norms)
    return {row["id"]: float(score) for row, score in zip(rows, similarities)}


async def retrieve(
    query: str,
    settings: dict,
    project_id: str | None = None,
    conversation_id: str | None = None,
    top_k: int | None = None,
) -> tuple[list[RetrievedChunk], dict]:
    """Retorna (trechos, diagnóstico). O diagnóstico informa se a busca vetorial foi usada."""
    top_k = top_k or int(settings["rag_top_k"])
    min_similarity = float(settings["rag_min_similarity"])
    clause, params = scope_clause(project_id, conversation_id)
    info = {"vector": False, "lexical": True, "error": None}

    query_vector = None
    with get_conn() as conn:
        has_embeddings = conn.execute(
            "SELECT 1 FROM chunks c JOIN documents d ON d.id = c.document_id"
            f" WHERE c.embedding IS NOT NULL AND {clause} LIMIT 1",
            params,
        ).fetchone()
        has_any = conn.execute(
            f"SELECT 1 FROM documents d WHERE {clause} LIMIT 1", params
        ).fetchone()
    if not has_any:
        return [], info
    if has_embeddings:
        model = settings["embed_model"]
        try:
            vectors = await get_provider(settings).embed([embed_prefix(model, "query") + query], model)
            query_vector = vectors[0]
        except LLMError as exc:
            info["error"] = f"Busca vetorial indisponível: {exc}"

    with get_conn() as conn:
        lexical_ids = _lexical(conn, query, clause, params)
        similarities = (
            _vector_scores(conn, query_vector, settings["embed_model"], clause, params)
            if query_vector
            else {}
        )
        info["vector"] = bool(similarities)

        vector_ranked = sorted(similarities, key=similarities.get, reverse=True)[:CANDIDATES]
        lexical_rank = {chunk_id: rank for rank, chunk_id in enumerate(lexical_ids)}
        vector_rank = {chunk_id: rank for rank, chunk_id in enumerate(vector_ranked)}

        candidates = []
        for chunk_id in set(lexical_rank) | set(vector_rank):
            similarity = similarities.get(chunk_id)
            # Trechos com embedding precisam de relevância semântica mínima; um termo em comum
            # só basta se a similaridade estiver perto do limiar. Trechos sem embedding
            # (documento indexado só lexicalmente) entram pela busca por palavras.
            if similarity is not None:
                threshold = min_similarity - (0.1 if chunk_id in lexical_rank else 0.0)
                if similarity < threshold:
                    continue
            score = 0.0
            if chunk_id in lexical_rank:
                score += 1.0 / (RRF_K + lexical_rank[chunk_id])
            if chunk_id in vector_rank:
                score += 1.0 / (RRF_K + vector_rank[chunk_id])
            candidates.append((score, chunk_id, similarity))
        candidates.sort(reverse=True)
        chosen = candidates[:top_k]
        if not chosen:
            return [], info

        rows = {
            row["id"]: row
            for row in conn.execute(
                "SELECT c.id, c.document_id, c.content, c.location, d.name, d.url, d.scope"
                " FROM chunks c JOIN documents d ON d.id = c.document_id"
                f" WHERE c.id IN ({','.join('?' * len(chosen))})",
                [chunk_id for _, chunk_id, _ in chosen],
            )
        }
    results = [
        RetrievedChunk(
            chunk_id=chunk_id,
            document_id=rows[chunk_id]["document_id"],
            document_name=rows[chunk_id]["name"],
            location=rows[chunk_id]["location"],
            url=rows[chunk_id]["url"],
            scope=rows[chunk_id]["scope"],
            content=rows[chunk_id]["content"],
            score=round(score, 5),
            similarity=None if similarity is None else round(similarity, 4),
            lexical_rank=lexical_rank.get(chunk_id),
        )
        for score, chunk_id, similarity in chosen
        if chunk_id in rows
    ]
    return results, info
