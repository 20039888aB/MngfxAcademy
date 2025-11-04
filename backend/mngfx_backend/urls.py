from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/courses/", include("apps.courses.urls")),
    path("api/chatbot/", include("apps.chatbot.urls")),
    path("api/auth/", include("apps.users.urls")),
    path("api/resources/", include("apps.resources.urls")),
    path("api/feedback/", include("apps.feedback.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

