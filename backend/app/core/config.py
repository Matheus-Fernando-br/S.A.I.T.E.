"""Configuração do backend lida de variáveis de ambiente.

Valores que o usuário pode alterar pela interface (modelo, endereço do provedor,
parâmetros de geração...) são persistidos na tabela ``settings`` e têm
precedência sobre os padrões abaixo: ver ``app.services.settings``.
Segredos (banco, chaves dos provedores, senha de acesso) ficam só no ambiente.
"""

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv


load_dotenv()

GEMINI_OPENAI_URL = "https://generativelanguage.googleapis.com/v1beta/openai"


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _env_int(name: str, default: int) -> int:
    try:
        return int(_env(name, str(default)))
    except ValueError:
        return default


@dataclass
class Config:
    # Banco PostgreSQL (Supabase em produção)
    database_url: str = field(default_factory=lambda: _env("DATABASE_URL"))
    db_pool_size: int = field(default_factory=lambda: _env_int("SAITE_DB_POOL_SIZE", 5))

    # Acesso: senha única do dono; sessões assinadas com o segredo abaixo.
    access_password: str = field(default_factory=lambda: _env("SAITE_ACCESS_PASSWORD"))
    session_secret: str = field(default_factory=lambda: _env("SAITE_SESSION_SECRET"))
    session_days: int = field(default_factory=lambda: _env_int("SAITE_SESSION_DAYS", 90))

    cors_origins: list[str] = field(
        default_factory=lambda: [
            origin.strip()
            for origin in _env(
                "SAITE_CORS_ORIGINS",
                "http://localhost:3000,https://saite-agent.vercel.app",
            ).split(",")
            if origin.strip()
        ]
    )

    # Chat: provedor compatível com a API OpenAI (Gemini, Groq, OpenRouter) ou Ollama.
    llm_provider: str = field(default_factory=lambda: _env("SAITE_LLM_PROVIDER", "openai_compatible"))
    llm_base_url: str = field(default_factory=lambda: _env("SAITE_LLM_BASE_URL", GEMINI_OPENAI_URL))
    llm_api_key: str = field(default_factory=lambda: _env("SAITE_LLM_API_KEY"))
    chat_model: str = field(default_factory=lambda: _env("SAITE_CHAT_MODEL", "gemini-2.5-flash"))

    # Embeddings: por padrão o mesmo provedor e a mesma chave do chat.
    embed_provider: str = field(default_factory=lambda: _env("SAITE_EMBED_PROVIDER", ""))
    embed_base_url: str = field(default_factory=lambda: _env("SAITE_EMBED_BASE_URL", ""))
    embed_api_key: str = field(default_factory=lambda: _env("SAITE_EMBED_API_KEY", ""))
    embed_model: str = field(default_factory=lambda: _env("SAITE_EMBED_MODEL", "gemini-embedding-001"))

    # Agente local do computador: só alcançável quando o backend roda na mesma máquina.
    agent_url: str = field(default_factory=lambda: _env("SAITE_AGENT_URL", ""))
    agent_token: str = field(default_factory=lambda: _env("SAITE_AGENT_TOKEN"))

    max_upload_bytes: int = field(
        default_factory=lambda: _env_int("SAITE_MAX_UPLOAD_MB", 15) * 1024 * 1024
    )
    max_url_bytes: int = field(
        default_factory=lambda: _env_int("SAITE_MAX_URL_MB", 5) * 1024 * 1024
    )


config = Config()
