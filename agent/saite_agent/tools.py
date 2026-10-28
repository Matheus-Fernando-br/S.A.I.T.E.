"""Ferramentas do agente. Todas são somente leitura.

Proteções de caminho: o caminho é resolvido (seguindo links simbólicos) e
precisa ficar dentro de uma pasta autorizada; ``..`` ou links que apontem para
fora são recusados. Arquivos e pastas com credenciais conhecidas são sempre
negados, mesmo dentro de pastas autorizadas.
"""

import fnmatch
import os
import platform
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from saite_agent.config import AgentConfig

try:
    import psutil
except ImportError:  # psutil é recomendado, mas o agente funciona de forma limitada sem ele
    psutil = None


class ToolError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


DENIED_DIRS = {
    ".ssh", ".gnupg", ".aws", ".azure", ".kube", ".docker", ".password-store", ".mozilla", "keychains",
}
# Trechos de caminho de perfis de navegador e cofres de credenciais do sistema.
DENIED_PATH_FRAGMENTS = (
    "google/chrome", "chromium", "microsoft/edge", "bravesoftware", "mozilla/firefox",
    "microsoft/crypto", "microsoft/protect", "microsoft/credentials", "microsoft/vault",
    ".config/google-chrome",
)
DENIED_FILES = [
    ".env", ".env.*", "*.pem", "*.key", "*.p12", "*.pfx", "*.kdbx", "*.keychain*",
    "id_rsa*", "id_dsa*", "id_ecdsa*", "id_ed25519*", "*.ppk", "credentials*", ".netrc",
    ".git-credentials", "login data", "cookies", "web data", "key3.db", "key4.db",
    "logins.json", "ntuser.dat*", "sam", "system", "security",
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def is_denied(path: Path) -> bool:
    lowered = [part.lower() for part in path.parts]
    joined = "/".join(lowered)
    if any(part in DENIED_DIRS for part in lowered) or any(f in joined for f in DENIED_PATH_FRAGMENTS):
        return True
    return any(fnmatch.fnmatch(path.name.lower(), pattern) for pattern in DENIED_FILES)


def resolve_allowed(raw: Any, config: AgentConfig) -> Path:
    if not isinstance(raw, str) or not raw.strip() or len(raw) > 1024 or "\x00" in raw:
        raise ToolError("Caminho inválido.")
    candidate = Path(raw.strip()).expanduser()
    if not candidate.is_absolute():
        raise ToolError("Use um caminho absoluto dentro de uma pasta autorizada.")
    try:
        resolved = candidate.resolve(strict=True)
    except (OSError, RuntimeError) as exc:
        raise ToolError("Caminho não encontrado.", status=404) from exc
    roots = [Path(root) for root in config.allowed_roots]
    if not roots:
        raise ToolError("Nenhuma pasta foi autorizada no agente local.", status=403)
    if not any(resolved == root or resolved.is_relative_to(root) for root in roots):
        raise ToolError("Acesso negado: o caminho está fora das pastas autorizadas.", status=403)
    if is_denied(resolved):
        raise ToolError("Acesso negado: arquivo ou pasta protegido (credenciais/dados sensíveis).", status=403)
    return resolved


def _entry(path: Path) -> dict:
    stat = path.stat()
    return {
        "name": path.name,
        "path": str(path),
        "type": "dir" if path.is_dir() else "file",
        "size_bytes": None if path.is_dir() else stat.st_size,
        "modified_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
    }


def system_info(config: AgentConfig, **_) -> dict:
    info: dict[str, Any] = {
        "collected_at": _now(),
        "os": platform.system(),
        "os_release": platform.release(),
        "os_version": platform.version(),
        "machine": platform.machine(),
        "hostname": platform.node(),
        "cpu_logical": os.cpu_count(),
    }
    if psutil:
        memory = psutil.virtual_memory()
        info.update(
            cpu_physical=psutil.cpu_count(logical=False),
            cpu_percent=psutil.cpu_percent(interval=0.5),
            memory_total_bytes=memory.total,
            memory_used_bytes=memory.total - memory.available,
            memory_percent=memory.percent,
            uptime_seconds=int(time.time() - psutil.boot_time()),
        )
        battery = psutil.sensors_battery() if hasattr(psutil, "sensors_battery") else None
        if battery:
            info["battery"] = {"percent": battery.percent, "plugged": battery.power_plugged}
    else:
        info["note"] = "Instale psutil para CPU, memória e tempo ligado."
    return info


def disk_usage(config: AgentConfig, **_) -> dict:
    disks = []
    if psutil:
        seen = set()
        for partition in psutil.disk_partitions(all=False):
            if partition.mountpoint in seen or "loop" in partition.device:
                continue
            seen.add(partition.mountpoint)
            try:
                usage = psutil.disk_usage(partition.mountpoint)
            except (PermissionError, OSError):
                continue
            disks.append(
                {
                    "mountpoint": partition.mountpoint,
                    "filesystem": partition.fstype,
                    "total_bytes": usage.total,
                    "used_bytes": usage.used,
                    "free_bytes": usage.free,
                    "percent": usage.percent,
                }
            )
    if not disks:
        usage = shutil.disk_usage(Path.home().anchor or "/")
        disks.append(
            {
                "mountpoint": Path.home().anchor or "/",
                "total_bytes": usage.total,
                "used_bytes": usage.used,
                "free_bytes": usage.free,
                "percent": round(usage.used / usage.total * 100, 1) if usage.total else None,
            }
        )
    return {"collected_at": _now(), "disks": disks}


def list_directory(config: AgentConfig, path: Any = None, **_) -> dict:
    directory = resolve_allowed(path, config)
    if not directory.is_dir():
        raise ToolError("O caminho não é uma pasta.")
    entries, hidden = [], 0
    for child in sorted(directory.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
        if is_denied(child) or child.name.startswith("."):
            hidden += 1
            continue
        try:
            entries.append(_entry(child))
        except OSError:
            continue
        if len(entries) >= config.max_results:
            break
    return {"collected_at": _now(), "path": str(directory), "entries": entries, "hidden_entries": hidden,
            "truncated": len(entries) >= config.max_results}


def search_files(config: AgentConfig, query: Any = None, extension: Any = None, **_) -> dict:
    if not isinstance(query, str) or not query.strip() or len(query) > 200:
        raise ToolError("Informe parte do nome do arquivo (até 200 caracteres).")
    needle = query.strip().lower()
    suffix = None
    if extension:
        if not isinstance(extension, str) or len(extension) > 20:
            raise ToolError("Extensão inválida.")
        suffix = "." + extension.strip().lower().lstrip(".")
    if not config.allowed_roots:
        raise ToolError("Nenhuma pasta foi autorizada no agente local.", status=403)
    deadline = time.monotonic() + config.tool_timeout_seconds
    results, timed_out = [], False
    for root in config.allowed_roots:
        for current, dirs, files in os.walk(root, followlinks=False):
            # Não desce em pastas ocultas, protegidas ou profundas demais.
            depth = Path(current).relative_to(root).parts
            dirs[:] = [d for d in dirs if not d.startswith(".") and not is_denied(Path(current) / d) and len(depth) < 12]
            for name in files:
                lowered = name.lower()
                if needle in lowered and (suffix is None or lowered.endswith(suffix)):
                    path = Path(current) / name
                    if is_denied(path) or path.is_symlink():
                        continue
                    try:
                        results.append(_entry(path))
                    except OSError:
                        continue
                    if len(results) >= config.max_results:
                        return {"collected_at": _now(), "results": results, "truncated": True}
            if time.monotonic() > deadline:
                timed_out = True
                break
        if timed_out:
            break
    return {"collected_at": _now(), "results": results, "truncated": timed_out}


def file_metadata(config: AgentConfig, path: Any = None, **_) -> dict:
    target = resolve_allowed(path, config)
    stat = target.stat()
    return {
        **_entry(target),
        "created_at": datetime.fromtimestamp(stat.st_ctime, timezone.utc).isoformat(timespec="seconds"),
        "extension": target.suffix.lower() or None,
        "collected_at": _now(),
    }


def read_text_file(config: AgentConfig, path: Any = None, **_) -> dict:
    target = resolve_allowed(path, config)
    if not target.is_file():
        raise ToolError("O caminho não é um arquivo.")
    size = target.stat().st_size
    with target.open("rb") as handle:
        data = handle.read(config.max_read_bytes)
    if b"\x00" in data[:4096]:
        raise ToolError("O arquivo parece ser binário; apenas arquivos de texto podem ser lidos.")
    return {
        "path": str(target),
        "size_bytes": size,
        "truncated": size > config.max_read_bytes,
        "content": data.decode("utf-8", errors="replace"),
        "collected_at": _now(),
    }


def list_processes(config: AgentConfig, sort: Any = "cpu", **_) -> dict:
    if psutil is None:
        raise ToolError("psutil não está instalado no agente.", status=501)
    key = "memory_percent" if sort == "memory" else "cpu_percent"
    processes = list(psutil.process_iter(["pid", "name"]))
    for process in processes:
        try:
            process.cpu_percent(None)  # primeira leitura serve de referência
        except psutil.Error:
            pass
    time.sleep(0.5)
    rows = []
    for process in processes:
        try:
            rows.append(
                {
                    "pid": process.pid,
                    "name": process.info["name"],
                    "cpu_percent": round(process.cpu_percent(None), 1),
                    "memory_percent": round(process.memory_percent(), 2),
                }
            )
        except psutil.Error:
            continue
    rows.sort(key=lambda row: row[key], reverse=True)
    # Linhas de comando e usuários não são expostos (podem conter segredos).
    return {"collected_at": _now(), "sorted_by": key, "processes": rows[:15]}


TOOLS = {
    "system_info": system_info,
    "disk_usage": disk_usage,
    "list_directory": list_directory,
    "search_files": search_files,
    "file_metadata": file_metadata,
    "read_text_file": read_text_file,
    "list_processes": list_processes,
}
