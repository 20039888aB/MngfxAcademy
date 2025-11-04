from django.contrib import admin

from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "resource_type", "created_by", "created_at")
    list_filter = ("resource_type", "created_at")
    search_fields = ("title", "description", "created_by__email")

