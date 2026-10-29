"""Autenticação da API e limites simples de taxa.

O backend fica na internet (Render), então o acesso é protegido por uma senha
do dono (``SAITE_ACCESS_PASSWORD``). O login devolve uma sessão assinada (HMAC)
usada em qualquer dispositivo — celular, computador, futuros apps — com o mesmo
banco de dados. Trocar a senha ou o segredo invalida todas as sessões.

Sem senha configurada (desenvolvimento e testes) a API fica aberta.
"""

import base64
import hashlib
import hmac
import json
import time
from collections import defaultdict, deque

from fastapi import Header, HTTPException, Request, status

from app.core.config import config


def auth_required() -> bool:
    return bool(config.access_password)


def _signing_key() -> bytes:
    # A senha entra na chave: trocá-la encerra todas as sessões existentes. A URL do banco
    # (que contém a senha do banco) e o segredo opcional tornam a chave impossível de
    # adivinhar mesmo que alguém tente descobrir a senha a partir de um token roubado.
    material = f"{config.session_secret}\x00{config.access_password}\x00{config.database_url}".encode()
    return hashlib.sha256(material).digest()


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def issue_session() -> tuple[str, int]:
    expires = int(time.time()) + config.session_days * 86400
    payload = _b64(json.dumps({"exp": expires}).encode())
    signature = _b64(hmac.new(_signing_key(), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{signature}", expires


def verify_session(token: str) -> bool:
    try:
        payload, signature = token.split(".", 1)
        expected = _b64(hmac.new(_signing_key(), payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            return False
        return json.loads(_unb64(payload))["exp"] > time.time()
    except (ValueError, KeyError, json.JSONDecodeError):
        return False


def check_password(password: str) -> bool:
    return auth_required() and hmac.compare_digest(password.encode(), config.access_password.encode())


def require_token(authorization: str | None = Header(default=None)) -> None:
    if not auth_required():
        return
    scheme, _, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not verify_session(token.strip()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão inválida ou expirada. Entre novamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def client_key(request: Request) -> str:
    # No Render o cliente real vem no X-Forwarded-For (o primeiro endereço da lista).
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "local"


class RateLimiter:
    """Janela deslizante em memória, por cliente e por grupo de rotas."""

    def __init__(self, limit: int, window_seconds: float):
        self.limit = limit
        self.window = window_seconds
        self.hits: dict[str, deque] = defaultdict(deque)

    def __call__(self, request: Request) -> None:
        key = client_key(request)
        now = time.monotonic()
        hits = self.hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.limit:
            raise HTTPException(status_code=429, detail="Muitas requisições. Aguarde alguns segundos.")
        hits.append(now)


chat_limiter = RateLimiter(limit=30, window_seconds=60)
ingest_limiter = RateLimiter(limit=60, window_seconds=60)
login_limiter = RateLimiter(limit=8, window_seconds=300)
