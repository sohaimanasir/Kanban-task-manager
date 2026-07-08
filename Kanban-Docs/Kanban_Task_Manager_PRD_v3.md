# Product Requirements Document (PRD)

**Project Name:** Kanban Task Manager

**Version:** 3.0.0

**Status:** Planning

**Owner:** Sohaima Nasir

**Last Updated:** July 2, 2026

---

# 1. Introduction

The Kanban Task Manager is a modern web application designed to help individuals organize, prioritize, and track their work using the Kanban methodology.

This project is being developed primarily as a personal productivity tool and a portfolio project to demonstrate modern full-stack web development skills.

The application focuses on providing an intuitive and responsive experience for managing tasks across multiple boards while maintaining a clean, distraction-free interface.

---

# 2. Problem Statement

Managing multiple projects, learning goals, freelance work, university assignments, and personal tasks across different applications often leads to fragmented information and reduced productivity.

Existing task management applications frequently include unnecessary complexity or paid features that are not required for individual users.

The goal of this project is to create a lightweight yet powerful Kanban application that provides essential task management features while remaining simple and enjoyable to use.

---

# 3. Product Vision

To build a fast, intuitive, and visually appealing Kanban Task Manager that simplifies personal task management while serving as a production-quality portfolio project.

---

# 4. Goals

## Primary Goals

- Build a modern full-stack web application.
- Practice scalable software architecture.
- Improve frontend and backend development skills.
- Learn real-world project planning.
- Create a portfolio-quality application.

## User Goals

Users should be able to:

- Organize tasks efficiently.
- Track project progress.
- Prioritize important work.
- Reduce clutter.
- Manage multiple projects from one place.

---

# 5. Target Users

## Primary User

Individual users who want to manage personal or professional projects.

Examples include:

- Students
- Freelancers
- Developers
- Designers
- Small business owners
- Content creators

---

# 6. Success Metrics

The project will be considered successful if users can:

- Create multiple boards.
- Organize tasks into columns.
- Move tasks using drag and drop.
- Quickly find tasks.
- Track progress visually.
- Use the application comfortably on desktop and mobile devices.

---

# 7. Scope

## In Scope

- Authentication
- Boards
- Columns
- Tasks
- Labels
- Due dates
- Priorities
- Drag and drop
- Search
- Responsive UI
- Dark mode
- Activity history

## Out of Scope (Version 1)

- Team collaboration
- Real-time updates
- AI features
- File storage
- Calendar synchronization
- Email notifications
- Mobile application

---

# 8. Core Features

## Dashboard

- View all boards
- Create board
- Delete board
- Favorite boards

## Board Management

- Create board
- Edit board
- Delete board

## Column Management

- Create columns
- Rename columns
- Delete columns
- Reorder columns

## Label Management

- Create label
- Edit label (name, color)
- Delete label
- Assign label(s) to a task
- Remove label from a task

## Task Management

Each task includes:

- Title
- Description
- Priority (see §8.1 below)
- Due date
- Labels
- Checklist
- Notes
- Activity history

### 8.1 Priority Levels

Tasks support three priority levels:

- **Low**
- **Medium**
- **High**

Priority is used both when displaying a task (e.g., a colored indicator) and when filtering (§8.3).

## Search

Search supports:

- Board names
- Task titles

## Filters

Filter tasks by:

- Priority
- Labels
- Due date
- Completion status

---

# 9. Non-Functional Requirements

- Responsive design
- Fast page loading
- Clean UI
- Accessible interface
- Secure authentication
- Scalable architecture
- Maintainable codebase

---

# 10. Assumptions

- Users have a modern web browser.
- Internet connection is available.
- The application is used on both desktop and mobile devices via a responsive web UI (no native mobile app in Version 1 — see §7 Out of Scope).
- The application is intended for personal productivity rather than enterprise collaboration.

---

# 11. Constraints

- Initial release focuses on individual users.
- No third-party integrations in Version 1.
- Development prioritizes simplicity over feature quantity.

---

# 12. Future Enhancements

Potential future features include:

- Team collaboration
- Workspace support
- Calendar view
- Timeline view
- File attachments
- Notifications
- Recurring tasks
- GitHub integration
- AI-powered task suggestions
- Mobile application

---

# 13. Project Principles

This project follows the following principles:

- Simplicity first.
- Performance over unnecessary animations.
- Consistent user experience.
- Clean and maintainable architecture.
- Accessibility by default.
- Mobile-friendly design.
- Incremental feature development.

---

# 14. Conclusion

The Kanban Task Manager aims to provide a clean and efficient productivity experience while acting as a showcase of modern software engineering practices.

The project prioritizes usability, maintainability, and scalability, providing a strong foundation for future enhancements.

---

# 15. Changelog

**v2.0.0 (July 2, 2026)**

- Resolved contradiction between §10 (desktop-only assumption) and §6/§9/§13 (desktop + mobile requirement) — assumption now states responsive web on both, no native app.
- Added defined priority levels (Low / Medium / High) as §8.1.
- Added Label Management subsection to §8 (create, edit, delete, assign, remove — previously undefined).

**v3.0.0 (July 2, 2026)**

- Extended §8 Search to include board names (previously task titles only), aligning with Application Flow v2 §11.
- Added Completion Status to §8 Filters (previously missing), aligning with Application Flow v2 §12, which filters on the `isCompleted` field defined there.
