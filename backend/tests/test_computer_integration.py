"""Integração real backend ↔ agente local (processo HTTP em thread, sem mocks de rede)."""

import socket
import sys
import threading
import time
from pathlib import Path

import pytest
import uvicorn

from app.core.config import config
from app.llm.base import ToolCall
from tests.conftest import stream_events

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "agent"))


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


@pytest.fixture()
def agent(tmp_path, monkeypatch, client):
    monkeypatch.setenv("SAITE_AGENT_HOME", str(tmp_path / "agent-home"))
    from saite_agent.config import load_config, save_config
    from saite_agent.server import app as agent_app

    allowed = tmp_path / "Documentos"
    allowed.mkdir()
    (allowed / "curriculo.pdf").write_bytes(b"%PDF-1.4")
    (allowed / "notas.txt").write_text("reunião às 15h")
    agent_config = load_config()
    agent_config.allowed_roots = [str(allowed.resolve())]
    save_config(agent_config)

    port = free_port()
    server = uvicorn.Server(uvicorn.Config(agent_app, host="127.0.0.1", port=port, log_level="warning"))
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    while not server.started:
        time.sleep(0.02)
    monkeypatch.setattr(config, "agent_token", agent_config.token)
    client.put("/api/ai/settings", json={"agent_url": f"http://127.0.0.1:{port}"})
    yield allowed
    server.should_exit = True
    thread.join(timeout=5)


def test_status_and_panel_tools(client, agent):
    status = client.get("/api/computer/status").json()
    assert status["connected"] is True and status["allowed_roots"] == [str(agent.resolve())]
    info = client.post("/api/computer/tools/system_info").json()
    assert info["os"] and info["collected_at"]
    # A interface não pode chamar ferramentas de arquivos diretamente.
    assert client.post("/api/computer/tools/read_text_file", json={"path": "/etc/passwd"}).status_code == 403


def test_wrong_token_and_offline_agent(client, agent, monkeypatch):
    monkeypatch.setattr(config, "agent_token", "errado")
    status = client.get("/api/computer/status").json()
    assert status["connected"] is False and "Token" in status["error"]
    client.put("/api/ai/settings", json={"agent_url": f"http://127.0.0.1:{free_port()}"})
    status = client.get("/api/computer/status").json()
    assert status["connected"] is False and status["hint"]


def test_chat_uses_tools_only_when_enabled(client, provider, agent):
    cid = client.post("/api/conversations").json()["conversation_id"]
    provider.scripted_tool_calls = [[ToolCall("search_files", {"query": "curriculo", "extension": "pdf"})]]
    provider.reply = "Encontrei seu currículo em Documentos."
    events = stream_events(client, cid, "Onde está meu currículo?", use_computer=True)
    tool_events = [data for kind, data in events if kind == "tool"]
    assert tool_events == [{"name": "search_files", "arguments": {"query": "curriculo", "extension": "pdf"},
                            "ok": True, "error": None}]
    tool_message = [m for m in provider.calls[-1]["messages"] if m["role"] == "tool"][0]
    assert "curriculo.pdf" in tool_message["content"]
    saved = events[-1][1]["assistant_message"]
    assert saved["tool_calls"][0]["name"] == "search_files"
    audit = client.get("/api/computer/audit").json()["entries"]
    assert audit[0]["tool"] == "search_files" and audit[0]["ok"] is True

    # Sem "use_computer", nenhuma ferramenta é oferecida ao modelo.
    stream_events(client, cid, "Onde está meu currículo?")
    assert provider.calls[-1]["kind"] == "stream"
    assert "ferramentas oferecidas" not in provider.calls[-1]["messages"][0]["content"]


def test_disallowed_tool_requests_are_refused(client, provider, agent, tmp_path):
    cid = client.post("/api/conversations").json()["conversation_id"]
    secret = tmp_path / "fora.txt"
    secret.write_text("segredo")
    provider.scripted_tool_calls = [
        [ToolCall("read_text_file", {"path": str(secret)})],  # desativada por padrão
        [ToolCall("list_directory", {"path": str(tmp_path)})],  # fora da pasta autorizada
        [ToolCall("run_shell", {"cmd": "rm -rf /"})],  # inexistente
    ]
    provider.reply = "Não consegui acessar."
    events = stream_events(client, cid, "Leia o arquivo fora.txt", use_computer=True)
    tools = [data for kind, data in events if kind == "tool"]
    assert [t["ok"] for t in tools] == [False, False, False]
    assert "não autorizada" in tools[0]["error"] and "não autorizada" in tools[2]["error"]
    assert "fora das pastas autorizadas" in tools[1]["error"]
    assert all("segredo" not in m["content"] for m in provider.calls[-1]["messages"] if m["role"] == "tool")


def test_paused_agent_disables_tools(client, provider, agent):
    client.put("/api/computer/permissions", json={"paused": True})
    cid = client.post("/api/conversations").json()["conversation_id"]
    events = stream_events(client, cid, "Quanto de disco livre?", use_computer=True)
    assert events[0][0] == "notice" and "indisponível" in events[0][1]["message"]
    assert events[1][1]["tools"] == []
    client.put("/api/computer/permissions", json={"paused": False})
    assert client.get("/api/computer/status").json()["paused"] is False
