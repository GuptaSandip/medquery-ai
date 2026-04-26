import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from services.embedding_service import get_embedding_model
from config import settings


# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(
    path=settings.CHROMA_DB_PATH,
    settings=ChromaSettings(anonymized_telemetry=False)
)


class VectorService:

    @staticmethod
    def get_collection_name(user_id: int, is_shared: bool = False) -> str:
        """Get ChromaDB collection name for user"""
        if is_shared:
            return "admin_shared_docs"
        return f"user_{user_id}_private"

    @staticmethod
    def process_and_store_pdf(
        file_path: str,
        user_id: int,
        is_shared: bool = False
    ) -> int:
        """Load PDF → chunk → embed → store in ChromaDB"""

        print("\n📄 Processing PDF:", file_path)

        # 1. Load PDF
        loader = PyPDFLoader(file_path)
        pages = loader.load()

        print("📑 Pages loaded:", len(pages))

        # 2. Split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " "]
        )

        chunks = splitter.split_documents(pages)

        print("✂️ Chunks created:", len(chunks))

        if not chunks:
            raise ValueError("No text could be extracted from PDF")

        # 3. Collection name
        collection_name = VectorService.get_collection_name(
            user_id, is_shared
        )

        print("📦 Collection:", collection_name)

        # 4. Embeddings
        embeddings = get_embedding_model()

        # 5. Vector store
        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )

        # 🔥 CRITICAL FIX (metadata consistency)
        for i, chunk in enumerate(chunks):
            chunk.metadata["user_id"] = str(user_id)
            chunk.metadata["is_shared"] = str(is_shared)

            # IMPORTANT for retrieval + citations
            chunk.metadata["source"] = file_path
            chunk.metadata["page"] = chunk.metadata.get("page", i)

        # 6. Store
        vectorstore.add_documents(chunks)

        print("✅ Stored in ChromaDB\n")

        return len(chunks)

    @staticmethod
    def delete_pdf_from_vectorstore(
        file_path: str,
        user_id: int,
        is_shared: bool = False
    ) -> None:
        """Delete document chunks from ChromaDB"""

        collection_name = VectorService.get_collection_name(
            user_id, is_shared
        )

        embeddings = get_embedding_model()

        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )

        results = vectorstore._collection.get(
            where={"source": file_path}
        )

        if results["ids"]:
            vectorstore._collection.delete(ids=results["ids"])
            print("🗑️ Deleted from vector DB")

    @staticmethod
    def get_retriever(user_id: int, include_shared: bool = True):
        """Get retrievers for user + shared docs"""

        embeddings = get_embedding_model()
        retrievers = []

        # 🔹 Private collection
        private_collection = VectorService.get_collection_name(
            user_id, is_shared=False
        )

        try:
            private_store = Chroma(
                client=chroma_client,
                collection_name=private_collection,
                embedding_function=embeddings
            )

            count = private_store._collection.count()
            print("🔍 Private collection count:", count)

            if count > 0:
                retrievers.append(
                    private_store.as_retriever(
                        search_kwargs={"k": 5}
                    )
                )
        except Exception as e:
            print("⚠️ Private retriever error:", e)

        # 🔹 Shared collection
        if include_shared:
            try:
                shared_store = Chroma(
                    client=chroma_client,
                    collection_name="admin_shared_docs",
                    embedding_function=embeddings
                )

                count = shared_store._collection.count()
                print("🔍 Shared collection count:", count)

                if count > 0:
                    retrievers.append(
                        shared_store.as_retriever(
                            search_kwargs={"k": 3}
                        )
                    )
            except Exception as e:
                print("⚠️ Shared retriever error:", e)

        print("✅ Total retrievers:", len(retrievers))

        return retrievers