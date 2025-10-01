from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date
from .models import Meal
from .serializers import MealSerializer, DaySummarySerializer

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Meal.objects.filter(user=self.request.user)
        date_param = self.request.query_params.get('date', None)
        if date_param:
            queryset = queryset.filter(date=date_param)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        meal = self.get_object()
        if meal.user != request.user:
            return Response(
                {"detail": "You don't have permission to edit this meal."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        meal = self.get_object()
        if meal.user != request.user:
            return Response(
                {"detail": "You don't have permission to delete this meal."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], url_path='summary')
    def day_summary(self, request):
        date_param = request.query_params.get('date')
        
        if not date_param:
            return Response(
                {"detail": "Date parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            summary_date = date.fromisoformat(date_param)
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        meals = Meal.objects.filter(user=request.user, date=summary_date)
        
        totals = meals.aggregate(
            calories=Sum('calories') or 0,
            protein=Sum('protein') or 0,
            carbs=Sum('carbs') or 0,
            fat=Sum('fat') or 0
        )
        
        targets = {
            'calories': getattr(request.user, 'target_calories', 2000),
            'protein': getattr(request.user, 'target_protein', 150),
            'carbs': getattr(request.user, 'target_carbs', 200),
            'fat': getattr(request.user, 'target_fat', 65),
        }
        
        remaining = {
            'calories': targets['calories'] - totals['calories'],
            'protein': targets['protein'] - totals['protein'],
            'carbs': targets['carbs'] - totals['carbs'],
            'fat': targets['fat'] - totals['fat'],
        }
        
        summary_data = {
            'date': summary_date,
            'meals': meals,
            'totals': totals,
            'targets': targets,
            'remaining': remaining,
        }
        
        serializer = DaySummarySerializer(summary_data)
        return Response(serializer.data)