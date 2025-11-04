from rest_framework import serializers

from .models import FeedbackMessage


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMessage
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "subject",
            "message",
            "rating",
            "handled",
            "created_at",
        ]
        read_only_fields = ["handled", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data.setdefault("user", request.user)
        return super().create(validated_data)

