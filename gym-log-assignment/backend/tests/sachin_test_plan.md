# Unit Test Plan – Sachin Pandey

## Location of Tests

My unit tests are in:

- `backend/tests/test_nutrition_snapshots.py`
- `backend/tests/test_utils_nutrition.py`

## Features and Code Under Test

### 1. Profile → NutritionSnapshot Signal (Models + Signals)

**File:** `backend/tests/test_nutrition_snapshots.py`  
**Production code touched:**
- `users.models.Profile`
- `users.models.NutritionSnapshot`
- Post-save signal logic that creates snapshots when a Profile is updated.

**Tests:**

1. `test_profile_update_creates_snapshot_for_today`  
   - Creates a `User` and `Profile` with all required fields:
     - `sex`, `height`, `weight`, `age`, `goal`, `activity_level`
   - Calls `profile.save()`, which triggers the post-save signal.
   - Uses `timezone.localdate()` to query `NutritionSnapshot` for `user` and today’s `date`.
   - Asserts:
     - Exactly one snapshot exists for that user and date.
     - `bmr`, `tdee`, `target_calories`, `protein_g`, `fat_g`, `carbs_g` are all positive.
   - This test uses **model fields** and validates the **returned snapshot object**.

2. `test_incomplete_profile_does_not_create_snapshot`  
   - Creates a `User` and `Profile` but deliberately leaves a required field (`weight`) as `None`.
   - Calls `profile.save()`.
   - Asserts that **no** `NutritionSnapshot` exists for that user and today’s date.
   - This verifies that incomplete Profiles do **not** create invalid snapshot objects.

### 2. Nutrition Math Utilities (Pure Functions)

**File:** `backend/tests/test_utils_nutrition.py`  
**Production code touched:**
- `users.utils._mifflin_st_jeor`
- `users.utils.compute_targets`

**Tests:**

3. `test_mifflin_st_jeor_male_female`  
   - Calls `_mifflin_st_jeor(sex, weight, height, age)` for:
     - A male case
     - A female case  
   - Compares the returned BMR against manually computed values:
     - `10 * weight + 6.25 * height - 5 * age + 5` (male)
     - `10 * weight + 6.25 * height - 5 * age - 161` (female)
   - This uses **all input fields** and verifies the **numeric return value**.

4. `test_compute_targets_goal_lose_vs_gain`  
   - Calls `compute_targets(...)` with the same person and activity level but different goals:
     - `goal="lose"`
     - `goal="maintain"`
     - `goal="gain"`
   - Asserts that:
     - `lose.target_calories < maintain.target_calories < gain.target_calories`
   - This uses the returned `Targets` object and its fields:
     - `target_calories`, plus underlying BMR/TDEE logic.
