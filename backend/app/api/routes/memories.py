from fastapi import APIRouter

from app.schemas.chat import MemoryCreate
from app.services.memory import memory_service


router = APIRouter(
    prefix="/memories",
    tags=["Memories"],
)


@router.get("")
def list_memories():
    return {
        "memories": memory_service.list_all()
    }


@router.post("")
def create_memory(payload: MemoryCreate):
    return memory_service.create_memory(payload.content.strip(), payload.project_id)


@router.delete("/{memory_id}")
def delete_memory(memory_id: str):
    memory_service.delete_memory(memory_id)
    return {
        "message": "Memória removida"
    }
