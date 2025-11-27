import pytest
from datetime import date, time
from django.contrib.auth import get_user_model
from MealLogging.models import Meal
from MealLogging.serializers import MealSerializer

User = get_user_model()


@pytest.mark.django_db
def test_meal_serializer_valid_data():
    user = User.objects.create(username="testuser", password="password123")

    meal_data = {
        "meal_type": "lunch",
        "name": "Chicken Rice",
        "calories": 550,
        "protein": 40,
        "carbs": 65,
        "fat": 15,
        "date": date(2025, 11, 26),
        "time": time(12, 30),
    }

    serializer = MealSerializer(data=meal_data)
    assert serializer.is_valid(), serializer.errors

    meal = serializer.save(user=user)  # pass manually because serializer doesn't handle FK

    assert meal.name == "Chicken Rice"
    assert meal.meal_type == "lunch"
    assert meal.calories == 550
    assert meal.user == user


@pytest.mark.django_db
def test_meal_serializer_missing_required_field():
    user = User.objects.create(username="testuser", password="password123")

    meal_data = {
        "meal_type": "dinner",
        # "name" missing on purpose
        "calories": 400,
        "protein": 30,
        "carbs": 50,
        "fat": 10,
        "date": date(2025, 11, 26),
        "time": time(8, 45),
    }

    serializer = MealSerializer(data=meal_data)
    assert not serializer.is_valid()
    assert "name" in serializer.errors


@pytest.mark.django_db
def test_meal_serializer_representation():
    user = User.objects.create(username="john", password="pass")

    meal = Meal.objects.create(
        user=user,
        meal_type="breakfast",
        name="Protein Shake",
        calories=300,
        protein=25,
        carbs=15,
        fat=5,
        date=date(2025, 11, 26),
        time=time(14, 0),
    )

    serialized = MealSerializer(meal)
    data = serialized.data

    assert data["name"] == "Protein Shake"
    assert data["meal_type"] == "breakfast"
    assert data["calories"] == 300
    assert "user" not in data  # because serializer does not return it
