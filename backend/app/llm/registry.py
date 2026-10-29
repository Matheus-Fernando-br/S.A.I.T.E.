"""Escolhe os provedores de inferência (chat e embeddings) conforme as preferências."""

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


def _build(kind: str, base_url: str, api_key: str) -> LLMProvider:
    if kind == "ollama":
        return OllamaProvider(base_url)
    return OpenAICompatibleProvider(base_url, api_key=api_key)


def get_provider(settings: dict | None = None) -> LLMProvider:
    """Provedor do chat."""
    settings = settings or get_settings()
    if _override is not None:
        return _override(settings)
    return _build(settings["llm_provider"], settings["llm_base_url"], config.llm_api_key)


def get_embed_provider(settings: dict | None = None) -> LLMProvider:
    """Provedor de embeddings; sem configuração própria, usa o mesmo do chat."""
    settings = settings or get_settings()
    if _override is not None:
        return _override(settings)
    kind = settings.get("embed_provider") or settings["llm_provider"]
    base_url = settings.get("embed_base_url") or settings["llm_base_url"]
    return _build(kind, base_url, config.embed_api_key or config.llm_api_key)


def generation_options(settings: dict) -> GenerationOptions:
    return GenerationOptions(
        temperature=float(settings["temperature"]),
        num_ctx=int(settings["num_ctx"]),
    )
