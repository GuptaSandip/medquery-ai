from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentResponse(BaseModel):
    id:                int
    filename:          str
    original_filename: str
    file_size:         Optional[float]
    page_count:        Optional[int]
    is_shared:         bool
    is_processed:      bool
    chunk_count:       Optional[int]
    created_at:        datetime

    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    my_documents:     list[DocumentResponse]
    shared_documents: list[DocumentResponse]
    total:            int