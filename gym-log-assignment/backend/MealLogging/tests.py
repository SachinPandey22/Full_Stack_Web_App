import pytest
from datetime import date
from django.contrib.auth.models import User

from MealLogging.models import WaterIntake

# Tested by: Misan Parajuli
@pytest.mark.django_db
def test_water_intake_save_sets_and_updates_total_ml():
    """
    WaterIntake.save should automatically compute total_ml from
    glasses * glass_size, both on create and on update.
    """
    user = User.objects.create_user(
        username="wateruser",
        email="water@example.com",
        password="StrongPass1",
    )

    # Create with 3 glasses of 400 ml
    intake = WaterIntake.objects.create(
        user=user,
        date=date(2024, 1, 1),
        glasses=3,
        glass_size=400,
    )
    assert intake.total_ml == 3 * 400  # 1200 ml

    # Update to 5 glasses and save again
    intake.glasses = 5
    intake.save()
    intake.refresh_from_db()

    assert intake.total_ml == 5 * 400  # 2000 ml

