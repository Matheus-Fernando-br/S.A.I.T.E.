from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router


app = FastAPI(
    title="SAITE — Superior Advanced Intelligence Technological Entity",
    description="Backend do agente pessoal de IA S.A.I.T.E.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    chat_router,
    prefix="/api",
)


@app.get("/")
async def root():
    return {
        "message": "S.A.I.T.E. API",
        "status": "online",
        "version": "0.1.0",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }