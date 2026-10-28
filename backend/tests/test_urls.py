import asyncio
import socket
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from app.services.knowledge import urlfetch
from app.services.knowledge.urlfetch import URLFetchError, fetch_url, is_public_ip, validate_url
from tests.conftest import wait_ready


@pytest.mark.parametrize(
    "url",
    [
        "file:///etc/passwd",
        "ftp://example.com/x",
        "gopher://example.com",
        "http://localhost/admin",
        "http://servidor.local/",
        "http://user:senha@example.com/",
        "http://example.com:22/",
        "javascript:alert(1)",
        "http:///semhost",
    ],
)
def test_validate_url_rejects_forbidden_forms(url):
    with pytest.raises(URLFetchError):
        validate_url(url)


@pytest.mark.parametrize(
    "address",
    ["127.0.0.1", "10.1.2.3", "172.16.0.5", "192.168.1.1", "169.254.169.254", "0.0.0.0",
     "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1", "224.0.0.1", "100.64.0.1"],
)
def test_private_and_special_addresses_are_not_public(address):
    assert is_public_ip(address) is False


def test_public_address_is_allowed():
    assert is_public_ip("93.184.216.34") and is_public_ip("2606:4700:4700::1111")


@pytest.mark.parametrize("host", ["127.0.0.1", "169.254.169.254", "[::1]", "10.0.0.8"])
def test_literal_private_ips_are_blocked(host):
    with pytest.raises(URLFetchError, match="privada"):
        asyncio.run(fetch_url(f"http://{host}/", 1000))


def test_hostname_resolving_to_private_ip_is_blocked(monkeypatch):
    def fake_getaddrinfo(*args, **kwargs):
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("192.168.0.10", 80))]

    loop = asyncio.new_event_loop()
    monkeypatch.setattr(loop, "getaddrinfo", lambda *a, **k: asyncio.sleep(0, fake_getaddrinfo()))
    with pytest.raises(URLFetchError, match="privada"):
        loop.run_until_complete(fetch_url("http://rebind.example/", 1000))
    loop.close()


# ------------------------------------------------- servidor HTTP local de teste

PAGES = {
    "/artigo": (200, "text/html", "<html><head><title>Guia de Chás</title></head><body><nav>menu</nav>"
                "<h1>Chá verde</h1><p>O chá verde deve ser preparado a 80 graus.</p></body></html>"),
    "/redireciona-interno": (302, "text/html", "http://10.0.0.1:{port}/segredo"),
    "/grande": (200, "text/plain", "x" * 5000),
    "/binario": (200, "application/octet-stream", "abc"),
    "/privado": (403, "text/html", "proibido"),
}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        status, content_type, body = PAGES.get(self.path, (404, "text/plain", "nada"))
        if status == 302:
            self.send_response(302)
            self.send_header("Location", body.format(port=self.server.server_port))
            self.end_headers()
            return
        data = body.encode()
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


@pytest.fixture()
def site(monkeypatch):
    server = HTTPServer(("127.0.0.1", 0), Handler)
    port = server.server_port
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    # O servidor de teste fica em 127.0.0.1: só ESTE endereço é tratado como público aqui.
    original = urlfetch.is_public_ip
    monkeypatch.setattr(urlfetch, "is_public_ip", lambda ip: ip == "127.0.0.1" or original(ip))
    monkeypatch.setattr(urlfetch, "ALLOWED_PORTS", urlfetch.ALLOWED_PORTS | {port})
    yield f"http://127.0.0.1:{port}"
    server.shutdown()


def test_fetch_limits(site):
    with pytest.raises(URLFetchError, match="limite"):
        asyncio.run(fetch_url(f"{site}/grande", 1000))
    with pytest.raises(URLFetchError, match="não suportado"):
        asyncio.run(fetch_url(f"{site}/binario", 1000))
    with pytest.raises(URLFetchError, match="autenticação"):
        asyncio.run(fetch_url(f"{site}/privado", 1000))


def test_redirect_to_private_network_is_blocked(site):
    with pytest.raises(URLFetchError, match="privada"):
        asyncio.run(fetch_url(f"{site}/redireciona-interno", 10_000))


def test_import_url_end_to_end(client, site):
    response = client.post("/api/knowledge/urls", json={"url": f"{site}/artigo"})
    assert response.status_code == 200
    document = wait_ready(client, response.json()["document"]["id"])
    assert document["status"] == "ready", document["error"]
    assert document["name"] == "Guia de Chás"
    assert document["fetched_at"] and document["sha256"]
    results = client.post("/api/knowledge/search", json={"query": "temperatura do chá verde graus"}).json()["results"]
    assert results[0]["url"].endswith("/artigo")
    assert results[0]["location"] == "Seção: Chá verde"
    assert "menu" not in results[0]["snippet"]

    # Atualização (nova captura) e duplicata.
    again = client.post("/api/knowledge/urls", json={"url": f"{site}/artigo"}).json()
    assert again["created"] is False
    client.post(f"/api/knowledge/documents/{document['id']}/reprocess")
    assert wait_ready(client, document["id"])["status"] == "ready"


def test_import_url_failure_is_reported(client, site):
    response = client.post("/api/knowledge/urls", json={"url": f"{site}/redireciona-interno"})
    document = wait_ready(client, response.json()["document"]["id"])
    assert document["status"] == "error" and "privada" in document["error"]
    assert client.post("/api/knowledge/urls", json={"url": "file:///etc/passwd"}).status_code == 400
