import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.security import chat_limiter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import agent_service
from app.services.conversation import conversation_service


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    dependencies=[Depends(chat_limiter)],
)


def _sse(event_type: str, data: dict) -> str:
    return f"event: {event_type}\ndata: {json.dumps(data, ensure_ascii=False, default=str)}\n\n"


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """Resposta em streaming (Server-Sent Events).

    Eventos: start, notice, tool, token, done, error. Se o cliente desconectar
    (ou cancelar), o texto já gerado é salvo como resposta parcial.
    """
    # Valida a conversa antes de abrir o stream, para responder 404 normalmente.
    conversation_service.get_conversation(request.conversation_id)

    async def events():
        async for event in agent_service.stream_reply(
            request.conversation_id, request.message.strip(), use_computer=request.use_computer
        ):
            yield _sse(event.type, event.data)

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Versão sem streaming (compatível com o cliente anterior)."""
    conversation_service.get_conversation(request.conversation_id)

    text = ""
    async for event in agent_service.stream_reply(
        request.conversation_id, request.message.strip(), use_computer=request.use_computer
    ):
        if event.type == "token":
            text += event.data["text"]
        elif event.type == "error":
            message = event.data["assistant_message"]
            return ChatResponse(response=event.data["message"], status="error", message_id=message["id"])
        elif event.type == "done":
            message = event.data["assistant_message"]
            return ChatResponse(
                response=message["content"],
                message_id=message["id"],
                citations=[c for c in message["citations"] if c.get("cited")],
            )

    return ChatResponse(
        response=text
    )
