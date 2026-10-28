import io
import zipfile

import pytest

from app.core.config import config
from app.services.knowledge.chunking import chunk_sections
from app.services.knowledge.extract import ExtractionError, Section, extract, normalize_text
from tests.conftest import upload, wait_ready
from tests.samples import make_docx, make_pdf, make_xlsx


def search(client, query, **scope):
    response = client.post("/api/knowledge/search", json={"query": query, **scope})
    assert response.status_code == 200
    return response.json()["results"]


# ------------------------------------------------------------------ unidades


def test_normalize_text():
    raw = "Café   com\t\tleite\r\n\r\n\r\n\r\nfim\x07"
    assert normalize_text(raw) == "Café com leite\n\nfim"


def test_chunking_overlap_and_location():
    text = "\n\n".join(f"Parágrafo {i} " + "palavra " * 40 for i in range(20))
    chunks = chunk_sections([Section(text, "p. 2")], chunk_chars=600, overlap=100)
    assert len(chunks) > 5
    assert all(len(chunk.content) <= 600 for chunk in chunks)
    assert all(chunk.location == "p. 2" for chunk in chunks)
    # Sobreposição: o fim de um trecho reaparece no início do seguinte.
    assert chunks[0].content[-40:].split()[-1] in chunks[1].content[:150]


@pytest.mark.parametrize(
    "name,data,expected",
    [
        ("manual.pdf", make_pdf(["Pagina um sobre motores", "Pagina dois sobre freios"]), ["p. 1", "p. 2"]),
        ("notas.docx", make_docx("Introdução", ["Texto do relatório anual."]), ["Seção: Introdução"]),
        ("estoque.xlsx", make_xlsx([["item", "qtd"], ["parafuso", 40]]), ["Planilha: Estoque"]),
        ("dados.csv", "nome;idade\nAna;31\nRui;45\n".encode(), ["linhas 2–3"]),
        ("pagina.html", b"<html><head><title>T</title><script>alert(1)</script></head><body><h1>Sobre</h1><p>Conteudo util</p></body></html>", ["Seção: Sobre"]),
        ("leia.md", "# Título\n\ntexto\n\n## Parte B\n\nmais".encode(), ["Seção: Título", "Seção: Parte B"]),
        ("simples.txt", "apenas texto".encode("utf-8"), [""]),
    ],
)
def test_extract_supported_formats(name, data, expected):
    sections = extract(name, data)
    assert [section.location for section in sections] == expected
    assert all(section.text for section in sections)
    if name.endswith(".html"):
        assert "alert" not in sections[0].text


@pytest.mark.parametrize(
    "name,data,message",
    [
        ("virus.exe", b"MZ...", "não suportado"),
        ("falso.pdf", b"isto nao e pdf", "PDF válido"),
        ("vazio.txt", b"", "vazio"),
        ("binario.txt", b"\x00\x01\x02abc", "binário"),
        ("falso.docx", b"texto", "DOCX válido"),
        ("escaneado.pdf", make_pdf([""]), "digitalizado"),
    ],
)
def test_extract_rejects_invalid_files(name, data, message):
    with pytest.raises(ExtractionError, match=message):
        extract(name, data)


def test_zip_bomb_is_rejected():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("word/document.xml", "0" * 50_000_000)
    with pytest.raises(ExtractionError, match="grande demais"):
        extract("bomba.docx", buffer.getvalue())


# --------------------------------------------------------------- integração


def test_upload_index_search_and_delete(client):
    data = make_pdf(["O robo Zeta tem bateria de 14 horas.", "A garantia do robo Zeta e de 3 anos."])
    result = upload(client, "zeta.pdf", data)
    assert result["created"] is True
    document = wait_ready(client, result["document"]["id"])
    assert document["status"] == "ready", document["error"]
    assert document["chunk_count"] == 2 and document["embed_model"] == config.embed_model

    results = search(client, "quanto dura a bateria do robo")
    assert results and results[0]["location"] == "p. 1"
    assert results[0]["document_name"] == "zeta.pdf"

    # Arquivo original guardado e removido junto com o documento.
    stored = config.files_dir / document["stored_path"]
    assert stored.is_file()
    assert client.delete(f"/api/knowledge/documents/{document['id']}").status_code == 200
    assert not stored.exists()
    assert search(client, "bateria robo") == []
    assert client.get(f"/api/knowledge/documents/{document['id']}").status_code == 404


def test_duplicate_upload_is_not_reindexed(client):
    first = upload(client, "a.txt", b"conteudo repetido sobre astronomia")
    second = upload(client, "copia.txt", b"conteudo repetido sobre astronomia")
    assert second["created"] is False
    assert second["document"]["id"] == first["document"]["id"]


def test_upload_limits_and_errors(client, monkeypatch):
    monkeypatch.setattr(config, "max_upload_bytes", 100)
    response = client.post(
        "/api/knowledge/documents", files={"file": ("grande.txt", io.BytesIO(b"x" * 500))}, data={"scope": "global"}
    )
    assert response.status_code == 400 and "limite" in response.json()["detail"]
    response = client.post(
        "/api/knowledge/documents", files={"file": ("x.exe", io.BytesIO(b"MZ"))}, data={"scope": "global"}
    )
    assert response.status_code == 400
    response = client.post(
        "/api/knowledge/documents", files={"file": ("x.txt", io.BytesIO(b"ok"))}, data={"scope": "project"}
    )
    assert response.status_code == 400 and "projeto" in response.json()["detail"]


def test_lexical_fallback_when_embeddings_unavailable_and_reprocess(client, provider):
    provider.embed_fails = True
    result = upload(client, "receita.md", "# Bolo\n\nUse tres ovos e farinha integral.".encode())
    document = wait_ready(client, result["document"]["id"])
    assert document["status"] == "ready"
    assert document["embed_model"] is None and "palavras" in document["error"]
    assert search(client, "quantos ovos")[0]["document_name"] == "receita.md"

    provider.embed_fails = False
    client.post(f"/api/knowledge/documents/{document['id']}/reprocess")
    document = wait_ready(client, document["id"])
    assert document["embed_model"] == config.embed_model and document["error"] is None
    assert document["version"] == 2
    chunks = client.get(f"/api/knowledge/documents/{document['id']}").json()["chunks"]
    assert all(chunk["embedded"] for chunk in chunks)


def test_unrelated_query_returns_nothing(client):
    document = wait_ready(client, upload(client, "jardim.txt", "Regue as orquideas uma vez por semana.".encode())["document"]["id"])
    assert document["status"] == "ready"
    assert search(client, "cotação do dólar hoje") == []


def test_fts_query_syntax_is_neutralized(client):
    wait_ready(client, upload(client, "t.txt", b"texto comum")["document"]["id"])
    for query in ['"', "NEAR(a b)", "a* OR", "texto AND -", "^col:"]:
        assert client.post("/api/knowledge/search", json={"query": query}).status_code == 200


def test_stats_and_listing(client):
    wait_ready(client, upload(client, "s.txt", "estatisticas de teste".encode())["document"]["id"])
    stats = client.get("/api/knowledge/stats").json()
    assert stats["documents"] == 1 and stats["ready"] == 1 and stats["chunks"] == 1
    listed = client.get("/api/knowledge/documents", params={"scope": "global"}).json()["documents"]
    assert [d["name"] for d in listed] == ["s.txt"]


def test_heading_without_body_joins_next_section():
    sections = extract("doc.md", "# Manual\n\n## Bateria\n\nDura 14 horas.".encode())
    assert [s.location for s in sections] == ["Seção: Bateria"]
    assert sections[0].text.startswith("# Manual")


def test_reindex_after_embedding_model_change(client):
    document = wait_ready(client, upload(client, "r.txt", "reindexar este texto".encode())["document"]["id"])
    assert client.get("/api/knowledge/stats").json()["stale"] == 0
    client.put("/api/ai/settings", json={"embed_model": "outro-modelo"})
    assert client.get("/api/knowledge/stats").json()["stale"] == 1
    assert client.post("/api/knowledge/reindex").json()["scheduled"] == 1
    assert wait_ready(client, document["id"])["embed_model"] == "outro-modelo"
