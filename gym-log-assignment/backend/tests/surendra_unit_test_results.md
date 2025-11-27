Command Used:
python -m pytest tests/test_meal_serializer.py -vv

========================================== test session starts ==========================================
                                                                                  

tests/test_meal_serializer.py::test_meal_serializer_valid_data PASSED                              [ 33%]
tests/test_meal_serializer.py::test_meal_serializer_missing_required_field PASSED                  [ 66%] 
tests/test_meal_serializer.py::test_meal_serializer_representation PASSED                          [100%] 

===================================== 3 passed, 1 warning in 0.74s ====================================== 




Command Used:
python -m pytest tests/test_models.py -vv 

========================================== test session starts ==========================================
                                                                                    

tests/test_models.py::test_water_intake_save_updates_total_ml PASSED                               [ 33%]
tests/test_models.py::test_meal_str_representation PASSED                                          [ 66%] 
tests/test_models.py::test_meal_target_str_representation PASSED                                   [100%] 

===================================== 3 passed, 1 warning in 0.66s ====================================== 



Command Used:
npm test -- src/components/MealLogging/WaterTracker.test.jsx

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.155 s