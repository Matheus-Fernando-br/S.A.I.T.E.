from app.core.config import config
from tests.conftest import stream_events, upload, wait_ready


def new_conversation(client, project_id=None):
    response = client.post("/api/conversations", json={"project_id": project_id} if project_id else {})
    assert response.status_code == 200, response.text
    return response.json()["conversation"]


def new_project(client, name, instructions=""):
    response = client.post("/api/projects", json={"name": name, "instructions": instructions})
    assert response.status_code == 200
    return response.json()


# ---------------------------------------------------------------- conversas


def test_conversation_lifecycle(client):
    conversation = new_conversation(client)
    cid = conversation["id"]
    assert conversation["title"] == "Nova conversa"

    assert client.patch(f"/api/conversations/{cid}", json={"title": "Viagem"}).json()["title"] == "Viagem"
    assert client.put(f"/api/conversations/{cid}/fix", params={"fix": True}).status_code == 200
    listed = client.get("/api/conversations").json()["conversations"]
    assert listed[0]["pinned"] is True and listed[0]["fix"] is True

    client.patch(f"/api/conversations/{cid}", json={"archived": True})
    assert client.get("/api/conversations").json()["conversations"] == []
    assert len(client.get("/api/conversations", params={"archived": True}).json()["conversations"]) == 1

    assert client.delete(f"/api/conversations/{cid}").status_code == 200
    assert client.get(f"/api/conversations/{cid}").status_code == 404
    assert client.patch("/api/conversations/nao-existe", json={"title": "x"}).status_code == 404


def test_search_history_by_title_and_content(client):
    first = new_conversation(client)
    stream_events(client, first["id"], "Planejar receita de lasanha")
    second = new_conversation(client)
    client.patch(f"/api/conversations/{second['id']}", json={"title": "Orçamento 100%_real"})
    found = client.get("/api/conversations", params={"q": "lasanha"}).json()["conversations"]
    assert [c["id"] for c in found] == [first["id"]]
    # Curingas do LIKE são tratados como texto literal.
    assert [c["id"] for c in client.get("/api/conversations", params={"q": "100%_"}).json()["conversations"]] == [second["id"]]
    assert client.get("/api/conversations", params={"q": "zz%"}).json()["conversations"] == []


def test_stream_persists_messages_and_uses_history(client, provider):
    conversation = new_conversation(client)
    events = stream_events(client, conversation["id"], "Meu nome é Ana.")
    types = [event for event, _ in events]
    assert types[0] == "start" and types[-1] == "done" and "token" in types
    start = events[0][1]
    assert start["conversation"]["title"] == "Meu nome é Ana."  # título sugerido
    assert start["retrieval"]["count"] == 0

    stream_events(client, conversation["id"], "Qual é o meu nome?")
    last_call = provider.calls[-1]["messages"]
    assert [m["role"] for m in last_call] == ["system", "user", "assistant", "user"]
    assert last_call[1]["content"] == "Meu nome é Ana."

    messages = client.get(f"/api/conversations/{conversation['id']}").json()["messages"]
    assert [m["role"] for m in messages] == ["user", "assistant", "user", "assistant"]
    assert all(m["status"] == "complete" for m in messages)


def test_rag_answer_has_verified_citations(client):
    document = upload(client, "manual.txt", "O cofre abre com o código 4815 após as 9 horas.".encode())
    wait_ready(client, document["document"]["id"])
    conversation = new_conversation(client)
    events = stream_events(client, conversation["id"], "Qual o código que abre o cofre?")
    start = events[0][1]
    assert start["retrieval"]["count"] == 1 and start["citations"][0]["document_name"] == "manual.txt"
    done = events[-1][1]["assistant_message"]
    # O dublê cita [1] (válida) e [7] (inexistente): a inválida é removida.
    assert "[1]" in done["content"] and "[7]" not in done["content"]
    assert done["citations"][0]["cited"] is True


def test_no_sources_answer_admits_absence(client):
    conversation = new_conversation(client)
    events = stream_events(client, conversation["id"], "Quem ganhou a copa de 1950?")
    assert "Não encontrei" in events[-1][1]["assistant_message"]["content"]
    assert events[0][1]["citations"] == []


def test_model_unavailable_is_reported_not_simulated(client, provider):
    provider.online = False
    conversation = new_conversation(client)
    events = stream_events(client, conversation["id"], "Olá?")
    assert events[-1][0] == "error"
    assert events[-1][1]["code"] == "LLMUnavailableError" and events[-1][1]["hint"]
    status = client.get("/api/ai/status").json()
    assert status["online"] is False
    # A mensagem de erro fica registrada, mas não entra no histórico enviado ao modelo.
    provider.online = True
    stream_events(client, conversation["id"], "De novo")
    assert [m["role"] for m in provider.calls[-1]["messages"]] == ["system", "user", "user"]


def test_error_mid_stream_saves_partial_text(client, provider):
    from app.llm.base import LLMError

    provider.stream_error = LLMError("conexão perdida")
    conversation = new_conversation(client)
    events = stream_events(client, conversation["id"], "Explique algo longo")
    assert events[-1][0] == "error"
    saved = client.get(f"/api/conversations/{conversation['id']}").json()["messages"][-1]
    assert saved["status"] == "error" and saved["content"].startswith("Não encontrei")


def test_non_streaming_endpoint_compat(client):
    conversation = new_conversation(client)
    response = client.post("/api/chat", json={"conversation_id": conversation["id"], "message": "oi"})
    assert response.status_code == 200 and response.json()["response"]
    assert client.post("/api/chat", json={"conversation_id": "x", "message": "oi"}).status_code == 404
    assert client.post("/api/chat", json={"conversation_id": conversation["id"], "message": ""}).status_code == 422


# ------------------------------------------------------- projetos/isolamento


def test_project_crud_and_protected_delete(client):
    project = new_project(client, "Casa", "Responda sempre com listas.")
    pid = project["id"]
    updated = client.patch(f"/api/projects/{pid}", json={"description": "Reforma"}).json()
    assert updated["description"] == "Reforma"
    conversation = new_conversation(client, pid)
    doc = upload(client, "planta.txt", b"planta da cozinha", scope="project", project_id=pid)
    wait_ready(client, doc["document"]["id"])
    stored = config.files_dir / doc["document"]["stored_path"]

    listed = client.get("/api/projects").json()["projects"][0]
    assert listed["conversation_count"] == 1 and listed["document_count"] == 1
    assert client.get(f"/api/projects/{pid}/activity").json()["activity"]

    client.patch(f"/api/projects/{pid}", json={"archived": True})
    assert client.get("/api/projects").json()["projects"] == []
    assert len(client.get("/api/projects", params={"include_archived": True}).json()["projects"]) == 1

    assert client.post(f"/api/projects/{pid}/delete", json={"confirm_name": "casa"}).status_code == 400
    removed = client.post(f"/api/projects/{pid}/delete", json={"confirm_name": "Casa"}).json()["removed"]
    assert removed == {"conversations": 1, "documents": 1}
    assert client.get(f"/api/conversations/{conversation['id']}").status_code == 404
    assert client.get(f"/api/knowledge/documents/{doc['document']['id']}").status_code == 404
    assert not stored.exists()


def test_project_context_does_not_leak(client, provider):
    alpha = new_project(client, "Alfa", "Instrução secreta do Alfa")
    beta = new_project(client, "Beta")
    wait_ready(client, upload(client, "alfa.txt", "O servidor do projeto usa a porta 7001.".encode(),
                              scope="project", project_id=alpha["id"])["document"]["id"])
    wait_ready(client, upload(client, "global.txt", "O wifi de casa chama Rede Teste porta.".encode())["document"]["id"])
    client.post("/api/memories", json={"content": "Memória do Alfa", "project_id": alpha["id"]})
    client.post("/api/memories", json={"content": "Prefere respostas curtas"})

    beta_chat = new_conversation(client, beta["id"])
    events = stream_events(client, beta_chat["id"], "Qual porta o servidor usa?")
    names = {c["document_name"] for c in events[0][1]["citations"]}
    system = provider.calls[-1]["messages"][0]["content"]
    assert "alfa.txt" not in names
    assert "7001" not in system and "Instrução secreta" not in system and "Memória do Alfa" not in system
    assert "Prefere respostas curtas" in system  # memória global é compartilhada

    alpha_chat = new_conversation(client, alpha["id"])
    events = stream_events(client, alpha_chat["id"], "Qual porta o servidor usa?")
    system = provider.calls[-1]["messages"][0]["content"]
    assert "alfa.txt" in {c["document_name"] for c in events[0][1]["citations"]}
    assert "Instrução secreta do Alfa" in system and "Memória do Alfa" in system

    # Conversas gerais não veem documentos de projeto.
    general = new_conversation(client)
    stream_events(client, general["id"], "Qual porta o servidor usa?")
    assert "7001" not in provider.calls[-1]["messages"][0]["content"]

    # A busca direta também respeita o escopo.
    results = client.post("/api/knowledge/search", json={"query": "porta servidor", "project_id": beta["id"]}).json()["results"]
    assert "alfa.txt" not in {r["document_name"] for r in results}


def test_conversation_scoped_document_is_private_to_that_conversation(client):
    one = new_conversation(client)
    two = new_conversation(client)
    doc = upload(client, "anexo.txt", "Contrato número 998877 assinado.".encode(), scope="conversation", conversation_id=one["id"])
    wait_ready(client, doc["document"]["id"])
    assert stream_events(client, one["id"], "número do contrato")[0][1]["retrieval"]["count"] == 1
    assert stream_events(client, two["id"], "número do contrato")[0][1]["retrieval"]["count"] == 0
    client.delete(f"/api/conversations/{one['id']}")
    assert client.get(f"/api/knowledge/documents/{doc['document']['id']}").status_code == 404


def test_memories_crud(client):
    memory = client.post("/api/memories", json={"content": "Sou vegetariano"}).json()
    assert [m["content"] for m in client.get("/api/memories").json()["memories"]] == ["Sou vegetariano"]
    assert client.delete(f"/api/memories/{memory['id']}").status_code == 200
    assert client.delete(f"/api/memories/{memory['id']}").status_code == 404
    assert client.post("/api/memories", json={"content": "x", "project_id": "nao-existe"}).status_code == 404
