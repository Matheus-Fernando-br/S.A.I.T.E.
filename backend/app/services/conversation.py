from app.db.supabase import supabase


class ConversationService:

    async def create_conversation(self, title: str = "Nova conversa"):
        response = (
            supabase
            .table("conversations")
            .insert({
                "title": title
            })
            .execute()
        )

        return response.data

    async def list_conversations(self):
        response = (
            supabase
            .table("conversations")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return response.data


conversation_service = ConversationService()