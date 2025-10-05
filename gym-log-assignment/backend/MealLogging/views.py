from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date, datetime
from .models import Meal, MealTarget
from .serializers import MealSerializer, MealTargetSerializer

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
        """
        GET /api/meals/day_summary/?date=2025-10-05
        Returns: meals, totals, targets, remaining for a specific day
        """
        # Get date from query params, default to today
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
        
        # Get user's meals for the day
        meals = Meal.objects.filter(
            user=request.user,
            date=target_date
        )
        
        # Calculate totals
        totals = meals.aggregate(
            calories=Sum('calories'),
            protein=Sum('protein'),
            carbs=Sum('carbs'),
            fat=Sum('fat')
        )
        
        # Convert None to 0
        totals = {k: (v or 0) for k, v in totals.items()}
        
        # Get user targets
        try:
            targets = MealTarget.objects.get(user=request.user)
            targets_data = {
                'calories': targets.daily_calories,
                'protein': targets.daily_protein,
                'carbs': targets.daily_carbs,
                'fat': targets.daily_fat,
            }
        except MealTarget.DoesNotExist:
            # Default targets if not set
            targets_data = {
                'calories': 2200,
                'protein': 165,
                'carbs': 220,
                'fat': 73,
            }
        
        # Calculate remaining
        remaining = {
            'calories': targets_data['calories'] - totals['calories'],
            'protein': targets_data['protein'] - totals['protein'],
            'carbs': targets_data['carbs'] - totals['carbs'],
            'fat': targets_data['fat'] - totals['fat'],
        }
        
        return Response({
            'date': target_date,
            'meals': MealSerializer(meals, many=True).data,
            'totals': totals,
            'targets': targets_data,
            'remaining': remaining
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