import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = [host for host in os.getenv("ALLOWED_HOSTS", "*").split(",") if host]


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "channels",
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    # local apps
    "apps.courses",
    "apps.chatbot",
    "apps.marketdata",
    "apps.users",
]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "mngfx_backend.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]


WSGI_APPLICATION = "mngfx_backend.wsgi.application"
ASGI_APPLICATION = "mngfx_backend.asgi.application"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


CHANNEL_LAYER_BACKEND = os.getenv("CHANNEL_LAYER_BACKEND", "redis").lower()

if CHANNEL_LAYER_BACKEND == "inmemory":
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }
else:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [
                    (
                        os.getenv("REDIS_HOST", "127.0.0.1"),
                        int(os.getenv("REDIS_PORT", "6379")),
                    )
                ],
            },
        }
    }


AUTH_PASSWORD_VALIDATORS = []


LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}


CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    origin
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin
]
CORS_ALLOW_CREDENTIALS = True


CSRF_TRUSTED_ORIGINS = [
    origin
    for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin
]


SITE_ID = 1
ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_AUTHENTICATION_METHOD = "username_email"
ACCOUNT_EMAIL_REQUIRED = True


AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
}

