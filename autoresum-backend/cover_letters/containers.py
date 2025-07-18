"""Dependency injection container for cover letters app."""

from dependency_injector import containers, providers

from cover_letters.repositories import CoverLetterRepository
from cover_letters.services.ai_generator import AICoverLetterGenerator

class Container(containers.DeclarativeContainer):
    """Container for cover letter-related dependencies."""

    config = providers.Configuration()

    # Use mock AI generator instead of OpenAI
    cover_letter_generator = providers.Singleton(
        AICoverLetterGenerator
    )

    cover_letter_repository = providers.Factory(
        CoverLetterRepository,
        cover_letter_generator=cover_letter_generator,
    )
