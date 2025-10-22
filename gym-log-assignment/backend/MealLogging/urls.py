from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MealViewSet, 
    MealTargetViewSet,
    get_water_intake,
    update_water_intake,
    get_water_intake_range,
    delete_water_intake
)


router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'meal-targets', MealTargetViewSet, basename='meal-target')


urlpatterns = [
    path('', include(router.urls)),
    
    # Water intake endpoints
    path('water-intake/', get_water_intake, name='get_water_intake'),
    path('water-intake/update/', update_water_intake, name='update_water_intake'),
    path('water-intake/range/', get_water_intake_range, name='get_water_intake_range'),
    path('water-intake/delete/', delete_water_intake, name='delete_water_intake'),
]
