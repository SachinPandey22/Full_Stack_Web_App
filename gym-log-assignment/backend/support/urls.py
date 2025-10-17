from django.urls import path
from .views import send_support_email

urlpatterns = [
    path('contact/', send_support_email, name='send_support_email'),
]
