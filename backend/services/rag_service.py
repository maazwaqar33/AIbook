"""
RAG Service - The brain of my chatbot.
Now uses Google Gemini for chat (FREE tier) while keeping Qdrant for vector storage.
"""

from typing import Optional
import hashlib
import google.generativeai as genai
from config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        settings = get_settings()
        
        # Initialize Gemini for chat
        self.gemini_api_key = settings.gemini_api_key
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("Gemini API configured for RAG chat")
        else:
            self.model = None
            logger.warning("Gemini API key not configured")
        
        # For now, we'll use a simple in-memory context store
        # In production, you'd use Qdrant with OpenAI embeddings
        self.context_store = []
        self._load_sample_context()
    
    def _load_sample_context(self):
        """Load sample context about the textbook for demo purposes"""
        self.context_store = [
            {
                "text": "Physical AI combines artificial intelligence with physical systems like robots. It enables machines to perceive, understand, and interact with the real world.",
                "source": "Chapter 1 - Introduction"
            },
            {
                "text": "ROS2 (Robot Operating System 2) is the industry standard middleware for robotics. It provides tools for building robot applications including message passing, hardware abstraction, and package management.",
                "source": "Chapter 2 - Foundations"
            },
            {
                "text": "Humanoid robots are designed to mimic human form and movement. Examples include Boston Dynamics' Atlas, Tesla's Optimus, and Figure's Figure 01.",
                "source": "Chapter 7 - Humanoids"
            },
            {
                "text": "LIDAR (Light Detection and Ranging) uses laser pulses to measure distances and create 3D maps of the environment. It's essential for autonomous navigation.",
                "source": "Chapter 3 - Hardware"
            },
            {
                "text": "Computer vision enables robots to understand visual information from cameras. Deep learning models like YOLO and ResNet are commonly used for object detection.",
                "source": "Chapter 6 - Perception"
            },
            {
                "text": "Motion planning algorithms like RRT (Rapidly-exploring Random Trees) and A* help robots find collision-free paths through their environment.",
                "source": "Chapter 4 - Motion"
            },
            {
                "text": "Reinforcement learning allows robots to learn behaviors through trial and error. The robot receives rewards for good actions and penalties for bad ones.",
                "source": "Chapter 5 - AI Algorithms"
            }
        ]
    
    def search(self, query: str, limit: int = 3) -> list[dict]:
        """Simple keyword-based search for demo. In production, use embeddings."""
        query_lower = query.lower()
        results = []
        
        for item in self.context_store:
            text_lower = item["text"].lower()
            # Simple relevance scoring
            score = sum(1 for word in query_lower.split() if word in text_lower)
            if score > 0:
                results.append({
                    "text": item["text"],
                    "source": item["source"],
                    "score": score
                })
        
        # Sort by score and return top results
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]
    
    def generate_response(
        self, 
        query: str, 
        context: Optional[str] = None,
        selected_text: Optional[str] = None
    ) -> tuple[str, list[dict]]:
        """Generate a response using Gemini with RAG context"""
        
        if not self.model:
            return "Please configure the Gemini API key in backend/.env", []
        
        # Search for relevant context
        search_results = self.search(query)
        
        if context is None:
            context = "\n\n".join([r["text"] for r in search_results])
        
        # Build prompt
        prompt = f"""You are a helpful AI tutor for a Physical AI & Humanoid Robotics textbook.
Answer the user's question based on the textbook content provided as context.
Be clear, educational, and accurate. Use examples when helpful.

Context from the textbook:
{context}

"""
        if selected_text:
            prompt += f"""The user has selected this text:
"{selected_text}"

"""
        
        prompt += f"""Question: {query}

Please provide a helpful, educational response."""

        try:
            response = self.model.generate_content(prompt)
            return response.text, search_results
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            return f"Error generating response: {str(e)}", []


# Singleton instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
