from django.urls import path
from .views import send_support_email, chat_with_ai

urlpatterns = [
    path('contact/', send_support_email, name='send_support_email'),
    path('chat/', chat_with_ai, name='chat_with_ai'),
]
