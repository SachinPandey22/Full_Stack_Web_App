from django.urls import path
from . import views

urlpatterns = [
    path("pairing-codes", views.create_pairing_code),      # POST
    path("mobile/devices", views.list_devices),            # GET
    path("mobile/devices/<int:pk>", views.revoke_device),  # DELETE
    path("mobile/link", views.link_device),                # POST
    path("mobile/ingest", views.ingest_data),              # POST
    path("mobile/steps", views.list_steps),
]
