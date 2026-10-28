"""Avaliação reproduzível do RAG com o modelo local real.

Uso (com o Ollama ativo e os modelos instalados):

    cd backend
    python -m eval.rag_eval --chat-model qwen2.5:7b --embed-model nomic-embed-text

Indexa o corpus de ``eval/corpus`` num banco temporário, faz as perguntas de
``eval/questions.json`` pelo mesmo caminho do chat e mede:

- recuperação: o trecho esperado (documento + seção) está entre os recuperados;
- fidelidade (aproximação): a resposta contém os fatos esperados do documento;
- citações: marcadores [n] válidos e apontando para o documento esperado;
- sem evidência: em perguntas sem resposta nos documentos, a resposta admite a ausência;
- latência por resposta.

Os resultados são gravados em ``docs/avaliacao/`` (JSON + Markdown).
"""

import argparse
import json
import re
import statistics
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

from fastapi.testclient import TestClient


ROOT = Path(__file__).resolve().parent
DOCS = ROOT.parents[1] / "docs" / "avaliacao"
ABSENCE = re.compile(
    r"não (encontrei|encontro|há|consta|tenho|possuo|foi possível|está)|nenhum[a]? (informação|trecho|menção)|"
    r"não (é|são) mencionad|não (aparece|contém)|desconheço",
    re.IGNORECASE,
)


def run(chat_model: str, embed_model: str, base_url: str) -> dict:
    from app.core.config import config

    config.data_dir = Path(tempfile.mkdtemp(prefix="saite-eval-"))
    from app.main import app

    results = []
    with TestClient(app) as client:
        client.put(
            "/api/ai/settings",
            json={"chat_model": chat_model, "embed_model": embed_model, "llm_base_url": base_url, "temperature": 0.0},
        )
        status = client.get("/api/ai/status").json()
        if not status["online"]:
            sys.exit(f"Runtime indisponível: {status['error']}")

        for path in sorted((ROOT / "corpus").iterdir()):
            response = client.post(
                "/api/knowledge/documents", files={"file": (path.name, path.read_bytes())}, data={"scope": "global"}
            )
            document_id = response.json()["document"]["id"]
            while True:
                document = client.get(f"/api/knowledge/documents/{document_id}").json()["document"]
                if document["status"] in {"ready", "error"}:
                    break
                time.sleep(0.2)
            if document["status"] != "ready" or document["embed_model"] is None:
                sys.exit(f"Falha ao indexar {path.name}: {document['error']}")

        for item in json.loads((ROOT / "questions.json").read_text(encoding="utf-8")):
            cid = client.post("/api/conversations").json()["conversation_id"]
            started = time.monotonic()
            response = client.post("/api/chat", json={"conversation_id": cid, "message": item["q"]})
            elapsed = time.monotonic() - started
            answer = response.json()["response"]
            messages = client.get(f"/api/conversations/{cid}").json()["messages"]
            citations = messages[-1]["citations"]
            retrieved_names = [c["document_name"] for c in citations]
            cited = [c for c in citations if c.get("cited")]

            row = {
                "question": item["q"],
                "answer": answer,
                "latency_s": round(elapsed, 2),
                "retrieved": [f"{c['document_name']} {c['location']}".strip() for c in citations],
            }
            if item["doc"]:
                hit = any(
                    c["document_name"] == item["doc"] and (not item["location"] or c["location"] == item["location"])
                    for c in citations
                )
                lowered = answer.lower()
                row.update(
                    kind="answerable",
                    retrieval_hit=hit,
                    top1_hit=bool(citations) and citations[0]["document_name"] == item["doc"],
                    facts_present=all(fact.lower() in lowered for fact in item["expect"]),
                    cited_any=bool(cited),
                    citations_correct=all(c["document_name"] == item["doc"] for c in cited) if cited else None,
                )
            else:
                row.update(
                    kind="no_evidence",
                    admits_absence=bool(ABSENCE.search(answer)),
                    retrieved_count=len(retrieved_names),
                )
            results.append(row)
            print(f"[{row['latency_s']:>5}s] {item['q']}\n    → {answer[:160]!r}")

    answerable = [r for r in results if r["kind"] == "answerable"]
    unanswerable = [r for r in results if r["kind"] == "no_evidence"]
    cited_rows = [r for r in answerable if r["cited_any"]]
    latencies = [r["latency_s"] for r in results]
    summary = {
        "chat_model": chat_model,
        "embed_model": embed_model,
        "date": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "questions": len(results),
        "retrieval_hit_rate": round(sum(r["retrieval_hit"] for r in answerable) / len(answerable), 3),
        "top1_hit_rate": round(sum(r["top1_hit"] for r in answerable) / len(answerable), 3),
        "faithfulness_fact_rate": round(sum(r["facts_present"] for r in answerable) / len(answerable), 3),
        "citation_rate": round(len(cited_rows) / len(answerable), 3),
        "citation_precision": (
            round(sum(r["citations_correct"] for r in cited_rows) / len(cited_rows), 3) if cited_rows else None
        ),
        "no_evidence_admitted_rate": round(sum(r["admits_absence"] for r in unanswerable) / len(unanswerable), 3),
        "latency_p50_s": round(statistics.median(latencies), 2),
        "latency_max_s": round(max(latencies), 2),
    }
    return {"summary": summary, "results": results}


def write_report(report: dict) -> Path:
    DOCS.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^\w.-]+", "_", report["summary"]["chat_model"])
    (DOCS / f"rag_eval_{slug}.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    s = report["summary"]
    lines = [
        f"# Avaliação RAG — {s['chat_model']} + {s['embed_model']}",
        "",
        f"Data: {s['date']} · {s['questions']} perguntas (`backend/eval/questions.json`)",
        "",
        "| Métrica | Valor |",
        "|---|---|",
        f"| Recuperação (trecho esperado entre os recuperados) | {s['retrieval_hit_rate']:.0%} |",
        f"| Recuperação top-1 (documento correto em 1º) | {s['top1_hit_rate']:.0%} |",
        f"| Fidelidade (fatos esperados presentes na resposta) | {s['faithfulness_fact_rate']:.0%} |",
        f"| Respostas com citação [n] | {s['citation_rate']:.0%} |",
        f"| Precisão das citações | {'—' if s['citation_precision'] is None else f'{s['citation_precision']:.0%}'} |",
        f"| Sem evidência: admite que não encontrou | {s['no_evidence_admitted_rate']:.0%} |",
        f"| Latência mediana / máxima | {s['latency_p50_s']} s / {s['latency_max_s']} s |",
        "",
        "## Respostas",
        "",
    ]
    for row in report["results"]:
        lines.append(f"- **{row['question']}** ({row['latency_s']} s) — {row['answer'][:300].replace(chr(10), ' ')}")
    path = DOCS / f"rag_eval_{slug}.md"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--chat-model", default="qwen2.5:7b")
    parser.add_argument("--embed-model", default="nomic-embed-text")
    parser.add_argument("--base-url", default="http://127.0.0.1:11434")
    args = parser.parse_args()
    report = run(args.chat_model, args.embed_model, args.base_url)
    print(json.dumps(report["summary"], indent=2, ensure_ascii=False))
    print("Relatório:", write_report(report))
