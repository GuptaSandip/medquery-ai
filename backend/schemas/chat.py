from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatQueryRequest(BaseModel):
    question:       str
    session_id:     Optional[int] = None
    include_shared: bool = True

class SourceCitation(BaseModel):
    filename: str
    page:     int | str
    preview:  str

class ChatQueryResponse(BaseModel):
    answer:     str
    sources:    List[SourceCitation]
    success:    bool
    session_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id:         int
    role:       str
    content:    str
    sources:    Optional[list] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id:         int
    title:      str
    created_at: datetime
    messages:   List[ChatMessageResponse] = []

    class Config:
        from_attributes = True