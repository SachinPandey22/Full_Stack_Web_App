"""
URL configuration for gymlog project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse
from mobile import views as m
from support import urls as support_urls
from support.views import chat_with_ai


def hello_view(request):
    return HttpResponse("Hello! Your Gym Log project is working! 🏋️‍♂️")

def api_hello_view(request):
    return JsonResponse({
        'message': 'Hello from Django API!',
        'status': 'Backend is working',
        'frontend_connected': True,
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', hello_view, name='hello'),
    path('api/hello/', api_hello_view, name='api_hello'),

    path('api/', include('exercises.urls')),
    path('api/', include('MealLogging.urls')),
    
    # Mobile
    path("api/mobile/link", m.link_device),      # exchange pairing code -> JWT
    path("api/mobile/ingest", m.ingest_data),    # post data with JWT

    #Notification
    path("api/", include("notifications.urls")),

    # for support app ie. sending support emails
    path('api/support/', include(support_urls)),  # Support app URLs
    path('api/chat_with_ai/', chat_with_ai, name='chat_with_ai'),
    
    # 🔐 Auth
    #path('api/auth/register/', RegisterView.as_view(), name='register'),
    #path('api/auth/login/', LoginView.as_view(), name='login'),
    #path('api/auth/refresh/', RefreshView.as_view(), name='refresh'),
    

    # 🔒 Protected example
    #path('api/me/', MeView.as_view(), name='me'),
    
    #EXITING
    #path('api/auth/logout/', LogoutView.as_view(), name='logout')

    #  Include everything from users/urls.py
    path("api/", include("users.urls")),
    path("api/", include("mobile.urls")),
]
