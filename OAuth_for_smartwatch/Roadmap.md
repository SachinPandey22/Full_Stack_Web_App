<h3>This feature is in progress by Misan Parajuli</h3><hr>

<h3>Step 1: Choose which smartwatch ecosystem(s) to support</h3>

    WearOS / Android watches → Google Fit REST API.

    Use Samsung → Google Fit Sync

    Flow: Watch → Samsung Health → Google Fit → Django backend (via REST API + OAuth) → Web Dashboard




    Use Apple → Google Fit Sync

    Some apps let users sync Apple Health data into a cloud service that exposes an API:

    Google Fit (if the user links Apple Health → Google Fit).

    Fitbit/Strava/MyFitnessPal (some allow Apple Health sync).

    Then your Django backend connects to those cloud APIs (OAuth + REST).

    Pros: No iOS app needed from you.

    Cons: Depends on third-party sync, limited control.

<h3>Step 2: Set up OAuth2 authentication</h3>

    Most health APIs require the user to grant permission before you can fetch their health data.

    Register your app with the provider (Fitbit, Google, etc.).

    Get Client ID and Client Secret.

    In Django, use a package like:

    django-allauth
    (handles OAuth login).

    Or requests-oauthlib
    for manual token handling.

    This will let a user log in with their Fitbit/Google account and authorize access to health data.

<h3>Step 3:Fetch data from API</h3>

<h3>Step 4: Store data in SQLite</h3>
