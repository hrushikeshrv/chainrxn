from django.shortcuts import render
from django.views.generic import View


# Create your views here.
class PlayLiveView(View):
    def post(self, request):
        player_name = request.POST['player_name']
        lobby_name = request.POST['lobby_name']
        return render(request, "core/play_live.html", {
            "lobby_name": lobby_name,
            "player_name": player_name,
        })
