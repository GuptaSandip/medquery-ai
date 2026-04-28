from langchain_huggingface import HuggingFaceEndpointEmbeddings
from config import settings

_embedding_model = None

def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        print("⏳ Connecting to HuggingFace Inference API...")
        _embedding_model = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2",
            huggingfacehub_api_token=settings.HF_TOKEN
        )
        print("✅ HuggingFace Embedding API ready!")

    return _embedding_model