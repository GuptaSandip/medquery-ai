import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from middleware.auth_middleware import get_current_user, get_admin_user
from models.user import User
from models.document import Document
from schemas.document import DocumentResponse, DocumentListResponse
from services.pdf_services import PDFService
from services.vector_service import VectorService

router = APIRouter(prefix="/documents", tags=["Documents"])

# ─── Upload User Document ──────────────────────────────────────────

@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a private PDF document"""

    # Validate PDF
    PDFService.validate_pdf(file)

    # Save to disk
    file_info = PDFService.save_pdf(file, current_user.id, is_shared=False)

    # Process and store in ChromaDB
    try:
        chunk_count = VectorService.process_and_store_pdf(
            file_path=file_info["file_path"],
            user_id=current_user.id,
            is_shared=False
        )
    except Exception as e:
        # Cleanup file if vectorization fails
        PDFService.delete_pdf(file_info["file_path"])
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF: {str(e)}"
        )

    # Save to database
    document = Document(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_size=file_info["file_size"],
        collection_name=VectorService.get_collection_name(
            current_user.id, is_shared=False
        ),
        owner_id=current_user.id,
        is_shared=False,
        is_processed=True,
        chunk_count=chunk_count
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document

# ─── Get My Documents ─────────────────────────────────────────────

@router.get("/my", response_model=List[DocumentResponse])
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all documents uploaded by current user"""
    docs = db.query(Document).filter(
        Document.owner_id == current_user.id,
        Document.is_shared == False
    ).all()
    return docs

# ─── Get Shared Library ───────────────────────────────────────────

@router.get("/shared", response_model=List[DocumentResponse])
def get_shared_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all admin-shared documents"""
    docs = db.query(Document).filter(
        Document.is_shared == True
    ).all()
    return docs

# ─── Delete Document ──────────────────────────────────────────────

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document — owner only"""

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    # Only owner can delete
    if document.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this document"
        )

    # Delete from ChromaDB
    try:
        VectorService.delete_pdf_from_vectorstore(
            file_path=document.file_path,
            user_id=current_user.id,
            is_shared=document.is_shared
        )
    except Exception:
        pass  # Continue even if vector deletion fails

    # Delete from disk
    PDFService.delete_pdf(document.file_path)

    # Delete from database
    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}

# ─── Admin Upload Shared Document ─────────────────────────────────

@router.post("/admin/upload", response_model=DocumentResponse, status_code=201)
async def admin_upload_shared_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Admin uploads shared document for all users"""

    PDFService.validate_pdf(file)
    file_info = PDFService.save_pdf(file, admin_user.id, is_shared=True)

    try:
        chunk_count = VectorService.process_and_store_pdf(
            file_path=file_info["file_path"],
            user_id=admin_user.id,
            is_shared=True
        )
    except Exception as e:
        PDFService.delete_pdf(file_info["file_path"])
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF: {str(e)}"
        )

    document = Document(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_size=file_info["file_size"],
        collection_name="admin_shared_docs",
        owner_id=admin_user.id,
        is_shared=True,
        is_processed=True,
        chunk_count=chunk_count
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document

