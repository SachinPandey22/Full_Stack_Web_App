from dataclasses import dataclass

_ACTIVITY_MULTIPLIER = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "very": 1.725,
    "extra": 1.9,
}

_GOAL_ADJUSTMENT = {
    "lose": -0.20,       # ~0.5 kg/week
    "maintain": 0.0,
    "gain": +0.10,       # lean bulk
}

@dataclass
class Targets:
    bmr: int
    tdee: int
    target_calories: int
    protein_g: int
    fat_g: int
    carbs_g: int
    meta: dict

def _mifflin_st_jeor(sex: str, weight_kg: float, height_cm: float, age_years: int) -> float:
    # Mifflin-St Jeor BMR
    if sex == "male":
        return 10 * weight_kg + 6.25 * height_cm - 5 * age_years + 5
    elif sex == "female":
        return 10 * weight_kg + 6.25 * height_cm - 5 * age_years - 161
    else:
        # If "other", neutral baseline (average of +5 and -161 ≈ -78)
        return 10 * weight_kg + 6.25 * height_cm - 5 * age_years - 78

def compute_targets(
    *,
    sex: str,
    weight_kg: float,
    height_cm: float,
    age_years: int,
    activity_level: str,
    goal: str,
    protein_g_per_kg: float = 1.8,
    fat_percent: float = 0.25
) -> Targets:
    bmr = _mifflin_st_jeor(sex, weight_kg, height_cm, age_years)
    mult = _ACTIVITY_MULTIPLIER.get(activity_level or "", 1.2)
    tdee = bmr * mult
    adj = _GOAL_ADJUSTMENT.get(goal or "maintain", 0.0)
    target = tdee * (1.0 + adj)

    protein_g = weight_kg * protein_g_per_kg
    fat_kcal = target * fat_percent
    fat_g = fat_kcal / 9.0
    protein_kcal = protein_g * 4.0
    carbs_kcal = max(0.0, target - protein_kcal - fat_kcal)
    carbs_g = carbs_kcal / 4.0

    return Targets(
        bmr=round(bmr),
        tdee=round(tdee),
        target_calories=round(target),
        protein_g=round(protein_g),
        fat_g=round(fat_g),
        carbs_g=round(carbs_g),
        meta={
            "activity_multiplier": mult,
            "protein_g_per_kg": protein_g_per_kg,
            "fat_percent": fat_percent,
            "goal_adjustment": adj,
        }
    )
