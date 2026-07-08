# Authentication

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# Authentication Provider

Better Auth

---

# Version 1 Features

- Register
- Login
- Logout
- Session Management
- Protected Routes

---

# Registration

Required fields:

- Name
- Email
- Password

Rules:

- Unique email
- Password must be at least 8 characters, with at least one letter and one number
- Better Auth handles password hashing and credential storage internally — the application never hashes or stores raw/hashed passwords itself (see Security doc and Schema doc's `Account` table)

---

# Login

Users authenticate using:

- Email
- Password

Successful login creates a secure session.

---

# Logout

Logout destroys the current session and redirects to the login page.

---

# Email Verification (V1 stance)

Email Verification is listed under Future Features below and is **not enforced in V1** — a newly registered user can access protected routes immediately after registration without verifying their email. The `emailVerified` field on `User` and the `Verification` table (Schema doc) exist to support this feature when it's built, but nothing gates access on it yet.

---

# Route Protection

Public Routes:

- `/`
- `/login`
- `/register`

Protected Routes:

- `/dashboard`
- `/boards/:id` (an individual board view; `/boards` route itself is not used since boards are accessed from the Dashboard, not a standalone list page)
- `/profile`

Note: `/settings` has been removed from this list. Per Application Flow, profile-related actions (update profile, change password, toggle theme, logout) all live under the single `/profile` screen — there is no separate Settings route in V1.

Unauthenticated users are redirected to the login page.

---

# Future Features

- Google Login
- GitHub Login
- Password Reset
- Email Verification
- Two-Factor Authentication

---

# Changelog

**v2.0.0 (July 2, 2026)**

- Reworded password handling under Registration to clarify Better Auth owns hashing/storage — the app performs no password hashing itself.
- Added a concrete password validation rule (min 8 characters, one letter, one number) so the Zod schema has a real spec to implement against.
- Added an explicit Email Verification section stating it is not enforced in V1.
- Clarified Route Protection: removed the undefined `/settings` route (folded into `/profile`, per Application Flow's Profile Flow), and made `/boards/:id` explicit as an individual board route rather than the ambiguous `/boards/*`.
