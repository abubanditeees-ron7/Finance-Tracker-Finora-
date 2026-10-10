from django.conf import settings
from django.db import models
from django.utils import timezone

import hashlib
import secrets

from datetime import timedelta


class UserProfile(models.Model):
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("ru", "Русский"),
        ("uz", "O‘zbekcha"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default="en",
    )
    email_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class EmailVerificationCode(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_codes",
    )
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    used = models.BooleanField(default=False)

    @staticmethod
    def generate_code():
        return f"{secrets.randbelow(1_000_000):06d}"

    @staticmethod
    def hash_code(code):
        return hashlib.sha256(code.encode()).hexdigest()

    @classmethod
    def create_for_user(cls, user):
        code = cls.generate_code()
        verification = cls.objects.create(
            user=user,
            code_hash=cls.hash_code(code),
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        return verification, code

    def is_valid(self, code):
        return (
            not self.used
            and timezone.now() < self.expires_at
            and self.attempts <= 5
            and secrets.compare_digest(
                self.code_hash,
                self.hash_code(code),
            )
        )

    def __str__(self):
        return f"Email verification for {self.user.username}"
