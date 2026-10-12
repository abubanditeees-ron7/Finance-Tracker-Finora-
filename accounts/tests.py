import re

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import override_settings
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import EmailVerificationCode, UserProfile


User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend"
)
class AuthenticationTests(APITestCase):
    def setUp(self):
        mail.outbox.clear()

        self.register_url = reverse("register")
        self.verify_url = reverse("verify-email")
        self.login_url = reverse("login")
        self.refresh_url = reverse("token-refresh")
        self.profile_url = reverse("profile")

        self.user_data = {
            "username": "finora_test_user",
            "email": "finora_test@example.com",
            "password": "TestPassword!4829",
            "password_confirm": "TestPassword!4829",
        }

    def register_user(self, user_data=None):
        data = user_data or self.user_data

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        return response

    def get_verification_code(self, email):
        user = User.objects.get(email=email)

        verification = (
            EmailVerificationCode.objects
            .filter(user=user, used=False)
            .latest("created_at")
        )

        message = mail.outbox[-1].body
        match = re.search(
            r"verification code is (\d{6})",
            message,
        )

        self.assertIsNotNone(match)
        self.assertEqual(
            verification.code_hash,
            EmailVerificationCode.hash_code(match.group(1)),
        )

        return match.group(1)

    def register_and_verify_user(self, user_data=None):
        data = user_data or self.user_data

        register_response = self.register_user(data)

        self.assertEqual(
            register_response.status_code,
            status.HTTP_201_CREATED,
        )

        code = self.get_verification_code(data["email"])

        verify_response = self.client.post(
            self.verify_url,
            {
                "email": data["email"],
                "code": code,
            },
            format="json",
        )

        self.assertEqual(
            verify_response.status_code,
            status.HTTP_200_OK,
        )

        return verify_response

    def authenticate_with_token(self, access_token):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

    def test_registration_creates_inactive_user_and_profile(self):
        response = self.register_user()

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        user = User.objects.get(
            email=self.user_data["email"]
        )

        self.assertFalse(user.is_active)
        self.assertTrue(
            UserProfile.objects.filter(user=user).exists()
        )
        self.assertEqual(len(mail.outbox), 1)

        self.assertTrue(
            EmailVerificationCode.objects.filter(
                user=user,
                used=False,
            ).exists()
        )

    def test_registration_rejects_password_mismatch(self):
        data = self.user_data.copy()
        data["password_confirm"] = "DifferentPassword!4829"

        response = self.register_user(data)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertFalse(
            User.objects.filter(
                email=data["email"]
            ).exists()
        )

    def test_registration_rejects_duplicate_username(self):
        User.objects.create_user(
            username=self.user_data["username"],
            email="existing@example.com",
            password="ExistingPassword!4829",
        )

        response = self.register_user()

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_email_verification_activates_user_and_returns_tokens(self):
        response = self.register_and_verify_user()

        user = User.objects.get(
            email=self.user_data["email"]
        )
        profile = UserProfile.objects.get(user=user)

        self.assertTrue(user.is_active)
        self.assertTrue(profile.email_verified)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        verification = EmailVerificationCode.objects.get(
            user=user
        )
        self.assertTrue(verification.used)

    
    def test_email_verification_rejects_wrong_code(self):
        self.register_user()

        actual_code = self.get_verification_code(
            self.user_data["email"]
        )
        wrong_code = (
            "000000" if actual_code != "000000" else "000001"
        )

        response = self.client.post(
            self.verify_url,
            {
                "email": self.user_data["email"],
                "code": wrong_code,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user = User.objects.get(
            email=self.user_data["email"]
        )
        self.assertFalse(user.is_active)


    def test_login_rejects_unverified_user(self):
        self.register_user()

        response = self.client.post(
            self.login_url,
            {
                "username": self.user_data["username"],
                "password": self.user_data["password"],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_login_accepts_email_after_verification(self):
        self.register_and_verify_user()

        response = self.client.post(
            self.login_url,
            {
                "username": self.user_data["email"],
                "password": self.user_data["password"],
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_token_returns_new_access_token(self):
        verify_response = self.register_and_verify_user()

        response = self.client.post(
            self.refresh_url,
            {"refresh": verify_response.data["refresh"]},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertIn("access", response.data)

    def test_profile_requires_authentication(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_profile_returns_current_user_data(self):
        verify_response = self.register_and_verify_user()
        self.authenticate_with_token(
            verify_response.data["access"]
        )

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data["username"],
            self.user_data["username"],
        )
        self.assertEqual(
            response.data["email"],
            self.user_data["email"],
        )
        self.assertEqual(response.data["language"], "en")
        self.assertTrue(response.data["email_verified"])

    def test_profile_language_can_be_changed(self):
        verify_response = self.register_and_verify_user()
        self.authenticate_with_token(
            verify_response.data["access"]
        )

        response = self.client.patch(
            self.profile_url,
            {"language": "ru"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(response.data["language"], "ru")

        user = User.objects.get(
            email=self.user_data["email"]
        )
        self.assertEqual(user.profile.language, "ru")

    def test_profile_rejects_unsupported_language(self):
        verify_response = self.register_and_verify_user()
        self.authenticate_with_token(
            verify_response.data["access"]
        )

        response = self.client.patch(
            self.profile_url,
            {"language": "de"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user = User.objects.get(
            email=self.user_data["email"]
        )
        self.assertEqual(user.profile.language, "en")
