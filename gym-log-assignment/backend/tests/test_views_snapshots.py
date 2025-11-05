# tests/test_views_snapshots.py
import pytest
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User
from users.models import Profile, NutritionSnapshot

SNAPSHOTS_URL = "/api/nutrition/snapshots/"

@pytest.fixture
@pytest.mark.django_db
def user_with_profile(db):
    """Creates a user with a complete Profile suitable for nutrition calculations."""
    user = User.objects.create_user(username="sachin@example.com", email="sachin@example.com", password="pass1234")
    Profile.objects.create(
        user=user,
        name="Sachin",
        sex="male",
        age=20,             
        height=175.0,       # cm
        weight=70.0,        # kg
        goal="maintain",
        activity_level="moderate",
    )
    return user

@pytest.fixture
def auth_client(user_with_profile):
    """APIClient with a valid Bearer access token in headers."""
    client = APIClient()
    refresh = RefreshToken.for_user(user_with_profile)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client

@pytest.mark.django_db
def test_snapshots_post_creates_or_updates_today(auth_client, user_with_profile):
    """POST upserts a single row for today (unique per user/date)."""
    today = timezone.now().date()

    # First POST -> create
    r1 = auth_client.post(SNAPSHOTS_URL)
    assert r1.status_code in (200, 201)
    assert NutritionSnapshot.objects.filter(user=user_with_profile, date=today).count() == 1
    snap1 = NutritionSnapshot.objects.get(user=user_with_profile, date=today)
    assert snap1.target_calories > 0
    assert snap1.protein_g >= 0 and snap1.fat_g >= 0 and snap1.carbs_g >= 0

    # Second POST same day -> update (no duplicate)
    r2 = auth_client.post(SNAPSHOTS_URL)
    assert r2.status_code in (200, 201)
    assert NutritionSnapshot.objects.filter(user=user_with_profile, date=today).count() == 1

@pytest.mark.django_db
def test_snapshots_get_returns_current_user_history(auth_client, user_with_profile):
    """GET returns only the authenticated user's snapshots (newest first)."""
    # Seed two snapshots via POST
    r1 = auth_client.post(SNAPSHOTS_URL); assert r1.status_code in (200, 201)
    # Simulate a second day by directly creating a row for 'yesterday'
    yesterday = timezone.now().date() - timezone.timedelta(days=1)
    NutritionSnapshot.objects.update_or_create(
        user=user_with_profile,
        date=yesterday,
        defaults=dict(bmr=1600, tdee=2300, target_calories=2100, protein_g=120, fat_g=60, carbs_g=240, meta={})
    )

    r = auth_client.get(SNAPSHOTS_URL)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    # Newest first (today first)
    assert data[0]["date"] >= data[1]["date"]

@pytest.mark.django_db
def test_snapshots_post_requires_complete_profile(db):
    """If profile is incomplete, POST returns 400 with missing_fields."""
    user = User.objects.create_user(username="incomplete@example.com", email="incomplete@example.com", password="pass1234")
    # Missing weight, for example
    Profile.objects.create(
        user=user,
        name="Incomplete",
        sex="male",
        age=20,
        height=175.0,
        weight=None,                 # <--- intentionally missing
        goal="maintain",
        activity_level="moderate",
    )

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")

    r = client.post(SNAPSHOTS_URL)
    assert r.status_code == 400
    detail = r.json()
    assert "missing_fields" in detail
    assert "weight" in detail["missing_fields"]
