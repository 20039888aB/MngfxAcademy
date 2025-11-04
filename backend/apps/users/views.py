from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, ProgressSnapshot
from .serializers import ProfileSerializer, ProgressSnapshotSerializer

User = get_user_model()


def _issue_tokens_for_user(user, provider="credentials"):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "name": (user.first_name or user.username or user.email),
            "provider": provider,
        },
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password") or ""
    first_name = (request.data.get("first_name") or request.data.get("firstName") or "").strip()
    last_name = (request.data.get("last_name") or request.data.get("lastName") or "").strip()

    if not email or not password or not first_name or not last_name:
        return Response({"error": "first_name, last_name, email and password are required"}, status=400)

    if User.objects.filter(email__iexact=email).exists():
        return Response({"error": "An account with this email already exists."}, status=400)

    try:
        validate_password(password)
    except ValidationError as exc:
        return Response({"error": exc.messages[0] if exc.messages else "Password validation failed"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=password,
    )

    tokens = _issue_tokens_for_user(user)
    return Response(tokens, status=201)


@api_view(["POST"])
@permission_classes([AllowAny])
def credentials_login(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password") or ""

    if not email or not password:
        return Response({"error": "email and password required"}, status=400)

    user = authenticate(request, username=email, password=password)
    if not user:
        return Response({"error": "Invalid email or password"}, status=400)

    tokens = _issue_tokens_for_user(user)
    return Response(tokens)


@api_view(["POST"])
@permission_classes([AllowAny])
def social_exchange(request):
    """Exchange social provider tokens for Django JWT credentials."""

    provider = request.data.get("provider")
    access_token = request.data.get("access_token")
    profile = request.data.get("profile") or {}

    email = (profile.get("email") or "").strip().lower()
    name = (profile.get("name") or "").strip()

    if not provider:
        return Response({"error": "provider required"}, status=400)

    providers_requiring_token = {"google", "facebook"}
    if provider in providers_requiring_token and not access_token:
        return Response({"error": "access_token required for OAuth providers"}, status=400)

    if not email:
        return Response({"error": "email required"}, status=400)

    user, created = User.objects.get_or_create(
        username=email,
        defaults={
            "email": email,
            "first_name": name,
        },
    )

    if created:
        user.set_unusable_password()
        user.save(update_fields=["password"])
    else:
        update_fields = []
        if name and user.first_name != name:
            user.first_name = name
            update_fields.append("first_name")
        if update_fields:
            user.save(update_fields=update_fields)

    tokens = _issue_tokens_for_user(user, provider=provider)
    return Response(tokens)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self) -> Profile:
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class ProgressSnapshotView(generics.ListCreateAPIView):
    serializer_class = ProgressSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProgressSnapshot.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProgressSummaryView(generics.GenericAPIView):
    serializer_class = ProgressSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        latest = request.user.progress_snapshots.order_by("-created_at").first()
        history = request.user.progress_snapshots.order_by("-created_at")[:10]
        return Response(
            {
                "latest": ProgressSnapshotSerializer(latest).data if latest else None,
                "history": ProgressSnapshotSerializer(history, many=True).data,
            },
            status=status.HTTP_200_OK,
        )

