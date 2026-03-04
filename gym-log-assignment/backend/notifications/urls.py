from django.urls import path
from .views import NotificationListView, mark_all_read, NotificationDeleteView

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notifications-list"),
    path("notifications/mark-all-read/", mark_all_read, name="notifications-mark-all"),
    path("notifications/<int:pk>/", NotificationDeleteView.as_view(), name="notifications-delete"),
]