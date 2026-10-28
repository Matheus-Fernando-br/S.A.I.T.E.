"""Memórias persistentes explícitas.

Só são criadas por ação do usuário (nunca extraídas automaticamente das
conversas) e são sempre visíveis e removíveis na interface.
"""

from app.db.database import get_conn, log_activity, new_id, now_iso, row_to_dict
from app.services.project import NotFoundError, project_service


class MemoryService:

    def create_memory(self, content: str, project_id: str | None = None) -> dict:
        if project_id:
            project_service.get_project(project_id)
        memory_id = new_id()
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO memories (id, project_id, content, created_at) VALUES (?, ?, ?, ?)",
                (memory_id, project_id, content, now_iso()),
            )
            log_activity(conn, "memory.created", {}, project_id)
            row = conn.execute("SELECT * FROM memories WHERE id = ?", (memory_id,)).fetchone()
        return row_to_dict(row)

    def list_memories(self, project_id: str | None = None, include_global: bool = True) -> list[dict]:
        """Memórias globais e/ou do projeto indicado — nunca de outros projetos."""
        clauses = []
        params: list = []
        if include_global:
            clauses.append("project_id IS NULL")
        if project_id:
            clauses.append("project_id = ?")
            params.append(project_id)
        if not clauses:
            return []
        with get_conn() as conn:
            rows = conn.execute(
                f"SELECT * FROM memories WHERE {' OR '.join(clauses)} ORDER BY created_at",
                params,
            )
            return [row_to_dict(row) for row in rows]

    def list_all(self) -> list[dict]:
        with get_conn() as conn:
            rows = conn.execute(
                "SELECT m.*, p.name AS project_name FROM memories m"
                " LEFT JOIN projects p ON p.id = m.project_id ORDER BY m.created_at"
            )
            return [row_to_dict(row) for row in rows]

    def delete_memory(self, memory_id: str) -> None:
        with get_conn() as conn:
            row = conn.execute("SELECT project_id FROM memories WHERE id = ?", (memory_id,)).fetchone()
            if row is None:
                raise NotFoundError("Memória não encontrada.")
            conn.execute("DELETE FROM memories WHERE id = ?", (memory_id,))
            log_activity(conn, "memory.deleted", {}, row["project_id"])


memory_service = MemoryService()
