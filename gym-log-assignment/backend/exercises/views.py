from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Exercise, UserWorkout
from .serializers import ExerciseSerializer, UserWorkoutSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed, created, updated, or deleted.
    Supports filtering by muscle_group and category.
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['muscle_group', 'category']


class UserWorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user's personal workout list.
    Requires authentication.
    """
    serializer_class = UserWorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserWorkout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

