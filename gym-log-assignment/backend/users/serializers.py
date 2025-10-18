from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile  #importing profile model
from django.db import transaction
from .models import NutritionSnapshot

class RegisterSerializer(serializers.ModelSerializer):
    # username will be email; enforce password min length
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password']  # keep it minimal

    def validate_email(self, value):
        email = (value or '').lower().strip()
        if not email:
            raise serializers.ValidationError('Email is required.')
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            # frontend expects a friendly duplicate error
            raise serializers.ValidationError('Email already in use.')
        return email

    def create(self, validated_data):
        email = validated_data['email'].lower().strip()
        user = User.objects.create_user(
            username=email,   # simple mapping: username = email
            email=email,
            password=validated_data['password'],
        )
        #  Creating an empty profile for this user right away
        Profile.objects.create(user=user)
        return user


class UserOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "sex", "height", "weight", "goal", "activity_level", "age"]
        extra_kwargs = {
            "sex": {"required": True, "allow_null": False},
            "height": {"required": True, "allow_null": False},
            "weight": {"required": True, "allow_null": False},
            "goal": {"required": True, "allow_null": False},
            "activity_level": {"required": True, "allow_null": False},
            "age": {"required": True, "allow_null": False},
            # name stays optional
        }

    def validate_height(self, value):
        if value <= 0:
            raise serializers.ValidationError("Height must be greater than 0.")
        return value

    def validate_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError("Weight must be greater than 0.")
        return value    

    def validate_age(self, value):
        if value <= 0 or value > 120:
            raise serializers.ValidationError("Age must be between 1 and 120.")
        return value
    
class NutritionSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionSnapshot
        fields = [
            "date", "bmr", "tdee", "target_calories",
            "protein_g", "fat_g", "carbs_g", "meta",
        ]
        read_only_fields = fields