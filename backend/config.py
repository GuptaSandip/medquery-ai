from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    # App
    APP_NAME: str = "MedQuery AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # JWT
    SECRET_KEY: str = "dev-secret-key"   # ⚠️ prevents crash if .env missing
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite:///./medquery.db"

    # Groq
    GROQ_API_KEY: str = ""

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    # File Upload
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")   # ✅ better path handling
    MAX_FILE_SIZE_MB: int = 10
    CHROMA_DB_PATH: str = str(BASE_DIR / "chroma_db")

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"   # ✅ prevents crash if extra env vars exist


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()