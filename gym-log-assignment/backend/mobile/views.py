from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
import random, string
from django.shortcuts import render
import json, jwt
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone as dj_tz
from django.conf import settings
from .models import PairingCode, MobileDevice, StepSample

def _rand_code(n=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=n))

@api_view(["POST"])
@permission_classes([IsAuthenticated])         # ✅ JWT required
@transaction.atomic
def create_pairing_code(request):
    # one active code per user – delete old ones
    PairingCode.objects.filter(user=request.user).delete()

    # ensure uniqueness
    for _ in range(10):
        code = _rand_code(6)
        if not PairingCode.objects.filter(code=code).exists():
            break

    pc = PairingCode.objects.create(user=request.user, code=code)
    return Response({"code": pc.code, "expires_at": pc.expires_at.isoformat()})

@api_view(["GET"])
@permission_classes([IsAuthenticated])         # ✅ JWT required
def list_devices(request):
    qs = MobileDevice.objects.filter(user=request.user).order_by("-last_seen","-created_at")
    data = [{
        "id": d.id,
        "platform": d.platform,
        "device_id": d.device_id,
        "last_seen": d.last_seen.isoformat() if d.last_seen else None,
        "created_at": d.created_at.isoformat() if d.created_at else None,
    } for d in qs]
    return Response(data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])         # ✅ JWT required
def revoke_device(request, pk):
    MobileDevice.objects.filter(id=pk, user=request.user).delete()
    return Response({"ok": True})

JWT_EXP_MIN = 60 * 24 * 7   # 7 days

def _issue_jwt(user_id, device_id):
    payload = {
        "uid": user_id,
        "did": device_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MIN)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def _auth(request):
    auth = request.headers.get("Authorization","")
    if not auth.startswith("Bearer "): return None
    token = auth.split(" ",1)[1]
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except Exception:
        return None

@csrf_exempt
def link_device(request):
    if request.method != "POST": return HttpResponseBadRequest("POST only")
    try:
        body = json.loads(request.body or "{}")
        code = body["pairing_code"].strip()
        device_id = body["device_id"].strip()
        platform = body.get("platform","android")
    except Exception:
        return HttpResponseBadRequest("invalid json")

    try:
        pc = PairingCode.objects.get(code=code)
    except PairingCode.DoesNotExist:
        return HttpResponseForbidden("invalid code")

    if pc.expires_at < dj_tz.now():
        return HttpResponseForbidden("code expired")

    # create or update device
    md, _ = MobileDevice.objects.update_or_create(
        user=pc.user, device_id=device_id,
        defaults={"platform": platform, "last_seen": dj_tz.now()}
    )

    token = _issue_jwt(pc.user_id, device_id)
    return JsonResponse({"token": token, "user_id": pc.user_id})

@csrf_exempt
def ingest_data(request):
    if request.method != "POST": return HttpResponseBadRequest("POST only")
    claims = _auth(request)
    if not claims: return HttpResponseForbidden("bad token")

    try:
        body = json.loads(request.body or "{}")
        steps = body.get("steps", [])
        source = body.get("source", "health_connect")
    except Exception:
        return HttpResponseBadRequest("invalid json")

    # write steps
    created, skipped = 0, 0
    for s in steps:
        try:
            obj, made = StepSample.objects.get_or_create(
                user_id=claims["uid"],
                ext_id=s["ext_id"],
                defaults={
                    "start": s["start"], "end": s["end"],
                    "steps": int(s["steps"]), "source": source
                }
            )
            created += int(made)
            skipped += int(not made)
        except Exception:
            continue

    # update device heartbeat
    try:
        MobileDevice.objects.filter(user_id=claims["uid"], device_id=claims["did"])\
            .update(last_seen=dj_tz.now())
    except:
        pass

    return JsonResponse({"ok": True, "created": created, "skipped": skipped})
