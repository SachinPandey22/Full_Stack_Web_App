from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile  #importing profile model

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
        if User.objects.filter(email=email).exists():
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
        fields = ["name", "sex", "height", "weight", "goal"]