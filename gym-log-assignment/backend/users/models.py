from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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
    age = models.IntegerField(null=True, blank=True)

    goal = models.CharField(
        max_length=10, 
        choices=[("lose","Lose"), ("gain","Gain"), ("maintain","Maintain")],
        blank=True,
        default=''
    )
    activity_level = models.CharField(
        max_length=10,
        choices=[
            ("sedentary", "sedentary"),
            ("light", "light"),
            ("moderate", "moderate"),
            ("very", "very"),
            ("extra", "extra"),
        ],
        blank=True,   # keep optional so old rows don’t break
        null=True,
    )
    def __str__(self):
        return f"{self.user.username}'s profile"
    
class NutritionTargets(models.Model):
    """
    Stores the latest computed nutrition targets per user.
    Auto-updated by a post_save signal on Profile, and also refreshed on GET.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="nutrition_targets")
    bmr = models.PositiveIntegerField()
    tdee = models.PositiveIntegerField()
    target_calories = models.PositiveIntegerField()
    protein_g = models.PositiveIntegerField()
    fat_g = models.PositiveIntegerField()
    carbs_g = models.PositiveIntegerField()
    meta = models.JSONField(default=dict, blank=True)  # e.g. activity_multiplier, goal_adjustment, etc.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"NutritionTargets<{self.user_id}>"
    
class NutritionSnapshot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="nutrition_snapshots")
    date = models.DateField(default=timezone.localdate)  # Change made after PR, store as local date
    bmr = models.PositiveIntegerField()
    tdee = models.PositiveIntegerField()
    target_calories = models.PositiveIntegerField()
    protein_g = models.PositiveIntegerField()
    fat_g = models.PositiveIntegerField()
    carbs_g = models.PositiveIntegerField()
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("user", "date")
        ordering = ("-date",)

    def __str__(self):
        return f"Snapshot({self.user_id}, {self.date})"