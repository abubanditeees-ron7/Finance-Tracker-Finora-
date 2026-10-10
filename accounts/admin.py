from django.contrib import admin
from .models import UserProfile, EmailVerificationCode


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "language", "email_verified", "created_at")
    list_filter = ("language", "email_verified")
    search_fields = ("userusername", "useremail")


@admin.register(EmailVerificationCode)
class EmailVerificationCodeAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "created_at",
        "expires_at",
        "attempts",
        "used",
    )
    list_filter = ("used",)
    search_fields = ("userusername", "useremail")
    readonly_fields = (
        "user",
        "code_hash",
        "created_at",
        "expires_at",
        "attempts",
        "used",
    )
