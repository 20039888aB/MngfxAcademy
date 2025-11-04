from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MarketConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.group_name = "market_broadcast"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.send_json({"type": "welcome", "message": "connected to market feed"})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "subscribe":
            symbol = content.get("symbol", "EURUSD")
            await self.send_json({"type": "subscribed", "symbol": symbol})
        else:
            await self.send_json({"type": "error", "message": "unknown action"})

    async def market_tick(self, event):
        await self.send_json({"type": "tick", "tick": event["tick"]})

