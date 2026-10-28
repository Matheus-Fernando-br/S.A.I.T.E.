import os
import sys

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def env(tmp_path, monkeypatch):
    home = tmp_path / "agent-home"
    allowed = tmp_path / "allowed"
    outside = tmp_path / "outside"
    allowed.mkdir()
    outside.mkdir()
    (allowed / "notas.txt").write_text("lista de compras: café", encoding="utf-8")
    (allowed / "relatorio.pdf").write_bytes(b"%PDF-1.4 fake")
    (allowed / ".env").write_text("SECRET=1")
    (allowed / "id_rsa").write_text("PRIVATE KEY")
    (allowed / "binario.txt").write_bytes(b"\x00\x01\x02")
    (allowed / "sub").mkdir()
    (allowed / "sub" / "notas-antigas.txt").write_text("antigo")
    (allowed / ".ssh").mkdir()
    (allowed / ".ssh" / "config").write_text("Host *")
    (outside / "segredo.txt").write_text("fora")
    monkeypatch.setenv("SAITE_AGENT_HOME", str(home))

    from saite_agent.config import load_config, save_config

    config = load_config()
    config.allowed_roots = [str(allowed.resolve())]
    config.tools["read_text_file"] = True
    save_config(config)

    from saite_agent.server import app

    client = TestClient(app)
    client.headers["Authorization"] = f"Bearer {config.token}"
    return client, allowed, outside, config


def call(client, name, **arguments):
    return client.post(f"/tools/{name}", json={"arguments": arguments})


def test_health_is_public_and_status_requires_token(env):
    client, *_ = env
    anonymous = TestClient(client.app)
    assert anonymous.get("/health").json()["ok"] is True
    assert anonymous.get("/status").status_code == 401
    assert anonymous.post("/tools/system_info", json={}).status_code == 401
    bad = TestClient(client.app, headers={"Authorization": "Bearer errado"})
    assert bad.get("/status").status_code == 401
    assert client.get("/status").status_code == 200


def test_defaults_are_least_privilege(tmp_path, monkeypatch):
    monkeypatch.setenv("SAITE_AGENT_HOME", str(tmp_path / "fresh"))
    from saite_agent.config import load_config

    config = load_config()
    assert config.allowed_roots == []
    assert config.tools["read_text_file"] is False
    assert config.tools["list_processes"] is False
    if os.name != "nt":
        assert oct((tmp_path / "fresh" / "config.json").stat().st_mode)[-3:] == "600"


def test_system_and_disk_report_current_state(env):
    client, *_ = env
    info = call(client, "system_info").json()
    assert info["os"] and info["collected_at"] and info["cpu_logical"] >= 1
    disks = call(client, "disk_usage").json()["disks"]
    assert disks and disks[0]["total_bytes"] > 0


def test_list_directory_hides_sensitive_entries(env):
    client, allowed, *_ = env
    response = call(client, "list_directory", path=str(allowed))
    assert response.status_code == 200
    names = {entry["name"] for entry in response.json()["entries"]}
    assert {"notas.txt", "relatorio.pdf", "sub"} <= names
    assert ".env" not in names and "id_rsa" not in names and ".ssh" not in names


@pytest.mark.parametrize(
    "path_builder",
    [
        lambda allowed, outside: str(outside / "segredo.txt"),
        lambda allowed, outside: str(allowed / ".." / "outside" / "segredo.txt"),
        lambda allowed, outside: "relativo/notas.txt",
        lambda allowed, outside: "/",
    ],
)
def test_access_outside_allowed_roots_is_denied(env, path_builder):
    client, allowed, outside, _ = env
    response = call(client, "read_text_file", path=path_builder(allowed, outside))
    assert response.status_code in {400, 403}


@pytest.mark.skipif(sys.platform == "win32", reason="symlinks exigem privilégio no Windows")
def test_symlink_escape_is_denied(env):
    client, allowed, outside, _ = env
    (allowed / "atalho.txt").symlink_to(outside / "segredo.txt")
    assert call(client, "read_text_file", path=str(allowed / "atalho.txt")).status_code == 403


@pytest.mark.parametrize("name", [".env", "id_rsa", ".ssh/config"])
def test_credential_files_are_denied_inside_allowed_root(env, name):
    client, allowed, *_ = env
    assert call(client, "read_text_file", path=str(allowed / name)).status_code == 403


def test_read_text_file_and_binary_rejection(env):
    client, allowed, *_ = env
    response = call(client, "read_text_file", path=str(allowed / "notas.txt"))
    assert response.json()["content"] == "lista de compras: café"
    assert call(client, "read_text_file", path=str(allowed / "binario.txt")).status_code == 400


def test_search_files_by_name_and_extension(env):
    client, *_ = env
    results = call(client, "search_files", query="notas").json()["results"]
    assert {r["name"] for r in results} == {"notas.txt", "notas-antigas.txt"}
    pdfs = call(client, "search_files", query="rel", extension="pdf").json()["results"]
    assert [r["name"] for r in pdfs] == ["relatorio.pdf"]


def test_disabled_tool_pause_and_revocation(env):
    client, allowed, *_ = env
    assert call(client, "list_processes").status_code == 403  # desligada por padrão
    client.put("/permissions", json={"paused": True})
    assert call(client, "system_info").status_code == 423
    client.put("/permissions", json={"paused": False, "allowed_roots": []})
    assert call(client, "list_directory", path=str(allowed)).status_code == 403


def test_permission_validation(env):
    client, *_ = env
    assert client.put("/permissions", json={"allowed_roots": ["/"]}).status_code == 400
    assert client.put("/permissions", json={"allowed_roots": ["/nao/existe"]}).status_code == 400
    assert client.put("/permissions", json={"tools": {"run_shell": True}}).status_code == 400
    assert call(client, "run_shell").status_code == 404


def test_bad_arguments_and_audit_log(env):
    client, allowed, *_ = env
    assert call(client, "system_info", unexpected="x").status_code == 200  # extras ignorados
    assert call(client, "list_directory", path=123).status_code == 400
    call(client, "read_text_file", path=str(allowed / "notas.txt"))
    entries = client.get("/audit").json()["entries"]
    assert entries[0]["tool"] == "read_text_file" and entries[0]["ok"] is True
    # O conteúdo lido nunca vai para o log.
    assert "café" not in str(entries)
