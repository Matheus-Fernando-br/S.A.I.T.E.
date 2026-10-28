"""Escolhe o provedor de inferência conforme as preferências atuais."""

from collections.abc import Callable

from app.core.config import config
from app.llm.base import GenerationOptions, LLMProvider
from app.llm.ollama import OllamaProvider
from app.llm.openai_compat import OpenAICompatibleProvider
from app.services.settings import get_settings


# Permite que os testes injetem um provedor sem tocar na rede.
_override: Callable[[dict], LLMProvider] | None = None


def set_provider_factory(factory: Callable[[dict], LLMProvider] | None) -> None:
    global _override
    _override = factory


def get_provider(settings: dict | None = None) -> LLMProvider:
    settings = settings or get_settings()
    if _override is not None:
        return _override(settings)
    if settings["llm_provider"] == "openai_compatible":
        return OpenAICompatibleProvider(settings["llm_base_url"], api_key=config.llm_api_key)
    return OllamaProvider(settings["llm_base_url"])


def generation_options(settings: dict) -> GenerationOptions:
    return GenerationOptions(
        temperature=float(settings["temperature"]),
        num_ctx=int(settings["num_ctx"]),
    )
