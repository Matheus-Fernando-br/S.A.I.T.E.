from fastapi import APIRouter, Query

from app.schemas.chat import ConversationCreate, ConversationUpdate
from app.services.conversation import conversation_service
from app.services.message import message_service


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("")
def create_conversation(payload: ConversationCreate | None = None):
    payload = payload or ConversationCreate()
    conversation = conversation_service.create_conversation(
        title=payload.title, project_id=payload.project_id
    )
    return {
        "conversation_id": conversation["id"],
        "conversation": conversation,
    }


@router.get("")
def list_conversations(
    project_id: str | None = None,
    all_projects: bool = False,
    archived: bool = False,
    q: str | None = Query(None, max_length=200),
    limit: int = Query(100, ge=1, le=500),
):
    conversations = conversation_service.list_conversations(
        project_id=project_id,
        all_projects=all_projects,
        archived=archived,
        query=q,
        limit=limit,
    )
    return {
        "conversations": conversations
    }


@router.get("/{conversation_id}")
def get_conversation(conversation_id: str):
    conversation = conversation_service.get_conversation(conversation_id)
    return {
        "conversation": conversation,
        "messages": message_service.list_messages(conversation_id),
    }


@router.patch("/{conversation_id}")
def update_conversation(conversation_id: str, payload: ConversationUpdate):
    return conversation_service.update_conversation(
        conversation_id, **payload.model_dump(exclude_none=True)
    )


# Rotas mantidas por compatibilidade com o frontend anterior.
@router.put("/{conversation_id}")
def rename_conversation(conversation_id: str, title: str = Query(..., min_length=1, max_length=200)):
    conversation_service.update_conversation(conversation_id, title=title)
    return {
        "message": "Conversation updated successfully"
    }


@router.put("/{conversation_id}/fix")
def update_fix(conversation_id: str, fix: bool):
    conversation_service.update_conversation(conversation_id, pinned=fix)
    return {
        "message": "Conversation fix updated successfully",
        "fix": fix
    }


@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: str):
    conversation_service.delete_conversation(conversation_id)
    return {
        "message": "Conversation deleted successfully"
    }
