from django.urls import path

from .views import (
    ProfileView,
    ProgressSnapshotView,
    ProgressSummaryView,
    credentials_login,
    register,
    social_exchange,
)


urlpatterns = [
    path("register/", register, name="register"),
    path("login/", credentials_login, name="credentials-login"),
    path("social-exchange/", social_exchange, name="social-exchange"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("progress/", ProgressSnapshotView.as_view(), name="progress"),
    path("progress/summary/", ProgressSummaryView.as_view(), name="progress-summary"),
]

