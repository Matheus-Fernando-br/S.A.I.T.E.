import time
from typing import Any

from fastapi import APIRouter, Body

from app.core.config import config
from app.llm.base import LLMError
from app.llm.registry import generation_options, get_provider
from app.services.settings import get_settings, reset_settings, update_settings


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


def _matches(installed: list[str], wanted: str) -> bool:
    # Ollama lista "modelo:latest"; Gemini lista "models/modelo".
    return any(name in (wanted, f"{wanted}:latest") or name.endswith(f"/{wanted}") for name in installed)


@router.get("/status")
async def status():
    """Estado real do runtime local: conectividade, modelos instalados e configurados."""
    settings = get_settings()
    provider = get_provider(settings)
    health = await provider.health()
    result: dict[str, Any] = {
        "provider": settings["llm_provider"],
        "key_configured": bool(config.llm_api_key) or settings["llm_provider"] == "ollama",
        "base_url": settings["llm_base_url"],
        "chat_model": settings["chat_model"],
        "embed_model": settings["embed_model"],
        "online": health.get("ok", False),
        "version": health.get("version"),
        "error": health.get("error"),
        "hint": health.get("hint"),
        "models": [],
        "chat_model_installed": False,
        "embed_model_installed": False,
    }
    if result["online"]:
        try:
            models = await provider.list_models()
            names = [model.name for model in models]
            result["models"] = [model.__dict__ for model in models]
            result["chat_model_installed"] = _matches(names, settings["chat_model"])
            result["embed_model_installed"] = _matches(names, settings["embed_model"])
            if not result["chat_model_installed"]:
                result["hint"] = (
                    f"O modelo de chat '{settings['chat_model']}' não está instalado. "
                    f"Instale com `ollama pull {settings['chat_model']}` ou escolha um modelo instalado."
                    if settings["llm_provider"] == "ollama"
                    else f"O provedor não lista o modelo '{settings['chat_model']}'. Confira o nome em Configurações → IA."
                )
        except LLMError as exc:
            result["error"] = str(exc)
    return result


@router.get("/settings")
def read_settings():
    return get_settings()


@router.put("/settings")
def write_settings(changes: dict[str, Any] = Body(...)):
    return update_settings(changes)


@router.post("/settings/reset")
def restore_settings():
    return reset_settings()


@router.post("/test")
async def test_generation():
    """Gera uma resposta curta para confirmar que o modelo configurado funciona."""
    settings = get_settings()
    provider = get_provider(settings)
    started = time.monotonic()
    result = await provider.chat(
        [{"role": "user", "content": "Responda apenas: OK"}],
        settings["chat_model"],
        generation_options(settings),
    )
    return {
        "ok": True,
        "model": settings["chat_model"],
        "reply": result.content[:200],
        "ms": int((time.monotonic() - started) * 1000),
    }
