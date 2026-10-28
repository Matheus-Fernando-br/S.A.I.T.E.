"""Autenticação da API e limites simples de taxa.

Modelo de ameaça: o backend roda na máquina do usuário, ligado a 127.0.0.1.
Se ``SAITE_API_TOKEN`` estiver definido (recomendado sempre que a porta for
exposta além de localhost), todas as rotas /api exigem ``Authorization: Bearer``.
"""

import hmac
import time
from collections import defaultdict, deque

from fastapi import Header, HTTPException, Request, status

from app.core.config import config


def require_token(authorization: str | None = Header(default=None)) -> None:
    if not config.api_token:
        return
    scheme, _, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not hmac.compare_digest(token.strip(), config.api_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso inválido ou ausente. Configure-o em Configurações → Conexão.",
            headers={"WWW-Authenticate": "Bearer"},
        )


class RateLimiter:
    """Janela deslizante em memória, por cliente e por grupo de rotas."""

    def __init__(self, limit: int, window_seconds: float):
        self.limit = limit
        self.window = window_seconds
        self.hits: dict[str, deque] = defaultdict(deque)

    def __call__(self, request: Request) -> None:
        key = request.client.host if request.client else "local"
        now = time.monotonic()
        hits = self.hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.limit:
            raise HTTPException(status_code=429, detail="Muitas requisições. Aguarde alguns segundos.")
        hits.append(now)


chat_limiter = RateLimiter(limit=30, window_seconds=60)
ingest_limiter = RateLimiter(limit=60, window_seconds=60)
