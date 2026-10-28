"""Configuração do backend lida de variáveis de ambiente.

Valores que o usuário pode alterar pela interface (modelo, endereço do runtime,
parâmetros de geração...) são persistidos na tabela ``settings`` e têm
precedência sobre os padrões abaixo: ver ``app.services.settings``.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _env_int(name: str, default: int) -> int:
    try:
        return int(_env(name, str(default)))
    except ValueError:
        return default


@dataclass
class Config:
    data_dir: Path = field(
        default_factory=lambda: Path(_env("SAITE_DATA_DIR", "./data")).resolve()
    )
    api_token: str = field(default_factory=lambda: _env("SAITE_API_TOKEN"))
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

    llm_provider: str = field(default_factory=lambda: _env("SAITE_LLM_PROVIDER", "ollama"))
    llm_base_url: str = field(
        default_factory=lambda: _env("SAITE_LLM_BASE_URL", "http://127.0.0.1:11434")
    )
    llm_api_key: str = field(default_factory=lambda: _env("SAITE_LLM_API_KEY"))
    chat_model: str = field(default_factory=lambda: _env("SAITE_CHAT_MODEL", "qwen2.5:7b"))
    embed_model: str = field(
        default_factory=lambda: _env("SAITE_EMBED_MODEL", "bge-m3")
    )

    agent_url: str = field(
        default_factory=lambda: _env("SAITE_AGENT_URL", "http://127.0.0.1:8765")
    )
    agent_token: str = field(default_factory=lambda: _env("SAITE_AGENT_TOKEN"))

    max_upload_bytes: int = field(
        default_factory=lambda: _env_int("SAITE_MAX_UPLOAD_MB", 25) * 1024 * 1024
    )
    max_url_bytes: int = field(
        default_factory=lambda: _env_int("SAITE_MAX_URL_MB", 5) * 1024 * 1024
    )

    @property
    def db_path(self) -> Path:
        return self.data_dir / "saite.db"

    @property
    def files_dir(self) -> Path:
        return self.data_dir / "files"


config = Config()
