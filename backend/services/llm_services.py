from langchain_groq import ChatGroq
from config import settings

# Singleton LLM instance
_llm = None

def get_llm() -> ChatGroq:
    """Get or create Groq LLM instance"""
    global _llm

    if _llm is None:
        _llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name="llama-3.1-8b-instant",
            temperature=0.3
        )

    return _llm