from django.urls import path

from .views import query_bot


urlpatterns = [
    path("query/", query_bot, name="chatbot-query"),
]

