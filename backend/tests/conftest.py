"""Fixtures da suíte do backend.

``FakeProvider`` é um dublê de teste determinístico do contrato ``LLMProvider``:
embeddings por *hashing* de palavras (textos com palavras em comum ficam
próximos) e respostas roteirizadas. Existe apenas nos testes; a aplicação real
usa Ollama ou um servidor OpenAI-compatível local.
"""

import hashlib
import io
import math
import os
import re
import time

import psycopg
import pytest
from fastapi.testclient import TestClient

from app.core.config import config
from app.llm import registry
from app.llm.base import ChatResult, LLMError, LLMUnavailableError, ModelInfo, ToolCall


DIM = 64


def fake_embedding(text: str) -> list[float]:
    vector = [0.0] * DIM
    for word in re.findall(r"\w+", text.lower()):
        if len(word) < 3 or word in {"search_document", "search_query"}:
            continue
        index = int(hashlib.md5(word.encode()).hexdigest(), 16) % DIM
        vector[index] += 1.0
    norm = math.sqrt(sum(v * v for v in vector)) or 1.0
    return [v / norm for v in vector]


class FakeProvider:
    name = "fake"
    base_url = "fake://"

    def __init__(self):
        self.calls: list[dict] = []
        self.online = True
        self.embed_fails = False
        self.stream_error: Exception | None = None
        self.scripted_tool_calls: list[list[ToolCall]] = []
        self.reply: str | None = None

    async def health(self):
        return {"ok": self.online, "version": "fake-1"} if self.online else {"ok": False, "error": "offline"}

    async def list_models(self):
        if not self.online:
            raise LLMUnavailableError("offline")
        return [ModelInfo(name="fake-chat"), ModelInfo(name="fake-embed", capabilities=["embedding"])]

    def _answer(self, messages) -> str:
        if self.reply is not None:
            return self.reply
        system = messages[0]["content"]
        if "<fonte" in system:
            return "Segundo os documentos, a resposta está na fonte [1]. Veja também [7]."
        return "Não encontrei essa informação nos seus documentos."

    async def chat(self, messages, model, options, tools=None):
        self.calls.append({"kind": "chat", "messages": messages, "tools": tools})
        if not self.online:
            raise LLMUnavailableError("offline", hint="inicie o runtime")
        if tools and self.scripted_tool_calls:
            return ChatResult(content="", tool_calls=self.scripted_tool_calls.pop(0))
        return ChatResult(content=self._answer(messages))

    async def stream_chat(self, messages, model, options):
        self.calls.append({"kind": "stream", "messages": messages})
        if not self.online:
            raise LLMUnavailableError("offline", hint="inicie o runtime")
        answer = self._answer(messages)
        for index, word in enumerate(answer.split(" ")):
            if self.stream_error and index == 2:
                raise self.stream_error
            yield word if index == 0 else " " + word

    async def embed(self, texts, model):
        if self.embed_fails or not self.online:
            raise LLMError("modelo de embeddings indisponível")
        return [fake_embedding(text) for text in texts]


@pytest.fixture()
def provider():
    fake = FakeProvider()
    registry.set_provider_factory(lambda settings: fake)
    yield fake
    registry.set_provider_factory(None)


TEST_DATABASE_URL = os.getenv("SAITE_TEST_DATABASE_URL", "postgresql://postgres@127.0.0.1:5433/postgres")


def reset_database(url: str) -> None:
    """Banco limpo a cada teste (o esquema é recriado pelas migrações na inicialização)."""
    with psycopg.connect(url, autocommit=True) as conn:
        conn.execute("DROP SCHEMA IF EXISTS public CASCADE")
        conn.execute("CREATE SCHEMA public")


@pytest.fixture()
def client(provider, monkeypatch):
    reset_database(TEST_DATABASE_URL)
    monkeypatch.setattr(config, "database_url", TEST_DATABASE_URL)
    monkeypatch.setattr(config, "access_password", "")
    from app.core.security import chat_limiter, ingest_limiter, login_limiter
    from app.main import app

    chat_limiter.hits.clear()
    ingest_limiter.hits.clear()
    login_limiter.hits.clear()

    with TestClient(app) as test_client:
        yield test_client


def blob_count(document_id: str) -> int:
    from app.db.database import get_conn

    with get_conn() as conn:
        return conn.execute(
            "SELECT COUNT(*) AS n FROM document_blobs WHERE document_id = ?", (document_id,)
        ).fetchone()["n"]


def wait_ready(client, document_id: str, timeout: float = 10.0) -> dict:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        document = client.get(f"/api/knowledge/documents/{document_id}").json()["document"]
        if document["status"] in {"ready", "error"}:
            return document
        time.sleep(0.05)
    raise AssertionError(f"documento {document_id} não terminou de processar")


def upload(client, name: str, data: bytes, **form) -> dict:
    response = client.post(
        "/api/knowledge/documents",
        files={"file": (name, io.BytesIO(data))},
        data={"scope": "global", **form},
    )
    assert response.status_code == 200, response.text
    return response.json()


def stream_events(client, conversation_id: str, message: str, **extra) -> list[tuple[str, dict]]:
    import json

    with client.stream(
        "POST",
        "/api/chat/stream",
        json={"conversation_id": conversation_id, "message": message, **extra},
    ) as response:
        assert response.status_code == 200, response.read()
        body = "".join(response.iter_text())
    events = []
    for block in body.strip().split("\n\n"):
        lines = dict(line.split(": ", 1) for line in block.splitlines())
        events.append((lines["event"], json.loads(lines["data"])))
    return events
