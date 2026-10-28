"""Contrato comum dos provedores de inferência local.

O restante do sistema depende apenas desta interface, de modo que trocar
Ollama por llama.cpp (ou outro servidor compatível) é uma mudança de
configuração, não de código.
"""

from collections.abc import AsyncIterator
from dataclasses import dataclass, field
from typing import Any, Protocol


class LLMError(Exception):
    """Falha genérica do runtime de inferência."""

    hint: str = ""

    def __init__(self, message: str, hint: str = ""):
        super().__init__(message)
        self.hint = hint


class LLMUnavailableError(LLMError):
    """O runtime não respondeu (não instalado, parado ou endereço errado)."""


class LLMModelNotFoundError(LLMError):
    """O modelo pedido não está instalado no runtime."""


class LLMToolsUnsupportedError(LLMError):
    """O modelo não aceita chamadas de ferramenta."""


@dataclass
class ModelInfo:
    name: str
    size_bytes: int | None = None
    family: str | None = None
    parameter_size: str | None = None
    quantization: str | None = None
    capabilities: list[str] = field(default_factory=list)


@dataclass
class ToolCall:
    name: str
    arguments: dict[str, Any]
    id: str | None = None


@dataclass
class ChatResult:
    content: str
    tool_calls: list[ToolCall] = field(default_factory=list)


@dataclass
class GenerationOptions:
    temperature: float = 0.4
    num_ctx: int = 8192
    max_tokens: int | None = None


class LLMProvider(Protocol):
    name: str
    base_url: str

    async def health(self) -> dict[str, Any]: ...

    async def list_models(self) -> list[ModelInfo]: ...

    async def chat(
        self,
        messages: list[dict[str, Any]],
        model: str,
        options: GenerationOptions,
        tools: list[dict[str, Any]] | None = None,
    ) -> ChatResult: ...

    def stream_chat(
        self,
        messages: list[dict[str, Any]],
        model: str,
        options: GenerationOptions,
    ) -> AsyncIterator[str]: ...

    async def embed(self, texts: list[str], model: str) -> list[list[float]]: ...
