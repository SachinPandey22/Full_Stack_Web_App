from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserOutSerializer

def build_auth_payload(user):
    """
    Shape expected by your frontend:
    { access: "...", user: { email: "..." } }
    """
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    return access, refresh

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
