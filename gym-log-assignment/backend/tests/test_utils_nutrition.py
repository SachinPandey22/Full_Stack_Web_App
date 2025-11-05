# tests/test_utils_nutrition.py
import math
import pytest
from users.utils import compute_targets

@pytest.mark.django_db
def test_compute_targets_basics():
    """
    Unit test for the pure calculation utility.
    Asserts presence and basic sanity of BMR/TDEE/target/macros + assumptions.
    """
    t = compute_targets(
        sex="male",
        weight_kg=70,      # 154 lb
        height_cm=175,     # 5'9"
        age_years=25,
        activity_level="moderate",
        goal="maintain",
    )

    # Required top-level fields exist and are positive
    assert t.bmr > 1200 and t.bmr < 2200
    assert t.tdee > t.bmr
    assert t.target_calories > 0

    # Macro grams are non-negative and total energy ~ target (allow rounding wiggle)
    kcal_from_macros = t.protein_g * 4 + t.fat_g * 9 + t.carbs_g * 4
    assert abs(kcal_from_macros - t.target_calories) <= 50  # rounding tolerance