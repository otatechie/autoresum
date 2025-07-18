"""AI Generator Service for Cover Letters"""

import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class AICoverLetterGenerator:
    """Handles AI generation of cover letter content"""
    
    def __init__(self):
        self.mock_mode = True  # For development, always use mock responses
        
    def generate_cover_letter(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate cover letter content based on user input
        For development, returns mock data instead of calling OpenAI
        """

        try:
            if self.mock_mode:
                result = self._generate_mock_content(data)
                return result
                
            # Real OpenAI implementation would go here
            raise NotImplementedError("OpenAI integration not implemented")
            
        except Exception as e:

            logger.error(f"Error generating cover letter: {e}")
            raise
            
    def _generate_mock_content(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate realistic-looking mock content for development"""
        company_name = data.get('company_name', 'the company')
        job_title = data.get('job_title', 'the position')
        name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
        
        mock_letter = f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company_name}. With my background in [relevant field] and proven track record of [key achievement], I am confident in my ability to contribute significantly to your team.

Throughout my career, I have developed expertise in:
• [Key Skill 1] with demonstrated success in [specific example]
• [Key Skill 2] resulting in [measurable outcome]
• [Key Skill 3] through [relevant experience]

What particularly draws me to {company_name} is your commitment to [company value/achievement]. I am excited about the opportunity to contribute to [specific company goal/project] while bringing my expertise in [relevant skills].

Thank you for considering my application. I look forward to discussing how my skills and experience align with your needs.

Best regards,
{name}"""

        return {
            "original_content": mock_letter,
            "parsed_content": {
                "name": name,
                "email": data.get('email', ''),
                "phone": data.get('phone_number', ''),
                "company_name": company_name,
                "job_title": job_title,
                "cover_letter": mock_letter
            }
        }
