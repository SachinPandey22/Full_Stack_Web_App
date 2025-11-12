from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from .utils import calculate_simple_calories, calculate_advanced_calories

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
    steps = models.TextField(blank=True, null=True) 
    tips = models.TextField(blank=True, null=True)

    video = models.FileField(upload_to="exercise_videos/", blank=True, null=True)

    met_value = models.FloatField(
        default=5.0,
        help_text="Metabolic Equivalent of Task (MET) - energy expenditure rate"
    )

    def __str__(self):
        return self.name

class UserWorkout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    sets = models.IntegerField(default=3, blank=True, null=True)
    reps = models.IntegerField(default=10, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    completed_date = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.IntegerField(
        blank=True, 
        null=True,
        validators=[MinValueValidator(1, message="Duration must be at least 1 minute")],
        help_text="Workout duration in minutes (minimum 1 minute)"
    )
    calories_burned = models.FloatField(
        blank=True,
        null=True,
        help_text="Estimated calories burned (auto-calculated from profile)"
    )
    class Meta:
        unique_together = ('user', 'exercise')
        ordering = ['-added_date']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name}"
    
    @property
    def is_completed(self):
        """Check if workout is completed"""
        return self.completed_date is not None
    
    def calculate_calories(self):
    
        if not self.duration_minutes:
            return None
    
        try:
            if not hasattr(self.user, 'profile'):
                print("Warning: User has no profile")
                return None
        
            # Use utility function for calculation
            return calculate_simple_calories(
                    met_value=self.exercise.met_value,
                    weight_kg=self.user.profile.weight,
                    duration_minutes=self.duration_minutes
            )
        
        except Exception as e:
            print(f"Error in simple calculation: {e}")
            return None
    
    def calculate_calories_advanced(self):
    
        if not self.duration_minutes:
            return None
    
        try:
            if not hasattr(self.user, 'profile'):
                print("Warning: User has no profile")
                return None
        
            profile = self.user.profile
        
            # Check if we have complete profile data
            if not all([profile.weight, profile.age, profile.sex, profile.height]):
                # Fallback to simple calculation if data missing
                return self.calculate_calories()
        
                # Use utility function for calculation
            return calculate_advanced_calories(
                        met_value=self.exercise.met_value,
                        weight_kg=profile.weight,
                        height_cm=profile.height,
                        age=profile.age,
                        sex=profile.sex,
                        duration_minutes=self.duration_minutes
                )
        
        except Exception as e:
            print(f"Error in advanced calculation: {e}")
            return self.calculate_calories()

    
    def save(self, *args, **kwargs):
        """Auto-calculate calories before saving using advanced method"""
        if self.completed_date and self.duration_minutes:
            # Try advanced calculation first (uses age, sex, height, weight)
            # Falls back to simple calculation if data missing
            calculated = self.calculate_calories_advanced()
            if calculated:
                self.calories_burned = calculated
        
        super().save(*args, **kwargs)