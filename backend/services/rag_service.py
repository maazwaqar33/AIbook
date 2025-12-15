"""
RAG Service - The brain of my chatbot.
Handles document embedding, retrieval, and generation.
"""

from typing import Optional
import hashlib
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import tiktoken

from config import get_settings


class RAGService:
    def __init__(self):
        settings = get_settings()
        
        # Initialize OpenAI client
        self.openai = OpenAI(api_key=settings.openai_api_key)
        self.embedding_model = settings.openai_embedding_model
        self.chat_model = settings.openai_chat_model
        
        # Initialize Qdrant client
        if settings.qdrant_url and settings.qdrant_api_key:
            self.qdrant = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key
            )
        else:
            # Use in-memory for local development
            self.qdrant = QdrantClient(":memory:")
        
        self.collection_name = settings.qdrant_collection_name
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        
        # Ensure collection exists
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Create collection if it doesn't exist"""
        try:
            self.qdrant.get_collection(self.collection_name)
        except Exception:
            self.qdrant.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=1536,  # text-embedding-3-small dimension
                    distance=Distance.COSINE
                )
            )
    
    def _generate_id(self, text: str) -> str:
        """Generate a unique ID for a text chunk"""
        return hashlib.md5(text.encode()).hexdigest()
    
    def get_embedding(self, text: str) -> list[float]:
        """Get embedding vector for text"""
        response = self.openai.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        """Split text into overlapping chunks"""
        tokens = self.tokenizer.encode(text)
        chunks = []
        
        for i in range(0, len(tokens), chunk_size - overlap):
            chunk_tokens = tokens[i:i + chunk_size]
            chunk_text = self.tokenizer.decode(chunk_tokens)
            chunks.append(chunk_text)
        
        return chunks
    
    def ingest_document(self, content: str, metadata: dict) -> int:
        """Ingest a document into the vector store"""
        chunks = self.chunk_text(content)
        points = []
        
        for i, chunk in enumerate(chunks):
            embedding = self.get_embedding(chunk)
            point_id = self._generate_id(f"{metadata.get('source', 'unknown')}_{i}")
            
            points.append(PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "text": chunk,
                    "chunk_index": i,
                    **metadata
                }
            ))
        
        self.qdrant.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        return len(points)
    
    def search(self, query: str, limit: int = 5) -> list[dict]:
        """Search for relevant chunks"""
        query_embedding = self.get_embedding(query)
        
        results = self.qdrant.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        
        return [
            {
                "text": hit.payload.get("text", ""),
                "source": hit.payload.get("source", ""),
                "score": hit.score
            }
            for hit in results
        ]
    
    def generate_response(
        self, 
        query: str, 
        context: Optional[str] = None,
        selected_text: Optional[str] = None
    ) -> str:
        """Generate a response using RAG"""
        
        # Search for relevant context if not provided
        if context is None:
            search_results = self.search(query, limit=5)
            context = "\n\n".join([r["text"] for r in search_results])
        
        # Build my prompt
        system_prompt = """You are a helpful AI tutor for a Physical AI & Humanoid Robotics textbook. 
Your role is to answer questions based on the textbook content provided as context.
Be clear, educational, and accurate. If the answer isn't in the context, say so.
Use examples and code snippets when helpful."""

        user_message = f"""Context from the textbook:
{context}

"""
        if selected_text:
            user_message += f"""The user has selected this text:
"{selected_text}"

"""
        
        user_message += f"Question: {query}"
        
        response = self.openai.chat.completions.create(
            model=self.chat_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content


# Singleton instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
