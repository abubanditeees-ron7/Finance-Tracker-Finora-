from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    EmailOrUsernameTokenSerializer,
    RegisterSerializer,
    VerifyEmailSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "message": (
                    "Registration successful. "
                    "Check your email for the verification code."
                ),
                "user_id": user.id,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Email verified successfully. You can now log in."},
            status=status.HTTP_200_OK,
        )


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailOrUsernameTokenSerializer
