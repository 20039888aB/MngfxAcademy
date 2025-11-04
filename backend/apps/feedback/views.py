from rest_framework import permissions, viewsets

from .models import FeedbackMessage
from .serializers import FeedbackSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackSerializer

    def get_permissions(self):  # pragma: no cover - simple branch
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.order_by("-created_at")


