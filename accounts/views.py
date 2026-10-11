from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    EmailOrUsernameTokenSerializer,
    RegisterSerializer,
    VerifyEmailSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

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
    serializer_class = VerifyEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Email verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailOrUsernameTokenSerializer
