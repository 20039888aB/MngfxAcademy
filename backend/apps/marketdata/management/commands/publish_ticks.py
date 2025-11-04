import random
import time

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Publish fake market ticks to the channel layer for testing"

    def handle(self, *args, **options):
        channel_layer = get_channel_layer()
        if channel_layer is None:
            self.stdout.write(self.style.ERROR("Channel layer is not configured."))
            return

        self.stdout.write("Starting fake tick publisher. Press Ctrl+C to stop.")
        try:
            while True:
                tick = {
                    "symbol": "EURUSD",
                    "bid": round(1.05 + random.random() * 0.01, 5),
                    "ask": round(1.05 + random.random() * 0.01 + 0.0001, 5),
                    "ts": int(time.time() * 1000),
                }
                async_to_sync(channel_layer.group_send)(
                    "market_broadcast",
                    {
                        "type": "market.tick",
                        "tick": tick,
                    },
                )
                time.sleep(0.5)
        except KeyboardInterrupt:
            self.stdout.write("Stopped tick publisher.")

