from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Resource(models.Model):
    DOCUMENT = "document"
    VIDEO = "video"
    RESOURCE_TYPES = (
        (DOCUMENT, "Document"),
        (VIDEO, "Video"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    file = models.FileField(upload_to="resources/documents/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resources")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        if self.resource_type == self.DOCUMENT and not self.file:
            raise ValidationError("Document resources must include an uploaded file.")
        if self.resource_type == self.VIDEO and not self.video_url:
            raise ValidationError("Video resources require a video URL.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.get_resource_type_display()} • {self.title}"

