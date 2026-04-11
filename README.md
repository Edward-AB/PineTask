# PineTask

**Plan your day. Own your time.**

A visual task manager with smart scheduling, deadlines, focus timer, analytics, and celebrations. Built with React and deployed on Cloudflare.

**Live:** [pinetask.com](https://pinetask.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite 5 |
| Backend | Cloudflare Pages Functions (Workers) |
| Database | Cloudflare D1 (SQLite) |
| Auth | JWT (HMAC-SHA256 via Web Crypto API) |
| Hosting | Cloudflare Pages (auto-deploy on push) |

## Features

- **Dashboard** — Three-column layout with tasks, calendar, and deadlines
- **Day Schedule** — 24-hour drag-and-drop timeline with overlap handling
- **Tasks** — Priorities, colours, duration, scheduling, inline editing
- **Deadlines** — Grouped by project, progress tracking, overdue alerts
- **Projects** — Organisation with analytics, Gantt chart, progress bars
- **Focus Timer** — Presets, progress ring, alarm with Web Audio
- **Events** — Calendar events separate from tasks
- **Analytics** — Productivity chart, completion heatmap, streaks, priority breakdown
- **Celebrations** — Canvas fireworks when all daily tasks complete
- **Theme** — Forest (light) and dark modes with smooth transitions
- **PWA** — Installable progressive web app
- **Responsive** — Full mobile support with single-column layout

## Prerequisites

- Node.js 18+
- npm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for local dev with D1)

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server (frontend only)
npm run dev

# Start full-stack dev server (recommended — includes D1)
npx wrangler pages dev dist --port 8788 --d1 DB=pinetask-db
```

For full-stack development, run `npm run build` first, then `wrangler pages dev`.

## Building

```bash
npm run build
```

Output goes to `dist/`. Cloudflare Pages auto-deploys on push to `main`.

## Deploying

Deployment is automatic via GitHub → Cloudflare Pages integration. Every push to `main` triggers a build and deploy.

Manual deploy (if needed):
```bash
npm run build
npx wrangler pages deploy dist
```

## Database Migrations

### Local

```bash
npx wrangler d1 execute pinetask-db --local --file=migrations/001_create_tables.sql
```

### Production

```bash
npx wrangler d1 execute pinetask-db --remote --file=migrations/001_create_tables.sql
```

D1 only supports single statements per execution. For multi-statement files, execute statements individually or use the Cloudflare dashboard.

## Project Structure

```
pinetask/
├── functions/          # Cloudflare Pages Functions (API)
│   ├── api/
│   │   ├── _middleware.js    # CORS, JWT auth, admin check
│   │   ├── auth/             # login, signup, me, reset, verify
│   │   ├── tasks/            # CRUD, reorder, move
│   │   ├── deadlines/        # CRUD
│   │   ├── projects/         # CRUD
│   │   ├── events/           # CRUD
│   │   ├── blocked-times/    # CRUD
│   │   ├── day-notes/        # GET/PUT
│   │   ├── account/          # profile, password, settings
│   │   ├── admin/            # users, stats
│   │   └── stats/            # personal analytics
│   └── [[catchall]].js       # SPA fallback
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # React Router (17 routes)
│   ├── api/client.js         # API client with JWT
│   ├── context/              # Theme, Auth, Sound providers
│   ├── hooks/                # 15 custom hooks
│   ├── pages/                # 17 page components
│   ├── components/           # 74 components across 14 directories
│   ├── styles/               # Theme, globals, animations
│   ├── constants/            # App constants, route paths
│   └── utils/                # Date, slot, calendar, sound utilities
├── migrations/               # D1 SQL migrations
├── public/                   # Static assets, PWA manifest
└── v1-archive/               # Preserved v1 codebase
```

## Environment Variables

Set in Cloudflare Pages dashboard (never committed):

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | JWT signing key (64-char hex) |
| `SALT` | Password hashing salt (64-char hex) |
| `NODE_VERSION` | Build Node.js version (`18`) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login, returns JWT |
| POST | /api/auth/signup | No | Create account |
| GET | /api/auth/me | Yes | Current user info |
| GET | /api/tasks?from=&to= | Yes | Tasks in date range |
| POST | /api/tasks | Yes | Create task |
| PATCH | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |
| POST | /api/tasks/move | Yes | Move task to date |
| POST | /api/tasks/reorder | Yes | Reorder tasks |
| GET/POST | /api/deadlines | Yes | List/create deadlines |
| PATCH/DELETE | /api/deadlines/:id | Yes | Update/delete deadline |
| GET/POST | /api/projects | Yes | List/create projects |
| GET/PATCH/DELETE | /api/projects/:id | Yes | Project detail CRUD |
| GET/POST | /api/events | Yes | List/create events |
| PATCH/DELETE | /api/events/:id | Yes | Update/delete event |
| GET/POST | /api/blocked-times | Yes | List/create blocked times |
| GET/PUT | /api/day-notes | Yes | Day notes |
| GET/PATCH/DELETE | /api/account | Yes | Account management |
| POST | /api/account/change-password | Yes | Change password |
| GET/PUT | /api/account/settings | Yes | User settings |
| GET | /api/stats | Yes | Personal analytics |
| GET | /api/admin/stats | Admin | Platform stats |
| GET | /api/admin/users | Admin | User management |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new task |
| `T` | Open timer |
| `D` | Toggle dark mode |
| `←` | Previous day |
| `→` | Next day |
| `Esc` | Close modal / cancel |
| `?` | Show help |

## Theming

Two built-in themes: **Forest** (light) and **Dark**. Themes are defined in `src/styles/theme.js` as JavaScript objects with 50+ tokens. The ThemeContext injects tokens as CSS custom properties on `<html>`.

To add a custom theme, create a new theme object in `theme.js` and add it to the theme map.

## Archived Versions

The v1 codebase is preserved in `v1-archive/` for reference. It contains the original single-file App.jsx with inline styles and JSON-blob database.

## Licence

Private project. All rights reserved.
