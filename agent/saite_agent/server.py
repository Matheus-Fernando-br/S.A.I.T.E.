"""API HTTP do agente local (somente 127.0.0.1 por padrão).

- ``GET /health``: sem autenticação, não revela dados.
- Demais rotas: ``Authorization: Bearer <token>`` (token em ~/.saite-agent/config.json).
- Toda chamada de ferramenta é registrada em ``audit.jsonl`` (sem conteúdo de arquivos).
"""

import asyncio
import hmac
import json
import time
from collections import deque
from datetime import datetime, timezone

from fastapi import Body, Depends, FastAPI, Header, HTTPException, Query

from saite_agent import __version__
from saite_agent.config import (
    DEFAULT_TOOLS,
    SENSITIVE_TOOLS,
    ConfigError,
    agent_home,
    load_config,
    save_config,
    validate_root,
)
from saite_agent.tools import TOOLS, ToolError


app = FastAPI(title="S.A.I.T.E. — agente local", version=__version__)

_calls: deque = deque()


def require_token(authorization: str | None = Header(default=None)) -> None:
    config = load_config()
    scheme, _, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not hmac.compare_digest(token.strip(), config.token):
        raise HTTPException(status_code=401, detail="Token inválido.")


def audit(tool: str, arguments: dict, ok: bool, error: str | None, duration_ms: int) -> None:
    # Registra só nomes de argumentos e caminhos/consultas curtas — nunca conteúdo lido.
    safe_args = {key: str(value)[:300] for key, value in arguments.items()}
    entry = {
        "at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "tool": tool,
        "arguments": safe_args,
        "ok": ok,
        "error": error,
        "duration_ms": duration_ms,
    }
    home = agent_home()
    home.mkdir(parents=True, exist_ok=True)
    with (home / "audit.jsonl").open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _public_status(config) -> dict:
    return {
        "version": __version__,
        "paused": config.paused,
        "allowed_roots": config.allowed_roots,
        "tools": config.tools,
        "sensitive_tools": sorted(SENSITIVE_TOOLS),
        "limits": {
            "max_read_bytes": config.max_read_bytes,
            "max_results": config.max_results,
            "tool_timeout_seconds": config.tool_timeout_seconds,
            "calls_per_minute": config.calls_per_minute,
        },
    }


@app.get("/health")
def health():
    return {"ok": True, "name": "saite-agent", "version": __version__}


@app.get("/status", dependencies=[Depends(require_token)])
def status():
    return _public_status(load_config())


@app.put("/permissions", dependencies=[Depends(require_token)])
def update_permissions(changes: dict = Body(...)):
    """Atualiza pastas autorizadas, ferramentas ativas e o estado de pausa (revogação imediata)."""
    config = load_config()
    try:
        if "allowed_roots" in changes:
            roots = changes["allowed_roots"]
            if not isinstance(roots, list) or len(roots) > 50:
                raise ConfigError("allowed_roots deve ser uma lista (até 50 pastas).")
            config.allowed_roots = sorted({validate_root(root) for root in roots})
        if "tools" in changes:
            tools = changes["tools"]
            if not isinstance(tools, dict) or any(name not in DEFAULT_TOOLS for name in tools):
                raise ConfigError("Ferramenta desconhecida.")
            config.tools.update({name: bool(value) for name, value in tools.items()})
        if "paused" in changes:
            config.paused = bool(changes["paused"])
    except ConfigError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    save_config(config)
    audit("permissions", {key: changes[key] for key in changes if key != "token"}, True, None, 0)
    return _public_status(config)


@app.get("/audit", dependencies=[Depends(require_token)])
def read_audit(limit: int = Query(100, ge=1, le=500)):
    path = agent_home() / "audit.jsonl"
    if not path.exists():
        return {"entries": []}
    lines = path.read_text(encoding="utf-8").splitlines()[-limit:]
    return {"entries": [json.loads(line) for line in reversed(lines) if line.strip()]}


@app.post("/tools/{name}", dependencies=[Depends(require_token)])
async def run_tool(name: str, payload: dict = Body(default_factory=dict)):
    config = load_config()
    arguments = payload.get("arguments") or {}
    if not isinstance(arguments, dict):
        raise HTTPException(status_code=400, detail="arguments deve ser um objeto.")
    if name not in TOOLS:
        raise HTTPException(status_code=404, detail="Ferramenta desconhecida.")
    if config.paused:
        audit(name, arguments, False, "paused", 0)
        raise HTTPException(status_code=423, detail="O agente local está pausado pelo usuário.")
    if not config.tools.get(name):
        audit(name, arguments, False, "disabled", 0)
        raise HTTPException(status_code=403, detail=f"A ferramenta '{name}' está desativada nas permissões.")

    now = time.monotonic()
    while _calls and now - _calls[0] > 60:
        _calls.popleft()
    if len(_calls) >= config.calls_per_minute:
        raise HTTPException(status_code=429, detail="Limite de chamadas por minuto atingido.")
    _calls.append(now)

    started = time.monotonic()
    try:
        result = await asyncio.wait_for(
            asyncio.to_thread(TOOLS[name], config, **arguments), timeout=config.tool_timeout_seconds + 2
        )
    except ToolError as exc:
        audit(name, arguments, False, str(exc), int((time.monotonic() - started) * 1000))
        raise HTTPException(status_code=exc.status, detail=str(exc)) from exc
    except asyncio.TimeoutError as exc:
        audit(name, arguments, False, "timeout", int((time.monotonic() - started) * 1000))
        raise HTTPException(status_code=504, detail="Tempo limite da ferramenta excedido.") from exc
    except TypeError as exc:
        audit(name, arguments, False, "bad_arguments", 0)
        raise HTTPException(status_code=400, detail="Argumentos inválidos para a ferramenta.") from exc
    audit(name, arguments, True, None, int((time.monotonic() - started) * 1000))
    return result
