from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool
    auth_provider: str
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Full name cannot be empty")
        return v