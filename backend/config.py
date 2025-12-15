"""
Configuration settings for the RAG chatbot backend.
I'm using pydantic-settings to manage environment variables cleanly.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # OpenAI - for embeddings and chat
    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"
    
    # Qdrant Cloud - for vector storage
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    qdrant_collection_name: str = "physical_ai_textbook"
    
    # Neon Postgres - for user data
    database_url: str = ""
    
    # App settings
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
