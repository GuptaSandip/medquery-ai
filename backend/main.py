from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# from config import settings
# from database import engine, Base

from config import settings         
from database import engine, Base 

from models import user, document, chat

from routers import (
    auth,
    chat as chat_router,
    documents,
    user as user_router,
    admin                        
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting MedQuery AI...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    yield
    print("🛑 Shutting down MedQuery AI...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Healthcare Document Intelligence Platform powered by RAG",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173" , "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat_router.router)
app.include_router(documents.router)
app.include_router(user_router.router)
app.include_router(admin.router)             

@app.get("/", tags=["Health"])
def root():
    return {
        "app":     settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status":  "running",
        "docs":    "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}