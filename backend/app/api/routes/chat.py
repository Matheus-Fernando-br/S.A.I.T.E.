from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import agent_service


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
async def chat(request: ChatRequest):

    response = await agent_service.process_message(
        request.message
    )

    return ChatResponse(
        response=response
    )