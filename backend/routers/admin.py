from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from middleware.auth_middleware import get_current_user, get_admin_user
from models.user import User
from models.document import Document
from models.chat import ChatSession, ChatMessage
from schemas.user import UserResponse
from services.pdf_services import PDFService
from services.vector_service import VectorService
from fastapi import UploadFile, File, HTTPException, status
from schemas.document import DocumentResponse
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin"])

# ─── Get All Users ────────────────────────────────────────────────

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all users — admin only"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id":         u.id,
            "full_name":  u.full_name,
            "email":      u.email,
            "role":       u.role,
            "is_active":  u.is_active,
            "auth_provider": u.auth_provider,
            "created_at": u.created_at,
            "last_login": u.last_login,
        }
        for u in users
    ]

# ─── Platform Stats ───────────────────────────────────────────────

@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get platform-wide stats — admin only"""
    total_users     = db.query(func.count(User.id)).scalar()
    total_docs      = db.query(func.count(Document.id)).scalar()
    total_sessions  = db.query(func.count(ChatSession.id)).scalar()
    total_messages  = db.query(func.count(ChatMessage.id)).scalar()
    shared_docs     = db.query(func.count(Document.id)).filter(
                        Document.is_shared == True
                      ).scalar()

    return {
        "total_users":    total_users,
        "total_documents": total_docs,
        "total_sessions": total_sessions,
        "total_messages": total_messages,
        "shared_documents": shared_docs,
    }

# ─── Delete User ──────────────────────────────────────────────────

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete a user — admin only"""
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} deleted"}

# ─── Upload Shared Document ───────────────────────────────────────

@router.post("/documents/upload", response_model=DocumentResponse, status_code=201)
async def admin_upload_shared(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Admin uploads shared document for all users"""
    PDFService.validate_pdf(file)
    file_info = PDFService.save_pdf(file, admin.id, is_shared=True)

    try:
        chunk_count = VectorService.process_and_store_pdf(
            file_path=file_info["file_path"],
            user_id=admin.id,
            is_shared=True
        )
    except Exception as e:
        PDFService.delete_pdf(file_info["file_path"])
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF: {str(e)}"
        )

    from models.document import Document
    document = Document(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_size=file_info["file_size"],
        collection_name="admin_shared_docs",
        owner_id=admin.id,
        is_shared=True,
        is_processed=True,
        chunk_count=chunk_count
    )

    db.add(document)
    db.commit()
    db.refresh(document)
    return document