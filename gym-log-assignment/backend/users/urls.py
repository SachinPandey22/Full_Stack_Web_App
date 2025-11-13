from django.urls import path
from .views import RegisterView, LoginView, RefreshView, MeView, LogoutView, ProfileView, NutritionTargetsView, NutritionSnapshotsView,NutritionRecommendationsView, ExportDataView, DeleteAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('user/profile/', ProfileView.as_view(), name='user-profile'),
    path('nutrition/recommendations/', NutritionRecommendationsView.as_view(), name='nutrition_recommendations'),
    path('nutrition/targets/', NutritionTargetsView.as_view(), name='nutrition_targets'),
    path("export/", ExportDataView.as_view(), name="export_data"),
    path('nutrition/snapshots/', NutritionSnapshotsView.as_view(), name='nutrition_snapshots'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),
]
