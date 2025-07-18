"""AI Generator Service for Resumes"""

import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class AIResumeGenerator:
    """Handles AI generation of resume content"""
    
    def __init__(self):
        self.mock_mode = True  # For development, always use mock responses
        
    def generate_resume(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate resume content based on user input
        For development, returns mock data instead of calling OpenAI
        """
        try:
            if self.mock_mode:
                return self._generate_mock_content(data)
                
            # Real OpenAI implementation would go here
            raise NotImplementedError("OpenAI integration not implemented")
            
        except Exception as e:
            logger.error(f"Error generating resume: {e}")
            raise
            
    def _generate_mock_content(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate realistic-looking mock content for development"""
        full_name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
        
        # Generate professional summary
        summary = """Results-driven professional with expertise in software development. Proven track record of delivering high-quality applications and optimizing performance. Skilled in full-stack development and agile methodologies, with a strong focus on user experience."""

        # Format work experience
        work_exp = data.get('work_experience', {})
        work_experience = [{
            "company": work_exp.get('company', 'Tech Company Inc.'),
            "position": work_exp.get('position', 'Senior Software Engineer'),
            "duration": "2020 - Present",
            "description": [
                "Led cross-functional teams in developing enterprise applications",
                "Implemented CI/CD pipelines reducing deployment time by 50%",
                "Developed and maintained microservices architecture"
            ]
        }]

        # Format education
        edu = data.get('education', {})
        education = [{
            "institution": edu.get('institution', 'University of Technology'),
            "degree": edu.get('degree', 'Bachelor of Science in Computer Science'),
            "duration": "2016 - 2020",
            "achievements": [
                "Graduated with Honors",
                "Dean's List all semesters"
            ]
        }]

        # Format skills
        skills_input = data.get('skills', {}).get('list', '')
        skills = skills_input.split(',') if skills_input else [
            "Python", "JavaScript", "React", "Django",
            "Docker", "AWS", "Git", "Agile"
        ]
        skills = [skill.strip() for skill in skills if skill.strip()]

        # Format languages
        languages_input = data.get('languages', {}).get('list', '')
        languages = languages_input.split(',') if languages_input else ["English", "Spanish"]
        languages = [lang.strip() for lang in languages if lang.strip()]

        # Format certifications
        certifications_input = data.get('certifications', {}).get('list', '')
        certifications = certifications_input.split(',') if certifications_input else [
            "AWS Certified Developer",
            "Professional Scrum Master"
        ]
        certifications = [cert.strip() for cert in certifications if cert.strip()]

        # Store the original content as a string representation
        original_content = str(data)

        # Return the content in the format expected by create_resume
        return {
            "original_content": original_content,
            "parsed_content": {
                "full_name": full_name,
                "email": data.get('email', ''),
                "phone_number": data.get('phone_number', ''),
                "resume_summary": summary,
                "work_experience": work_experience,
                "education": education,
                "skills": skills,
                "languages": languages,
                "certifications": certifications
            }
        }
