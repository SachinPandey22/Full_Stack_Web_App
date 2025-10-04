from django.db import models

class Exercise(models.Model):
    CATEGORY_CHOICES = [
        ("cardio", "Cardio"),
        ("strength", "Strength"),
        ("flexibility", "Flexibility"),
    ]

    MUSCLE_GROUP_CHOICES = [
        ("chest", "Chest"),
        ("back", "Back"),
        ("legs", "Legs"),
        ("arms", "Arms"),
        ("shoulders", "Shoulders"),
        ("core", "Core"),
    ]

    
    DIFFICULTY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    muscle_group = models.CharField(max_length=50, choices=MUSCLE_GROUP_CHOICES)
    description = models.TextField()
    equipment = models.CharField(max_length=100, blank=True, null=True)

    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default="beginner")
    
    image = models.CharField(max_length=500, blank=True, null=True)

    video = models.FileField(upload_to="exercise_videos/", blank=True, null=True)

    def __str__(self):
        return self.name