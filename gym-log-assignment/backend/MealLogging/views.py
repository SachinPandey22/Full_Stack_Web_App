from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date, datetime
from .models import Meal, MealTarget, WaterIntake
from .serializers import (
    MealSerializer, 
    MealTargetSerializer,
    WaterIntakeSerializer,
    WaterIntakeCreateUpdateSerializer
)
from .services import MealCalculatorService


class MealViewSet(viewsets.ModelViewSet):
    """
    API endpoints for meal CRUD operations
    """
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only meals belonging to the authenticated user"""
        return Meal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Automatically set the user when creating a meal"""
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """Update meal - enforce ownership"""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {'error': 'You do not have permission to edit this meal'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Delete meal - enforce ownership"""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {'error': 'You do not have permission to delete this meal'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def day_summary(self, request):
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            target_date = date.today()
        
        meals = Meal.objects.filter(user=request.user, date=target_date)
        summary = MealCalculatorService.get_day_summary(request.user, target_date)
        
        return Response({
            'date': target_date,
            'meals': MealSerializer(meals, many=True).data,
            'totals': summary['totals'],
            'targets': summary['targets'],
            'remaining': summary['remaining'],
        })


class MealTargetViewSet(viewsets.ModelViewSet):
    """
    API endpoints for meal targets (goals)
    """
    serializer_class = MealTargetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only targets belonging to the authenticated user"""
        return MealTarget.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Create or update user's targets
        POST /api/meal-targets/
        """
        try:
            target = MealTarget.objects.get(user=request.user)
            # Update existing
            serializer = self.get_serializer(target, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except MealTarget.DoesNotExist:
            # Create new
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_targets(self, request):
        """
        GET /api/meal-targets/my_targets/
        Returns current user's targets
        """
        try:
            target = MealTarget.objects.get(user=request.user)
            serializer = self.get_serializer(target)
            return Response(serializer.data)
        except MealTarget.DoesNotExist:
            return Response(
                {'error': 'No targets set. Please create targets first.'},
                status=status.HTTP_404_NOT_FOUND
            )


# Water Intake Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_water_intake(request):
    """
    GET /api/water-intake/?date=YYYY-MM-DD
    Get water intake for a specific date (defaults to today)
    """
    date_str = request.query_params.get('date')
    
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        target_date = date.today()
    
    try:
        water_intake = WaterIntake.objects.get(user=request.user, date=target_date)
        serializer = WaterIntakeSerializer(water_intake)
        return Response(serializer.data)
    except WaterIntake.DoesNotExist:
        return Response(
            {
                'date': target_date,
                'glasses': 0,
                'total_ml': 0,
                'glass_size': 500,
                'message': 'No water intake recorded for this date'
            },
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_water_intake(request):
    """
    POST /api/water-intake/update/
    Create or update water intake for a specific date
    Body: { "date": "YYYY-MM-DD", "glasses": 5 }
    """
    serializer = WaterIntakeCreateUpdateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    target_date = serializer.validated_data['date']
    glasses = serializer.validated_data['glasses']
    
    water_intake, created = WaterIntake.objects.update_or_create(
        user=request.user,
        date=target_date,
        defaults={'glasses': glasses}
    )
    
    response_serializer = WaterIntakeSerializer(water_intake)
    
    if created:
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_water_intake_range(request):
    """
    GET /api/water-intake/range/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    Get water intake for a date range
    """
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    
    if not start_date_str or not end_date_str:
        return Response(
            {'error': 'Both start_date and end_date are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if start_date > end_date:
        return Response(
            {'error': 'start_date must be before or equal to end_date'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    water_intakes = WaterIntake.objects.filter(
        user=request.user,
        date__gte=start_date,
        date__lte=end_date
    ).order_by('-date')
    
    serializer = WaterIntakeSerializer(water_intakes, many=True)
    
    # Calculate total for the range
    total_glasses = water_intakes.aggregate(Sum('glasses'))['glasses__sum'] or 0
    total_ml = water_intakes.aggregate(Sum('total_ml'))['total_ml__sum'] or 0
    
    return Response({
        'start_date': start_date,
        'end_date': end_date,
        'entries': serializer.data,
        'summary': {
            'total_glasses': total_glasses,
            'total_ml': total_ml,
            'days_tracked': water_intakes.count()
        }
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_water_intake(request):
    """
    DELETE /api/water-intake/delete/?date=YYYY-MM-DD
    Delete water intake for a specific date
    """
    date_str = request.query_params.get('date')
    
    if not date_str:
        return Response(
            {'error': 'date parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        water_intake = WaterIntake.objects.get(user=request.user, date=target_date)
        water_intake.delete()
        return Response(
            {'message': f'Water intake for {target_date} deleted successfully'},
            status=status.HTTP_200_OK
        )
    except WaterIntake.DoesNotExist:
        return Response(
            {'error': 'No water intake found for this date'},
            status=status.HTTP_404_NOT_FOUND
        )
