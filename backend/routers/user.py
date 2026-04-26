from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from middleware.auth_middleware import get_current_user
from schemas.user import UserResponse, UpdateProfileRequest
from models.user import User
from models.document import Document
from models.chat import ChatSession

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get user profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if request.full_name:
        current_user.full_name = request.full_name
    if request.bio is not None:
        current_user.bio = request.bio
    if request.avatar_url is not None:
        current_user.avatar_url = request.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get stats for current user dashboard"""
    my_docs = db.query(func.count(Document.id)).filter(
        Document.owner_id == current_user.id,
        Document.is_shared == False
    ).scalar()

    chat_sessions = db.query(func.count(ChatSession.id)).filter(
        ChatSession.user_id == current_user.id
    ).scalar()

    shared_docs = db.query(func.count(Document.id)).filter(
        Document.is_shared == True
    ).scalar()

    return {
        "my_documents":   my_docs,
        "chat_sessions":  chat_sessions,
        "shared_library": shared_docs,
    }