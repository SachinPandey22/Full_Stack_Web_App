from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class MealTarget(models.Model):
    """User's daily nutrition goals"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='meal_target')
    daily_calories = models.IntegerField(validators=[MinValueValidator(0)])
    daily_protein = models.IntegerField(validators=[MinValueValidator(0)])
    daily_carbs = models.IntegerField(validators=[MinValueValidator(0)])
    daily_fat = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s targets"

class Meal(models.Model):
    """Individual meal entry"""
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snacks', 'Snacks'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    name = models.CharField(max_length=200)
    calories = models.IntegerField(validators=[MinValueValidator(0)])
    protein = models.IntegerField(validators=[MinValueValidator(0)])
    carbs = models.IntegerField(validators=[MinValueValidator(0)])
    fat = models.IntegerField(validators=[MinValueValidator(0)])
    date = models.DateField()
    time = models.TimeField()
    image = models.ImageField(upload_to="meal_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-time']
    
    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.meal_type})"

class WaterIntake(models.Model):
    """Daily water intake tracking"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_intakes')
    date = models.DateField(db_index=True)
    glasses = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    total_ml = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    glass_size = models.IntegerField(default=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'water_intake'
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def save(self, *args, **kwargs):
        self.total_ml = self.glasses * self.glass_size
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.glasses} glasses"
