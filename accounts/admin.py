from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "language", "email_verified", "created_at")
    list_filter = ("language", "email_verified")
    search_fields = ("userusername", "useremail")
