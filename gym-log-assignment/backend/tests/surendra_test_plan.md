# Unit Test Plan – Surendra Bikram Khatri

## Location of Tests

My unit tests are located in:

- backend/tests/test_meal_serializer.py
- backend/tests/test_models.py
- frontend/src/components/MealLogging/WaterTracker.test.jsx

## Features and Code Under Test

### 1. Meal Serializer Validation (Django REST Framework)

File: backend/tests/test_meal_serializer.py  
Production code touched:
- MealLogging.serializers.MealSerializer
- MealLogging.models.Meal

Tests:

1. test_meal_serializer_valid_data  
   - Creates a User and valid meal data and initializes the serializer with that data.
   - Calls `serializer.save(user=user)` to manually pass the foreign key.
   - Asserts that:
     - `serializer.is_valid()` returns True
     - The created Meal instance has correct field values.
   - Uses required model fields and verifies saved object values.

2. test_meal_serializer_missing_required_field  
   - Creates a User and initializes serializer with missing `name`.
   - Calls `serializer.is_valid()`.
   - Asserts:
     - Validation fails
     - `'name'` appears in serializer.errors
   - Validates input field rules.

### 2. Model Logic (WaterIntake and Meal string representation)

File: backend/tests/test_models.py  
Production code touched:
- MealLogging.models.WaterIntake
- MealLogging.models.Meal
- MealLogging.models.MealTarget

Tests:

3. test_water_intake_save_updates_total_ml  
   - Creates a WaterIntake with `glasses=3` and `glass_size=500`.
   - Saves the object, triggering the overridden `save()` logic.
   - Asserts that `total_ml == 1500`.
   - Uses model persistence and computed field behavior.

4. test_meal_str_representation and test_meal_target_str_representation  
   - Creates a `Meal` and `MealTarget` instance with valid fields.
   - Asserts that `str(instance)` matches the expected string pattern based on username.
   - Confirms correct string formatting logic in model layer.

### 3. React Component UI Logic (WaterTracker)

File: frontend/src/components/MealLogging/WaterTracker.test.jsx  
Production code touched:
- WaterTracker component
- Button interaction logic

Tests:

5. renders total ml correctly  
   - Renders component with props `glasses=2` and `glassSize=500`.
   - Asserts that the component displays `1000 ml` based on internal computation.

6. calls onAdd when Add button clicked  
   - Mocks `onAdd` callback and renders WaterTracker.
   - Simulates clicking the Add button using `fireEvent.click()`.
   - Asserts that `onAdd` was called exactly once.

## Summary

These unit tests cover both frontend and backend elements of the project, testing serializer data validation, model behavior and computed values, and React UI logic. They each use real fields and verify returned objects or values. All tests run successfully using:
- pytest and pytest-django for backend
- React Testing Library + Jest for frontend
