from django.db.models import Sum
from .models import Meal, MealTarget

class MealCalculatorService:
    
    @staticmethod
    def calculate_daily_totals(user, target_date):
        meals = Meal.objects.filter(user=user, date=target_date)
        totals = meals.aggregate(
            calories=Sum('calories'),
            protein=Sum('protein'),
            carbs=Sum('carbs'),
            fat=Sum('fat')
        )
        return {
            'calories': totals.get('calories') or 0,
            'protein': totals.get('protein') or 0,
            'carbs': totals.get('carbs') or 0,
            'fat': totals.get('fat') or 0,
        }
    
    @staticmethod
    def get_user_targets(user):
        try:
            targets = MealTarget.objects.get(user=user)
            return {
                'calories': targets.daily_calories,
                'protein': targets.daily_protein,
                'carbs': targets.daily_carbs,
                'fat': targets.daily_fat,
            }
        except MealTarget.DoesNotExist:
            return {
                'calories': 2200,
                'protein': 165,
                'carbs': 220,
                'fat': 73,
            }
    
    @staticmethod
    def calculate_remaining_macros(totals, targets):
        return {
            'calories': targets['calories'] - totals['calories'],
            'protein': targets['protein'] - totals['protein'],
            'carbs': targets['carbs'] - totals['carbs'],
            'fat': targets['fat'] - totals['fat'],
        }
    
    @staticmethod
    def get_day_summary(user, target_date):
        totals = MealCalculatorService.calculate_daily_totals(user, target_date)
        targets = MealCalculatorService.get_user_targets(user)
        remaining = MealCalculatorService.calculate_remaining_macros(totals, targets)
        
        return {
            'totals': totals,
            'targets': targets,
            'remaining': remaining,
        }