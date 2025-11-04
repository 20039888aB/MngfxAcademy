from django.urls import path

from .views import social_exchange


urlpatterns = [
    path("social-exchange/", social_exchange, name="social-exchange"),
]

