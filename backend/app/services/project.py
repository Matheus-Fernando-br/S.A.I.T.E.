import shutil

from app.core.config import config
from app.db.database import get_conn, log_activity, new_id, now_iso, row_to_dict


class NotFoundError(LookupError):
    pass


class ProjectService:

    def create_project(self, name: str, description: str = "", instructions: str = "") -> dict:
        project_id = new_id()
        now = now_iso()
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO projects (id, name, description, instructions, created_at, updated_at)"
                " VALUES (?, ?, ?, ?, ?, ?)",
                (project_id, name, description, instructions, now, now),
            )
            log_activity(conn, "project.created", {"name": name}, project_id)
        return self.get_project(project_id)

    def list_projects(self, include_archived: bool = False) -> list[dict]:
        query = (
            "SELECT p.*,"
            " (SELECT COUNT(*) FROM conversations c WHERE c.project_id = p.id) AS conversation_count,"
            " (SELECT COUNT(*) FROM documents d WHERE d.project_id = p.id"
            "   AND d.scope = 'project') AS document_count"
            " FROM projects p"
        )
        if not include_archived:
            query += " WHERE p.archived = 0"
        query += " ORDER BY p.updated_at DESC"
        with get_conn() as conn:
            return [row_to_dict(row) for row in conn.execute(query)]

    def get_project(self, project_id: str) -> dict:
        with get_conn() as conn:
            row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if row is None:
            raise NotFoundError("Projeto não encontrado.")
        return row_to_dict(row)

    def update_project(self, project_id: str, **fields) -> dict:
        allowed = {k: v for k, v in fields.items() if k in {"name", "description", "instructions", "archived"} and v is not None}
        self.get_project(project_id)
        if allowed:
            assignments = ", ".join(f"{key} = ?" for key in allowed)
            with get_conn() as conn:
                conn.execute(
                    f"UPDATE projects SET {assignments}, updated_at = ? WHERE id = ?",
                    (*[int(v) if isinstance(v, bool) else v for v in allowed.values()], now_iso(), project_id),
                )
                log_activity(conn, "project.updated", {"fields": sorted(allowed)}, project_id)
        return self.get_project(project_id)

    def delete_project(self, project_id: str, confirm_name: str) -> dict:
        """Exclui o projeto e, em cascata, conversas, documentos, chunks e memórias.

        Exige o nome exato do projeto como confirmação para evitar exclusões acidentais.
        """
        project = self.get_project(project_id)
        if confirm_name.strip() != project["name"]:
            raise ValueError("Confirmação inválida: digite o nome exato do projeto.")
        with get_conn() as conn:
            paths = [
                row["stored_path"]
                for row in conn.execute(
                    "SELECT stored_path FROM documents WHERE project_id = ?"
                    " OR conversation_id IN (SELECT id FROM conversations WHERE project_id = ?)",
                    (project_id, project_id),
                )
                if row["stored_path"]
            ]
            counts = {
                "conversations": conn.execute(
                    "SELECT COUNT(*) FROM conversations WHERE project_id = ?", (project_id,)
                ).fetchone()[0],
                "documents": conn.execute(
                    "SELECT COUNT(*) FROM documents WHERE project_id = ?", (project_id,)
                ).fetchone()[0],
            }
            # Documentos de conversas do projeto não têm project_id: remover explicitamente.
            conn.execute(
                "DELETE FROM documents WHERE conversation_id IN"
                " (SELECT id FROM conversations WHERE project_id = ?)",
                (project_id,),
            )
            conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
            log_activity(conn, "project.deleted", {"name": project["name"], **counts})
        remove_stored_files(paths)
        return counts

    def activity(self, project_id: str, limit: int = 50) -> list[dict]:
        self.get_project(project_id)
        with get_conn() as conn:
            rows = conn.execute(
                "SELECT * FROM activity_log WHERE project_id = ? ORDER BY id DESC LIMIT ?",
                (project_id, limit),
            )
            return [row_to_dict(row, ("detail",)) for row in rows]


def remove_stored_files(paths: list[str]) -> None:
    root = config.files_dir.resolve()
    for path in paths:
        directory = (root / path).resolve().parent
        # Só remove dentro do diretório de dados: nunca segue caminhos externos.
        if directory.is_relative_to(root) and directory != root:
            shutil.rmtree(directory, ignore_errors=True)


project_service = ProjectService()
