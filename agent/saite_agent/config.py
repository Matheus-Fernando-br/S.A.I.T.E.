"""Configuração e permissões do agente, guardadas em ``~/.saite-agent/config.json``.

Por padrão nenhuma pasta é autorizada e as ferramentas sensíveis (leitura de
conteúdo de arquivos e lista de processos) começam desligadas.
"""

import json
import os
import secrets
import threading
from dataclasses import asdict, dataclass, field
from pathlib import Path


def agent_home() -> Path:
    return Path(os.getenv("SAITE_AGENT_HOME", Path.home() / ".saite-agent")).expanduser()


DEFAULT_TOOLS = {
    "system_info": True,
    "disk_usage": True,
    "list_directory": True,
    "search_files": True,
    "file_metadata": True,
    "read_text_file": False,
    "list_processes": False,
}

SENSITIVE_TOOLS = {"read_text_file", "list_processes"}


@dataclass
class AgentConfig:
    token: str = field(default_factory=lambda: secrets.token_urlsafe(32))
    allowed_roots: list[str] = field(default_factory=list)
    tools: dict[str, bool] = field(default_factory=lambda: dict(DEFAULT_TOOLS))
    paused: bool = False
    max_read_bytes: int = 200_000
    max_results: int = 200
    tool_timeout_seconds: float = 10.0
    calls_per_minute: int = 60


class ConfigError(ValueError):
    pass


_lock = threading.Lock()


def config_path() -> Path:
    return agent_home() / "config.json"


def load_config() -> AgentConfig:
    path = config_path()
    with _lock:
        if not path.exists():
            config = AgentConfig()
            _write(config)
            return config
        data = json.loads(path.read_text(encoding="utf-8"))
    config = AgentConfig(**{k: v for k, v in data.items() if k in AgentConfig.__dataclass_fields__})
    # Ferramentas novas entram com o padrão seguro; desconhecidas são descartadas.
    config.tools = {name: bool(config.tools.get(name, default)) for name, default in DEFAULT_TOOLS.items()}
    return config


def save_config(config: AgentConfig) -> None:
    with _lock:
        _write(config)


def _write(config: AgentConfig) -> None:
    home = agent_home()
    home.mkdir(parents=True, exist_ok=True)
    path = config_path()
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(asdict(config), indent=2, ensure_ascii=False), encoding="utf-8")
    try:
        os.chmod(tmp, 0o600)  # token legível apenas pelo dono (sem efeito prático no Windows)
    except OSError:
        pass
    os.replace(tmp, path)


def validate_root(raw: str) -> str:
    """Normaliza e valida uma pasta a autorizar."""
    if not isinstance(raw, str) or not raw.strip():
        raise ConfigError("Caminho vazio.")
    path = Path(raw.strip()).expanduser()
    if not path.is_absolute():
        raise ConfigError(f"Use um caminho absoluto: {raw}")
    resolved = path.resolve()
    if not resolved.is_dir():
        raise ConfigError(f"A pasta não existe: {resolved}")
    if resolved == Path(resolved.anchor):
        raise ConfigError("Não é permitido autorizar a raiz do disco inteiro.")
    return str(resolved)
