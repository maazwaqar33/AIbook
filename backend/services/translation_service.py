"""
Translation Service - Handles Urdu translation for chapter content.
Uses Google Gemini API for high-quality translations (FREE tier available).
"""

import google.generativeai as genai
from config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TranslationService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.gemini_api_key
        logger.info(f"Gemini API key configured: {'Yes' if self.api_key else 'No'}")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
    
    def translate_to_urdu(self, content: str, preserve_code: bool = True) -> str:
        """
        Translate content to Urdu while preserving code blocks and technical terms.
        """
        
        if not self.model:
            raise ValueError("Gemini API key not configured in .env file")
        
        prompt = f"""You are an expert translator specializing in technical and educational content.
Translate the following text from English to Urdu.

Rules:
1. Keep all code blocks (```...```) in English - do not translate code
2. Keep technical terms like "Python", "ROS2", "LIDAR" etc in English
3. Translate explanations and descriptions naturally into Urdu
4. Use proper Urdu script (right-to-left)
5. Maintain markdown formatting
6. Keep any mermaid diagrams in English
7. For mathematical equations, keep the math but translate surrounding text

Text to translate:
{content}"""

        try:
            logger.info(f"Translating content of length: {len(content)}")
            response = self.model.generate_content(prompt)
            translated = response.text
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
