from app.db.supabase import supabase


class ConversationService:

    async def create_conversation(
        self,
        user_id: str,
        title: str = "Nova conversa"
    ):
        response = (
            supabase
            .table("conversations")
            .insert({
                "user_id": user_id,
                "title": title
            })
            .execute()
        )

        return response.data

    async def list_conversations(self, user_id: str):
        response = (
            supabase
            .table("conversations")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return response.data


conversation_service = ConversationService()