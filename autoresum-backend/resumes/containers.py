"""Dependency injection container for resumes app."""

from dependency_injector import containers, providers

from resumes.repositories import ResumeRepository
from resumes.services.ai_generator import AIResumeGenerator

class Container(containers.DeclarativeContainer):
    """Container for resume-related dependencies."""

    config = providers.Configuration()

    # Use mock AI generator instead of OpenAI
    resume_generator = providers.Singleton(
        AIResumeGenerator
    )

    resume_repository = providers.Factory(
        ResumeRepository,
        resume_generator=resume_generator,
    )
