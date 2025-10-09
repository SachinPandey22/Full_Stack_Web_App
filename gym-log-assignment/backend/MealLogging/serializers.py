from rest_framework import serializers
from .models import Meal, MealTarget

class MealSerializer(serializers.ModelSerializer):
    """Serializer for Meal model"""
    
    class Meta:
        model = Meal
        fields = ['id', 'meal_type', 'name', 'calories', 'protein', 
                  'carbs', 'fat', 'date', 'time', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate that all nutrition values are non-negative"""
        nutrition_fields = ['calories', 'protein', 'carbs', 'fat']
        for field in nutrition_fields:
            value = data.get(field)
            if value is not None and value < 0:
                raise serializers.ValidationError({
                    field: f"{field.capitalize()} cannot be negative"
                })
        return data
    
    def validate_name(self, value):
        """Validate meal name is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Meal name is required")
        return value.strip()

class MealTargetSerializer(serializers.ModelSerializer):
    """Serializer for MealTarget model"""
    
    class Meta:
        model = MealTarget
        fields = ['id', 'daily_calories', 'daily_protein', 'daily_carbs', 
                  'daily_fat', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate that all target values are positive"""
        target_fields = ['daily_calories', 'daily_protein', 'daily_carbs', 'daily_fat']
        for field in target_fields:
            value = data.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError({
                    field: f"{field} must be greater than 0"
                })
        return data