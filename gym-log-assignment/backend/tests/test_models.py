import pytest
from datetime import date, time
from django.contrib.auth import get_user_model
from MealLogging.models import Meal, MealTarget, WaterIntake

User = get_user_model()


@pytest.mark.django_db
def test_water_intake_save_updates_total_ml():
    user = User.objects.create(username="wateruser")
    water = WaterIntake.objects.create(
        user=user, date=date(2025, 1, 1), glasses=3, glass_size=500
    )
    # Should calculate total ml automatically: 3 * 500 = 1500
    assert water.total_ml == 1500


@pytest.mark.django_db
def test_meal_str_representation():
    user = User.objects.create(username="mealuser")
    meal = Meal.objects.create(
        user=user,
        meal_type="dinner",
        name="Biryani",
        calories=800,
        protein=40,
        carbs=90,
        fat=20,
        date=date(2025, 11, 26),
        time=time(18, 0),
    )

    assert str(meal) == "mealuser - Biryani (dinner)"


@pytest.mark.django_db
def test_meal_target_str_representation():
    user = User.objects.create(username="goaluser")
    target = MealTarget.objects.create(
        user=user,
        daily_calories=2000,
        daily_protein=150,
        daily_carbs=250,
        daily_fat=60,
    )

    assert str(target) == "goaluser's targets"
