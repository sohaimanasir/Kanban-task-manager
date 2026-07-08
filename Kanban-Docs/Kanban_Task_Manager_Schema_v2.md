# Database Schema

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# Overview

This document defines the database schema for the Kanban Task Manager.

The database is designed to support a personal productivity application where every registered user owns their own boards, columns, and tasks.

The schema prioritizes simplicity, scalability, and maintainability.

---

# Entity Relationship

```text
User
 │
 ├───────────────┐
 │               │
Session      Account
 │
 └───────┐
         │
      Boards
         │
         ├──────────┐
         │          │
      Columns     Labels
         │            │
         └──────────┐ │
                    │ │
                 Tasks ─┴─ TaskLabel
                    │
                    └──────────┐
                               │
                             Tasks
                               │
            ┌──────────┬────────────┐
            │          │            │
       TaskLabel   Checklist    Activity
                       │
                       ▼
                Checklist Items
```

---

# User

Represents a registered user.

Authentication credentials are **not** stored on this table — they live in the `Account` table below, per Better Auth's schema requirements (see Tech Stack doc §6).

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| name | String |
| email | String |
| emailVerified | Boolean |
| avatar | String (Optional) |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- One user owns many boards.
- One user has many sessions.
- One user has many accounts (credential + future OAuth providers).

---

# Account

Required by Better Auth. Stores credential data per authentication provider (email/password now; Google/GitHub in future per Tech Stack §6).

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| userId | UUID |
| providerId | String |
| accountId | String |
| password | String (Optional — hashed, only set for the email/password provider) |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- Belongs to one user.

---

# Session

Required by Better Auth. Represents an active login session.

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| userId | UUID |
| token | String |
| expiresAt | DateTime |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- Belongs to one user.

---

# Verification

Required by Better Auth. Stores short-lived tokens for email verification and password reset flows.

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| identifier | String |
| value | String |
| expiresAt | DateTime |
| createdAt | DateTime |

---

# Board

Represents a project or workspace.

Examples:

- Learning
- University
- Freelancing
- Business Ideas

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| title | String |
| description | String (Optional) |
| color | String |
| isFavorite | Boolean |
| userId | UUID |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- Belongs to one user.
- Contains many columns.
- Contains many labels.

---

# Column

Represents a Kanban column.

Examples:

- Todo
- In Progress
- Review
- Done

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| title | String |
| position | Integer |
| boardId | UUID |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- Belongs to one board.
- Contains many tasks.

---

# Task

Represents an individual task.

`isCompleted` and `isArchived` are independent boolean fields, not derived from column — see Application Flow v2 §9.1 for the reasoning (a task can be completed without being archived, and columns are fully user-defined so a "Done" column isn't guaranteed to exist).

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| title | String |
| description | Text |
| priority | Enum |
| dueDate | DateTime (Optional) |
| position | Integer |
| isCompleted | Boolean |
| isArchived | Boolean |
| columnId | UUID |
| createdAt | DateTime |
| updatedAt | DateTime |

## Relationships

- Belongs to one column.
- Has many labels (via `TaskLabel`).
- Has one checklist.
- Has many activity records.

---

# Label

Used to categorize tasks.

Examples:

- React
- Bug
- Design
- Important

Labels are scoped to a board (`boardId`), not global to the user — a label created on one board is not available on another. This keeps label lists relevant per-project rather than one long unmanaged list across all boards.

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| name | String |
| color | String |
| boardId | UUID |

## Relationships

- Belongs to one board.
- Attached to many tasks (via `TaskLabel`).

---

# TaskLabel

Explicit join table for the Task ↔ Label many-to-many relationship. Made explicit (rather than relying on Prisma's implicit join table) so label-based queries and filters (PRD §8 Filters, Application Flow §12) can be indexed and queried directly.

## Fields

| Field | Type |
|---------|---------|
| taskId | UUID |
| labelId | UUID |

## Relationships

- Belongs to one task.
- Belongs to one label.

Composite primary key on (`taskId`, `labelId`).

---

# Checklist

Represents a checklist attached to a task.

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| taskId | UUID |

## Relationships

- Belongs to one task.
- Contains many checklist items.

---

# Checklist Item

Represents an individual checklist item.

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| title | String |
| completed | Boolean |
| position | Integer |
| checklistId | UUID |

## Relationships

- Belongs to one checklist.

---

# Activity

Stores task history.

Examples:

- Created task
- Renamed task
- Changed priority
- Moved task
- Completed task

## Fields

| Field | Type |
|---------|---------|
| id | UUID |
| action | String |
| taskId | UUID |
| createdAt | DateTime |

---

# Relationships Summary

```text
User
 ├── Boards
 ├── Sessions
 └── Accounts

Board
 ├── Columns
 └── Labels

Column
 └── Tasks

Task
 ├── Checklist
 ├── Activity
 └── TaskLabel → Label

Checklist
 └── Checklist Items
```

---

# Future Schema

The following entities may be introduced in future versions:

- Attachments
- Notifications
- Calendar Events
- Recurring Tasks
- Comments
- Teams
- Workspaces
- AI Suggestions

---

# Design Principles

The schema follows these principles:

- Normalize data where practical.
- Keep relationships simple.
- Avoid unnecessary tables.
- Support future scalability.
- Maintain clear ownership through user relationships.

---

# Conclusion

The database schema provides a solid foundation for a personal Kanban Task Manager while remaining flexible enough to support future enhancements without major structural changes.

---

# Changelog

**v2.0.0 (July 2, 2026)**

- Removed `password` from `User` and added `Account`, `Session`, and `Verification` tables, matching Better Auth's required schema (Tech Stack §6). Previously the `password` field on `User` would have conflicted with how Better Auth manages credentials.
- Added explicit `TaskLabel` join table for the Task ↔ Label many-to-many relationship, replacing the previously implicit/undefined join.
- Renamed `Task.completed` → `Task.isCompleted` and `Task.archived` → `Task.isArchived` to match the naming and semantics defined in Application Flow v2 §9.1.
- Noted that `Label.boardId` scopes labels per-board by design (not global to the user) — previously implicit, now stated explicitly.
