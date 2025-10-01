from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100)
    sex = models.CharField(max_length=10, choices=[("male","Male"), ("female","Female"), ("other","Other")])
    height = models.FloatField()
    weight = models.FloatField()
    goal = models.CharField(max_length=10, choices=[("lose","Lose"), ("gain","Gain"), ("maintain","Maintain")])

    def __str__(self):
        return f"{self.user.username}'s profile"
