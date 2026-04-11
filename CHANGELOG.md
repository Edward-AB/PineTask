# Changelog

All notable changes to PineTask are documented in this file.

## [2.0.0] — 2026-04-11

### Added

- **Multi-page application** with React Router v6 (17 routes)
- **RESTful API** with 25+ endpoints on Cloudflare Pages Functions
- **Relational database** schema with 11 tables (migrated from JSON blob)
- **Theme system** with forest (light) and dark modes, 50+ design tokens
- **Landing page** with hero, features grid, social proof, and CTA
- **Authentication** with JWT, password strength indicator, email validation
- **4-step onboarding wizard** (welcome, role, work hours, first project)
- **Dashboard** with three-column layout (greeting, tasks, calendar)
- **Day schedule** — 24-hour drag-and-drop timeline with overlap columns
- **Task management** — priorities, 6 colours, duration, scheduling, inline edit
- **Deadline system** — grouped by project, progress tracking, overdue alerts
- **Events** — calendar events separate from tasks, indigo styling
- **Projects** — list page, detail with manage/analytics tabs, Gantt chart
- **Focus timer** — presets, SVG progress ring, Web Audio alarm, header badge
- **Analytics** — productivity chart, completion heatmap, streaks, priority breakdown, project progress
- **Celebrations** — canvas fireworks with sound when all daily tasks complete
- **Day notes** — collapsible daily journal per date
- **Account management** — profile, password change, delete with confirmation
- **Settings** — theme, sounds, celebrations, work hours, task defaults
- **Admin panel** — platform stats, user table with search and pagination
- **Help page** — getting started guide, keyboard shortcuts, FAQ
- **74 React components** across 14 feature directories
- **15 custom hooks** (tasks, deadlines, projects, events, timer, keyboard, etc.)
- **14 CSS animations** (fadeIn, slideUp, scaleIn, shimmer, checkPop, confetti, etc.)
- **PWA manifest** with standalone display mode
- **SEO** — Open Graph tags, Twitter cards, theme-color
- **Loading skeletons** with shimmer animation on every page
- **Empty states** with friendly messages and icons
- **Keyboard shortcuts** (N, T, D, arrows, Esc, ?)
- **Responsive layout** — single-column on mobile, three-column on desktop

### Changed

- Migrated from single `App.jsx` (1,900 lines) to 125+ files
- Migrated from JSON blob (`store` table) to 11 relational tables
- Upgraded to React 18 + React Router v6
- All API calls use JWT authentication
- All task operations use optimistic updates
- Passwords hashed with HMAC-SHA256 + salt

### Fixed

- P-01: Pie chart artifact at 12 o'clock position for 0%/100% values
- P-03: Calendar task pills stay within schedule bounds
- P-05: Overlapping tasks compute columns correctly
- P-06: Consistent 3px priority border on all task items
- P-07: Distinct chart colours for priority levels
- P-22: Day schedule scrolls within card, not page
- P-29: Now-line updates position every 30 seconds
- P-57: Colour picker uses fixed grid layout (no shifting)
- Dev-43: All task fields editable after creation
- Dev-46: Add task form resets colour and priority after submit

## [1.0.0] — 2026-03-01

Initial release. Single-page app with inline styles and JSON-blob database.
