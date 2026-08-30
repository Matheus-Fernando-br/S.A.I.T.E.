from fastapi import APIRouter
from app.services.conversation import conversation_service

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)

USER_ID = "d3c91eba-11a1-486c-91e2-8fa34dab8602"


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
