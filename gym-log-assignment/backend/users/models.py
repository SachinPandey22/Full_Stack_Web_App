from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100, blank=True, default='')
    sex = models.CharField(
        max_length=10, 
        choices=[("male","Male"), ("female","Female"), ("other","Other")],
        blank=True,
        default=''
    )
    height = models.FloatField(null=True, blank=True)  # Allow NULL
    weight = models.FloatField(null=True, blank=True)  # Allow NULL
    goal = models.CharField(
        max_length=10, 
        choices=[("lose","Lose"), ("gain","Gain"), ("maintain","Maintain")],
        blank=True,
        default=''
    )

    def __str__(self):
        return f"{self.user.username}'s profile"