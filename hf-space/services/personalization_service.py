"""
Personalization Service - Adapts content based on user profile.
Uses Google Gemini API for intelligent content adaptation (FREE tier available).
"""

import google.generativeai as genai
from config import get_settings
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class UserProfile:
    experience_level: str  # beginner, intermediate, advanced
    background: str  # software, hardware, both
    interests: list[str]
    preferred_examples: str = "python"  # python, cpp, pseudocode


class PersonalizationService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.gemini_api_key
        logger.info(f"Gemini API key configured: {'Yes' if self.api_key else 'No'}")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.model = None
    
    def personalize_content(self, content: str, user_profile: UserProfile) -> str:
        """
        Adapt content based on user's background and experience level.
        """
        
        if not self.model:
            raise ValueError("Gemini API key not configured in .env file")
        
        prompt = f"""You are an expert educator adapting robotics content for different learners.
        
User Profile:
- Experience Level: {user_profile.experience_level}
- Background: {user_profile.background}
- Interests: {', '.join(user_profile.interests)}
- Preferred Examples: {user_profile.preferred_examples}

Adapt the following content for this user. Make it:
- More detailed with fundamentals for beginners
- Technical with implementation details for advanced users
- Relevant to their interests ({', '.join(user_profile.interests)})

Content to adapt:
{content}

Provide an adapted version that maintains accuracy while matching the user's level."""

        try:
            logger.info(f"Personalizing content for {user_profile.experience_level} user")
            response = self.model.generate_content(prompt)
            personalized = response.text
            logger.info(f"Personalization successful")
            return personalized
            
        except Exception as e:
            error_str = str(e).lower()
            logger.error(f"Personalization error: {type(e).__name__}: {str(e)}")
            
            # User-friendly error messages
            if "429" in str(e) or "quota" in error_str or "rate" in error_str:
                raise ValueError("⏳ Personalization service is busy. Please wait a moment and try again.")
            elif "api key" in error_str or "authentication" in error_str:
                raise ValueError("🔑 API configuration issue. Please contact the administrator.")
            else:
                raise ValueError("😅 Personalization temporarily unavailable. Please try again.")


# Singleton
_personalization_service = None

def get_personalization_service() -> PersonalizationService:
    global _personalization_service
    if _personalization_service is None:
        _personalization_service = PersonalizationService()
    return _personalization_service
