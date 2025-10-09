from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealViewSet, MealTargetViewSet

router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'meal-targets', MealTargetViewSet, basename='meal-target')

urlpatterns = [
    path('', include(router.urls)),
]