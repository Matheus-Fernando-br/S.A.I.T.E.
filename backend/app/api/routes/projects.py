from fastapi import APIRouter

from app.schemas.chat import ProjectCreate, ProjectDelete, ProjectUpdate
from app.services.project import project_service


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post("")
def create_project(payload: ProjectCreate):
    return project_service.create_project(payload.name.strip(), payload.description, payload.instructions)


@router.get("")
def list_projects(include_archived: bool = False):
    return {
        "projects": project_service.list_projects(include_archived=include_archived)
    }


@router.get("/{project_id}")
def get_project(project_id: str):
    return project_service.get_project(project_id)


@router.patch("/{project_id}")
def update_project(project_id: str, payload: ProjectUpdate):
    return project_service.update_project(project_id, **payload.model_dump(exclude_none=True))


@router.get("/{project_id}/activity")
def project_activity(project_id: str):
    return {
        "activity": project_service.activity(project_id)
    }


@router.post("/{project_id}/delete")
def delete_project(project_id: str, payload: ProjectDelete):
    """Exclusão protegida: exige o nome exato do projeto no corpo da requisição."""
    removed = project_service.delete_project(project_id, payload.confirm_name)
    return {
        "message": "Projeto excluído",
        "removed": removed,
    }
