from langchain_community.embeddings import HuggingFaceEmbeddings

# Singleton pattern — load model once
_embedding_model = None

def get_embedding_model() -> HuggingFaceEmbeddings:
    """Get or create embedding model (loaded once)"""
    global _embedding_model

    if _embedding_model is None:
        print("⏳ Loading embedding model...")
        _embedding_model = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        print("✅ Embedding model loaded!")

    return _embedding_model