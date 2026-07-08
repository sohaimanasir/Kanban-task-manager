# API Design

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# Overview

The application uses Next.js Route Handlers to provide RESTful APIs.

All endpoints return JSON.

---

# API Principles

- RESTful design
- Consistent naming
- Proper HTTP methods
- Input validation
- Clear error handling

---

# Authentication

Protected endpoints require a valid authenticated session.

---

# User

```
GET    /api/user
PATCH  /api/user
```

---

# Boards

```
GET    /api/boards
POST   /api/boards
GET    /api/boards/:id
PATCH  /api/boards/:id
DELETE /api/boards/:id
```

---

# Columns

```
POST   /api/columns
PATCH  /api/columns/:id
DELETE /api/columns/:id
```

Reordering columns and moving tasks between columns both go through the existing `PATCH` endpoints — updating `position` (and `columnId`, for tasks) rather than a separate move/reorder endpoint. No dedicated endpoint is needed; this is a standing convention, not a gap.

---

# Tasks

```
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

## Filtering

`GET /api/tasks` supports the following query parameters, matching the filters defined in the PRD (§8) and Application Flow (§12):

```
?priority=low|medium|high
?labelId=<uuid>
?dueBefore=<date>
?dueAfter=<date>
?completed=true|false
?boardId=<uuid>
```

Multiple parameters may be combined (e.g. `?boardId=x&priority=high&completed=false`).

---

# Labels

Labels are board-scoped (per Schema v2 — `Label.boardId`), so label endpoints are nested under a board rather than global:

```
GET    /api/boards/:boardId/labels
POST   /api/boards/:boardId/labels
PATCH  /api/labels/:id
DELETE /api/labels/:id
```

---

# Checklist

```
POST   /api/checklists
PATCH  /api/checklists/:id
DELETE /api/checklists/:id
```

## Checklist Items

```
POST   /api/checklists/:checklistId/items
PATCH  /api/checklist-items/:id
DELETE /api/checklist-items/:id
```

`PATCH` on a checklist item is used both for renaming and for toggling `completed`.

---

# Activity

```
GET /api/tasks/:taskId/activity
```

Read-only. Activity records are created automatically by the server when a tracked change occurs (e.g. priority change, move, completion) — there is no direct write endpoint.

---

# Search

```
GET /api/search?q=<query>
```

Searches both board titles and task titles (per Application Flow §11), scoped to the current user's own boards/tasks. Returns a combined result set distinguishing board matches from task matches.

---

# Response Format

Success

```json
{
  "success": true,
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

---

# Status Codes

```
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# Future APIs

- File Uploads
- Notifications
- Calendar
- AI Assistant

---

# Changelog

**v2.0.0 (July 2, 2026)**

- Moved Search out of Future APIs into a proper V1 endpoint (`GET /api/search`), since Search is core V1 scope per the PRD and Application Flow — it was previously listed as future work despite being planned for launch.
- Added filter query parameters to `GET /api/tasks` (priority, label, due date range, completion status, board), matching the filters already defined in the PRD and Application Flow.
- Added Checklist Item endpoints, which were previously entirely undefined despite Checklist Item being its own entity in the Schema doc.
- Added a read-only Activity endpoint (`GET /api/tasks/:taskId/activity`) — writes remain server-generated, not client-triggered.
- Scoped Label endpoints under `/api/boards/:boardId/labels` for creation/listing, matching `Label.boardId` in Schema v2 (labels are per-board, not global).
- Added a note clarifying that column reordering and task moves use the existing `PATCH` endpoints rather than needing separate move/reorder routes.
