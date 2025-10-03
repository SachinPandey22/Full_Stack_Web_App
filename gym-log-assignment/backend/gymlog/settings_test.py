# backend/gymlog/settings_test.py
from .settings import *  # noqa

# Force SQLite for tests only
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "test_db.sqlite3",
    }
}

# Optional: speed up hashing in tests (keeps behavior same but faster)
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
