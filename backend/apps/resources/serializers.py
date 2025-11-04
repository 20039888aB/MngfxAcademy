from rest_framework import serializers

from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.first_name", read_only=True)

    class Meta:
        model = Resource
        fields = [
            "id",
            "title",
            "description",
            "resource_type",
            "file",
            "video_url",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at", "created_by_name"]

    def validate(self, attrs):
        resource_type = attrs.get("resource_type", getattr(self.instance, "resource_type", None))
        file = attrs.get("file", getattr(self.instance, "file", None))
        video_url = attrs.get("video_url", getattr(self.instance, "video_url", None))

        if resource_type == Resource.DOCUMENT and not file:
            raise serializers.ValidationError("Document resources must include an uploaded file.")
        if resource_type == Resource.VIDEO and not video_url:
            raise serializers.ValidationError("Video resources require a video URL.")
        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        if request and not validated_data.get("created_by"):
            validated_data["created_by"] = request.user
        return super().create(validated_data)

