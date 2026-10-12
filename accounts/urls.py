
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView,
    RegisterView,
    VerifyEmailView,
    UserProfileView,
    PasswordChangeView,
    EmailChangeRequestView,
    EmailChangeConfirmView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path(
        "profile/password/",
        PasswordChangeView.as_view(),
        name="profile-password-change",
    ),
    path(
    "profile/email/request/",
    EmailChangeRequestView.as_view(),
    name="profile-email-request",
    ),
    path(
        "profile/email/confirm/",
        EmailChangeConfirmView.as_view(),
        name="profile-email-confirm",
    ),
]
