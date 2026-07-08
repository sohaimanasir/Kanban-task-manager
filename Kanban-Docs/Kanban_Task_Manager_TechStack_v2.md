# Tech Stack

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# 1. Overview

This document outlines the technologies selected for the Kanban Task Manager project and explains the reasoning behind each choice.

The goal is to build a modern, scalable, maintainable, and production-ready full-stack web application using technologies that are widely adopted in the industry.

---

# 2. Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | Next.js 15 |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| Theme Switching | next-themes |
| Icons | Lucide React |
| Drag & Drop | dnd-kit |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL (via Supabase) |
| Database Hosting | Supabase |
| ORM | Prisma |
| Authentication | Better Auth |
| Validation | Zod |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Forms | React Hook Form |
| File Storage | Cloudinary *(Future)* |
| Deployment | Vercel |
| Version Control | Git + GitHub |
| Package Manager | pnpm |

---

# 3. Frontend

## Next.js

Next.js is chosen because it provides a complete framework for building modern React applications with support for:

- App Router
- Server Components
- Route Handlers
- Optimized performance
- Server-side rendering
- Static generation
- Excellent developer experience

---

## React

React provides a component-based architecture that enables reusable UI components and maintainable application structure.

---

## TypeScript

TypeScript improves code quality through static typing.

Benefits include:

- Better IntelliSense
- Type safety
- Easier refactoring
- Reduced runtime errors
- Improved maintainability

---

## Tailwind CSS

Tailwind CSS is selected for styling because it offers:

- Utility-first workflow
- Responsive design
- Consistent spacing
- Fast development
- Excellent performance

---

## shadcn/ui

shadcn/ui provides accessible, customizable UI components without locking the project into a rigid design system.

Advantages:

- Accessible components
- Easy customization
- No unnecessary dependencies
- Modern design

---

## next-themes

next-themes provides dark mode support for the application, satisfying the dark mode requirement defined in the PRD (§7 Scope).

Reasons:

- Works natively with shadcn/ui's theming approach
- Handles system preference detection
- Prevents flash-of-wrong-theme on load
- Minimal setup, no extra state management needed

---

## Lucide React

Lucide React provides lightweight, customizable SVG icons that integrate well with React applications.

---

## dnd-kit

dnd-kit is used for implementing drag-and-drop functionality.

Reasons:

- Modern API
- Excellent accessibility
- High performance
- Flexible architecture
- Actively maintained

---

# 4. Backend

## Next.js Route Handlers

The backend will use Next.js Route Handlers instead of a separate Express server.

Benefits:

- Single codebase
- Simplified deployment
- Shared TypeScript types
- Better developer experience

---

# 5. Database

## PostgreSQL

PostgreSQL is selected because it is:

- Reliable
- Open source
- Highly scalable
- ACID compliant
- Widely used in production

---

## Supabase

Supabase provides managed PostgreSQL hosting for the project.

Reasons:

- Fully managed Postgres with generous free tier
- Built-in connection pooling (via Supavisor), which matters for Prisma in a serverless/Vercel deployment
- Simple dashboard for inspecting data during development
- Room to adopt Supabase Auth, Storage, or Realtime later without migrating databases, if project needs grow beyond current scope
- Prisma connects to it like any standard Postgres instance — no vendor lock-in on the ORM side

Note: Supabase is used here purely as a Postgres host. Auth remains handled by Better Auth (§6), not Supabase Auth, to keep authentication logic in the application layer.

---

## Prisma

Prisma simplifies database interactions.

Benefits:

- Type-safe queries
- Automatic migrations
- Schema management
- Excellent TypeScript support
- Easy development workflow

---

# 6. Authentication

## Better Auth

Better Auth provides secure authentication with modern features.

Planned authentication methods:

- Email and password
- Session management
- Protected routes
- Secure cookies

Future possibilities:

- Google Login
- GitHub Login

---

# 7. Validation

## Zod

Zod will be used for validating incoming data.

Advantages:

- Runtime validation
- Type inference
- Consistent error handling
- Easy integration with React Hook Form

---

# 8. Forms

## React Hook Form

Reasons for selection:

- High performance
- Minimal re-renders
- Excellent TypeScript support
- Easy validation with Zod

---

# 9. State Management

## Zustand

Zustand will manage global client-side state.

Expected use cases:

- Theme
- Sidebar state
- Selected board
- User preferences
- UI state

Server data will **not** be stored in Zustand.

---

# 10. Server State

## TanStack Query

TanStack Query will manage:

- Data fetching
- Caching
- Background refetching
- Optimistic updates
- Request deduplication

This keeps server state separate from UI state.

---

# 11. Development Tools

| Tool | Purpose |
|--------|----------|
| ESLint | Code quality |
| Prettier | Code formatting |
| Husky *(Optional)* | Git hooks |
| lint-staged *(Optional)* | Pre-commit checks |

---

# 12. Deployment

The application will be deployed using Vercel.

Advantages:

- Simple deployment
- GitHub integration
- Preview deployments
- Automatic builds
- Edge infrastructure

---

# 13. Version Control

Git will be used for version control.

GitHub will host:

- Source code
- Documentation
- Issues
- Future project board

---

# 14. Architecture Principles

The project follows these engineering principles:

- Type safety
- Component reusability
- Separation of concerns
- Clean architecture
- Responsive design
- Accessibility
- Performance
- Scalability
- Maintainability

---

# 15. Future Technologies

Potential additions include:

- Redis
- UploadThing
- Resend
- Sentry
- Docker
- Playwright
- Vitest
- GitHub Actions
- PWA support

---

# 16. Conclusion

The selected technology stack emphasizes developer productivity, scalability, maintainability, and modern web development practices. Each technology has been chosen based on its maturity, community support, and compatibility with the overall architecture of the project.

---

# 17. Changelog

**v2.0.0 (July 2, 2026)**

- Added Supabase as the managed PostgreSQL hosting provider (§5), resolving the previously unspecified Postgres hosting gap. Prisma continues to connect to it as a standard Postgres instance.
- Added next-themes (§3) to implement the dark mode requirement from the PRD, which had no theming solution listed in v1.
