from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExerciseViewSet, UserWorkoutViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'my-workouts', UserWorkoutViewSet, basename='my-workouts')

urlpatterns = [
    path('', include(router.urls)),
]
