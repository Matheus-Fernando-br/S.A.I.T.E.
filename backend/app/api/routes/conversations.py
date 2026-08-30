from fastapi import APIRouter

from app.services.conversation import conversation_service


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("")
async def create_conversation():
    conversation = await conversation_service.create_conversation()

    return {
        "conversation": conversation
    }


@router.get("")
async def list_conversations():
    conversations = await conversation_service.list_conversations()

    return {
        "conversations": conversations
    }