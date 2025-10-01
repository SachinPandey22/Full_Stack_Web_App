from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    name = models.CharField(max_length=200)
    calories = models.IntegerField(validators=[MinValueValidator(0)])
    protein = models.IntegerField(validators=[MinValueValidator(0)])
    carbs = models.IntegerField(validators=[MinValueValidator(0)])
    fat = models.IntegerField(validators=[MinValueValidator(0)])
    date = models.DateField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.date}"