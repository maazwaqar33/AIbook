"""
Configuration settings for the RAG chatbot backend.
Using pydantic-settings to manage environment variables cleanly.
Supports both Google Gemini (free) and OpenAI APIs.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Google Gemini - FREE tier available (recommended)
    gemini_api_key: str = ""
    
    # OpenAI - for embeddings and chat (optional, paid)
    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"
    
    # Qdrant Cloud - for vector storage
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    qdrant_collection_name: str = "physical_ai_textbook"
    
    # Neon Postgres - for user data
    database_url: str = ""
    
    # App settings - allow all origins for deployment
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://maazwaqar33.github.io",
        "https://*.vercel.app"
    ]
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
