import pytest

from app.core.config import config


def test_login_protects_every_route(client, monkeypatch):
    monkeypatch.setattr(config, "access_password", "senha-do-dono")
    monkeypatch.setattr(config, "session_secret", "segredo-de-teste")
    assert client.get("/api/conversations").status_code == 401
    assert client.get("/api/conversations", headers={"Authorization": "Bearer errado"}).status_code == 401
    assert client.post("/api/auth/login", json={"password": "errada"}).status_code == 401
    login = client.post("/api/auth/login", json={"password": "senha-do-dono"}).json()
    headers = {"Authorization": f"Bearer {login['token']}"}
    assert client.get("/api/conversations", headers=headers).status_code == 200
    # Assinatura adulterada é recusada.
    assert client.get("/api/conversations", headers={"Authorization": f"Bearer {login['token']}x"}).status_code == 401
    # /health e /api/auth/status são públicos e informam que há autenticação, sem revelar dados.
    assert client.get("/health").json()["auth_required"] is True
    assert client.get("/api/auth/status").json() == {"auth_required": True}
    # Trocar a senha encerra as sessões existentes em todos os dispositivos.
    monkeypatch.setattr(config, "access_password", "nova-senha")
    assert client.get("/api/conversations", headers=headers).status_code == 401


def test_expired_session_is_rejected(client, monkeypatch):
    from app.core import security

    monkeypatch.setattr(config, "access_password", "senha")
    monkeypatch.setattr(config, "session_days", -1)
    token, _ = security.issue_session()
    assert security.verify_session(token) is False


def test_login_is_rate_limited(client, monkeypatch):
    monkeypatch.setattr(config, "access_password", "senha")
    codes = [client.post("/api/auth/login", json={"password": "x"}).status_code for _ in range(9)]
    assert codes[:8] == [401] * 8 and codes[8] == 429


def test_private_network_access_preflight(client):
    response = client.options(
        "/api/conversations",
        headers={
            "Origin": "https://saite-agent.vercel.app",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Private-Network": "true",
        },
    )
    assert response.headers.get("access-control-allow-private-network") == "true"
    other = client.options(
        "/api/conversations",
        headers={"Origin": "https://malicioso.example", "Access-Control-Request-Method": "GET",
                 "Access-Control-Request-Private-Network": "true"},
    )
    assert "access-control-allow-private-network" not in other.headers
    assert "access-control-allow-origin" not in other.headers


def test_settings_persist_and_validate(client):
    settings = client.get("/api/ai/settings").json()
    assert settings["llm_provider"] == config.llm_provider and "llm_api_key" not in settings
    updated = client.put("/api/ai/settings", json={"chat_model": "llama3.2:3b", "temperature": 0.2}).json()
    assert updated["chat_model"] == "llama3.2:3b" and updated["temperature"] == 0.2
    assert client.get("/api/ai/settings").json()["chat_model"] == "llama3.2:3b"
    for bad in ({"temperature": 5}, {"llm_provider": "openai"}, {"llm_base_url": "file:///x"},
                {"desconhecida": 1}, {"num_ctx": "muito"}, {"rag_top_k": True}):
        assert client.put("/api/ai/settings", json=bad).status_code == 400, bad
    assert client.post("/api/ai/settings/reset").json()["chat_model"] == config.chat_model


def test_ai_status_reports_models(client):
    status = client.get("/api/ai/status").json()
    assert status["online"] is True and {m["name"] for m in status["models"]} == {"fake-chat", "fake-embed"}
    assert status["chat_model_installed"] is False and "não lista o modelo" in status["hint"]
    client.put("/api/ai/settings", json={"chat_model": "fake-chat"})
    assert client.get("/api/ai/status").json()["chat_model_installed"] is True
    assert client.post("/api/ai/test").json()["ok"] is True


def test_export_import_roundtrip(client, tmp_path, monkeypatch):
    project = client.post("/api/projects", json={"name": "Exportado"}).json()
    conversation = client.post("/api/conversations", json={"project_id": project["id"]}).json()["conversation"]
    client.post("/api/chat", json={"conversation_id": conversation["id"], "message": "olá"})
    client.post("/api/memories", json={"content": "lembrar disso"})
    exported = client.get("/api/data/export")
    assert "attachment" in exported.headers["content-disposition"]
    payload = exported.json()
    assert len(payload["messages"]) == 2 and payload["projects"][0]["name"] == "Exportado"

    # Importa num banco vazio.
    from app.db.database import get_conn

    with get_conn() as conn:
        conn.execute("TRUNCATE projects, conversations, messages, memories CASCADE")
    inserted = client.post("/api/data/import", json=payload).json()["inserted"]
    assert inserted == {"projects": 1, "conversations": 1, "messages": 2, "memories": 1}
    again = client.post("/api/data/import", json=payload).json()["inserted"]
    assert again == {"projects": 0, "conversations": 0, "messages": 0, "memories": 0}
    assert client.post("/api/data/import", json={"format": "outro"}).status_code == 400


@pytest.mark.parametrize("payload", [{"title": ""}, {"title": "x" * 201}])
def test_input_validation(client, payload):
    cid = client.post("/api/conversations").json()["conversation_id"]
    assert client.patch(f"/api/conversations/{cid}", json=payload).status_code == 422


def test_rate_limit_on_chat(client, monkeypatch):
    from app.core.security import chat_limiter

    monkeypatch.setattr(chat_limiter, "limit", 2)
    chat_limiter.hits.clear()
    cid = client.post("/api/conversations").json()["conversation_id"]
    codes = [client.post("/api/chat", json={"conversation_id": cid, "message": "oi"}).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
    chat_limiter.hits.clear()


def test_computer_agent_not_configured_in_cloud(client):
    status = client.get("/api/computer/status").json()
    assert status["connected"] is False and status["configured"] is False
    assert ".exe" in status["error"]
    assert client.post("/api/computer/tools/system_info").status_code == 503


@pytest.mark.parametrize(
    "base,expected",
    [
        ("http://127.0.0.1:8080", "http://127.0.0.1:8080/v1"),
        ("http://127.0.0.1:8080/v1/", "http://127.0.0.1:8080/v1"),
        ("https://generativelanguage.googleapis.com/v1beta/openai/", "https://generativelanguage.googleapis.com/v1beta/openai"),
        ("https://api.groq.com/openai/v1", "https://api.groq.com/openai/v1"),
    ],
)
def test_openai_compatible_base_url(base, expected):
    from app.llm.openai_compat import OpenAICompatibleProvider

    assert OpenAICompatibleProvider(base).base_url == expected
