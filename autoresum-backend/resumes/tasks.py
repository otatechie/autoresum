# File: resumes/tasks.py
# Author: Oluwatobiloba Light

from typing import Union

# import celery
from celery import shared_task

# from autoresum_api.celery import celery_app
from resumes.containers import Container
from resumes.models import Resume
from users.models import User

# from django.core.cache import cache


@shared_task
def generate_resume_content_task(user_data: dict, user_id: int):
    """Celery task to generate a resume asynchronously."""
    try:
        # Fetch the user inside Celery
        User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValueError(f"User with id {user_id} not found.")

    resume_generator = Container.resume_generator()

    # Ensure phone number is properly formatted
    if not user_data.get('phone_number'):
        user_data['phone_number'] = ''  # Set empty string if not provided

    result = resume_generator.generate_resume(user_data)
    return result  # This already contains original_content and parsed_content


@shared_task
def update_resume_content_task(resume_id: str, user_data: dict, user_id: int):
    """Celery task to generate a resume asynchronously."""
    user: Union[User, None] = None
    resume: Union[Resume, None] = None

    try:
        # Fetch the user inside Celery
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValueError(f"User with id {user_id} not found.")

    try:
        resume = Resume.objects.get(id=resume_id, user=user)
    except:
        raise ValueError(f"Resume with id {user_id} or user_id {user_id} not found.")

    # Ensure phone number is properly formatted
    if not user_data.get('phone_number'):
        user_data['phone_number'] = ''  # Set empty string if not provided

    resume_generator = Container.resume_generator()
    result = resume_generator.generate_resume(user_data)

    resume.update_generate_content_count += 1
    resume.save(update_fields=["update_generate_content_count"])

    return {
        "original_content": result["original_content"],
        "parsed_content": result["parsed_content"],
        "resume_id": resume_id  # Include resume_id for automatic update functionality
    }
