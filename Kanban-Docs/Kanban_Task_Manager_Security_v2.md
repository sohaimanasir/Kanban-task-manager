# Security

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# Purpose

This document defines the security principles for the Kanban Task Manager.

Security should be built into the application from the beginning rather than added later.

---

# Authentication

- Secure session-based authentication
- Password hashing and credential storage handled entirely by Better Auth (via its `Account` table — see Schema doc) — the application never hashes or stores passwords itself
- Protected routes
- Secure cookies
- Automatic session expiration
- Rate limit login and registration attempts to reduce brute-force and credential-stuffing risk

---

# Authorization

Every user can only access their own:

- Profile
- Boards
- Columns
- Labels
- Tasks
- Checklists and Checklist Items
- Activity records

Checklists, Checklist Items, and Activity records don't carry a `userId` directly — ownership is verified by walking the relationship back to the owning Task → Column → Board → User, per Schema v2. Every query or mutation on these nested resources must still confirm the resolved owner matches the current session user; proximity to an owned task is not itself authorization.

Never trust client-side ownership. Always verify ownership on the server.

---

# Input Validation

Validate all incoming data using Zod.

Never trust:

- Form input
- Query parameters
- Route parameters
- API payloads

---

# Database

- Parameterized queries through Prisma
- No raw SQL unless necessary
- Proper foreign key relationships

---

# API Security

- Validate every request
- Return safe error messages
- Never expose internal errors
- Use proper HTTP status codes
- Rate limit auth endpoints (see Authentication above)

---

# Secrets

Never commit:

- API keys
- Database URLs
- Secrets
- Tokens

Use environment variables.

---

# File Uploads (Future)

- Validate file type
- Validate file size
- Store outside the application server

---

# Security Goals

- Confidentiality
- Integrity
- Availability
- Least privilege
- Secure defaults

---

# Changelog

**v2.0.0 (July 2, 2026)**

- Reworded "Passwords hashed before storage" to reflect that Better Auth owns all credential hashing/storage — the app never implements this itself (matches the same fix already made in Rules v2).
- Expanded Authorization to explicitly cover Checklists, Checklist Items, and Activity records, and clarified that ownership for these is resolved by walking back to the owning Task/Board/User rather than a direct `userId` field.
- Added rate limiting on login/registration as an explicit security goal under Authentication and API Security.
