from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from django.utils import timezone

from .serializers import RegisterSerializer, UserOutSerializer, ProfileSerializer, NutritionSnapshotSerializer
from .models import Profile, NutritionTargets, NutritionSnapshot   # ✅ added NutritionTargets
from .utils import compute_targets


def build_auth_payload(user):
    """
    Shape expected by your frontend:
    { access: "...", user: { email: "..." } }
    """
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    return access, refresh


class NutritionTargetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile: Profile = getattr(request.user, "profile", None)
        if not profile:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        missing = []
        if not profile.sex:
            missing.append("sex")
        if not profile.height:
            missing.append("height")
        if not profile.weight:
            missing.append("weight")
        if not profile.activity_level:
            missing.append("activity_level")
        if not profile.goal:
            missing.append("goal")
        if not profile.age:
            missing.append("age")

        if missing:
            return Response(
                {"detail": "Incomplete profile.", "missing_fields": missing},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Compute fresh targets from current profile
        t = compute_targets(
            sex=profile.sex,
            weight_kg=profile.weight,
            height_cm=profile.height,
            age_years=profile.age,            # ✅ your model uses `age`
            activity_level=profile.activity_level,
            goal=profile.goal,
        )

        # ✅ Persist (upsert) the latest numbers for this user in Supabase
        meta = getattr(t, "meta", {}) or getattr(t, "assumptions", {}) or {}
        NutritionTargets.objects.update_or_create(
            user=request.user,
            defaults=dict(
                bmr=round(getattr(t, "bmr", 0)),
                tdee=round(getattr(t, "tdee", 0)),
                target_calories=round(getattr(t, "target_calories", 0)),
                protein_g=round(getattr(t, "protein_g", 0)),
                fat_g=round(getattr(t, "fat_g", 0)),
                carbs_g=round(getattr(t, "carbs_g", 0)),
                meta=meta,
            ),
        )

        # Response shape your frontend already handles
        return Response({
            "bmr": t.bmr,
            "tdee": t.tdee,
            "goal": profile.goal,
            "target_calories": t.target_calories,
            "macros": {
                "protein_g": t.protein_g,
                "fat_g": t.fat_g,
                "carbs_g": t.carbs_g,
            },
            "assumptions": meta,   # keep returning meta/assumptions
        })

class NutritionSnapshotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = NutritionSnapshot.objects.filter(user=request.user).order_by("-date")
        ser = NutritionSnapshotSerializer(qs, many=True)
        return Response(ser.data)

    def post(self, request):
        # Get today's targets either from stored NutritionTargets or compute fresh
        try:
            profile: Profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        missing = [f for f in ["sex","height","weight","age","goal","activity_level"]
                   if not getattr(profile, f, None)]
        if missing:
            return Response({"missing_fields": missing}, status=status.HTTP_400_BAD_REQUEST)

        # Try to read latest stored targets; if absent, compute now
        nt = getattr(request.user, "nutrition_targets", None)
        if nt is None:
            t = compute_targets(
                sex=profile.sex, height_cm=profile.height, weight_kg=profile.weight,
                age_years=profile.age, activity_level=profile.activity_level, goal=profile.goal,
            )
            # shape-normalize
            payload = dict(
                bmr=round(getattr(t, "bmr", 0)),
                tdee=round(getattr(t, "tdee", 0)),
                target_calories=round(getattr(t, "target_calories", 0)),
                protein_g=round(getattr(t, "protein_g", 0)),
                fat_g=round(getattr(t, "fat_g", 0)),
                carbs_g=round(getattr(t, "carbs_g", 0)),
                meta=getattr(t, "meta", {}) or getattr(t, "assumptions", {}) or {},
            )
        else:
            payload = dict(
                bmr=nt.bmr, tdee=nt.tdee, target_calories=nt.target_calories,
                protein_g=nt.protein_g, fat_g=nt.fat_g, carbs_g=nt.carbs_g,
                meta=nt.meta or {},
            )

        today = timezone.localtime(timezone.now()).date()
        snap, _ = NutritionSnapshot.objects.update_or_create(
            user=request.user, date=today,
            defaults=payload,
        )
        ser = NutritionSnapshotSerializer(snap)
        return Response(ser.data, status=status.HTTP_201_CREATED)



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if ser.is_valid():
            user = ser.save()
            access, refresh = build_auth_payload(user)
            resp = Response(
                {'access': access, 'user': UserOutSerializer(user).data},
                status=status.HTTP_201_CREATED
            )
            # Optional: drop refresh as httpOnly cookie (works with withCredentials)
            resp.set_cookie(
                'refresh', str(refresh),
                httponly=True, samesite='Lax', secure=False  # secure=True on HTTPS
            )
            return resp

        # Return friendly duplicate email or validation details
        detail = ser.errors.get('email') or ser.errors
        return Response({'detail': detail}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').lower().strip()
        password = request.data.get('password') or ''

        # We set username=email when creating users
        user = authenticate(username=email, password=password)
        if not user:
            # Generic error per your acceptance criteria
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        access, refresh = build_auth_payload(user)
        resp = Response({'access': access, 'user': UserOutSerializer(user).data})
        resp.set_cookie(
            'refresh', str(refresh),
            httponly=True, samesite='Lax', secure=False
        )
        return resp


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        If you send refresh token in cookie named 'refresh', mint a new access token.
        """
        from rest_framework_simplejwt.tokens import RefreshToken as RT
        cookie_refresh = request.COOKIES.get('refresh')
        if not cookie_refresh:
            return Response({'detail': 'No refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            rt = RT(cookie_refresh)
            access = str(rt.access_token)
            return Response({'access': access})
        except Exception:
            return Response({'detail': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # If Authorization: Bearer <access> is valid, you'll reach here
        return Response({'user': UserOutSerializer(request.user).data})


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Clear the httpOnly refresh cookie (basic server-side logout)
        resp = Response({"detail": "Logged out."})
        resp.delete_cookie("refresh")
        return resp


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/profile/   -> fetch the logged-in user's profile
    PUT /api/profile/   -> update the logged-in user's profile
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
