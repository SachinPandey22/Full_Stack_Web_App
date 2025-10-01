from rest_framework import serializers
from .models import Meal

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'user', 'name', 'calories', 'protein', 'carbs', 'fat', 'date', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def validate_calories(self, value):
        if value < 0:
            raise serializers.ValidationError("Calories must be non-negative")
        return value
    
    def validate_protein(self, value):
        if value < 0:
            raise serializers.ValidationError("Protein must be non-negative")
        return value
    
    def validate_carbs(self, value):
        if value < 0:
            raise serializers.ValidationError("Carbs must be non-negative")
        return value
    
    def validate_fat(self, value):
        if value < 0:
            raise serializers.ValidationError("Fat must be non-negative")
        return value

class DayTotalsSerializer(serializers.Serializer):
    calories = serializers.IntegerField()
    protein = serializers.IntegerField()
    carbs = serializers.IntegerField()
    fat = serializers.IntegerField()

class DaySummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    meals = MealSerializer(many=True)
    totals = DayTotalsSerializer()
    targets = DayTotalsSerializer()
    remaining = DayTotalsSerializer()