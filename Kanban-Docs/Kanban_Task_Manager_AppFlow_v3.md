# Application Flow

**Version:** 3.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# 1. Overview

The Application Flow defines how users navigate through the Kanban Task Manager from the moment they visit the application until they complete their daily work.

Unlike traditional project management tools designed for teams, this application is built around the concept of a **personal workspace**. Every registered user has their own private dashboard, boards, tasks, and settings.

The goal is to make the application feel welcoming, intuitive, and productive while keeping navigation simple and predictable.

---

# 2. Application Philosophy

The application should feel like opening your personal workspace every day.

Rather than overwhelming users with unnecessary information, the interface should immediately present what matters most:

- Today's tasks
- Current progress
- Favorite boards
- Upcoming deadlines
- Recently updated work

Every screen should reduce friction and help users focus on completing work.

---

# 3. High-Level Application Flow

```text
User Visits Website
        │
        ▼
Landing Page
        │
        ▼
Login / Register
        │
        ▼
Authentication
        │
        ▼
Load User Session
        │
        ▼
Personal Dashboard
        │
        ├───────────────┐
        │               │
        ▼               ▼
Open Board      Quick Add Task
        │
        ▼
Manage Tasks
        │
        ▼
Save Changes
        │
        ▼
Dashboard Updates
```

---

# 4. Landing Page

The landing page introduces the application to new users.

Its purpose is to explain the product, highlight key features, and encourage users to create an account.

Sections include:

- Hero section
- Feature overview
- Screenshots
- Call-to-action
- Login
- Register

Authenticated users should automatically bypass the landing page and be redirected to their dashboard.

---

# 5. Authentication Flow

When a user attempts to access the application, authentication is checked.

```text
Visit Application
        │
        ▼
Check Session
        │
 ┌──────┴──────┐
 │             │
 ▼             ▼
Logged In   Not Logged In
 │             │
 ▼             ▼
Dashboard   Login Page
```

After a successful login:

```text
Validate Credentials
        │
        ▼
Create Session
        │
        ▼
Redirect to Dashboard
```

---

# 6. Dashboard Flow

The dashboard serves as the central hub of the application.

It provides a personalized overview of the user's productivity and allows quick access to frequently used features.

The dashboard includes:

- Personalized greeting
- Today's tasks
- Overdue tasks
- Due this week
- Favorite boards
- Recent boards
- Recent tasks
- Productivity summary
- Quick Add Task button

Example:

```text
Good Morning, Sohaima ☀️

Today's Tasks: 5

Overdue: 1

Due This Week: 8

Favorite Boards

📚 Learning

💼 Freelancing

🎓 University

💡 Business Ideas

Recent Tasks

Quick Add Task
```

---

# 7. Board Flow

Users can create multiple boards to organize different areas of their work.

Examples:

- Learning
- Freelancing
- University
- Personal
- Business Ideas

Opening a board loads all associated columns and tasks.

```text
Dashboard
      │
      ▼
Open Board
      │
      ▼
Load Columns
      │
      ▼
Load Tasks
```

---

# 8. Column Flow

Columns represent the workflow stages of a board.

Default columns may include:

- Todo
- In Progress
- Review
- Done

Users can:

- Create columns
- Rename columns
- Delete columns
- Reorder columns

---

# 9. Task Flow

Tasks represent individual pieces of work.

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Archive tasks
- Move tasks between columns
- Mark tasks as completed

Typical workflow:

```text
Create Task
      │
      ▼
Add Details
      │
      ▼
Save
      │
      ▼
Move Through Workflow
      │
      ▼
Complete or Archive
```

## 9.1 Task States (Completed vs. Archived)

To avoid ambiguity in the data model, task state is defined as follows:

- **Completed** is an independent boolean field on the task (`isCompleted`), separate from which column the task sits in. Moving a task into a "Done" column does **not** automatically mark it completed — the user marks it explicitly (e.g., via a checkbox). This allows a task to be marked complete without forcing a specific column structure, since columns are fully user-defined (§8) and a "Done" column isn't guaranteed to exist.
- **Archived** is a separate boolean field (`isArchived`) representing a soft-delete state. Archived tasks are hidden from the board view by default but remain retrievable from a dedicated Archive view, and can be restored or permanently deleted from there.
- A task can be completed without being archived (e.g., staying visible as a finished item), and archiving is a distinct, later action the user takes to clean up the board.

---

# 10. Task Details

Selecting a task opens a detailed task panel or modal.

Each task may contain:

- Title
- Description
- Priority
- Due Date
- Labels
- Checklist
- Notes
- Activity History

All updates should save without requiring the user to leave the current board.

---

# 11. Search Flow

Users can quickly locate information through search.

Search supports:

- Board names
- Task titles

Search results should update instantly as users type.

---

# 12. Filtering

Boards support filtering tasks by:

- Priority
- Labels
- Due Date
- Completion Status (uses the `isCompleted` field defined in §9.1)

Filters only affect the currently opened board.

---

# 13. Profile Flow

Users can manage their personal account.

Available options:

- Update profile
- Change password
- Logout

Theme toggle is not available in V1 — the application ships dark mode only (per the Design System doc §3). A toggle will be added once a light palette exists.

Avatar upload is deferred to a future version — it requires file storage (Cloudinary), which is out of scope for V1 per the PRD and Tech Stack documents.

---

# 14. Logout Flow

```text
Logout
   │
   ▼
Destroy Session
   │
   ▼
Redirect to Login
```

---

# 15. Empty States

The application should provide meaningful empty states to guide users.

Examples include:

- No boards yet
- No tasks today
- Search returned no results
- Empty checklist
- No favorite boards
- No archived tasks

Each empty state should encourage the next logical action instead of displaying a blank screen.

---

# 16. Personalized Dashboard Experience

The dashboard should adapt based on the user's progress.

Examples:

### New User

```text
Welcome, Sohaima 👋

Let's create your first board.
```

### Active Day

```text
Good Afternoon, Sohaima 🌿

Today's Tasks: 6

Overdue: 2

You're making great progress today.
```

### Everything Completed

```text
Good Evening, Sohaima 🌙

Everything is complete today.

Fantastic work! 🎉
```

These personalized messages create a welcoming and motivating experience every time the application is opened.

---

# 17. Design Principles

The application should follow these principles:

- Personal-first experience
- Minimal clicks
- Fast interactions
- Consistent navigation
- Responsive design
- Accessibility
- Clear visual hierarchy
- Immediate feedback
- Distraction-free interface

---

# 18. Future Expansion

Although the application is designed around personal productivity, the architecture should allow future enhancements without requiring major redesigns.

Potential future additions include:

- Team workspaces
- Shared boards
- Real-time collaboration
- Calendar view
- Timeline view
- Notifications
- File attachments
- AI assistance
- Avatar upload (requires file storage — see §13)

---

# 19. Summary

The Kanban Task Manager is designed to provide every user with their own personal workspace for managing tasks and projects.

The application emphasizes simplicity, productivity, and clarity while maintaining a scalable architecture for future growth.

Every interaction should help users focus on their work with minimal effort, making the application feel like a personalized productivity companion rather than a traditional project management system.

---

# 20. Changelog

**v2.0.0 (July 2, 2026)**

- Defined the distinction between "Completed" and "Archived" task states (§9.1) — previously undefined, now specified as two independent boolean fields rather than column-derived state. This directly informs the Prisma schema.
- Deferred avatar upload (§13) to Future Expansion (§18), since it requires file storage which is out of scope for V1 per the PRD and Tech Stack docs.
- Kept board-name search (§11) and completion-status filtering (§12) as-is, per product decision — PRD §8 (Search/Filters) should be updated to match, since it currently only lists task-title search and doesn't mention completion status as a filter.

**v3.0.0 (July 2, 2026)**

- Removed "Toggle theme" from Profile Flow (§13) and replaced it with a note that V1 is dark-mode only, resolving the contradiction with Design System v2 §3. The toggle returns once a light palette ships.
