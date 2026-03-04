# users/services.py
from django.utils import timezone
from .models import NutritionSnapshot, Profile
from .utils import compute_targets

def upsert_today_nutrition_snapshot(user):
    """
    Create/update today's NutritionSnapshot for this user.
    Idempotent: one row per (user, date).
    Returns the snapshot or None if profile is incomplete.
    """
    profile: Profile = getattr(user, "profile", None)
    if not profile:
        return None

    # require all nutrition-relevant fields
    required = [profile.sex, profile.age, profile.height, profile.weight, profile.activity_level, profile.goal]
    if any(v in (None, "",) for v in required):
        return None

    t = compute_targets(
        sex=profile.sex,
        weight_kg=profile.weight,
        height_cm=profile.height,
        age_years=profile.age,
        activity_level=profile.activity_level,
        goal=profile.goal,
    )

    today = timezone.localdate()
    snap, _created = NutritionSnapshot.objects.update_or_create(
        user=user, date=today,
        defaults=dict(
            bmr=t.bmr,
            tdee=t.tdee,
            target_calories=t.target_calories,
            protein_g=t.protein_g,
            fat_g=t.fat_g,
            carbs_g=t.carbs_g,
            meta=t.meta,
        )
    )
    return snap