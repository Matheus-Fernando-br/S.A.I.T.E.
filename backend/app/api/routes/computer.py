from fastapi import APIRouter, Body, HTTPException

from app.schemas.chat import PermissionsUpdate
from app.services.computer import computer_service


router = APIRouter(
    prefix="/computer",
    tags=["Computer agent"],
)

# Ferramentas que a interface pode chamar diretamente (painel "Meu PC").
PANEL_TOOLS = {"system_info", "disk_usage"}


@router.get("/status")
async def status():
    return await computer_service.status()


@router.put("/permissions")
async def update_permissions(payload: PermissionsUpdate):
    return await computer_service.update_permissions(payload.model_dump(exclude_none=True))


@router.get("/audit")
async def audit(limit: int = 100):
    return {
        "entries": await computer_service.audit(limit=min(max(limit, 1), 500))
    }


@router.post("/tools/{name}")
async def run_panel_tool(name: str, arguments: dict = Body(default_factory=dict)):
    if name not in PANEL_TOOLS:
        raise HTTPException(status_code=403, detail="Esta ferramenta só pode ser usada pela IA no chat.")
    return await computer_service.call_tool(name, arguments)
