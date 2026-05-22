# Chelsea Man Spa — Staff Management Platform

## Project Overview
Staff management dashboard for Chelsea Man Spa with auth, role-based access, and CRUD for services/stylists/bookings.

## Tech Stack
- **Auth & Database**: Supabase (anon key in `public/js/config.js`, gitignored)
- **Frontend**: Vanilla HTML/CSS/JS — no frameworks
- **Theme**: Dark/gold (#0A0907 background, #D4AF37 accents, Inter font)

## Supabase Credentials
- Project URL: `https://pzbiydpbwrkmjjvhfokm.supabase.co`
- Anon Key: `sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y`
- Stored in: `public/js/config.js` (gitignored)
- Placeholder template: `public/js/config.example.js`

## Database Tables Needed (create in Supabase SQL Editor)

### profiles (staff/admin auth)
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'staff'
);
```

### customers (client auth)
```sql
create table customers (
  id uuid primary key references auth.users(id),
  email text not null,
  name text
);
```

### services
```sql
-- assumed existing: id (uuid), name, price
```

### stylists
```sql
-- assumed existing: id (uuid), name, role, is_active
```

### bookings
```sql
-- assumed needs creation:
-- id (uuid PK), service_id (FK→services), stylist_id (FK→stylists),
-- start_time (timestamptz), customer_name (text), created_at (default now())
```

## Login Flow (`public/js/auth.js`)
1. `signInWithPassword()` → if error, `alert()` and return
2. Set `loginTime` in localStorage
3. Check `profiles` table → if found, set `userRole` → redirect `index.html`
4. Check `customers` table by email → if found, redirect `client-dashboard.html`
5. If neither → `signOut()` + `alert('Account type not recognized.')`

## Session Lock
- `loginTime` stored in localStorage on login
- `checkSessionExpiration()` runs on page load
- If > 1 hour since login, signs out and redirects to `login.html`
- Gatekeeper script at top of `index.html` checks before any other JS runs

## Auth Architecture
- `public/js/config.js` — Supabase credentials (gitignored)
- `public/js/supabaseClient.js` — creates client from window variables
- `public/js/auth.js` — signIn, logout, getSession, requireAuth, checkSessionExpiration
- `public/js/authGuard.js` — IIFE that redirects to login.html if no Supabase session
- Role stored in localStorage as `userRole` — all comparisons use `.toLowerCase()`

## Pages
| Page | URL | Access |
|---|---|---|
| Login | `login.html` | Public |
| Manager Dashboard | `index.html` | All authenticated users (admin sees more) |
| Services | `services.html` | Admin only (redirects non-admin) |
| Roster | `roster.html` | Admin only (redirects non-admin) |
| Bookings | `bookings.html` | Admin only (redirects non-admin) |

## Key Decisions
- `profiles` table needed in Supabase before login works
- Email auth provider must be enabled in Supabase Dashboard
- Anon key is publishable but still gitignored for safety
- Soft-delete for stylists (`is_active = false`)
- Role-based UI uses `.admin-only` CSS class
- `applyRoleBasedUI()` uses `setProperty('display', 'block', 'important')` on `#admin-controls`
- Gatekeeper script in `index.html` reads `loginTime` directly (no Supabase dependency)
- Back-button prevention via `window.history.pushState` + `onpopstate`
- Password toggle with 👁️/🙈 icon swap
- All error messages surfaced via `alert()` in `auth.js`

## Git Branches
- `feature/stylist-roster` — previous branch
- `feature/ui-redesign` — current stable branch (created 22 May 2026)

## Project Structure
```
chelsea-man-spa-mobile/
├── public/
│   ├── index.html          — Manager Dashboard
│   ├── login.html          — Login form
│   ├── services.html       — Services management
│   ├── roster.html         — Stylist roster
│   ├── bookings.html       — Bookings management
│   └── js/
│       ├── config.js       — Supabase credentials (gitignored)
│       ├── config.example.js — Placeholder template
│       ├── supabaseClient.js — Supabase client init
│       ├── auth.js         — Auth functions
│       ├── authGuard.js    — Session guard
│       ├── rosterManager.js — Stylist CRUD
│       └── bookingsManager.js — Bookings CRUD
├── .gitignore
├── AGENTS.md               — This file
├── DESIGN.md               — Original design doc
└── README.md
```

## What's Built
- ✅ Admin dashboard (`index.html`) with metrics, today's bookings, action hub
- ✅ Staff login + role-based UI (staff see minimal dashboard, admin sees all)
- ✅ Services management (`services.html`)
- ✅ Stylist roster (`roster.html`) with soft-delete
- ✅ Bookings management (`bookings.html`)
- ✅ Session lock (1-hour timeout)
- ✅ Credentials extracted to gitignored `config.js`

## What's Still Needed (Not Built)
- ❌ **Client login flow** — `customers` table exists in code but needs setup
- ❌ **Client dashboard** — `client-dashboard.html` doesn't exist yet
- ❌ Client-facing booking view (view own appointments)
- ❌ Client self-registration flow
- ❌ Client profile management

## Remaining Setup
- [ ] Enable Email auth provider in Supabase Dashboard
- [ ] Create `profiles` table and insert admin user row
- [ ] Create `customers` table
- [ ] Create `bookings` table if not exists
- [ ] Test full login/logout flow as admin and staff
- [ ] Test role-based redirect: staff → dashboard, admin → all pages
- [ ] Build client dashboard and client-specific features
