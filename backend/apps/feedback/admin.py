from django.contrib import admin

from .models import FeedbackMessage


@admin.register(FeedbackMessage)
class FeedbackMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "rating", "handled", "created_at")
    list_filter = ("handled", "rating", "created_at")
    search_fields = ("name", "email", "subject", "message")
    ordering = ("-created_at",)

