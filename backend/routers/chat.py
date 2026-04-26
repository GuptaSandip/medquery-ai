from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from middleware.auth_middleware import get_current_user
from models.user import User
from models.chat import ChatSession, ChatMessage
from schemas.chat import (
    ChatQueryRequest,
    ChatQueryResponse,
    ChatSessionResponse,
    ChatMessageResponse
)
from services.rag_service import RAGService

router = APIRouter(prefix="/chat", tags=["Chat"])

# ─── Send Query ───────────────────────────────────────────────────

@router.post("/query", response_model=ChatQueryResponse)
def chat_query(
    request: ChatQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a question and get RAG-powered answer"""

    if not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty"
        )

    # Run RAG pipeline
    result = RAGService.query(
        question=request.question,
        user_id=current_user.id,
        include_shared=request.include_shared
    )

    # Get or create chat session
    if request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
    else:
        # Create new session with first question as title
        title   = request.question[:50] + "..." \
                  if len(request.question) > 50 \
                  else request.question
        session = ChatSession(
            user_id=current_user.id,
            title=title
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    # Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=request.question,
        sources=None
    )
    db.add(user_msg)

    # Save assistant message
    assistant_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=result["answer"],
        sources=result["sources"]
    )
    db.add(assistant_msg)
    db.commit()

    return ChatQueryResponse(
        answer=result["answer"],
        sources=result["sources"],
        success=result["success"],
        session_id=session.id
    )

# ─── Get Chat History ─────────────────────────────────────────────

@router.get("/history", response_model=List[ChatSessionResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all chat sessions for current user"""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.created_at.desc()).all()
    return sessions

# ─── Get Single Session ───────────────────────────────────────────

@router.get("/session/{session_id}", response_model=ChatSessionResponse)
def get_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific chat session with all messages"""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return session

# ─── Clear History ────────────────────────────────────────────────

@router.delete("/history")
def clear_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete all chat sessions for current user"""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).all()

    for session in sessions:
        db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).delete()
        db.delete(session)

    db.commit()
    return {"message": "Chat history cleared successfully"}