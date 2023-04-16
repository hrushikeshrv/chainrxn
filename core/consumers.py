import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class GameLobbyConsumer(WebsocketConsumer):
    def connect(self):
        self.lobby_name = self.scope['url_route']['kwargs']['lobby_name']
        self.lobby_group_name = f'game_{self.lobby_name}'
        async_to_sync(self.channel_layer.group_add)(
            self.lobby_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.lobby_group_name, self.channel_name
        )

    def receive(self, text_data):
        # self.send(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.lobby_group_name, {"type": "message", "message": text_data}
        )

    def message(self, event):
        message = event["message"]
        self.send(text_data=message)
