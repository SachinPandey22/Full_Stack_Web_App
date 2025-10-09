import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user_data():
    return {"email": "you@example.com", "password": "secret12"}

@pytest.fixture
def create_user(db):
    def _make(email="you@example.com", password="secret12"):
        return User.objects.create_user(username=email.lower(), email=email.lower(), password=password)
    return _make

