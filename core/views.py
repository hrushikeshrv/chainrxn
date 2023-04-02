from django.shortcuts import render
from django.views.generic import View


# Create your views here.
class PlayLiveView(View):
    def post(self):
        player_name = self.request.POST['player_name']
        lobby_name = self.request.POST['lobby_name']
        return render(self.request, "core/play_live.html", {
            "lobby_name": lobby_name,
            "player_name": player_name,
        })
