import pytest
from django.contrib.auth.models import User
from django.utils import timezone

from users.models import Profile, NutritionSnapshot


@pytest.mark.django_db
def test_profile_update_creates_snapshot_for_today():
    """
    When a user profile is complete (sex, height, weight, age, goal, activity_level)
    and is saved, the post_save signal should create a NutritionSnapshot for today.
    """
    user = User.objects.create_user(username="snap@test.com", password="testpass")

    # Depending on your setup, profile may be auto-created; get or create to be safe
    profile, _ = Profile.objects.get_or_create(user=user)

    profile.sex = "male"
    profile.height = 175
    profile.weight = 70
    profile.age = 25
    profile.goal = "maintain"
    profile.activity_level = "moderate"
    profile.save()  # <- should trigger the signal

    today = timezone.localdate()
    snaps = NutritionSnapshot.objects.filter(user=user, date=today)

    assert snaps.count() == 1
    snap = snaps.first()
    # Basic sanity checks: numbers should be positive
    assert snap.bmr > 0
    assert snap.tdee > 0
    assert snap.target_calories > 0
    assert snap.protein_g > 0
    assert snap.fat_g > 0
    assert snap.carbs_g >= 0


@pytest.mark.django_db
def test_incomplete_profile_does_not_create_snapshot():
    """
    If required fields are missing (e.g., no weight), the signal should not
    create a snapshot. This prevents invalid / partial data from being stored.
    """
    user = User.objects.create_user(username="incomplete@test.com", password="testpass")
    profile, _ = Profile.objects.get_or_create(user=user)

    profile.sex = "male"
    profile.height = 175
    profile.weight = None  # missing weight
    profile.age = 25
    profile.goal = "maintain"
    profile.activity_level = "moderate"
    profile.save()

    today = timezone.localdate()
    snaps = NutritionSnapshot.objects.filter(user=user, date=today)

    assert snaps.count() == 0
