from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base   # ✅ fixed import


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    # File Info
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size = Column(Float, nullable=True)  # in MB
    page_count = Column(Integer, nullable=True)

    # Storage
    file_path = Column(String, nullable=False)
    collection_name = Column(String, nullable=False)  # ChromaDB collection

    # Ownership
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_shared = Column(Boolean, default=False)  # Admin shared docs

    # Status
    is_processed = Column(Boolean, default=False)
    chunk_count = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    owner = relationship("User", back_populates="documents")  # ✅ fixed

    def __repr__(self):
        return f"<Document {self.filename}>"