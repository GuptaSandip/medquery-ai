from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings   # ✅ consistent import

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},  # ✅ safe for non-sqlite
    echo=settings.DEBUG  # ✅ helpful for debugging
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()

# Dependency — use in routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()