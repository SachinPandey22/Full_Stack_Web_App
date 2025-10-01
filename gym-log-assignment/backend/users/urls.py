from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse
from mobile import views as m

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

    # Mobile
    path("api/mobile/link", m.link_device),
    path("api/mobile/ingest", m.ingest_data),

    
]
