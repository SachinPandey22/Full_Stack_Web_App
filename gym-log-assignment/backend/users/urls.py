from django.urls import path
from .views import RegisterView, LoginView, RefreshView, MeView, LogoutView, ProfileView, NutritionTargetsView, NutritionSnapshotsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('nutrition/targets/', NutritionTargetsView.as_view(), name='nutrition_targets'),
    path("nutrition/snapshots/", NutritionSnapshotsView.as_view() , name="nutrition_snapshots"),
]