# Unit Test Execution & Results – Sachin Pandey

## Test Files

- `backend/tests/test_nutrition_snapshots.py`
  - `test_profile_update_creates_snapshot_for_today`
  - `test_incomplete_profile_does_not_create_snapshot`

- `backend/tests/test_utils_nutrition.py`
  - `test_mifflin_st_jeor_male_female`
  - `test_compute_targets_goal_lose_vs_gain`

## Command Used

From the backend project root:

```bash
pytest tests/test_nutrition_snapshots.py backend/tests/test_utils_nutrition.py \
  --html=backend/tests/reports/sachin_unit_tests.html --self-contained-html