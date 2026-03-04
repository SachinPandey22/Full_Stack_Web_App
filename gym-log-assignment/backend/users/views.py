import csv
from datetime import datetime
from io import StringIO
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, NutritionSnapshot, NutritionTargets
from .serializers import (
    ProfileSerializer,
    NutritionSnapshotSerializer,
    NutritionTargetsSerializer,
    NutritionTargetsWriteSerializer,
    RegisterSerializer,
    UserOutSerializer,
)
from .utils import compute_targets


def build_auth_payload(user):
    """
    Shape expected by the frontend:
    { access: "...", user: { email: "..." } }
    """
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    return access, refresh


class NutritionRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, "profile", None)
        if profile is None:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        required_fields = ["sex", "height", "weight", "activity_level", "goal", "age"]
        missing = [field for field in required_fields if not getattr(profile, field, None)]
        if missing:
            return Response(
                {"detail": "Incomplete profile.", "missing_fields": missing},
                status=status.HTTP_400_BAD_REQUEST,
            )

        targets = compute_targets(
            sex=profile.sex,
            weight_kg=profile.weight,
            height_cm=profile.height,
            age_years=profile.age,
            activity_level=profile.activity_level,
            goal=profile.goal,
        )

        meta = dict(getattr(targets, "meta", {}) or {})
        meta["source"] = "recommendation"

        nutrition_targets, _ = NutritionTargets.objects.update_or_create(
            user=request.user,
            defaults={
                "bmr": round(targets.bmr),
                "tdee": round(targets.tdee),
                "target_calories": round(targets.target_calories),
                "protein_g": round(targets.protein_g),
                "fat_g": round(targets.fat_g),
                "carbs_g": round(targets.carbs_g),
                "meta": meta,
            },
        )

        serializer = NutritionTargetsSerializer(nutrition_targets)
        assumptions = {key: value for key, value in meta.items() if key != "source"}

        response_payload = {
            **serializer.data,
            "goal": profile.goal,
            "assumptions": assumptions,
        }
        return Response(response_payload)


class NutritionTargetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            nutrition_targets = request.user.nutrition_targets
        except NutritionTargets.DoesNotExist:
            return Response({"detail": "Nutrition targets not set."}, status=status.HTTP_404_NOT_FOUND)

        serializer = NutritionTargetsSerializer(nutrition_targets)
        return Response(serializer.data)

    def post(self, request):
        serializer = NutritionTargetsWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            existing = request.user.nutrition_targets
        except NutritionTargets.DoesNotExist:
            existing = None

        meta = {}
        if existing and existing.meta:
            meta = existing.meta.copy()
        meta["source"] = "manual"

        defaults = {
            "target_calories": data["target_calories"],
            "protein_g": data["protein_g"],
            "carbs_g": data["carbs_g"],
            "fat_g": data["fat_g"],
            "meta": meta,
            "bmr": existing.bmr if existing else data["target_calories"],
            "tdee": existing.tdee if existing else data["target_calories"],
        }

        nutrition_targets, created = NutritionTargets.objects.update_or_create(
            user=request.user,
            defaults=defaults,
        )

        response_serializer = NutritionTargetsSerializer(nutrition_targets)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(response_serializer.data, status=status_code)


class NutritionSnapshotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = NutritionSnapshot.objects.filter(user=request.user).order_by("-date")
        serializer = NutritionSnapshotSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        required_fields = ["sex", "height", "weight", "age", "goal", "activity_level"]
        missing = [field for field in required_fields if not getattr(profile, field, None)]
        if missing:
            return Response({"missing_fields": missing}, status=status.HTTP_400_BAD_REQUEST)

        nutrition_targets = getattr(request.user, "nutrition_targets", None)
        if nutrition_targets is None:
            computed = compute_targets(
                sex=profile.sex,
                height_cm=profile.height,
                weight_kg=profile.weight,
                age_years=profile.age,
                activity_level=profile.activity_level,
                goal=profile.goal,
            )
            payload = {
                "bmr": round(getattr(computed, "bmr", 0)),
                "tdee": round(getattr(computed, "tdee", 0)),
                "target_calories": round(getattr(computed, "target_calories", 0)),
                "protein_g": round(getattr(computed, "protein_g", 0)),
                "fat_g": round(getattr(computed, "fat_g", 0)),
                "carbs_g": round(getattr(computed, "carbs_g", 0)),
                "meta": getattr(computed, "meta", {}) or getattr(computed, "assumptions", {}) or {},
            }
        else:
            payload = {
                "bmr": nutrition_targets.bmr,
                "tdee": nutrition_targets.tdee,
                "target_calories": nutrition_targets.target_calories,
                "protein_g": nutrition_targets.protein_g,
                "fat_g": nutrition_targets.fat_g,
                "carbs_g": nutrition_targets.carbs_g,
                "meta": nutrition_targets.meta or {},
            }

        today = timezone.localtime(timezone.now()).date()
        snapshot, _ = NutritionSnapshot.objects.update_or_create(
            user=request.user,
            date=today,
            defaults=payload,
        )
        serializer = NutritionSnapshotSerializer(snapshot)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DeleteAccountView(APIView):
    """
    POST /api/delete-account/
    Body: {"confirm": "DELETE"}

    Requires explicit confirmation. Deletes this user's data and account.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        confirm = (request.data.get("confirm") or "").strip().upper()
        if confirm != "DELETE":
            return Response(
                {"detail": "Type DELETE to confirm account removal."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        # Delete nutrition data explicitly (even though CASCADE will also handle it)
        from .models import NutritionSnapshot, NutritionTargets

        NutritionSnapshot.objects.filter(user=user).delete()
        NutritionTargets.objects.filter(user=user).delete()

        # Best-effort deletes for other apps that track user-owned data
        try:
            from exercises.models import UserWorkout
            UserWorkout.objects.filter(user=user).delete()
        except Exception:
            pass

        try:
            from MealLogging.models import Meal, MealTarget
            Meal.objects.filter(user=user).delete()
            MealTarget.objects.filter(user=user).delete()
        except Exception:
            pass

        try:
            from notifications.models import Notification
            Notification.objects.filter(user=user).delete()
        except Exception:
            pass

        # Finally, delete the user.
        # Profile and other OneToOne/ForeignKey with on_delete=CASCADE will follow.
        user.delete()

        return Response(
            {"detail": "Your account and all associated data have been deleted."},
            status=status.HTTP_200_OK
        )
        
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            detail = serializer.errors.get('email') or serializer.errors
            return Response({'detail': detail}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        access, refresh = build_auth_payload(user)
        response = Response(
            {'access': access, 'user': UserOutSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )
        response.set_cookie(
            'refresh',
            str(refresh),
            httponly=True,
            samesite='Lax',
            secure=False,
        )
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').lower().strip()
        password = request.data.get('password') or ''

        user = authenticate(username=email, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        access, refresh = build_auth_payload(user)
        response = Response({'access': access, 'user': UserOutSerializer(user).data})
        response.set_cookie(
            'refresh',
            str(refresh),
            httponly=True,
            samesite='Lax',
            secure=False,
        )
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken

        cookie_refresh = request.COOKIES.get('refresh')
        if not cookie_refresh:
            return Response({'detail': 'No refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh_token = SimpleRefreshToken(cookie_refresh)
            access = str(refresh_token.access_token)
            return Response({'access': access})
        except Exception:
            return Response({'detail': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user': UserOutSerializer(request.user).data})


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"detail": "Logged out."})
        response.delete_cookie("refresh")
        return response


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/profile/ -> fetch the logged-in user's profile
    PUT /api/profile/ -> update the logged-in user's profile
    """

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

# users/views.py (append)

def _parse_iso_date(s: str):
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None

class ExportDataView(APIView):
    """
    GET /api/export/?start=YYYY-MM-DD&end=YYYY-MM-DD&tz=America/Chicago

    Exports the signed-in user's data (nutrition, workouts, sleep, weight) as CSV.
    Dates are ISO (YYYY-MM-DD). 'tz' is accepted for future use; we currently rely
    on model dates already saved using localdate() to respect TIME_ZONE.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        start = _parse_iso_date(request.query_params.get("start", ""))
        end   = _parse_iso_date(request.query_params.get("end", ""))
        tzname = request.query_params.get("tz") or timezone.get_current_timezone_name()

        if not start or not end or start > end:
            return Response({"detail": "Provide valid 'start' and 'end' ISO dates."},
                            status=status.HTTP_400_BAD_REQUEST)

        rows = []

        # --- Nutrition (required; snapshots represent daily targets) ---
        from .models import NutritionSnapshot
        qs_nut = NutritionSnapshot.objects.filter(user=user, date__gte=start, date__lte=end).order_by("date")
        for s in qs_nut:
            rows.append({
                "date": s.date.isoformat(),
                "type": "nutrition",
                "kcal": round(s.target_calories or 0),
                "protein_g": round(s.protein_g or 0),
                "fat_g": round(s.fat_g or 0),
                "carbs_g": round(s.carbs_g or 0),
                "duration_min": "",
                "hours": "",
                "quality": "",
                "kg": "",
                "meta": s.meta or {},
            })

        # --- Optional: Workouts ---
        try:
            from exercises.models import UserWorkout  # adjust if your app path differs
            qs_w = UserWorkout.objects.filter(user=user, date__gte=start, date__lte=end).order_by("date")
            for w in qs_w:
                rows.append({
                    "date": getattr(w, "date", None).isoformat() if getattr(w, "date", None) else "",
                    "type": "workout",
                    "kcal": getattr(w, "calories", ""),
                    "protein_g": "",
                    "fat_g": "",
                    "carbs_g": "",
                    "duration_min": getattr(w, "duration_min", ""),
                    "hours": "",
                    "quality": "",
                    "kg": "",
                    "meta": {},
                })
        except Exception:
            pass

        # --- Optional: Sleep ---
        try:
            from sleep.models import SleepSession
            qs_s = SleepSession.objects.filter(user=user, date__gte=start, date__lte=end).order_by("date")
            for sl in qs_s:
                rows.append({
                    "date": getattr(sl, "date", None).isoformat() if getattr(sl, "date", None) else "",
                    "type": "sleep",
                    "kcal": "",
                    "protein_g": "",
                    "fat_g": "",
                    "carbs_g": "",
                    "duration_min": "",
                    "hours": getattr(sl, "hours", ""),
                    "quality": getattr(sl, "quality", ""),
                    "kg": "",
                    "meta": {},
                })
        except Exception:
            pass

        # --- Optional: Weight ---
        try:
            from weight.models import BodyWeight
            qs_bw = BodyWeight.objects.filter(user=user, date__gte=start, date__lte=end).order_by("date")
            for bw in qs_bw:
                rows.append({
                    "date": getattr(bw, "date", None).isoformat() if getattr(bw, "date", None) else "",
                    "type": "weight",
                    "kcal": "",
                    "protein_g": "",
                    "fat_g": "",
                    "carbs_g": "",
                    "duration_min": "",
                    "hours": "",
                    "quality": "",
                    "kg": getattr(bw, "weight_kg", ""),
                    "meta": {},
                })
        except Exception:
            pass

        # Sort by date asc, then type for stability
        rows.sort(key=lambda r: (r["date"], r["type"]))

        # CSV headers (consistent across all record types)
        headers = [
            "date", "type", "kcal", "protein_g", "fat_g", "carbs_g",
            "duration_min", "hours", "quality", "kg", "meta"
        ]

        buf = StringIO()
        writer = csv.DictWriter(buf, fieldnames=headers)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

        resp = HttpResponse(buf.getvalue(), content_type="text/csv")
        filename = f"export_{start.isoformat()}_{end.isoformat()}.csv"
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp
