# Development Rules

**Version:** 2.0.0
**Status:** Active
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# Purpose

This document defines the engineering standards for the Kanban Task Manager project.

Every contributor, including AI coding assistants, should follow these rules to ensure the project remains clean, consistent, maintainable, and scalable.

---

# General Principles

- Write clean, readable code.
- Prefer simplicity over cleverness.
- Prioritize maintainability.
- Avoid unnecessary complexity.
- Keep files small and focused.
- Follow existing project conventions.

---

# Code Quality

- Use TypeScript for all application code.
- Do not use `any` unless absolutely necessary.
- Remove unused imports, variables, and functions.
- Avoid duplicate code.
- Refactor when repetition appears.
- Write self-explanatory code before adding comments.

---

# Project Structure

- Keep folders organized by feature.
- Separate UI, business logic, and data access.
- Do not place unrelated code in the same file.
- Reuse components whenever possible.

---

# Components

- Components should have a single responsibility.
- Keep components small and reusable.
- Prefer composition over large components.
- Avoid deeply nested component trees.

---

# Styling

- Use Tailwind CSS utilities.
- Follow the design system.
- Avoid inline styles.
- Keep styling consistent across the application.
- Priority and Label colors must use the fixed values defined in the Design System doc (§4 Priority Colors, §4 Label Colors) — never introduce a new one-off hex value for either.

---

# State Management

- Use Zustand only for client-side UI state (theme, sidebar state, selected board, UI toggles).
- Use TanStack Query for all server data (boards, columns, tasks, labels, etc.) — fetching, caching, and mutations.
- Never store server data inside Zustand. If it comes from the database, it belongs in TanStack Query, not the Zustand store.

---

# Validation

- Use Zod schemas for all incoming data — both API route handlers and forms (via React Hook Form's Zod resolver).
- Define a Zod schema once per entity/shape and reuse it across the form and the corresponding API route where possible, rather than duplicating validation logic.
- Reject invalid input at the boundary (API route) even if the form already validated it — never trust client-side validation alone.

---

# Database

- Never duplicate data unnecessarily.
- Use proper relationships.
- Keep queries efficient.
- Use Prisma for all database operations.

---

# API

- Validate all incoming data (see Validation above).
- Return consistent response formats.
- Handle errors gracefully.
- Never expose sensitive information.

---

# Authentication

- Protect private routes.
- Never trust client-side validation.
- Never handle raw credentials directly — all credential storage, hashing, and session management is owned by Better Auth via its `Account`, `Session`, and `Verification` tables (see Schema doc). Do not add custom password fields or hashing logic anywhere in the app.
- Validate user ownership before accessing resources.

---

# Error Handling

- Handle expected errors gracefully.
- Show user-friendly error messages.
- Avoid exposing internal implementation details.
- Log unexpected errors where appropriate.

---

# Performance

- Avoid unnecessary re-renders.
- Lazy load when beneficial.
- Optimize database queries.
- Keep bundle size reasonable.

---

# Accessibility

- Use semantic HTML.
- Support keyboard navigation.
- Maintain sufficient color contrast.
- Provide accessible labels for interactive elements.

---

# Git

- Make small, focused commits.
- Write meaningful commit messages.
- Keep the main branch stable.

---

# Documentation

- Update documentation when architecture or behavior changes.
- Keep documentation concise and accurate.

---

# Before Merging

Every feature should:

- Compile successfully.
- Pass linting.
- Match the design system.
- Handle common edge cases.
- Be reviewed before merging.

---

# Rule of Thumb

When multiple solutions exist:

1. Choose the simplest.
2. Choose the most readable.
3. Choose the most maintainable.

If a solution feels overly clever, it is probably not the right one.

---

# Changelog

**v2.0.0 (July 2, 2026)**

- Reworded the Authentication rule "Store passwords securely" to reflect that Better Auth owns all credential storage/hashing via its own tables (Schema v2) — the app should never implement its own password handling.
- Added a Validation section specifying Zod as the required validation layer for both API routes and forms, per Tech Stack §7.
- Added a State Management section codifying the Zustand (UI state) vs. TanStack Query (server state) boundary from Tech Stack §9, so server data never ends up in Zustand.
- Added an explicit rule under Styling tying Priority and Label colors to the fixed values in the Design System doc, rather than relying on "follow the design system" alone.
