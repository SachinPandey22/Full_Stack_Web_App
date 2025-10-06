from django.contrib import admin
from .models import Meal, MealTarget

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'meal_type', 'calories', 'date', 'time']
    list_filter = ['meal_type', 'date', 'user']
    search_fields = ['name', 'user__username']
    ordering = ['-date', '-time']

@admin.register(MealTarget)
class MealTargetAdmin(admin.ModelAdmin):
    list_display = ['user', 'daily_calories', 'daily_protein', 'daily_carbs', 'daily_fat']
    search_fields = ['user__username']