
import os

import django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import apps.marketdata.routing as marketdata_routing


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mngfx_backend.settings")
django.setup()


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                marketdata_routing.websocket_urlpatterns,
            )
        ),
    }
)
