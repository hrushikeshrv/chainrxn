from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """

    """
    username = models.CharField(unique=True, max_length=32)
    name = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
