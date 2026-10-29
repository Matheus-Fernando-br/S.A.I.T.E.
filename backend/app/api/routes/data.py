from datetime import datetime, timezone

from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse

from app.db.database import get_conn, log_activity, row_to_dict


router = APIRouter(
    prefix="/data",
    tags=["Data"],
)

EXPORT_VERSION = 1
TABLES = ("projects", "conversations", "messages", "memories")


@router.get("/export")
def export_data():
    """Exporta projetos, conversas, mensagens, memórias e o catálogo de documentos (JSON).

    Os arquivos originais e o índice não entram aqui: para backup completo copie a
    pasta de dados (ver docs/INSTALACAO.md → Backup).
    """
    with get_conn() as conn:
        payload = {
            "format": "saite-export",
            "version": EXPORT_VERSION,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            **{
                table: [row_to_dict(row) for row in conn.execute(f"SELECT * FROM {table}")]
                for table in TABLES
            },
            "documents": [
                row_to_dict(row)
                for row in conn.execute(
                    "SELECT id, scope, project_id, conversation_id, source_type, name, mime,"
                    " size_bytes, sha256, url, status, chunk_count, created_at FROM documents"
                )
            ],
        }
    filename = f"saite-export-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    return JSONResponse(payload, headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@router.post("/import")
def import_data(payload: dict = Body(...)):
    """Importa um arquivo de exportação. Registros com IDs já existentes são ignorados."""
    if payload.get("format") != "saite-export" or payload.get("version") != EXPORT_VERSION:
        raise HTTPException(status_code=400, detail="Arquivo de exportação inválido ou de versão incompatível.")
    inserted = {}
    with get_conn() as conn:
        for table in TABLES:
            columns = [
                row["column_name"]
                for row in conn.execute(
                    "SELECT column_name FROM information_schema.columns"
                    " WHERE table_name = ? AND table_schema = current_schema()",
                    (table,),
                )
                if row["column_name"] != "seq"
            ]
            rows = payload.get(table) or []
            if not isinstance(rows, list):
                raise HTTPException(status_code=400, detail=f"Campo '{table}' inválido.")
            count = 0
            for row in rows:
                if not isinstance(row, dict) or "id" not in row:
                    continue
                values = {key: row.get(key) for key in columns if key in row}
                cursor = conn.execute(
                    f"INSERT INTO {table} ({', '.join(values)}) VALUES ({', '.join('?' * len(values))})"
                    " ON CONFLICT DO NOTHING",
                    list(values.values()),
                )
                count += cursor.rowcount
            inserted[table] = count
        log_activity(conn, "data.imported", inserted)
    return {
        "inserted": inserted
    }


@router.get("/activity")
def activity(limit: int = 100):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM activity_log ORDER BY id DESC LIMIT ?", (min(max(limit, 1), 500),)
        )
        return {
            "activity": [row_to_dict(row, ("detail",)) for row in rows]
        }
