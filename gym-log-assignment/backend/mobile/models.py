from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

def default_expiry():
    return timezone.now() + timedelta(minutes=10)

class PairingCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=12, unique=True)
    expires_at = models.DateTimeField(default=default_expiry)

class MobileDevice(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=10)   # 'android' or 'ios'
    device_id = models.CharField(max_length=128) # from mobile
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)

class StepSample(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start = models.DateTimeField()   # UTC
    end = models.DateTimeField()
    steps = models.IntegerField()
    source = models.CharField(max_length=20)     # 'health_connect' | 'healthkit'
    ext_id = models.CharField(max_length=128, unique=False)    # idempotency key
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user","ext_id"], name="uniq_user_extid_steps")
        ]
