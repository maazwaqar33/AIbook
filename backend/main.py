"""
FastAPI main application for the RAG chatbot backend.
This powers the AI assistant embedded in my Physical AI textbook.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from pathlib import Path

from config import get_settings
from services.rag_service import get_rag_service
from services.translation_service import get_translation_service
from services.personalization_service import get_personalization_service, UserProfile

# Create the FastAPI app
app = FastAPI(
    title="Physical AI Textbook Chatbot API",
    description="RAG-powered chatbot for the Physical AI & Humanoid Robotics textbook",
    version="1.0.0"
)

# Configure CORS so my Docusaurus frontend can talk to this
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatRequest(BaseModel):
    message: str
    selected_text: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: list[dict] = []


class IngestRequest(BaseModel):
    content: str
    source: str
    chapter: Optional[str] = None


class IngestResponse(BaseModel):
    chunks_ingested: int
    message: str


class TranslateRequest(BaseModel):
    content: str
    target_language: str = "urdu"


class TranslateResponse(BaseModel):
    translated_content: str
    source_language: str
    target_language: str


class PersonalizeRequest(BaseModel):
    content: str
    experience_level: str = "intermediate"  # beginner, intermediate, advanced
    background: str = "other"  # cs, engineering, physics, other
    interests: list[str] = []
    preferred_examples: str = "python"  # python, cpp, both


class PersonalizeResponse(BaseModel):
    personalized_content: str
    user_level: str


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-chatbot"}


# Main chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint. Send a message and optionally selected text
    to get an AI response based on the textbook content.
    """
    try:
        rag_service = get_rag_service()
        
        # Generate response (now returns tuple)
        response_text, sources = rag_service.generate_response(
            query=request.message,
            selected_text=request.selected_text
        )
        
        return ChatResponse(
            response=response_text,
            sources=sources[:3]  # Return top 3 sources
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Selected text chat - for when users highlight text and ask about it
@app.post("/api/chat/selected", response_model=ChatResponse)
async def chat_about_selection(request: ChatRequest):
    """
    Chat about selected text. Uses the selected text as primary context.
    """
    if not request.selected_text:
        raise HTTPException(status_code=400, detail="selected_text is required")
    
    try:
        rag_service = get_rag_service()
        
        # Use selected text as primary context (returns tuple now)
        response_text, _ = rag_service.generate_response(
            query=request.message,
            context=request.selected_text,
            selected_text=request.selected_text
        )
        
        return ChatResponse(
            response=response_text,
            sources=[{"text": request.selected_text[:200], "source": "selected", "score": 1.0}]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Translation endpoint - converts content to Urdu
@app.post("/api/translate", response_model=TranslateResponse)
async def translate_content(request: TranslateRequest):
    """
    Translate chapter content to Urdu while preserving code blocks.
    This enables the Urdu translation bonus feature.
    """
    try:
        translation_service = get_translation_service()
        
        translated = translation_service.translate_to_urdu(request.content)
        
        return TranslateResponse(
            translated_content=translated,
            source_language="english",
            target_language=request.target_language
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Personalization endpoint - adapts content to user level
@app.post("/api/personalize", response_model=PersonalizeResponse)
async def personalize_content(request: PersonalizeRequest):
    """
    Personalize chapter content based on user's experience level and background.
    This enables the content personalization bonus feature.
    """
    try:
        personalization_service = get_personalization_service()
        
        user_profile = UserProfile(
            experience_level=request.experience_level,
            background=request.background,
            interests=request.interests or ["robotics"],
            preferred_examples=request.preferred_examples
        )
        
        personalized = personalization_service.personalize_content(
            request.content, 
            user_profile
        )
        
        return PersonalizeResponse(
            personalized_content=personalized,
            user_level=request.experience_level
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Ingest endpoint - for adding content to the vector store
@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_document(request: IngestRequest):
    """
    Ingest a document into the vector store.
    Used to add textbook content for RAG.
    """
    try:
        rag_service = get_rag_service()
        
        metadata = {
            "source": request.source,
            "chapter": request.chapter or "unknown"
        }
        
        chunks_count = rag_service.ingest_document(request.content, metadata)
        
        return IngestResponse(
            chunks_ingested=chunks_count,
            message=f"Successfully ingested {chunks_count} chunks from {request.source}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Batch ingest all markdown files from docs folder
@app.post("/api/ingest/batch")
async def batch_ingest():
    """
    Ingest all markdown files from the docs folder.
    Run this once to populate the vector store.
    """
    try:
        rag_service = get_rag_service()
        docs_path = Path(__file__).parent.parent / "docs"
        
        if not docs_path.exists():
            raise HTTPException(status_code=404, detail="Docs folder not found")
        
        total_chunks = 0
        files_processed = 0
        
        for md_file in docs_path.rglob("*.md"):
            content = md_file.read_text(encoding="utf-8")
            relative_path = md_file.relative_to(docs_path)
            
            # Extract chapter from path
            parts = str(relative_path).split(os.sep)
            chapter = parts[0] if len(parts) > 1 else "intro"
            
            metadata = {
                "source": str(relative_path),
                "chapter": chapter
            }
            
            chunks = rag_service.ingest_document(content, metadata)
            total_chunks += chunks
            files_processed += 1
        
        return {
            "message": f"Batch ingestion complete",
            "files_processed": files_processed,
            "total_chunks": total_chunks
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

