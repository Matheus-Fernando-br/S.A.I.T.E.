"""Cliente do agente local do computador (processo separado, ver ``agent/``).

O backend só conhece as ferramentas de leitura listadas em ``TOOL_SCHEMAS``.
As permissões (pastas, ferramentas ativas, pausa) são impostas pelo próprio
agente — o backend nunca acessa o disco do usuário diretamente.
"""

from typing import Any

import httpx

from app.core.config import config
from app.db.database import get_conn, log_activity
from app.services.settings import get_settings


class ComputerAgentError(Exception):
    def __init__(self, message: str, status: int = 502):
        super().__init__(message)
        self.status = status


SETUP_HINT = (
    "Inicie o agente local com `python -m saite_agent serve` (pasta agent/) e copie o token "
    "exibido por `python -m saite_agent token` para SAITE_AGENT_TOKEN no .env do backend."
)

NOT_CONFIGURED = (
    "O acesso ao computador ainda não está disponível nesta versão na nuvem: o servidor não alcança o seu PC. "
    "Ele virá com o aplicativo para Windows (.exe), que conecta o agente local ao S.A.I.T.E."
)

TOOL_SCHEMAS: dict[str, dict[str, Any]] = {
    "system_info": {
        "description": "Informações atuais do sistema: sistema operacional, CPU, memória e tempo ligado.",
        "parameters": {"type": "object", "properties": {}},
    },
    "disk_usage": {
        "description": "Espaço total, usado e livre de cada disco/partição.",
        "parameters": {"type": "object", "properties": {}},
    },
    "list_directory": {
        "description": "Lista arquivos e pastas de um diretório autorizado pelo usuário.",
        "parameters": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Caminho absoluto dentro de uma pasta autorizada"}},
            "required": ["path"],
        },
    },
    "search_files": {
        "description": "Procura arquivos por nome (e opcionalmente extensão) dentro das pastas autorizadas.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Parte do nome do arquivo"},
                "extension": {"type": "string", "description": "Extensão, ex.: pdf"},
            },
            "required": ["query"],
        },
    },
    "file_metadata": {
        "description": "Metadados (tamanho, datas, tipo) de um arquivo em pasta autorizada.",
        "parameters": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    },
    "read_text_file": {
        "description": "Lê o conteúdo de um arquivo de texto em pasta autorizada (limitado em tamanho).",
        "parameters": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
    },
    "list_processes": {
        "description": "Processos em execução com maior uso de CPU ou memória.",
        "parameters": {
            "type": "object",
            "properties": {"sort": {"type": "string", "enum": ["cpu", "memory"]}},
        },
    },
}


class ComputerService:

    def _client(self, timeout: float = 20.0) -> httpx.AsyncClient:
        headers = {"Authorization": f"Bearer {config.agent_token}"} if config.agent_token else {}
        return httpx.AsyncClient(
            base_url=get_settings()["agent_url"].rstrip("/"),
            headers=headers,
            timeout=httpx.Timeout(timeout, connect=3.0),
            trust_env=False,
        )

    async def _request(self, method: str, path: str, **kwargs) -> Any:
        if not get_settings()["agent_url"]:
            raise ComputerAgentError(NOT_CONFIGURED, status=503)
        try:
            async with self._client() as client:
                response = await client.request(method, path, **kwargs)
        except httpx.HTTPError as exc:
            raise ComputerAgentError(
                f"Agente local indisponível ({type(exc).__name__}). {SETUP_HINT}", status=503
            ) from exc
        if response.status_code == 401:
            raise ComputerAgentError(
                "Token do agente local inválido ou ausente. Configure SAITE_AGENT_TOKEN no backend.",
                status=503,
            )
        try:
            data = response.json()
        except ValueError:
            data = {"detail": response.text[:300]}
        if response.status_code >= 400:
            detail = data.get("detail") if isinstance(data, dict) else None
            raise ComputerAgentError(str(detail or f"Erro {response.status_code}"), status=response.status_code)
        return data

    async def status(self) -> dict:
        """Estado real do agente. Nunca levanta: devolve ``connected: False`` com o motivo."""
        if not get_settings()["agent_url"]:
            return {"connected": False, "configured": False, "error": NOT_CONFIGURED, "hint": SETUP_HINT}
        try:
            data = await self._request("GET", "/status")
            return {"connected": True, **data}
        except ComputerAgentError as exc:
            return {"connected": False, "error": str(exc), "hint": SETUP_HINT}

    async def update_permissions(self, changes: dict) -> dict:
        data = await self._request("PUT", "/permissions", json=changes)
        with get_conn() as conn:
            log_activity(conn, "agent.permissions_changed", {"fields": sorted(changes)})
        return data

    async def audit(self, limit: int = 100) -> list[dict]:
        return (await self._request("GET", "/audit", params={"limit": limit})).get("entries", [])

    async def call_tool(self, name: str, arguments: dict) -> dict:
        if name not in TOOL_SCHEMAS:
            raise ComputerAgentError(f"Ferramenta desconhecida: {name}", status=400)
        return await self._request("POST", f"/tools/{name}", json={"arguments": arguments or {}})

    def tool_definitions(self, enabled: list[str]) -> list[dict]:
        """Definições no formato de *function calling* apenas para ferramentas ativas no agente."""
        return [
            {"type": "function", "function": {"name": name, **schema}}
            for name, schema in TOOL_SCHEMAS.items()
            if name in enabled
        ]


computer_service = ComputerService()
