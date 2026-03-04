from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExerciseViewSet, UserWorkoutViewSet, workout_stats

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'my-workouts', UserWorkoutViewSet, basename='my-workouts')

urlpatterns = [
    path('', include(router.urls)),
    path('workout-stats/', workout_stats, name='workout-stats'),
]
