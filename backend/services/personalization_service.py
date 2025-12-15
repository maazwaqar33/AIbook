"""
Personalization Service - Adapts content based on user's experience level.
Uses the user's background to tailor explanations and examples.
"""

from openai import OpenAI
from config import get_settings
from typing import Optional
from dataclasses import dataclass


@dataclass
class UserProfile:
    """User's background for personalization"""
    experience_level: str  # "beginner", "intermediate", "advanced"
    background: str  # "cs", "engineering", "physics", "other"
    interests: list[str]  # ["ai", "hardware", "locomotion", etc.]
    preferred_examples: str  # "python", "cpp", "both"


class PersonalizationService:
    def __init__(self):
        settings = get_settings()
        self.openai = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"
    
    def personalize_content(
        self, 
        content: str, 
        user_profile: UserProfile
    ) -> str:
        """
        Adapt content based on user's experience level and background.
        
        For beginners: Add more context, simpler analogies
        For intermediate: Standard content with practical tips
        For advanced: Add deeper technical details, research references
        """
        
        level_instructions = {
            "beginner": """
- Add more context and background for technical concepts
- Use simple analogies and everyday comparisons
- Explain acronyms and technical terms when first used
- Add "Think of it like..." explanations
- Simplify code examples with extra comments""",
            "intermediate": """
- Keep the standard level of detail
- Add practical implementation tips
- Include common pitfalls to avoid
- Suggest related topics to explore""",
            "advanced": """
- Add deeper technical details and edge cases
- Include references to recent research papers
- Add optimization tips and advanced techniques
- Discuss trade-offs and design decisions
- Include more complex code examples"""
        }
        
        background_context = {
            "cs": "The reader has a computer science background, so focus on algorithms and software aspects.",
            "engineering": "The reader has an engineering background, so include more math and physics where relevant.",
            "physics": "The reader has a physics background, so emphasize dynamics, forces, and physical principles.",
            "other": "The reader may not have a technical background, so explain fundamentals clearly."
        }
        
        system_prompt = f"""You are an expert robotics educator adapting content for a specific learner.

Learner Profile:
- Experience Level: {user_profile.experience_level}
- Background: {user_profile.background}
- Interests: {', '.join(user_profile.interests)}
- Code Preference: {user_profile.preferred_examples}

Instructions:
{level_instructions.get(user_profile.experience_level, level_instructions["intermediate"])}

{background_context.get(user_profile.background, background_context["other"])}

Keep the same structure and format (markdown, code blocks, etc.).
Return the adapted content - do not add any prefixes or explanations."""

        response = self.openai.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Adapt this content:\n\n{content}"}
            ],
            max_tokens=4000,
            temperature=0.5
        )
        
        return response.choices[0].message.content
    
    def get_personalized_explanation(
        self, 
        concept: str, 
        user_profile: UserProfile
    ) -> str:
        """Generate a personalized explanation for a specific concept"""
        
        prompt = f"""Explain the concept of "{concept}" for someone with:
- Experience: {user_profile.experience_level}
- Background: {user_profile.background}
- Interests: {', '.join(user_profile.interests)}

Keep the explanation concise but tailored to their level."""

        response = self.openai.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        
        return response.choices[0].message.content


# Singleton
_personalization_service = None

def get_personalization_service() -> PersonalizationService:
    global _personalization_service
    if _personalization_service is None:
        _personalization_service = PersonalizationService()
    return _personalization_service
