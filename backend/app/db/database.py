"""Acesso ao SQLite local e aplicação de migrações versionadas.

Cada operação abre a sua própria conexão (barata em SQLite) para que rotas
síncronas executadas no threadpool do FastAPI não compartilhem conexões.
"""

import json
import sqlite3
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from app.core.config import config


MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def new_id() -> str:
    return str(uuid.uuid4())


def _connect() -> sqlite3.Connection:
    config.data_dir.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(config.db_path, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 15000")
    return conn


@contextmanager
def get_conn() -> Iterator[sqlite3.Connection]:
    """Conexão com commit automático ao final e rollback em caso de erro."""
    conn = _connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def migrate() -> list[str]:
    """Aplica, em ordem, as migrações ainda não registradas. Retorna as aplicadas."""
    applied: list[str] = []
    with get_conn() as conn:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations ("
            " name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)"
        )
        done = {row["name"] for row in conn.execute("SELECT name FROM schema_migrations")}
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            if path.name in done:
                continue
            # Migração e registro na mesma transação: ou aplica tudo ou nada.
            conn.executescript(
                "BEGIN;\n"
                + path.read_text(encoding="utf-8")
                + f"\nINSERT INTO schema_migrations (name, applied_at)"
                f" VALUES ('{path.name}', '{now_iso()}');\nCOMMIT;"
            )
            applied.append(path.name)
    return applied


def row_to_dict(row: sqlite3.Row | None, json_fields: tuple[str, ...] = ()) -> dict | None:
    if row is None:
        return None
    data = dict(row)
    for name in json_fields:
        if name in data and isinstance(data[name], str):
            data[name] = json.loads(data[name])
    return data


def log_activity(
    conn: sqlite3.Connection,
    action: str,
    detail: dict | None = None,
    project_id: str | None = None,
) -> None:
    conn.execute(
        "INSERT INTO activity_log (created_at, project_id, action, detail) VALUES (?, ?, ?, ?)",
        (now_iso(), project_id, action, json.dumps(detail or {}, ensure_ascii=False)),
    )
