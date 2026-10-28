from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.config import config
from app.core.security import ingest_limiter
from app.schemas.chat import Scope, SearchRequest, URLImport
from app.services.knowledge.retrieval import retrieve
from app.services.knowledge.service import knowledge_service
from app.services.settings import get_settings


router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge"],
)


@router.get("/stats")
def stats():
    return knowledge_service.stats()


@router.get("/documents")
def list_documents(
    scope: Scope | None = None,
    project_id: str | None = None,
    conversation_id: str | None = None,
):
    return {
        "documents": knowledge_service.list_documents(scope, project_id, conversation_id)
    }


@router.post("/documents", dependencies=[Depends(ingest_limiter)])
async def upload_document(
    file: UploadFile = File(...),
    scope: Scope = Form("global"),
    project_id: str | None = Form(None),
    conversation_id: str | None = Form(None),
):
    # Lê no máximo limite + 1 byte para recusar arquivos grandes sem carregá-los inteiros.
    data = await file.read(config.max_upload_bytes + 1)
    document, created = knowledge_service.add_file(
        file.filename or "arquivo", data, scope, project_id or None, conversation_id or None
    )
    if created:
        knowledge_service.schedule(document["id"])
    return {
        "document": document,
        "created": created,
    }


@router.post("/urls", dependencies=[Depends(ingest_limiter)])
async def import_url(payload: URLImport):
    document, created = knowledge_service.add_url(
        payload.url, payload.scope, payload.project_id, payload.conversation_id
    )
    if created:
        knowledge_service.schedule(document["id"])
    return {
        "document": document,
        "created": created,
    }


@router.get("/documents/{document_id}")
def get_document(document_id: str):
    return {
        "document": knowledge_service.get_document(document_id),
        "chunks": knowledge_service.list_chunks(document_id),
    }


@router.post("/documents/{document_id}/reprocess", dependencies=[Depends(ingest_limiter)])
async def reprocess_document(document_id: str):
    """Reprocessa o arquivo guardado ou, para links, captura a página novamente."""
    return {
        "document": knowledge_service.reprocess(document_id)
    }


@router.post("/documents/{document_id}/cancel")
async def cancel_document(document_id: str):
    knowledge_service.get_document(document_id)
    if not knowledge_service.cancel(document_id):
        raise HTTPException(status_code=409, detail="Este documento não está em processamento.")
    return {
        "message": "Cancelamento solicitado"
    }


@router.delete("/documents/{document_id}")
def delete_document(document_id: str):
    """Remove o documento, seus trechos, o índice e o arquivo original guardado."""
    knowledge_service.delete_document(document_id)
    return {
        "message": "Documento removido"
    }


@router.post("/search")
async def search(payload: SearchRequest):
    """Consulta direta à base (sem modelo de linguagem), útil para verificar a recuperação."""
    results, info = await retrieve(
        payload.query,
        get_settings(),
        project_id=payload.project_id,
        conversation_id=payload.conversation_id,
        top_k=payload.top_k,
    )
    return {
        "results": [chunk.citation(n) | {"content": chunk.content} for n, chunk in enumerate(results, start=1)],
        "info": info,
    }
