from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.db import transaction

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    EmailVerificationCode,
    EmailChangeVerificationCode,
    UserProfile,
)

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })

        try:
            validate_password(attrs["password"])
        except DjangoValidationError as exc:
            raise serializers.ValidationError({
                "password": list(exc.messages)
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            is_active=False,
            **validated_data,
        )

        UserProfile.objects.create(user=user)

        verification, code = EmailVerificationCode.create_for_user(user)

        send_mail(
            subject="Confirm your email",
            message=(
                f"Your verification code is {code}. "
                "It expires in 10 minutes."
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r"^\d{6}$")

    def validate(self, attrs):
        email = attrs["email"].strip().lower()

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            raise serializers.ValidationError(
                {"email": "User or verification code not found."}
            )

        if user.is_active:
            raise serializers.ValidationError(
                {"email": "This email is already verified."}
            )

        verification = (
            EmailVerificationCode.objects
            .filter(user=user, used=False)
            .order_by("-created_at")
            .first()
        )

        if not verification:
            raise serializers.ValidationError(
                {"code": "No active verification code. Register again."}
            )

        verification.attempts += 1
        verification.save(update_fields=["attempts"])

        if not verification.is_valid(attrs["code"]):
            raise serializers.ValidationError(
                {"code": "Invalid, expired, or blocked code."}
            )

        attrs["user"] = user
        attrs["verification"] = verification
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        user = self.validated_data["user"]
        verification = self.validated_data["verification"]

        verification.used = True
        verification.save(update_fields=["used"])

        user.is_active = True
        user.save(update_fields=["is_active"])

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.email_verified = True
        profile.save(update_fields=["email_verified"])

        return user


class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    username_field = "username"

    def validate(self, attrs):
        identifier = attrs.get("username", "").strip()
        password = attrs.get("password", "")

        user = User.objects.filter(email__iexact=identifier).first()
        username = user.username if user else identifier

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password,
        )

        if not authenticated_user:
            raise serializers.ValidationError(
                "Invalid username/email or password."
            )

        if not authenticated_user.is_active:
            raise serializers.ValidationError(
                "Please verify your email before logging in."
            )

        data = super().validate({
            "username": authenticated_user.get_username(),
            "password": password,
        })
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        max_length=150,
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
            "language",
            "email_verified",
            "phone",
            "avatar",
        ]
        read_only_fields = [
            "email",
            "email_verified",
        ]

    def validate_username(self, value):
        value = value.strip()

        users = User.objects.filter(username__iexact=value)

        if self.instance:
            users = users.exclude(pk=self.instance.user_id)

        if users.exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        if not value:
            raise serializers.ValidationError(
                "Username cannot be empty."
            )

        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        username = user_data.get("username")

        if username is not None and username != instance.user.username:
            instance.user.username = username
            instance.user.save(update_fields=["username"])

        return super().update(instance, validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({
                "current_password": "Current password is incorrect."
            })

        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError({
                "new_password_confirm": "Passwords do not match."
            })

        if attrs["current_password"] == attrs["new_password"]:
            raise serializers.ValidationError({
                "new_password": (
                    "New password must differ from the current password."
                )
            })

        try:
            validate_password(attrs["new_password"], user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({
                "new_password": list(exc.messages)
            })

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class EmailChangeRequestSerializer(serializers.Serializer):
    new_email = serializers.EmailField()
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate_new_email(self, value):
        value = value.strip().lower()
        user = self.context["request"].user

        if value.casefold() == user.email.casefold():
            raise serializers.ValidationError(
                "This is already your current email."
            )

        if User.objects.filter(email__iexact=value).exclude(
            pk=user.pk
        ).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({
                "current_password": "Current password is incorrect."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        new_email = validated_data["new_email"]

        EmailChangeVerificationCode.objects.filter(
            user=user,
            used=False,
        ).update(used=True)

        verification, code = (
            EmailChangeVerificationCode.create_for_user(
                user,
                new_email,
            )
        )

        send_mail(
            subject="Confirm your new Finora email",
            message=(
                f"Your email change verification code is {code}. "
                "It expires in 10 minutes."
            ),
            from_email=None,
            recipient_list=[new_email],
            fail_silently=False,
        )

        return verification


class EmailChangeConfirmSerializer(serializers.Serializer):
    new_email = serializers.EmailField()
    code = serializers.RegexField(regex=r"^\d{6}$")

    def validate(self, attrs):
        user = self.context["request"].user
        new_email = attrs["new_email"].strip().lower()

        if User.objects.filter(email__iexact=new_email).exclude(
            pk=user.pk
        ).exists():
            raise serializers.ValidationError({
                "new_email": "An account with this email already exists."
            })

        verification = (
            EmailChangeVerificationCode.objects
            .filter(
                user=user,
                new_email__iexact=new_email,
                used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not verification:
            raise serializers.ValidationError({
                "code": "No active code found. Request a new code."
            })

        if verification.attempts >= 5:
            raise serializers.ValidationError({
                "code": "Too many attempts. Request a new code."
            })

        verification.attempts += 1
        verification.save(update_fields=["attempts"])

        if not verification.is_valid(attrs["code"]):
            raise serializers.ValidationError({
                "code": "Invalid or expired verification code."
            })

        attrs["new_email"] = new_email
        attrs["verification"] = verification
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        user = self.context["request"].user
        verification = self.validated_data["verification"]

        user.email = self.validated_data["new_email"]
        user.save(update_fields=["email"])

        verification.used = True
        verification.save(update_fields=["used"])

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.email_verified = True
        profile.save(update_fields=["email_verified"])

        return user
