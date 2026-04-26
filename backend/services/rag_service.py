from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from services.vector_service import VectorService
from services.llm_services import get_llm
from typing import Dict, List


# 🔥 RAG Prompt (Document-based answers)
MEDICAL_RAG_PROMPT = PromptTemplate(
    template="""You are helpful and polite MedQuery AI, a smart and friendly medical assistant.

Rules:
0. Always greet if some greet you than ask about thier problem related to medical report or research paper.
1. Answer ONLY from the provided context
2. If not found → say: "I couldn't find this information in the uploaded documents"
3. Always cite source + page
4. Be clear and slightly friendly (not too casual)
5. Use PROPER MARKDOWN formatting
6. Use headings (##)
7. Use bullet points (-)
8. Use bold where needed (**text**)
9. Keep it clean and readable

Context:
{context}

Question:
{question}

Answer:""",
    input_variables=["context", "question"]
)


# 🔥 Friendly Chat Prompt (no docs)
FRIENDLY_PROMPT = PromptTemplate(
    template="""You are MedQuery AI, a friendly assistant.

Talk like a helpful friend and always greet when someone greet you.


User: {question}

Assistant:""",
    input_variables=["question"]
)


class RAGService:

    @staticmethod
    def format_docs(docs: List[Document]) -> str:
        formatted = []

        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "N/A")

            filename = source.split("\\")[-1].split("/")[-1]

            formatted.append(
                f"[Source {i} - {filename}, Page {page}]\n{doc.page_content}"
            )

        return "\n\n".join(formatted)

    @staticmethod
    def extract_sources(docs: List[Document]) -> List[dict]:
        sources = []
        seen = set()

        for doc in docs:
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "N/A")

            filename = source.split("\\")[-1].split("/")[-1]

            key = f"{filename}_{page}"

            if key not in seen:
                seen.add(key)
                sources.append({
                    "filename": filename,
                    "page": page,
                    "preview": doc.page_content[:150] + "..."
                })

        return sources

    @staticmethod
    def query(
        question: str,
        user_id: int,
        include_shared: bool = True
    ) -> Dict:

        print("\n🔍 RAG QUERY START")
        print("Question:", question)

        # 🔹 Step 1: Get retrievers
        retrievers = VectorService.get_retriever(
            user_id, include_shared
        )

        # 🔹 If NO documents → Friendly chat mode
        if not retrievers:
            print("🤖 No docs → switching to friendly mode")

            llm = get_llm()

            chain = (
                FRIENDLY_PROMPT
                | llm
                | StrOutputParser()
            )

            answer = chain.invoke({
                "question": question
            })

            return {
                "answer": answer,
                "sources": [],
                "success": True
            }

        print(f"✅ Found {len(retrievers)} retriever(s)")

        # 🔹 Step 2: Retrieve docs
        all_docs = []

        for i, retriever in enumerate(retrievers):
            try:
                # ✅ FIXED (new LangChain API)
                docs = retriever.invoke(question)

                print(f"Retriever {i} returned {len(docs)} docs")

                all_docs.extend(docs)

            except Exception as e:
                print("⚠️ Retriever error:", str(e))

        # 🔹 If docs exist but nothing matched → fallback
        small_talk = ["hi","hii","hiii","hiiii", "hello", "hey", "thanks", "thank you", "ok", "okay", "bye", "okay fine", "done"]
        if not all_docs:
            print("❌ No relevant docs → fallback to friendly mode")

            llm = get_llm()

            chain = (
                FRIENDLY_PROMPT
                | llm
                | StrOutputParser()
            )

            answer = chain.invoke({
                "question": question
            })

            return {
                "answer": answer,
                "sources": [],
                "success": True
            }

        elif question.lower().strip() in small_talk:
            print("💬 Small talk detected → skipping RAG or fallback to friendly mode")

        print(f"✅ Total docs retrieved: {len(all_docs)}")

        # 🔹 Step 3: Format context
        context = RAGService.format_docs(all_docs)

        # 🔹 Step 4: LLM
        llm = get_llm()

        chain = (
            MEDICAL_RAG_PROMPT
            | llm
            | StrOutputParser()
        )

        # 🔹 Step 5: Generate answer
        answer = chain.invoke({
            "context": context,
            "question": question
        })

        sources = RAGService.extract_sources(all_docs)

        print("✅ RAG SUCCESS\n")

        return {
            "answer": answer,
            "sources": sources,
            "success": True
        }