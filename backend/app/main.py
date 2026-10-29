import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.ai import router as ai_router
from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.computer import router as computer_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.data import router as data_router
from app.api.routes.knowledge import router as knowledge_router
from app.api.routes.memories import router as memories_router
from app.api.routes.projects import router as projects_router
from app.core.config import config
from app.core.security import auth_required, require_token
from app.db.database import close_pool, migrate
from app.llm.base import LLMError
from app.services.computer import ComputerAgentError
from app.services.knowledge.service import KnowledgeError, knowledge_service
from app.services.project import NotFoundError
from app.services.settings import SettingsError


VERSION = "0.3.0"

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("saite")


@asynccontextmanager
async def lifespan(_: FastAPI):
    applied = migrate()
    if applied:
        logger.info("Migrações aplicadas: %s", ", ".join(applied))
    recovered = knowledge_service.recover_interrupted()
    if recovered:
        logger.warning("%d documento(s) com processamento interrompido marcados para reprocessar", recovered)
    if not auth_required():
        logger.warning("SAITE_ACCESS_PASSWORD não definida: a API está ABERTA (use só em desenvolvimento).")
    yield
    close_pool()


app = FastAPI(
    title="SAITE — Superior Advanced Intelligence Technological Entity",
    description="Backend do agente pessoal de IA S.A.I.T.E. (chat, RAG, projetos, dados sincronizados).",
    version=VERSION,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def private_network_access(request: Request, call_next):
    """Permite que a interface publicada (HTTPS) acesse este backend em localhost.

    Navegadores baseados em Chromium exigem este cabeçalho na resposta ao preflight
    de requisições de um site público para a rede local/loopback.
    """
    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin in config.cors_origins and request.headers.get("access-control-request-private-network"):
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response


def _error(status: int, message: str, hint: str | None = None, code: str | None = None) -> JSONResponse:
    return JSONResponse(status_code=status, content={"detail": message, "hint": hint, "code": code})


@app.exception_handler(NotFoundError)
async def not_found(_: Request, exc: NotFoundError):
    return _error(404, str(exc))


@app.exception_handler(KnowledgeError)
@app.exception_handler(SettingsError)
async def bad_request(_: Request, exc: Exception):
    return _error(400, str(exc))


@app.exception_handler(ValueError)
async def value_error(_: Request, exc: ValueError):
    return _error(400, str(exc))


@app.exception_handler(LLMError)
async def llm_error(_: Request, exc: LLMError):
    return _error(503, str(exc), hint=exc.hint, code=type(exc).__name__)


@app.exception_handler(ComputerAgentError)
async def agent_error(_: Request, exc: ComputerAgentError):
    return _error(exc.status, str(exc))


app.include_router(auth_router, prefix="/api")

protected = [Depends(require_token)]
for router in (
    chat_router,
    conversations_router,
    projects_router,
    knowledge_router,
    memories_router,
    ai_router,
    computer_router,
    data_router,
):
    app.include_router(router, prefix="/api", dependencies=protected)


@app.get("/")
async def root():
    return {
        "message": "S.A.I.T.E. API",
        "status": "online",
        "version": VERSION,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": VERSION,
        "auth_required": auth_required(),
    }
