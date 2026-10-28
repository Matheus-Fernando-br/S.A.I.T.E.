import pytest

from app.core.config import config


def test_token_is_enforced_when_configured(client, monkeypatch):
    monkeypatch.setattr(config, "api_token", "segredo-local")
    assert client.get("/api/conversations").status_code == 401
    assert client.get("/api/conversations", headers={"Authorization": "Bearer errado"}).status_code == 401
    assert client.get("/api/conversations", headers={"Authorization": "Bearer segredo-local"}).status_code == 200
    # /health continua público e informa que há autenticação, sem revelar dados.
    assert client.get("/health").json()["auth_required"] is True


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
    assert settings["llm_provider"] == "ollama" and "llm_api_key" not in settings
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
    assert status["chat_model_installed"] is False and "não está instalado" in status["hint"]
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
    monkeypatch.setattr(config, "data_dir", tmp_path / "outro")
    from app.db.database import migrate

    migrate()
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
