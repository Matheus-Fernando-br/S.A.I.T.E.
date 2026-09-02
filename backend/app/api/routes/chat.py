from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import agent_service
from app.services.message import message_service


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("", response_model=ChatResponse,)
async def chat(request: ChatRequest):

    # Salva a mensagem do usuário
    await message_service.create_message(
        conversation_id=request.conversation_id,
        role="user",
        content=request.message,
    )

    # Processa a mensagem pela IA
    response = await agent_service.process_message(
        request.message
    )

    # Salva a resposta da IA
    await message_service.create_message(
        conversation_id=request.conversation_id,
        role="assistant",
        content=response,
    )

    return ChatResponse(
        response=response
    )