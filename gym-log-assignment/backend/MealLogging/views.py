from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from datetime import date, datetime, timedelta
from django.conf import settings
from django.core.cache import cache
import logging
import requests
from requests.exceptions import HTTPError, RequestException

from .models import Meal, MealTarget, WaterIntake
from .serializers import (
    MealSerializer,
    MealTargetSerializer,
    WaterIntakeSerializer,
)
from .services import MealCalculatorService


class MealViewSet(viewsets.ModelViewSet):
    """
    API endpoints for meal CRUD operations.
    """

    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return only meals belonging to the authenticated user.
        Supports optional ?date=YYYY-MM-DD filtering.
        """
        queryset = Meal.objects.filter(user=self.request.user).order_by('-date', '-time')
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError as exc:
                raise ValidationError({'date': 'Invalid date format. Use YYYY-MM-DD'}) from exc
            queryset = queryset.filter(date=selected_date)
        return queryset

    def perform_create(self, serializer):
        """Automatically set the user when creating a meal."""
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        """Update meal - enforce ownership."""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {'error': 'You do not have permission to edit this meal'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete meal - enforce ownership."""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {'error': 'You do not have permission to delete this meal'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def day_summary(self, request):
        """Return aggregated totals and remaining macros for a specific day."""
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST,
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

    @action(detail=False, methods=['get'], url_path='weekly')
    def weekly_summary(self, request):
        """
        Return aggregated totals for the trailing seven days ending on the requested date.
        """
        date_str = request.query_params.get('date')
        if date_str:
            try:
                end_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            end_date = date.today()

        start_date = end_date - timedelta(days=6)

        meals = Meal.objects.filter(
            user=request.user,
            date__range=(start_date, end_date),
        )

        aggregated = meals.values('date').annotate(
            calories=Sum('calories'),
            protein=Sum('protein'),
            carbs=Sum('carbs'),
            fat=Sum('fat'),
        )

        totals_by_date = {entry['date']: entry for entry in aggregated}

        week_data = []
        for offset in range(7):
            day = start_date + timedelta(days=offset)
            entry = totals_by_date.get(day)
            week_data.append({
                'date': day.isoformat(),
                'weekday': day.strftime('%a'),
                'calories': (entry.get('calories') if entry else 0) or 0,
                'protein': (entry.get('protein') if entry else 0) or 0,
                'carbs': (entry.get('carbs') if entry else 0) or 0,
                'fat': (entry.get('fat') if entry else 0) or 0,
            })

        return Response({
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'days': week_data,
        })


NUTRIENT_ID_MAP = {
    1008: 'calories',  # Energy (kcal)
    1003: 'protein',   # Protein (g)
    1005: 'carbs',     # Carbohydrate, by difference (g)
    1004: 'fat',       # Total lipid (fat) (g)
}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_food(request):
    """
    Proxy USDA FoodData Central search to provide simplified nutrition data.
    """
    query = request.query_params.get('q', '').strip()
    if not query:
        return Response({'results': []})

    api_key = getattr(settings, 'USDA_API_KEY', None)
    if not api_key:
        return Response(
            {'error': 'USDA API key is not configured.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    cache_key = f'food-search:{query.lower()}'
    cached_payload = cache.get(cache_key)
    if cached_payload:
        return Response(cached_payload)

    params = {
        'query': query,
        'api_key': api_key,
        'pageSize': 10,
        'dataType': ['Survey (FNDDS)', 'Branded'],
    }

    def fetch_payload(param_set):
        response = requests.get(
            'https://api.nal.usda.gov/fdc/v1/foods/search',
            params=param_set,
            timeout=5,
        )
        response.raise_for_status()
        return response.json()

    try:
        payload = fetch_payload(params)
    except HTTPError as exc:
        status_code = exc.response.status_code if exc.response else status.HTTP_502_BAD_GATEWAY
        if status_code == status.HTTP_403_FORBIDDEN and 'dataType' in params:
            logging.getLogger(__name__).info('USDA search forbidden with dataType; retrying without branded results')
            fallback_params = {key: value for key, value in params.items() if key != 'dataType'}
            try:
                payload = fetch_payload(fallback_params)
            except HTTPError as fallback_exc:
                payload = {'error': 'Food search failed'}
                try:
                    raw = fallback_exc.response.json()
                except ValueError:
                    raw = {'detail': fallback_exc.response.text if fallback_exc.response else 'No response body'}
                payload['details'] = raw
                logging.getLogger(__name__).warning('USDA fallback search returned error', exc_info=True)
                return Response(payload, status=status_code)
        else:
            payload = {'error': 'Food search failed'}
            try:
                raw = exc.response.json()
            except ValueError:
                raw = {'detail': exc.response.text if exc.response else 'No response body'}
            payload['details'] = raw
            logging.getLogger(__name__).warning('USDA search returned error', exc_info=True)
            return Response(payload, status=status_code)
    except RequestException as exc:
        logging.getLogger(__name__).error('USDA search request failed', exc_info=True)
        return Response(
            {'error': 'Unable to fetch food data at this time.'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    simplified_results = []

    for food in payload.get('foods', []):
        nutrient_values = {
            NUTRIENT_ID_MAP[n.get('nutrientId')]: n.get('value')
            for n in food.get('foodNutrients', [])
            if n.get('nutrientId') in NUTRIENT_ID_MAP
        }

        simplified_results.append({
            'description': food.get('description', ''),
            'calories': round(nutrient_values.get('calories', 0) or 0, 1),
            'protein': round(nutrient_values.get('protein', 0) or 0, 1),
            'carbs': round(nutrient_values.get('carbs', 0) or 0, 1),
            'fat': round(nutrient_values.get('fat', 0) or 0, 1),
        })

    payload = {'results': simplified_results}
    cache.set(cache_key, payload, timeout=300)
    return Response(payload)


class MealTargetViewSet(viewsets.ModelViewSet):
    """
    API endpoints for meal targets (goals).
    """

    serializer_class = MealTargetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only targets belonging to the authenticated user."""
        return MealTarget.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Create or update a user's targets (POST /api/meal-targets/).
        """
        try:
            target = MealTarget.objects.get(user=request.user)
        except MealTarget.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        serializer = self.get_serializer(target, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_targets(self, request):
        """
        GET /api/meal-targets/my_targets/ — returns current user's targets.
        """
        try:
            target = MealTarget.objects.get(user=request.user)
        except MealTarget.DoesNotExist:
            return Response(
                {'error': 'No targets set. Please create targets first.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(target)
        return Response(serializer.data)


class WaterIntakeViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoints for daily water intake.
    """

    serializer_class = WaterIntakeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return water intake rows for the current user with optional date filtering.
        """
        queryset = WaterIntake.objects.filter(user=self.request.user).order_by('-date')
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError as exc:
                raise ValidationError({'date': 'Invalid date format. Use YYYY-MM-DD'}) from exc
            queryset = queryset.filter(date=target_date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date_value = serializer.validated_data['date']
        payload = {key: value for key, value in serializer.validated_data.items() if key != 'date'}
        existing = WaterIntake.objects.filter(user=request.user, date=date_value).first()

        if existing:
            for attr, value in payload.items():
                setattr(existing, attr, value)
            existing.save()
            output = self.get_serializer(existing)
            return Response(output.data, status=status.HTTP_200_OK)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Allow partial updates so clients can send only the fields they need.
        """
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
