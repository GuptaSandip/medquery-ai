from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship   # ✅ IMPORTANT
from database import Base
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class AuthProvider(str, enum.Enum):
    LOCAL = "local"
    GOOGLE = "google"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    # Auth
    hashed_password = Column(String, nullable=True)  # Null for Google OAuth

    auth_provider = Column(
        String,
        default=AuthProvider.LOCAL.value
    )

    google_id = Column(String, nullable=True, unique=True)

    # Profile
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    # Role
    role = Column(
        String,
        default=UserRole.USER.value
    )

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # ✅ FIX: Relationship with Document
    documents = relationship("Document", back_populates="owner")
    chat_sessions = relationship("ChatSession", back_populates="user")
    def __repr__(self):
        return f"<User {self.email}>"