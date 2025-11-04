from django.urls import path

from .views import credentials_login, register, social_exchange


urlpatterns = [
    path("register/", register, name="register"),
    path("login/", credentials_login, name="credentials-login"),
    path("social-exchange/", social_exchange, name="social-exchange"),
]

