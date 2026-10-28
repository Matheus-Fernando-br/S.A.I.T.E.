"""Provedor Ollama (https://github.com/ollama/ollama/blob/main/docs/api.md)."""

import json
from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.llm.base import (
    ChatResult,
    GenerationOptions,
    LLMError,
    LLMModelNotFoundError,
    LLMToolsUnsupportedError,
    LLMUnavailableError,
    ModelInfo,
    ToolCall,
)


SETUP_HINT = (
    "Instale o Ollama (https://ollama.com/download), inicie-o com `ollama serve` "
    "e confira o endereço em Configurações."
)


class OllamaProvider:
    name = "ollama"

    def __init__(self, base_url: str, timeout: float = 300.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _client(self, timeout: float | None = None) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self.base_url,
            timeout=httpx.Timeout(timeout or self.timeout, connect=5.0),
        )

    def _raise_for(self, response: httpx.Response, model: str | None = None) -> None:
        if response.status_code < 400:
            return
        try:
            message = response.json().get("error", response.text)
        except ValueError:
            message = response.text
        if response.status_code == 404 or "not found" in message.lower():
            raise LLMModelNotFoundError(
                f"Modelo '{model}' não encontrado no Ollama.",
                hint=f"Instale-o com `ollama pull {model}` ou escolha outro em Configurações.",
            )
        if "does not support tools" in message.lower():
            raise LLMToolsUnsupportedError(message)
        raise LLMError(f"Ollama retornou erro {response.status_code}: {message}")

    def _unavailable(self, exc: Exception) -> LLMUnavailableError:
        return LLMUnavailableError(
            f"Não foi possível conectar ao Ollama em {self.base_url} ({type(exc).__name__}).",
            hint=SETUP_HINT,
        )

    @staticmethod
    def _options(options: GenerationOptions) -> dict[str, Any]:
        data: dict[str, Any] = {"temperature": options.temperature, "num_ctx": options.num_ctx}
        if options.max_tokens:
            data["num_predict"] = options.max_tokens
        return data

    async def health(self) -> dict[str, Any]:
        try:
            async with self._client(timeout=5.0) as client:
                response = await client.get("/api/version")
                response.raise_for_status()
                return {"ok": True, "version": response.json().get("version")}
        except (httpx.HTTPError, ValueError) as exc:
            return {"ok": False, "error": str(self._unavailable(exc)), "hint": SETUP_HINT}

    async def list_models(self) -> list[ModelInfo]:
        try:
            async with self._client(timeout=10.0) as client:
                response = await client.get("/api/tags")
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response)
        models = []
        for item in response.json().get("models", []):
            details = item.get("details") or {}
            models.append(
                ModelInfo(
                    name=item.get("name") or item.get("model"),
                    size_bytes=item.get("size"),
                    family=details.get("family"),
                    parameter_size=details.get("parameter_size"),
                    quantization=details.get("quantization_level"),
                    capabilities=item.get("capabilities") or [],
                )
            )
        return models

    async def chat(
        self,
        messages: list[dict[str, Any]],
        model: str,
        options: GenerationOptions,
        tools: list[dict[str, Any]] | None = None,
    ) -> ChatResult:
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": self._options(options),
        }
        if tools:
            payload["tools"] = tools
        try:
            async with self._client() as client:
                response = await client.post("/api/chat", json=payload)
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response, model)
        message = response.json().get("message") or {}
        calls = []
        for call in message.get("tool_calls") or []:
            function = call.get("function") or {}
            arguments = function.get("arguments") or {}
            if isinstance(arguments, str):
                try:
                    arguments = json.loads(arguments)
                except ValueError:
                    arguments = {}
            calls.append(ToolCall(name=function.get("name", ""), arguments=arguments))
        return ChatResult(content=message.get("content") or "", tool_calls=calls)

    async def stream_chat(
        self,
        messages: list[dict[str, Any]],
        model: str,
        options: GenerationOptions,
    ) -> AsyncIterator[str]:
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            "options": self._options(options),
        }
        try:
            async with self._client() as client:
                async with client.stream("POST", "/api/chat", json=payload) as response:
                    if response.status_code >= 400:
                        await response.aread()
                        self._raise_for(response, model)
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        data = json.loads(line)
                        if data.get("error"):
                            raise LLMError(data["error"])
                        piece = (data.get("message") or {}).get("content") or ""
                        if piece:
                            yield piece
                        if data.get("done"):
                            break
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc

    async def embed(self, texts: list[str], model: str) -> list[list[float]]:
        if not texts:
            return []
        try:
            async with self._client() as client:
                response = await client.post(
                    "/api/embed", json={"model": model, "input": texts, "truncate": True}
                )
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response, model)
        embeddings = response.json().get("embeddings")
        if not embeddings or len(embeddings) != len(texts):
            raise LLMError("Resposta de embeddings inválida do Ollama.")
        return embeddings
