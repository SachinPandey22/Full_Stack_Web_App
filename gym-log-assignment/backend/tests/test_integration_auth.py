import time
import pytest
from datetime import timedelta
from django.test import override_settings

# backend/tests/test_integration_auth.py

REGISTER_URL = "/api/register/"
LOGIN_URL    = "/api/login/"
REFRESH_URL  = "/api/refresh/"
LOGOUT_URL   = "/api/logout/"
ME_URL       = "/api/me/"


@pytest.mark.django_db
def test_register_success_and_duplicate(api_client, user_data):
    r1 = api_client.post(REGISTER_URL, user_data, format="json")
    assert r1.status_code in (200, 201)
    assert "access" in r1.data and "user" in r1.data

    r2 = api_client.post(REGISTER_URL, user_data, format="json")
    assert r2.status_code in (400, 409)
    assert "detail" in r2.data

@pytest.mark.django_db
def test_login_success_and_invalid(api_client, user_data):
    api_client.post(REGISTER_URL, user_data, format="json")

    ok = api_client.post(LOGIN_URL, user_data, format="json")
    assert ok.status_code == 200
    assert "access" in ok.data and "user" in ok.data

    bad = api_client.post(LOGIN_URL, {"email": user_data["email"], "password": "wrong"}, format="json")
    assert bad.status_code == 401
    assert bad.data.get("detail") in {"Invalid credentials.", "Invalid email or password."}

@pytest.mark.django_db
def test_me_requires_token_and_allows_with_token(api_client, user_data):
    r0 = api_client.get(ME_URL)
    assert r0.status_code in (401, 403)

    r = api_client.post(REGISTER_URL, user_data, format="json")
    access = r.data["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    me = api_client.get(ME_URL)
    assert me.status_code == 200
    assert me.data["user"]["email"] == user_data["email"]

@pytest.mark.django_db
def test_logout_clears_refresh_and_blocks_subsequent_refresh(api_client, user_data):
    api_client.post(REGISTER_URL, user_data, format="json")
    login = api_client.post(LOGIN_URL, user_data, format="json")
    assert login.status_code == 200

    pre = api_client.post(REFRESH_URL, format="json")
    assert pre.status_code == 200 and "access" in pre.data

    out = api_client.post(LOGOUT_URL, format="json")
    assert out.status_code == 200

    post = api_client.post(REFRESH_URL, format="json")
    assert post.status_code in (401, 403)
