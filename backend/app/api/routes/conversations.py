from fastapi import APIRouter
from app.services.conversation import conversation_service
from app.services.message import message_service

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)

USER_ID = os.getenv("USER_ID")


@router.post("")
async def create_conversation():
    conversation = await conversation_service.create_conversation(
        user_id=USER_ID
    )

    return {
        "conversation_id": conversation[0]["id"]
    }


@router.get("")
async def list_conversations():
    conversations = await conversation_service.list_conversations(
        user_id=USER_ID
    )

    return {
        "conversations": conversations
    }

@router.get("/{conversation_id}")
async def list_messages(conversation_id: str):
    messages = await message_service.list_messages(
        conversation_id=conversation_id
    )

    return {
        "messages": messages
    }

    @router.delete("/{conversation_id}")
    async def delete_conversation(conversation_id: str):
        await conversation_service.delete_conversation(
            conversation_id=conversation_id,
            user_id=USER_ID
        )

        return {
            "message": "Conversation deleted successfully"
        }

        @router.put("/{conversation_id}")
        async def update_conversation(conversation_id: str, title: str):
            await conversation_service.update_conversation(
                conversation_id=conversation_id,
                user_id=USER_ID,
                title=title
            )

            return {
                "message": "Conversation updated successfully"
            }
