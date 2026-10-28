from app.db.database import get_conn, log_activity, new_id, now_iso, row_to_dict
from app.services.project import NotFoundError, project_service, remove_stored_files


class ConversationService:

    def create_conversation(self, title: str = "Nova conversa", project_id: str | None = None) -> dict:
        if project_id:
            project_service.get_project(project_id)
        conversation_id = new_id()
        now = now_iso()
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO conversations (id, project_id, title, created_at, updated_at)"
                " VALUES (?, ?, ?, ?, ?)",
                (conversation_id, project_id, title, now, now),
            )
        return self.get_conversation(conversation_id)

    def get_conversation(self, conversation_id: str) -> dict:
        with get_conn() as conn:
            row = conn.execute(
                "SELECT * FROM conversations WHERE id = ?", (conversation_id,)
            ).fetchone()
        if row is None:
            raise NotFoundError("Conversa não encontrada.")
        return _as_conversation(row)

    def list_conversations(
        self,
        project_id: str | None = None,
        all_projects: bool = False,
        archived: bool = False,
        query: str | None = None,
        limit: int = 100,
    ) -> list[dict]:
        """Lista conversas. Por padrão, só as conversas gerais (fora de projetos)."""
        clauses = ["c.archived = ?"]
        params: list = [int(archived)]
        if not all_projects:
            if project_id:
                clauses.append("c.project_id = ?")
                params.append(project_id)
            else:
                clauses.append("c.project_id IS NULL")
        if query:
            like = f"%{_escape_like(query.strip())}%"
            clauses.append(
                "(c.title LIKE ? ESCAPE '\\' OR EXISTS (SELECT 1 FROM messages m"
                " WHERE m.conversation_id = c.id AND m.content LIKE ? ESCAPE '\\'))"
            )
            params += [like, like]
        sql = (
            "SELECT c.*, p.name AS project_name FROM conversations c"
            " LEFT JOIN projects p ON p.id = c.project_id"
            f" WHERE {' AND '.join(clauses)}"
            " ORDER BY c.pinned DESC, c.updated_at DESC LIMIT ?"
        )
        with get_conn() as conn:
            return [_as_conversation(row) for row in conn.execute(sql, (*params, limit))]

    def update_conversation(self, conversation_id: str, **fields) -> dict:
        allowed = {
            key: int(value) if isinstance(value, bool) else value
            for key, value in fields.items()
            if key in {"title", "pinned", "archived"} and value is not None
        }
        self.get_conversation(conversation_id)
        if allowed:
            assignments = ", ".join(f"{key} = ?" for key in allowed)
            with get_conn() as conn:
                conn.execute(
                    f"UPDATE conversations SET {assignments} WHERE id = ?",
                    (*allowed.values(), conversation_id),
                )
        return self.get_conversation(conversation_id)

    def delete_conversation(self, conversation_id: str) -> None:
        conversation = self.get_conversation(conversation_id)
        with get_conn() as conn:
            paths = [
                row["stored_path"]
                for row in conn.execute(
                    "SELECT stored_path FROM documents WHERE conversation_id = ?", (conversation_id,)
                )
                if row["stored_path"]
            ]
            conn.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
            log_activity(
                conn, "conversation.deleted", {"title": conversation["title"]}, conversation["project_id"]
            )
        remove_stored_files(paths)


def _escape_like(text: str) -> str:
    return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _as_conversation(row) -> dict:
    data = row_to_dict(row)
    data["pinned"] = bool(data["pinned"])
    data["archived"] = bool(data["archived"])
    # Compatibilidade com o frontend anterior, que usava o campo "fix".
    data["fix"] = data["pinned"]
    return data


conversation_service = ConversationService()
