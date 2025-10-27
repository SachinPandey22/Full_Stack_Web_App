<h3>This feature is in progress by Misan Parajuli</h3><hr>

As google fit is being discontinued by google, the initial plan to access health data through google fit API has been discarded.

Here is the new model/roadmap that involve an app that connects to user's health app to access data

<h4> Architecture at a glance </h4>

    Watch → Phone health app → Bridge App → Django API → SQLite → Web Dashboard

    Android: Samsung Health/others → Health Connect → your Android app → POST to Django

    iOS: Apple Watch → Health app (HealthKit) → your iOS app → POST to Django

<h5>Step 1: Backend Handshake Setup</h5>

    1) Models (pairing, device, samples)
    Create tables for: a short-lived pairing code (to link a phone to a logged-in user), a mobile device record (tracks platform/device_id), and a simple StepSample (stores time-bucketed steps). This is your minimal data schema.

    2) URLs
    Expose two endpoints: /api/mobile/link (to exchange a pairing code for a JWT) and /api/mobile/ingest (to receive health data from the phone). These are the only routes the bridge app needs at first.

    3) Views (link → JWT, ingest → save)
    Implement the logic:

    link_device verifies the pairing code, records/updates the device, and returns a JWT.

    ingest_data validates the JWT and saves posted samples (idempotently) into SQLite.

    4) Generate pairing codes
    Create a one-time code (e.g., 6 chars, 10-minute expiry) tied to the logged-in user. You’ll show this as a QR on the web so the phone can claim it and securely link to that user.

    5) Test with curl
    Before writing any mobile code, prove the flow works: POST a pairing code to get a JWT, then POST a mock steps payload with that JWT. Seeing rows appear in SQLite confirms your backend handshake is solid.

After securing that the backend works, next phase would be to pass real data into the code and test it.

<B>Documentation</B>

1. Mobile/models.py

   PairingCode: short-lived code to pair a phone with a web user

   MobileDevice: records the linked device (android/ios, device_id)

   StepSample: stores time-bucketed step data (with a unique ext_id to dedupe)

2. api/mobile/link and ingest in urls.py

   Exchange a short-lived pairing code (shown on your web app/QR) for a mobile auth token (JWT) tied to the user + device.
