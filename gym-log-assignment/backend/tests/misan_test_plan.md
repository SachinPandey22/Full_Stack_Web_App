# Unit Test Plan – Misan Parajuli

## Location of Tests

My unit tests are in:

- `backend/MealLogging/tests.py`
- `backend/notifications/tests.py`

## Features and Code Under Test

### 1. WaterIntake `save()` Logic (Model Behavior)

**File:** `backend/MealLogging/tests.py`  
**Production code touched:**

- `MealLogging.models.WaterIntake`
- Custom `save()` implementation that computes `total_ml`

**Tests:**

1. `test_water_intake_save_sets_and_updates_total_ml`
   - Creates a `User` and an initial `WaterIntake` with:
     - `date`
     - `glasses`
     - `glass_size`
   - On **create**:
     - Calls `WaterIntake.objects.create(...)`.
     - Asserts `total_ml == glasses * glass_size` (e.g. `3 * 400 = 1200`).
   - On **update**:
     - Changes `glasses` (e.g. from `3` to `5`).
     - Calls `intake.save()` and then `intake.refresh_from_db()`.
     - Asserts `total_ml` is recomputed correctly (e.g. `5 * 400 = 2000`).
   - Validates that the model’s `save()` method always keeps `total_ml`
     consistent with `glasses` and `glass_size` on both create and update.

---

### 2. Welcome Notification on New User (Models + Signals)

**File:** `backend/notifications/tests.py`  
**Production code touched:**

- `notifications.models.Notification`
- Custom `User` model from `django.contrib.auth.get_user_model()`
- Post-save signal that creates a welcome notification for new users

**Tests:**

2. `test_welcome_notification_created_for_new_user`
   - Creates a new user with:
     - `username`
     - `email`
     - `password`
   - Relies on the **post_save** signal to create a `Notification`.
   - Queries `Notification.objects.filter(user=user)`.
   - Asserts:
     - Exactly **one** `Notification` exists for that user.
     - The notification `message` equals the expected welcome text
       (e.g. `"Welcome to Shaktiman! 🎉"`).
     - `is_read` is initially `False`.
   - Ensures every newly registered user automatically receives
     a correctly populated, unread welcome notification.

---

### 3. Workout Completion Notification (Models + Signals)

**File:** `backend/notifications/tests.py`  
**Production code touched:**

- `notifications.models.Notification`
- `exercises.models.Exercise`
- `exercises.models.UserWorkout`
- Signal logic that creates a notification when a workout is completed

**Tests:**

3. `test_workout_completion_creates_notification`
   - Creates:
     - A `User`
     - An `Exercise` (e.g. `"Bench Press"`)
     - A `UserWorkout` for that user and exercise that is **not completed** yet.
   - Simulates completion by:
     - Setting `workout.completed_date = timezone.now()`.
     - Calling `workout.save()` to trigger the completion signal.
   - Fetches notification messages for that user with:
     - `Notification.objects.filter(user=user).values_list("message", flat=True)`.
   - Asserts:
     - At least one message contains a congratulatory text
       (e.g. starts with `"Bravo!"`) and includes the exercise name.
   - Verifies that changing a workout from incomplete to completed
     automatically generates a meaningful completion notification
     for the correct user and exercise.
