from django.urls import path
from django.views.generic import TemplateView

from . import views

app_name = "core"


urlpatterns = [
    path("", TemplateView.as_view(template_name="core/homepage.html"), name='index'),
    path("local/", TemplateView.as_view(template_name="core/play_local.html"), name='play_local'),
]
