from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import auth_required, check_password, issue_session, login_limiter


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


class LoginRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=200)


@router.get("/status")
def auth_status():
    return {
        "auth_required": auth_required()
    }


@router.post("/login", dependencies=[Depends(login_limiter)])
def login(payload: LoginRequest):
    """Troca a senha do dono por uma sessão válida em qualquer dispositivo."""
    if not auth_required():
        return {"token": "", "expires_at": None}
    if not check_password(payload.password):
        raise HTTPException(status_code=401, detail="Senha incorreta.")
    token, expires = issue_session()
    return {
        "token": token,
        "expires_at": expires,
    }
