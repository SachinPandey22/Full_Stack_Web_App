import pytest
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.mark.django_db
def test_password_hashing_and_authenticate(create_user):
    u = create_user(email="alice@example.com", password="StrongPass1")
    assert u.password != "StrongPass1"
    assert u.check_password("StrongPass1") is True
    assert authenticate(username="alice@example.com", password="StrongPass1") is not None
    assert authenticate(username="alice@example.com", password="wrong") is None

@pytest.mark.django_db
def test_token_creation_helpers(create_user):
    u = create_user(email="bob@example.com", password="abc12345")
    refresh = RefreshToken.for_user(u)
    access = str(refresh.access_token)
    assert isinstance(access, str) and len(access) > 10
