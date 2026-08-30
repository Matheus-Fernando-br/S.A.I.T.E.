from app.db.supabase import supabase


class MessageService:

    async def create_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        tool_name: str | None = None,
    ):
        response = (
            supabase
            .table("messages")
            .insert({
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
                "tool_name": tool_name,
            })
            .execute()
        )

        return response.data

    async def list_messages(
        self,
        conversation_id: str,
    ):
        response = (
            supabase
            .table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .execute()
        )

        return response.data


message_service = MessageService()