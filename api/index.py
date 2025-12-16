"""
Vercel Serverless Function Entry Point
This file wraps our FastAPI backend for Vercel deployment.
"""

import sys
from pathlib import Path

# Add backend directory to Python path so imports work
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

# Import services from backend
try:
    from config import get_settings
    from services.rag_service import get_rag_service
    from services.translation_service import get_translation_service
    from services.personalization_service import get_personalization_service, UserProfile
except ImportError:
    # Fallback for local development
    pass

# Create the FastAPI app
app = FastAPI(
    title="Physical AI Textbook Chatbot API",
    description="RAG-powered chatbot for the Physical AI & Humanoid Robotics textbook",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    sources: list = []


class TranslateRequest(BaseModel):
    content: str
    target_language: str = "urdu"


class TranslateResponse(BaseModel):
    translated_content: str
    source_language: str
    target_language: str


class PersonalizeRequest(BaseModel):
    content: str
    experience_level: str = "intermediate"
    background: str = "other"
    interests: list = []
    preferred_examples: str = "python"


class PersonalizeResponse(BaseModel):
    personalized_content: str
    user_level: str


class IngestRequest(BaseModel):
    content: str
    source: str
    chapter: Optional[str] = None


class IngestResponse(BaseModel):
    chunks_ingested: int
    message: str


# Health check
@app.get("/api/health")
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-chatbot"}


# Main chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint for general questions."""
    try:
        rag_service = get_rag_service()
        response_text, sources = rag_service.generate_response(
            query=request.message,
            selected_text=request.selected_text
        )
        return ChatResponse(response=response_text, sources=sources[:3])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Selected text chat
@app.post("/api/chat/selected", response_model=ChatResponse)
async def chat_about_selection(request: ChatRequest):
    """Chat about selected text only."""
    if not request.selected_text:
        raise HTTPException(status_code=400, detail="selected_text is required")
    
    try:
        rag_service = get_rag_service()
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


# Translation endpoint
@app.post("/api/translate", response_model=TranslateResponse)
async def translate_content(request: TranslateRequest):
    """Translate chapter content to Urdu."""
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


# Personalization endpoint
@app.post("/api/personalize", response_model=PersonalizeResponse)
async def personalize_content(request: PersonalizeRequest):
    """Personalize content based on user level."""
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


# Ingest endpoint
@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_document(request: IngestRequest):
    """Ingest a document into the vector store."""
    try:
        rag_service = get_rag_service()
        metadata = {"source": request.source, "chapter": request.chapter or "unknown"}
        chunks_count = rag_service.ingest_document(request.content, metadata)
        return IngestResponse(
            chunks_ingested=chunks_count,
            message=f"Successfully ingested {chunks_count} chunks from {request.source}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Vercel handler
handler = app
