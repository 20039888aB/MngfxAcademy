from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from rest_framework import serializers

from .models import Profile, ProgressSnapshot


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["email", "nickname", "bio", "avatar"]

    def _compress_avatar(self, avatar):
        max_size_bytes = 10 * 1024 * 1024
        if avatar.size <= max_size_bytes:
            return avatar

        image = Image.open(avatar)
        image_format = image.format or "JPEG"

        max_dimension = 1024
        image.thumbnail((max_dimension, max_dimension))

        buffer = BytesIO()
        save_kwargs = {"optimize": True}
        if image_format.upper() in {"JPEG", "JPG"}:
            save_kwargs["format"] = "JPEG"
            save_kwargs["quality"] = 85
        else:
            save_kwargs["format"] = image_format

        image.save(buffer, **save_kwargs)
        buffer.seek(0)

        compressed = InMemoryUploadedFile(
            buffer,
            field_name="avatar",
            name=avatar.name or "avatar.jpg",
            content_type=avatar.content_type or "image/jpeg",
            size=buffer.getbuffer().nbytes,
            charset=None,
        )
        return compressed

    def update(self, instance, validated_data):
        avatar = validated_data.get("avatar")
        if avatar:
            avatar = self._compress_avatar(avatar)
            validated_data["avatar"] = avatar
        return super().update(instance, validated_data)


class ProgressSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressSnapshot
        fields = [
            "id",
            "courses_completed",
            "lessons_completed",
            "quizzes_passed",
            "win_rate",
            "created_at",
        ]

