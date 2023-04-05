from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<lobby_name>\w+)/$', consumers.GameLobbyConsumer.as_asgi()),
]
