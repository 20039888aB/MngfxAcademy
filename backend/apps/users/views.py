from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def social_exchange(request):
    """Exchange social provider tokens for Django JWT credentials."""

    provider = request.data.get("provider")
    access_token = request.data.get("access_token")
    profile = request.data.get("profile") or {}

    email = profile.get("email") or ""
    name = profile.get("name") or ""

    if not provider or not access_token:
        return Response({"error": "provider and access_token required"}, status=400)

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

    refresh = RefreshToken.for_user(user)

    # TODO: validate provider access_token against provider APIs for production use.
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.first_name or user.username,
                "provider": provider,
            },
        }
    )

