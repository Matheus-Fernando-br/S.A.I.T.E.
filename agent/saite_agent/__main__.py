"""Linha de comando do agente local.

    python -m saite_agent serve [--port 8765]
    python -m saite_agent token [--rotate]
    python -m saite_agent roots list|add <pasta>|remove <pasta>
    python -m saite_agent tools list|enable <nome>|disable <nome>
    python -m saite_agent pause|resume
"""

import argparse
import ipaddress
import os
import secrets
import sys

from saite_agent.config import DEFAULT_TOOLS, ConfigError, config_path, load_config, save_config, validate_root


def _is_loopback(host: str) -> bool:
    if host == "localhost":
        return True
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return False


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="saite_agent", description="Agente local do S.A.I.T.E.")
    sub = parser.add_subparsers(dest="command", required=True)

    serve = sub.add_parser("serve", help="inicia o agente")
    serve.add_argument("--host", default="127.0.0.1")
    serve.add_argument("--port", type=int, default=8765)

    token = sub.add_parser("token", help="mostra (ou gera novo) token de acesso")
    token.add_argument("--rotate", action="store_true")

    roots = sub.add_parser("roots", help="pastas autorizadas")
    roots.add_argument("action", choices=["list", "add", "remove"])
    roots.add_argument("path", nargs="?")

    tools = sub.add_parser("tools", help="ferramentas ativas")
    tools.add_argument("action", choices=["list", "enable", "disable"])
    tools.add_argument("name", nargs="?")

    sub.add_parser("pause", help="bloqueia todas as ferramentas")
    sub.add_parser("resume", help="libera as ferramentas ativas")

    args = parser.parse_args(argv)
    config = load_config()

    if args.command == "serve":
        if not _is_loopback(args.host) and os.getenv("SAITE_AGENT_ALLOW_REMOTE") != "1":
            print("Recusado: o agente só escuta em 127.0.0.1. Defina SAITE_AGENT_ALLOW_REMOTE=1 para forçar.")
            return 2
        import uvicorn

        print(f"Agente local em http://{args.host}:{args.port} — configuração: {config_path()}")
        print(f"Pastas autorizadas: {', '.join(config.allowed_roots) or 'nenhuma'}")
        uvicorn.run("saite_agent.server:app", host=args.host, port=args.port, log_level="info")
        return 0

    if args.command == "token":
        if args.rotate:
            config.token = secrets.token_urlsafe(32)
            save_config(config)
            print("Novo token gerado (o anterior deixou de valer):")
        print(config.token)
        return 0

    try:
        if args.command == "roots":
            if args.action == "add":
                config.allowed_roots = sorted(set(config.allowed_roots) | {validate_root(args.path or "")})
            elif args.action == "remove":
                config.allowed_roots = [r for r in config.allowed_roots if r != args.path]
            save_config(config)
            print("\n".join(config.allowed_roots) or "(nenhuma pasta autorizada)")
        elif args.command == "tools":
            if args.action != "list":
                if args.name not in DEFAULT_TOOLS:
                    raise ConfigError(f"Ferramenta desconhecida. Opções: {', '.join(DEFAULT_TOOLS)}")
                config.tools[args.name] = args.action == "enable"
                save_config(config)
            for name, enabled in config.tools.items():
                print(f"{'[x]' if enabled else '[ ]'} {name}")
        elif args.command in {"pause", "resume"}:
            config.paused = args.command == "pause"
            save_config(config)
            print("Agente pausado." if config.paused else "Agente liberado.")
    except ConfigError as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
