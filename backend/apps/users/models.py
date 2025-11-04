import os
from pathlib import Path

from django.contrib.auth import get_user_model
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save


User = get_user_model()


def avatar_upload_path(instance: "Profile", filename: str) -> str:
    base = Path(filename).name
    return os.path.join("profiles", str(instance.user_id), base)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    nickname = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_path, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Profile for {self.user.email}"


class ProgressSnapshot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progress_snapshots")
    courses_completed = models.PositiveIntegerField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    quizzes_passed = models.PositiveIntegerField(default=0)
    win_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Progress for {self.user.email} @ {self.created_at:%Y-%m-%d}"


@receiver(post_save, sender=User)
def ensure_profile_exists(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, nickname=instance.first_name or instance.email.split("@")[0])

