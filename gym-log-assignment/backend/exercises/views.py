from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count  
from datetime import timedelta  
from django.utils import timezone
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_stats(request):
    """Get workout statistics with filtering"""
    user = request.user
    filter_type = request.GET.get('filter', 'all')
    
    # Calculate date range
    now = timezone.now()
    if filter_type == 'week':
        start_date = now - timedelta(days=7)
    elif filter_type == 'month':
        start_date = now - timedelta(days=30)
    else:
        start_date = None
    
    # Get completed workouts
    workouts = UserWorkout.objects.filter(user=user, completed_date__isnull=False)
    if start_date:
        workouts = workouts.filter(completed_date__gte=start_date)
    
    # Calculate stats
    stats = workouts.aggregate(
        total_workouts=Count('id'),
        total_calories=Sum('calories_burned'),
        total_minutes=Sum('duration_minutes')
    )
    
    # Calculate streak
    all_workouts = UserWorkout.objects.filter(
        user=user, 
        completed_date__isnull=False
    ).order_by('-completed_date')
    
    workout_dates = set(w.completed_date.date() for w in all_workouts)
    sorted_dates = sorted(workout_dates, reverse=True)
    
    current_streak = 0
    if sorted_dates:
        today = timezone.now().date()
        check_date = today
        
        for date in sorted_dates:
            if date == check_date or date == check_date - timedelta(days=1):
                current_streak += 1
                check_date = date - timedelta(days=1)
            else:
                break
    
    return Response({
        'stats': {
            'total_workouts': stats['total_workouts'] or 0,
            'total_calories': round(stats['total_calories'] or 0, 1),
            'total_minutes': stats['total_minutes'] or 0,
        },
        'streak': {'current': current_streak},
        'filter': filter_type
    })