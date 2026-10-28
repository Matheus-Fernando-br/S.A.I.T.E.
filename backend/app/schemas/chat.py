from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
    )

    conversation_id: str = Field(..., min_length=1, max_length=64)

    use_computer: bool = False


class ChatResponse(BaseModel):
    response: str
    status: str = "complete"
    message_id: str | None = None
    citations: list[dict[str, Any]] = []


class ConversationCreate(BaseModel):
    title: str = Field("Nova conversa", min_length=1, max_length=200)
    project_id: str | None = None


class ConversationUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    pinned: bool | None = None
    archived: bool | None = None


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: str = Field("", max_length=2000)
    instructions: str = Field("", max_length=8000)


class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120)
    description: str | None = Field(None, max_length=2000)
    instructions: str | None = Field(None, max_length=8000)
    archived: bool | None = None


class ProjectDelete(BaseModel):
    confirm_name: str = Field(..., min_length=1, max_length=120)


class MemoryCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    project_id: str | None = None


Scope = Literal["global", "project", "conversation"]


class URLImport(BaseModel):
    url: str = Field(..., min_length=8, max_length=2048)
    scope: Scope = "global"
    project_id: str | None = None
    conversation_id: str | None = None


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    project_id: str | None = None
    conversation_id: str | None = None
    top_k: int | None = Field(None, ge=1, le=20)


class PermissionsUpdate(BaseModel):
    allowed_roots: list[str] | None = Field(None, max_length=50)
    tools: dict[str, bool] | None = None
    paused: bool | None = None
