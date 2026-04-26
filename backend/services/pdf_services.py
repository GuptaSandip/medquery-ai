import os
import uuid
import shutil
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from config import settings

class PDFService:

    @staticmethod
    def validate_pdf(file: UploadFile) -> None:
        """Validate file is PDF and within size limit"""

        # Check file type
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed"
            )

        # Check content type
        if file.content_type not in ["application/pdf", "application/octet-stream"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type"
            )

    @staticmethod
    def save_pdf(
        file: UploadFile,
        user_id: int,
        is_shared: bool = False
    ) -> dict:
        """Save PDF to disk and return file info"""

        # Determine save folder
        folder = "shared_docs" if is_shared else f"user_{user_id}"
        save_dir = Path(settings.UPLOAD_DIR) / folder
        save_dir.mkdir(parents=True, exist_ok=True)

        # Generate unique filename
        unique_name = f"{uuid.uuid4()}_{file.filename}"
        file_path   = save_dir / unique_name

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get file size in MB
        file_size = os.path.getsize(file_path) / (1024 * 1024)

        # Check size limit
        if file_size > settings.MAX_FILE_SIZE_MB:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Max size is {settings.MAX_FILE_SIZE_MB}MB"
            )

        return {
            "filename":          unique_name,
            "original_filename": file.filename,
            "file_path":         str(file_path),
            "file_size":         round(file_size, 2)
        }

    @staticmethod
    def delete_pdf(file_path: str) -> None:
        """Delete PDF from disk"""
        if os.path.exists(file_path):
            os.remove(file_path)