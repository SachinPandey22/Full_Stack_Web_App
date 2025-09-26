# Auth UX & Error States — Register, Login, Logout

**Project:** Shakti (AI Fitness Tracker)
**Scope:** Register/Login screens, post-login/logout redirects, validation rules, error copy, and flow.

## 1) Low-Fidelity Wireframes (text)

### /register

```
+----------------------------------------+
|  Create account                        |
|                                        |
|  [Label] Email                         |
|  [_______________________________]     |
|     error: "Enter a valid email."      |
|                                        |
|  [Label] Password                      |
|  [_______________________________]     |
|     error: "Password must be at least  |
|            6 characters."              |
|                                        |
|  ( Register )  [disabled while sending]|
|                                        |
|  Already have an account? (Log in)     |
|----------------------------------------|
| Toast (top-center):                    |
|  - success: "Account created!"         |
|  - error:   "Email already in use."    |
+----------------------------------------+
```

### /login

```
+----------------------------------------+
|  Log in                                |
|                                        |
|  [Label] Email                         |
|  [_______________________________]     |
|                                        |
|  [Label] Password                      |
|  [_______________________________]     |
|                                        |
|  ( Log in ) [disabled while sending]   |
|                                        |
|  New here? (Create an account)         |
|----------------------------------------|
| Toast (top-center):                    |
|  - error: "Invalid email or password." |
|  - error: "Something went wrong.       |
|           Please try again."           |
+----------------------------------------+
```

### Post-login redirect → /dashboard

* On success: toast **“Welcome back!”**
* Navigate to **/dashboard**
* Dashboard greets: **“Welcome [you@example.com](mailto:you@example.com)”**
* Includes **Logout** button

### Logout flow

* From **/dashboard**: click **Logout**

  1. Frontend clears in-memory access token
  2. Backend `POST /api/auth/logout/` clears httpOnly refresh cookie
  3. Redirect to **/login**

---

## 2) Simple Flow Diagram

```
[Unauthenticated]
      |
      v
+----------------+        +---------------+
|   /register    |<-----> |   /login      |
+----------------+        +---------------+
      |  success                   | success
      |                            |
      +-------------+--------------+
                    v
             [Authenticated]
                    |
                    v
             +--------------+
             |  /dashboard  |
             +--------------+
                    |
                 (Logout)
                    |
                    v
             [Unauthenticated] -> /login
```

---

## 3) UX Copy (final text)

**Field labels**

* Email
* Password

**Validation errors**

* Email: **“Enter a valid email.”**
* Password: **“Password must be at least 6 characters.”**

**Submit button text**

* Idle: **“Register”**, **“Log in”**
* Loading: **“Creating…”**, **“Signing in…”** (button disabled while sending)

**Success toasts**

* Register: **“Account created!”**
* Login: **“Welcome back!”**
* Logout: **“Signed out.”**

**Error toasts**

* Duplicate email (register): **“Email already in use.”**
* Invalid login: **“Invalid email or password.”** *(generic; no field leaks)*
* Network/unknown: **“Something went wrong. Please try again.”**

**Redirects**

* Post-login → **/dashboard**
* Post-logout → **/login**

---

## 4) Validation Rules & Form Behavior

**Email**

* Must be a valid email format.
* Client message: **“Enter a valid email.”**
* (Optional) Trim + lowercase before submit.

**Password**

* Minimum **6** characters.
* Client message: **“Password must be at least 6 characters.”**

**Form behavior**

* On submit: **disable** the submit button while the request is in flight.
* If validation fails: **focus the first invalid field**.
* On server errors:

  * Duplicate email (register): toast **“Email already in use.”**
    → Preserve **Email**, **clear Password**.
  * Invalid login: toast **“Invalid email or password.”**
    → Preserve **Email**, **clear Password**.
  * Network/unknown: toast **“Something went wrong. Please try again.”**

**Accessibility**

* Use `<label htmlFor>` paired with `<input id>`.
* Set `aria-invalid="true"` when a field has an error.
* (Optional) Link error text via `aria-describedby`.


## 5) Acceptance Checklist (Design)

* [ ] Low-fidelity wireframes reviewed by team and attached to the story
* [ ] Error states covered: duplicate email, invalid creds, network failure
* [ ] Post-login redirect defined (**/dashboard**) and post-logout redirect defined (**/login**)
* [ ] Validation rules documented and unambiguous


## 6) Notes (implementation alignment)

* Current implementation already reflects this design:

  * Client validation (email format, password ≥ 6)
  * Copy: duplicate email / invalid login / network error
  * Redirects: `/dashboard` after login, `/login` after logout
  * Toasts + disabled buttons + focus on first invalid field
* Backend endpoints used:

  * `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/`, `POST /api/auth/refresh/`, `GET /api/auth/me`
