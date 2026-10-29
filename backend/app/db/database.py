"""Acesso ao PostgreSQL (Supabase em produção) e aplicação de migrações versionadas.

Os serviços escrevem SQL com marcadores ``?``; o adaptador abaixo converte para
o formato do psycopg (``%s``) e devolve linhas como dicionários. Um pool de
conexões é compartilhado pelo processo.
"""

import json
import threading
import uuid
from collections.abc import Iterator, Sequence
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from app.core.config import config


MIGRATIONS_DIR = Path(__file__).parent / "migrations"

_pool: ConnectionPool | None = None
_pool_url: str | None = None
_pool_lock = threading.Lock()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def new_id() -> str:
    return str(uuid.uuid4())


def _translate(sql: str) -> str:
    return sql.replace("%", "%%").replace("?", "%s")


class Connection:
    """Envoltório fino sobre ``psycopg.Connection`` com a interface usada pelos serviços."""

    def __init__(self, raw: psycopg.Connection):
        self.raw = raw

    def execute(self, sql: str, params: Sequence[Any] = ()) -> psycopg.Cursor:
        cursor = self.raw.cursor()
        cursor.execute(_translate(sql), tuple(params))
        return cursor

    def executemany(self, sql: str, rows: Sequence[Sequence[Any]]) -> None:
        with self.raw.cursor() as cursor:
            cursor.executemany(_translate(sql), [tuple(row) for row in rows])


def get_pool() -> ConnectionPool:
    global _pool, _pool_url
    if not config.database_url:
        raise RuntimeError("DATABASE_URL não configurada.")
    with _pool_lock:
        if _pool is None or _pool_url != config.database_url:
            if _pool is not None:
                _pool.close()
            _pool = ConnectionPool(
                config.database_url,
                min_size=1,
                max_size=config.db_pool_size,
                kwargs={"row_factory": dict_row, "autocommit": False, "prepare_threshold": None},
                open=True,
            )
            _pool_url = config.database_url
    return _pool


def close_pool() -> None:
    global _pool, _pool_url
    with _pool_lock:
        if _pool is not None:
            _pool.close()
        _pool, _pool_url = None, None


@contextmanager
def get_conn() -> Iterator[Connection]:
    """Conexão do pool com commit automático ao final e rollback em caso de erro."""
    with get_pool().connection() as raw:
        # O pool faz commit ao devolver a conexão sem erro e rollback se houver exceção.
        yield Connection(raw)


def migrate() -> list[str]:
    """Aplica, em ordem, as migrações ainda não registradas. Retorna as aplicadas."""
    applied: list[str] = []
    with get_conn() as conn:
        # Impede que duas instâncias apliquem migrações ao mesmo tempo.
        conn.execute("SELECT pg_advisory_xact_lock(7426001)")
        conn.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations ("
            " name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)"
        )
        done = {row["name"] for row in conn.execute("SELECT name FROM schema_migrations")}
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            if path.name in done:
                continue
            # Sem parâmetros: o psycopg aceita várias instruções e mantém tudo na mesma transação.
            conn.raw.execute(path.read_text(encoding="utf-8"))
            conn.execute(
                "INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)", (path.name, now_iso())
            )
            applied.append(path.name)
    return applied


def row_to_dict(row: dict | None, json_fields: tuple[str, ...] = ()) -> dict | None:
    if row is None:
        return None
    data = dict(row)
    for name in json_fields:
        if name in data and isinstance(data[name], str):
            data[name] = json.loads(data[name])
    return data


def log_activity(
    conn: Connection,
    action: str,
    detail: dict | None = None,
    project_id: str | None = None,
) -> None:
    conn.execute(
        "INSERT INTO activity_log (created_at, project_id, action, detail) VALUES (?, ?, ?, ?)",
        (now_iso(), project_id, action, json.dumps(detail or {}, ensure_ascii=False)),
    )
