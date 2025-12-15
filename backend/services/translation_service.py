"""
Translation Service - Handles Urdu translation for chapter content.
Uses OpenAI for high-quality translations that preserve technical accuracy.
"""

from openai import OpenAI
from config import get_settings


class TranslationService:
    def __init__(self):
        settings = get_settings()
        self.openai = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"
    
    def translate_to_urdu(self, content: str, preserve_code: bool = True) -> str:
        """
        Translate content to Urdu while preserving code blocks and technical terms.
        
        I'm using a careful prompt to ensure:
        - Code blocks stay in English
        - Technical terms are transliterated when appropriate
        - The translation reads naturally in Urdu
        """
        
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

        response = self.openai.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content}
            ],
            max_tokens=4000,
            temperature=0.3  # Lower temperature for more consistent translations
        )
        
        return response.choices[0].message.content
    
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
