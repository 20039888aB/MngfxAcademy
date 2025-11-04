from django.contrib import admin

from .models import Profile, ProgressSnapshot


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "nickname", "updated_at")
    search_fields = ("user__email", "nickname")


@admin.register(ProgressSnapshot)
class ProgressSnapshotAdmin(admin.ModelAdmin):
    list_display = ("user", "courses_completed", "lessons_completed", "quizzes_passed", "win_rate", "created_at")
    list_filter = ("created_at",)

