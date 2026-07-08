# Design System

**Version:** 2.0.0
**Status:** Draft
**Owner:** Sohaima Nasir
**Last Updated:** July 2, 2026

---

# 1. Overview

This document defines the visual identity and design system for the Kanban Task Manager.

The goal is to create a clean, modern, and distraction-free interface that feels welcoming every time a user opens the application.

The design system ensures consistency across all pages and components while making future development easier.

---

# 2. Design Philosophy

The Kanban Task Manager is designed around one idea:

> **Your personal workspace.**

The interface should feel:

- Calm
- Modern
- Minimal
- Comfortable
- Organized
- Productive

It should never feel:

- Overwhelming
- Corporate
- AI-generated
- Over-designed
- Filled with unnecessary effects

Every design decision should reduce friction and help users focus on their work.

---

# 3. Theme

The application ships with **dark mode only in V1.**

Dark mode is the sole experience for this release — there is no light palette yet, so there is nothing to toggle between. The "Toggle theme" option listed under Profile Flow is deferred until a light palette exists (see §21 Future Design Enhancements); it should not appear in the V1 Profile screen.

next-themes (per the Tech Stack doc) is still used under the hood so the app is structured to support a theme switch later without rework — it just resolves to dark mode only for now.

---

# 4. Color Palette

## Background

| Purpose | Color |
|----------|---------|
| Main Background | `#18181B` |
| Secondary Background | `#27272A` |
| Surface | `#3F3F46` |

---

## Primary Accent

The primary brand color is **Pink**.

| Purpose | Color |
|----------|---------|
| Primary | `#EC4899` |
| Hover | `#DB2777` |
| Light Accent | `#F9A8D4` |

The accent color should be used sparingly to highlight important actions.

Examples:

- Primary buttons
- Active navigation
- Selected cards
- Focus states
- Progress indicators

---

## Status Colors

| State | Color |
|---------|---------|
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |
| Info | `#3B82F6` |

---

## Text Colors

| Purpose | Color |
|----------|---------|
| Primary Text | `#FAFAFA` |
| Secondary Text | `#A1A1AA` |
| Disabled | `#71717A` |

---

## Borders

| Purpose | Color |
|----------|---------|
| Border | `#3F3F46` |

Borders should remain subtle and never dominate the interface.

---

## Priority Colors

Task priority (Low / Medium / High, per the PRD) reuses the existing Status Colors above rather than introducing new ones:

| Priority | Color | Source |
|----------|---------|---------|
| Low | `#3B82F6` (Info) | Status Colors |
| Medium | `#F59E0B` (Warning) | Status Colors |
| High | `#EF4444` (Error) | Status Colors |

Used as a small dot, left border accent, or badge on task cards (§13) — not as a full card background, to keep cards calm and scannable.

---

## Label Colors

Labels are user-created with an assigned color (per PRD Label Management). Rather than a free color picker, users choose from a fixed swatch pulled from the palette already defined in this document, so custom labels can't introduce visually inconsistent or clashing colors:

| Swatch | Color |
|----------|---------|
| Pink | `#EC4899` (Primary Accent) |
| Blue | `#3B82F6` (Info) |
| Green | `#22C55E` (Success) |
| Amber | `#F59E0B` (Warning) |
| Red | `#EF4444` (Error) |
| Gray | `#A1A1AA` (Secondary Text) |

This keeps every color in the app traceable back to one palette instead of accumulating arbitrary one-off hex values.

---

# 5. Typography

## Primary Font

**Geist**

Reasons:

- Modern appearance
- Excellent readability
- Optimized for web applications
- Works seamlessly with Next.js

---

## Font Sizes

| Element | Size |
|----------|------|
| Page Title | 32px |
| Section Title | 24px |
| Card Title | 18px |
| Body Text | 16px |
| Small Text | 14px |
| Caption | 12px |

---

## Font Weights

| Weight | Usage |
|----------|---------|
| 700 | Headings |
| 600 | Card Titles |
| 500 | Buttons |
| 400 | Body Text |

---

# 6. Icons

Icon Library:

**Lucide React**

Reasons:

- Lightweight
- Consistent style
- Modern
- Easy customization

Icons should support the interface rather than dominate it.

---

# 7. Spacing System

The application follows an **8-point spacing system**.

Available spacing values:

- 4px
- 8px
- 16px
- 24px
- 32px
- 40px
- 48px
- 64px

Consistent spacing improves readability and visual balance.

---

# 8. Border Radius

| Component | Radius |
|------------|---------|
| Buttons | 10px |
| Inputs | 10px |
| Cards | 12px |
| Dialogs | 16px |
| Dropdowns | 10px |

Rounded corners create a friendly and modern appearance.

---

# 9. Shadows

Shadows should remain subtle.

Purpose:

- Separate layers
- Improve readability
- Add depth

Avoid heavy shadows or floating effects.

---

# 10. Layout

The application uses a sidebar layout.

```text
┌──────────────┬───────────────────────────────────────┐
│              │                                       │
│   Sidebar    │            Main Content              │
│              │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

The sidebar remains visible on desktop and becomes collapsible on smaller screens.

---

# 11. Dashboard Layout

The dashboard is the first screen users see after logging in.

It should immediately answer:

- What should I work on today?
- What needs attention?
- Where was I last working?

Primary sections:

- Personalized greeting
- Today's tasks
- Overdue tasks
- Favorite boards
- Recent boards
- Recent tasks
- Quick Add Task

---

# 12. Board Layout

Each board consists of:

- Board header
- Search
- Filters
- Kanban columns
- Floating Add Task button (optional)

The board should remain the visual focus.

---

# 13. Task Card Design

Task cards should remain compact while displaying important information.

Each card includes:

- Title
- Priority (color per §4 Priority Colors)
- Due Date
- Labels (color per §4 Label Colors)
- Checklist progress

Cards should be easy to scan at a glance.

---

# 14. Task Details

Selecting a task opens a side panel or modal.

The user should never leave the board to edit a task.

The panel includes:

- Title
- Description
- Priority
- Labels
- Due Date
- Checklist
- Notes
- Activity History

---

# 15. Buttons

Button hierarchy:

### Primary

Used for the main action on a page.

Examples:

- Create Task
- Save
- Create Board

---

### Secondary

Used for supporting actions.

Examples:

- Cancel
- Edit
- Back

---

### Destructive

Used only for dangerous actions.

Examples:

- Delete Board
- Delete Task
- Remove Account

Always display confirmation before destructive actions.

---

# 16. Forms

Forms should prioritize clarity.

Guidelines:

- Labels above inputs
- Helpful placeholder text
- Instant validation feedback
- Clear error messages

---

# 17. Animations

Animations should feel natural.

Recommended duration:

150–250ms

Examples:

- Hover
- Button press
- Sidebar toggle
- Modal opening
- Drag and drop

Avoid unnecessary animations.

---

# 18. Empty States

Every empty state should encourage action.

Examples:

No boards yet.

> Create your first board and start organizing your work.

No tasks today.

> You're all caught up today. 🌸

Search returned nothing.

> No matching tasks were found.

---

# 19. Responsive Design

The application should work on:

- Mobile
- Tablet
- Laptop
- Desktop

On smaller screens:

- Sidebar collapses
- Boards scroll horizontally
- Modals become full screen when necessary

---

# 20. Accessibility

The application should follow accessibility best practices.

Requirements:

- Keyboard navigation
- Visible focus states
- Proper color contrast
- Semantic HTML
- ARIA labels where necessary

---

# 21. Future Design Enhancements

Potential additions include:

- Light mode (and the theme toggle deferred from V1, per §3)
- Multiple accent colors
- Theme customization
- Compact layout
- Comfortable layout
- Larger text option

---

# 22. Design Principles

Every screen should follow these principles:

- Simplicity over complexity
- Consistency over creativity
- Function over decoration
- Readability over density
- Comfort over novelty

When in doubt, choose the simpler solution.

---

# 23. Conclusion

The Kanban Task Manager should feel like opening a clean, organized workspace rather than a traditional project management application.

Every component, interaction, and visual element should support productivity while maintaining a calm and enjoyable user experience.

---

# 24. Changelog

**v2.0.0 (July 2, 2026)**

- Resolved the dark-mode-only vs. theme-toggle contradiction (§3): V1 ships dark mode only, and "Toggle theme" is deferred to Future Design Enhancements (§21) until a light palette exists. next-themes remains in place structurally for when that ships.
- Added Priority Colors (§4), mapping Low/Medium/High to the existing Status Colors (Info/Warning/Error) instead of introducing new hex values.
- Added Label Colors (§4), defined as a fixed 6-swatch palette pulled entirely from colors already in this document, rather than a free color picker — keeps every color in the app traceable to one source.
- Referenced these new color mappings from Task Card Design (§13).

**Note:** Application Flow §13 (Profile Flow) still lists "Toggle theme" as a V1 option — that doc should be updated to match this decision in a future pass.
