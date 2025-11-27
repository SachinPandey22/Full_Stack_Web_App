# Unit Test Execution & Results – Misan Parajuli

## Test Files

The following backend test files were executed:

- `backend/MealLogging/tests.py`
  - `test_water_intake_save_sets_and_updates_total_ml`
- `backend/notifications/tests.py`
  - `test_welcome_notification_created_for_new_user`
  - `test_workout_completion_creates_notification`

## How I Ran the Tests

From the backend project root:

```bash
pytest MealLogging/tests.py notifications/tests.py \
  --html=tests/reports/misan_all_tests.html \
  --self-contained-html
```
