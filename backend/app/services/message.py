import json

from app.db.database import get_conn, new_id, now_iso, row_to_dict


class MessageService:

    def create_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        status: str = "complete",
        model: str | None = None,
        citations: list | None = None,
        tool_calls: list | None = None,
    ) -> dict:
        message_id = new_id()
        now = now_iso()
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO messages (id, conversation_id, role, content, status, model,"
                " citations, tool_calls, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    message_id,
                    conversation_id,
                    role,
                    content,
                    status,
                    model,
                    json.dumps(citations or [], ensure_ascii=False),
                    json.dumps(tool_calls or [], ensure_ascii=False),
                    now,
                ),
            )
            conn.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conversation_id))
        return self.get_message(message_id)

    def get_message(self, message_id: str) -> dict:
        with get_conn() as conn:
            row = conn.execute("SELECT * FROM messages WHERE id = ?", (message_id,)).fetchone()
        return row_to_dict(row, ("citations", "tool_calls"))

    def list_messages(self, conversation_id: str, limit: int | None = None) -> list[dict]:
        """Mensagens em ordem cronológica; com ``limit``, apenas as mais recentes."""
        with get_conn() as conn:
            rows = conn.execute(
                "SELECT * FROM (SELECT * FROM messages WHERE conversation_id = ?"
                " ORDER BY seq DESC LIMIT ?) AS recent ORDER BY seq",
                (conversation_id, limit),
            ).fetchall()
        messages = []
        for row in rows:
            data = row_to_dict(row, ("citations", "tool_calls"))
            data.pop("seq", None)
            messages.append(data)
        return messages


message_service = MessageService()
