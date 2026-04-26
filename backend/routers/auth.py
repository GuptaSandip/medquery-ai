from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db   # ✅ fixed
from schemas.auth import (
    SignupRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    MessageResponse,
    ErrorResponse,
)
from schemas.user import UserResponse
from services.auth_service import AuthService
from middleware.auth_middleware import get_current_user, security
from models.user import User
from utils.token_blacklist import revoke_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


auth_error_responses = {
    400: {"model": ErrorResponse, "description": "Bad Request"},
    401: {"model": ErrorResponse, "description": "Unauthorized"},
    403: {"model": ErrorResponse, "description": "Forbidden"},
    404: {"model": ErrorResponse, "description": "Not Found"},
    409: {"model": ErrorResponse, "description": "Conflict"},
    422: {"model": ErrorResponse, "description": "Validation Error"},
}


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=201,
    responses=auth_error_responses,
)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    return AuthService.signup(request, db)


@router.post(
    "/login",
    response_model=TokenResponse,
    responses=auth_error_responses
)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    return AuthService.login(request, db)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    responses=auth_error_responses
)
def refresh_tokens(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access and refresh tokens"""
    return AuthService.refresh_tokens(request.refresh_token, db)


@router.get(
    "/me",
    response_model=UserResponse,
    responses=auth_error_responses
)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged in user"""
    return current_user


@router.post(
    "/logout",
    response_model=MessageResponse,
    responses=auth_error_responses,
)
def logout(
    current_user: User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Logout user by revoking the current access token"""
    revoke_token(credentials.credentials)
    return {"message": "Logged out successfully"}