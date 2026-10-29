"""Preferências persistidas (tabela ``settings``) com padrões vindos do ambiente.

Segredos (chave do servidor LLM, token do agente) ficam só no ambiente e nunca
são devolvidos pela API.
"""

import json
from typing import Any

from app.core.config import config
from app.db.database import get_conn


def defaults() -> dict[str, Any]:
    return {
        "llm_provider": config.llm_provider,
        "llm_base_url": config.llm_base_url,
        "chat_model": config.chat_model,
        "embed_provider": config.embed_provider,
        "embed_base_url": config.embed_base_url,
        "embed_model": config.embed_model,
        "temperature": 0.4,
        "num_ctx": 8192,
        "history_messages": 20,
        "rag_top_k": 5,
        "rag_min_similarity": 0.45,
        "agent_url": config.agent_url,
        "assistant_name": "Athena",
    }


# Validação simples por chave: (tipo, mínimo, máximo) ou conjunto de opções.
RULES: dict[str, Any] = {
    "llm_provider": {"ollama", "openai_compatible"},
    "llm_base_url": str,
    "chat_model": str,
    "embed_provider": {"", "ollama", "openai_compatible"},
    "embed_base_url": "optional_url",
    "embed_model": str,
    "temperature": (float, 0.0, 2.0),
    "num_ctx": (int, 512, 262144),
    "history_messages": (int, 0, 200),
    "rag_top_k": (int, 1, 20),
    "rag_min_similarity": (float, 0.0, 1.0),
    "agent_url": "optional_url",
    "assistant_name": str,
}


class SettingsError(ValueError):
    pass


def _validate(key: str, value: Any) -> Any:
    rule = RULES.get(key)
    if rule is None:
        raise SettingsError(f"Configuração desconhecida: {key}")
    if isinstance(rule, set):
        if value not in rule:
            raise SettingsError(f"{key} deve ser um de: {', '.join(sorted(rule))}")
        return value
    if rule == "optional_url":
        if not isinstance(value, str) or len(value) > 500:
            raise SettingsError(f"{key} inválido")
        value = value.strip()
        if value and not value.startswith(("http://", "https://")):
            raise SettingsError(f"{key} deve começar com http:// ou https://")
        return value
    if rule is str:
        if not isinstance(value, str) or not value.strip() or len(value) > 500:
            raise SettingsError(f"{key} deve ser um texto não vazio")
        value = value.strip()
        if key.endswith("_url") and not value.startswith(("http://", "https://")):
            raise SettingsError(f"{key} deve começar com http:// ou https://")
        return value
    kind, low, high = rule
    try:
        number = kind(value)
    except (TypeError, ValueError) as exc:
        raise SettingsError(f"{key} deve ser numérico") from exc
    if isinstance(value, bool) or not low <= number <= high:
        raise SettingsError(f"{key} deve estar entre {low} e {high}")
    return number


def get_settings() -> dict[str, Any]:
    values = defaults()
    with get_conn() as conn:
        for row in conn.execute("SELECT key, value FROM settings"):
            if row["key"] in values:
                values[row["key"]] = json.loads(row["value"])
    return values


def update_settings(changes: dict[str, Any]) -> dict[str, Any]:
    validated = {key: _validate(key, value) for key, value in changes.items()}
    with get_conn() as conn:
        for key, value in validated.items():
            conn.execute(
                "INSERT INTO settings (key, value) VALUES (?, ?)"
                " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                (key, json.dumps(value)),
            )
    return get_settings()


def reset_settings() -> dict[str, Any]:
    with get_conn() as conn:
        conn.execute("DELETE FROM settings")
    return get_settings()
