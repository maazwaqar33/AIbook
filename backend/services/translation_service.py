"""
Translation Service - Handles Urdu translation for chapter content.
Uses OpenAI for high-quality translations that preserve technical accuracy.
"""

from openai import OpenAI
from config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TranslationService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.openai_api_key
        logger.info(f"OpenAI API key configured: {'Yes' if self.api_key else 'No'}")
        logger.info(f"API key prefix: {self.api_key[:10]}..." if self.api_key else "No key")
        self.openai = OpenAI(api_key=self.api_key)
        self.model = "gpt-4o-mini"
    
    def translate_to_urdu(self, content: str, preserve_code: bool = True) -> str:
        """
        Translate content to Urdu while preserving code blocks and technical terms.
        """
        
        if not self.api_key:
            raise ValueError("OpenAI API key not configured in .env file")
        
        system_prompt = """You are an expert translator specializing in technical and educational content.
Translate the following text from English to Urdu.

Rules:
1. Keep all code blocks (```...```) in English - do not translate code
2. Keep technical terms like "Python", "ROS2", "LIDAR" etc in English
3. Translate explanations and descriptions naturally into Urdu
4. Use proper Urdu script (right-to-left)
5. Maintain markdown formatting
6. Keep any mermaid diagrams in English
7. For mathematical equations, keep the math but translate surrounding text"""

        try:
            logger.info(f"Translating content of length: {len(content)}")
            response = self.openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": content}
                ],
                max_tokens=4000,
                temperature=0.3
            )
            
            translated = response.choices[0].message.content
            logger.info(f"Translation successful, output length: {len(translated)}")
            return translated
            
        except Exception as e:
            logger.error(f"Translation error: {type(e).__name__}: {str(e)}")
            raise
    
    def translate_chunk(self, text: str) -> str:
        """Translate a smaller chunk of text"""
        return self.translate_to_urdu(text)


# Singleton
_translation_service = None

def get_translation_service() -> TranslationService:
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service
