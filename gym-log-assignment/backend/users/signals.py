# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile, NutritionTargets
from .utils import compute_targets

@receiver(post_save, sender=Profile)
def update_nutrition_targets_on_profile_save(sender, instance: Profile, **kwargs):
    """
    Recompute and persist targets whenever Profile changes (if complete).
    """
    p = instance

    # Your Profile uses 'age' (not 'age_years'); support both defensively.
    age_val = getattr(p, "age", None) or getattr(p, "age_years", None)

    required_ok = all([
        bool(p.sex),
        bool(p.height),
        bool(p.weight),
        bool(age_val),
        bool(p.activity_level),
        bool(p.goal),
    ])
    if not required_ok:
        # Skip silently on incomplete profile
        return

    t = compute_targets(
        sex=p.sex,
        height_cm=p.height,
        weight_kg=p.weight,
        age_years=age_val,
        activity_level=p.activity_level,
        goal=p.goal,
    )

    # t may be a dataclass/obj; access with getattr + dict fallback
    meta = getattr(t, "meta", None) or getattr(t, "assumptions", None) or {}
    NutritionTargets.objects.update_or_create(
        user=p.user,
        defaults=dict(
            bmr=round(getattr(t, "bmr", 0) or (t.get("bmr") if isinstance(t, dict) else 0)),
            tdee=round(getattr(t, "tdee", 0) or (t.get("tdee") if isinstance(t, dict) else 0)),
            target_calories=round(getattr(t, "target_calories", 0) or (t.get("target_calories") if isinstance(t, dict) else 0)),
            protein_g=round(getattr(t, "protein_g", 0) or (t.get("protein_g") if isinstance(t, dict) else 0)),
            fat_g=round(getattr(t, "fat_g", 0) or (t.get("fat_g") if isinstance(t, dict) else 0)),
            carbs_g=round(getattr(t, "carbs_g", 0) or (t.get("carbs_g") if isinstance(t, dict) else 0)),
            meta=meta or {},
        )
    )
