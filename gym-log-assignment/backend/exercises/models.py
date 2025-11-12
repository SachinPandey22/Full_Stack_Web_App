from django.db import models
from django.contrib.auth.models import User

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
        help_text="Workout duration in minutes"
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
    
    def calculate_calories_advanced(self):
        """
        Advanced calorie calculation using BMR formula
        Uses Harris-Benedict equation with age, sex, weight, height
        More accurate and personalized
        """
        if not self.duration_minutes:
            return None
        
        try:
            profile = self.user.profile
            
            # Check if we have complete profile data
            if not all([profile.weight, profile.age, profile.sex, profile.height]):
                # Fallback to simple calculation if data missing
                return self.calculate_calories()
            
            # Calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
            if profile.sex.lower() == 'male':
                # Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
                bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
            else:  # female
                # Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
                bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161
            
            # Calculate calories using MET and BMR
            # Formula: (MET × BMR / 24) × duration(hours)
            met_value = self.exercise.met_value
            duration_hours = self.duration_minutes / 60
            
            calories_per_hour = (met_value * bmr) / 24
            calories = calories_per_hour * duration_hours
            
            return round(calories, 1)
            
        except Exception as e:
            print(f"Error in advanced calculation: {e}, using simple method")
            # Fallback to simple calculation
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