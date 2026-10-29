"""Provedor para servidores locais que expõem a API no formato OpenAI.

Exemplos: ``llama-server`` do llama.cpp, LM Studio, vLLM. Não é a API da OpenAI:
o endereço padrão é local e a chave é opcional (alguns servidores exigem uma
chave arbitrária configurada pelo próprio usuário).
"""

import json
from urllib.parse import urlsplit
from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.llm.base import (
    ChatResult,
    GenerationOptions,
    LLMError,
    LLMModelNotFoundError,
    LLMUnavailableError,
    ModelInfo,
    ToolCall,
)


SETUP_HINT = (
    "Confira o endereço do provedor e a chave SAITE_LLM_API_KEY nas variáveis de ambiente do backend "
    "(ex.: Gemini https://generativelanguage.googleapis.com/v1beta/openai, "
    "Groq https://api.groq.com/openai/v1, ou um llama-server local)."
)


class OpenAICompatibleProvider:
    name = "openai_compatible"

    def __init__(self, base_url: str, api_key: str = "", timeout: float = 300.0):
        base = base_url.rstrip("/")
        # Servidores locais costumam expor /v1; provedores na nuvem já trazem o caminho
        # completo (ex.: .../v1beta/openai do Gemini, .../openai/v1 do Groq).
        self.base_url = base + "/v1" if urlsplit(base).path in ("", "/") else base
        self.api_key = api_key
        self.timeout = timeout

    def _client(self, timeout: float | None = None) -> httpx.AsyncClient:
        headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        return httpx.AsyncClient(
            base_url=self.base_url,
            headers=headers,
            timeout=httpx.Timeout(timeout or self.timeout, connect=5.0),
        )

    def _unavailable(self, exc: Exception) -> LLMUnavailableError:
        return LLMUnavailableError(
            f"Não foi possível conectar ao servidor em {self.base_url} ({type(exc).__name__}).",
            hint=SETUP_HINT,
        )

    @staticmethod
    def _raise_for(response: httpx.Response, model: str | None = None) -> None:
        if response.status_code < 400:
            return
        if response.status_code == 404:
            raise LLMModelNotFoundError(
                f"Modelo ou rota não encontrada ({model}).",
                hint="Confira o nome do modelo em Configurações → IA.",
            )
        if response.status_code in (401, 403):
            raise LLMError(
                f"O provedor recusou a chave de acesso (HTTP {response.status_code}).",
                hint="Confira SAITE_LLM_API_KEY nas variáveis de ambiente do backend.",
            )
        if response.status_code == 429:
            raise LLMError(
                "Limite de uso do provedor de IA atingido. Aguarde um pouco e tente de novo.",
                hint="Planos gratuitos têm limite de requisições por minuto e por dia.",
            )
        raise LLMError(f"Servidor retornou erro {response.status_code}: {response.text[:300]}")

    @staticmethod
    def _payload(messages, model, options: GenerationOptions) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": options.temperature,
        }
        if options.max_tokens:
            payload["max_tokens"] = options.max_tokens
        return payload

    async def health(self) -> dict[str, Any]:
        try:
            async with self._client(timeout=5.0) as client:
                response = await client.get("/models")
                response.raise_for_status()
                return {"ok": True, "version": None}
        except httpx.HTTPError as exc:
            return {"ok": False, "error": str(self._unavailable(exc)), "hint": SETUP_HINT}

    async def list_models(self) -> list[ModelInfo]:
        try:
            async with self._client(timeout=10.0) as client:
                response = await client.get("/models")
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response)
        return [ModelInfo(name=item["id"]) for item in response.json().get("data", [])]

    async def chat(self, messages, model, options, tools=None) -> ChatResult:
        payload = self._payload(_to_openai_messages(messages), model, options)
        if tools:
            payload["tools"] = tools
        try:
            async with self._client() as client:
                response = await client.post("/chat/completions", json=payload)
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response, model)
        message = response.json()["choices"][0]["message"]
        calls = []
        for call in message.get("tool_calls") or []:
            function = call.get("function") or {}
            try:
                arguments = json.loads(function.get("arguments") or "{}")
            except ValueError:
                arguments = {}
            calls.append(
                ToolCall(name=function.get("name", ""), arguments=arguments, id=call.get("id"))
            )
        return ChatResult(content=message.get("content") or "", tool_calls=calls)

    async def stream_chat(self, messages, model, options) -> AsyncIterator[str]:
        payload = self._payload(_to_openai_messages(messages), model, options)
        payload["stream"] = True
        try:
            async with self._client() as client:
                async with client.stream("POST", "/chat/completions", json=payload) as response:
                    if response.status_code >= 400:
                        await response.aread()
                        self._raise_for(response, model)
                    async for line in response.aiter_lines():
                        if not line.startswith("data:"):
                            continue
                        data = line[5:].strip()
                        if data == "[DONE]":
                            break
                        delta = json.loads(data)["choices"][0].get("delta") or {}
                        if delta.get("content"):
                            yield delta["content"]
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc

    async def embed(self, texts: list[str], model: str) -> list[list[float]]:
        if not texts:
            return []
        try:
            async with self._client() as client:
                response = await client.post("/embeddings", json={"model": model, "input": texts})
        except httpx.HTTPError as exc:
            raise self._unavailable(exc) from exc
        self._raise_for(response, model)
        data = sorted(response.json().get("data", []), key=lambda item: item.get("index", 0))
        if len(data) != len(texts):
            raise LLMError("Resposta de embeddings inválida do servidor.")
        return [item["embedding"] for item in data]


def _to_openai_messages(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Converte o formato interno (igual ao do Ollama) para o formato OpenAI."""
    converted = []
    for message in messages:
        item = dict(message)
        if item.get("tool_calls"):
            item["tool_calls"] = [
                {
                    "id": call.get("id") or f"call_{index}",
                    "type": "function",
                    "function": {
                        "name": call["function"]["name"],
                        "arguments": json.dumps(call["function"].get("arguments") or {}),
                    },
                }
                for index, call in enumerate(item["tool_calls"])
            ]
        if item.get("role") == "tool" and "tool_call_id" not in item:
            item["tool_call_id"] = item.pop("tool_call_ref", "call_0")
        item.pop("tool_name", None)
        converted.append(item)
    return converted
