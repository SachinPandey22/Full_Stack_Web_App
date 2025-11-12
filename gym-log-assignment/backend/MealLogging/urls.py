from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MealViewSet,
    MealTargetViewSet,
    WaterIntakeViewSet,
)


router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'meal-targets', MealTargetViewSet, basename='meal-target')
router.register(r'water', WaterIntakeViewSet, basename='water')


urlpatterns = [
    path('', include(router.urls)),
]
