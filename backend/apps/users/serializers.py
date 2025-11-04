from rest_framework import serializers

from .models import Profile, ProgressSnapshot


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["email", "nickname", "bio", "avatar"]


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

