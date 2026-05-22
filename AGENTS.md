# Chelsea Man Spa — Staff Management Platform

## Project Overview
Staff management platform for Chelsea Man Spa (men's salon). Started as a Firebase mobile booking app, migrated to Supabase. Currently has:
- Admin dashboard with metrics (total bookings, active services, active stylists, total revenue AED, most popular service)
- Staff management (services CRUD, stylist roster with soft-delete, bookings management)
- Auth with Supabase (email/password)
- Session lock (1-hour timeout)
- Role-based UI (admin vs staff views)
- **Client features NOT built yet** — needs client dashboard, client booking view, self-registration

## Tech Stack
- **Auth & Database**: Supabase (`pzbiydpbwrkmjjvhfokm` project)
- **Frontend**: Vanilla HTML/CSS/JS — no frameworks, no build step
- **Theme**: Dark/gold (#0A0907 bg, #D4AF37 gold, #F5EDE3 text, Inter font)
- **Serving**: Local dev via `python -m http.server <port>` from `public/`
- **Auth Flow**: Login checks `profiles` table first (admin/staff), then `customers` table (clients)

## Supabase Credentials
- Project URL: `https://pzbiydpbwrkmjjvhfokm.supabase.co`
- Anon Key: `sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y`
- Stored in: `public/js/config.js` (gitignored via `.gitignore:6`)
- Public template: `public/js/config.example.js` (placeholder values, committed)
- **Supabase setup needed**: Enable Email Auth Provider in Dashboard > Authentication > Providers

## CSS / Design Details
- Body: `font-family Inter, #0A0907 background, #F5EDE3 color, 32px 24px padding, min-height 100vh`
- Containers: `.container` max-width 960px, centered
- Nav bar: flex, 24px gap, bottom border #1E1C18, links #9C927D → hover #D4AF37
- `.btn-logout`: border #3D1A1A, color #E87A7A, hidden by default (`display: none`), shown via JS
- Metrics grid: 3 columns, 16px gap, `.metric-card` with #12110E bg, #1E1C18 border, gold numbers
- Today bookings table: `.today-wrap` with #12110E bg, styled th/td
- Action hub: `.action-hub` 3-column grid, `.action-card` cards with icon/label/description
- `.admin-only` elements hidden for staff, shown for admin via JS
- Buttons/links use #D4AF37 gold accent
- Responsive: at 768px, nav wraps, metrics & action hub go single column

## All Files Created/Modified

### Root
| File | Purpose |
|---|---|
| `.gitignore` | Ignores `node_modules/`, `.env`, `.DS_Store`, `dist/`, `build/`, `public/js/config.js` |
| `AGENTS.md` | This file — full project memory |

### public/ (all pages load scripts in this order: supabase CDN → config.js → supabaseClient.js → auth.js → authGuard.js → page-specific JS)
| File | Purpose | Key Details |
|---|---|---|
| `index.html` | Manager Dashboard | 5 metric cards, Today's Bookings table (date-filtered), action hub (Manage Services/Roster/Bookings), gatekeeper script (first script), back-button prevention, `applyRoleBasedUI()`, `#admin-controls` on nav span |
| `login.html` | Login form | Dark-themed, email/password, password toggle (👁️/🙈), calls `signIn()` from auth.js |

### public/ — Management Pages (all have inline redirect: if role !== admin, go to index.html)
| File | Purpose | Key Details |
|---|---|---|
| `services.html` | Services CRUD | Table, modal for add/edit (assumes JS handler exists or TBD) |
| `roster.html` | Stylist roster | Table, modal for add/edit, soft-delete modal, `rosterManager.js` handles CRUD |
| `bookings.html` | Bookings management | Booking form (service/stylist selects, datetime, customer name), table with delete, `bookingsManager.js` loads dropdowns + CRUD |

### public/js/
| File | Purpose | Key Details |
|---|---|---|
| `config.js` | Real Supabase creds | **Gitignored** — sets `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` |
| `config.example.js` | Placeholder template | Committed — `YOUR_PROJECT.supabase.co` / `sb_publishable_YOUR_ANON_KEY` |
| `supabaseClient.js` | Supabase client | Reads from `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`, creates `window.supabaseClient` |
| `auth.js` | Auth functions | `signIn()`, `logout()`, `getSession()`, `requireAuth()`, `checkSessionExpiration()` |
| `authGuard.js` | Session guard | IIFE — if no Supabase session, redirect to `login.html` |
| `rosterManager.js` | Stylist CRUD | Fetch/display, modal show/hide, insert/update/soft-delete via Supabase |
| `bookingsManager.js` | Bookings CRUD | Load services & stylists dropdowns, fetch with joins, insert form, default datetime |

## Login Flow (`public/js/auth.js:10-63`)
1. `signInWithPassword(email, password)` — if Supabase error, `alert(error.message)` and return
2. If no user returned → `alert('Login failed. Please try again.')`
3. Set `localStorage.setItem('loginTime', Date.now())` — session lock timer starts
4. Query `profiles` table with `.maybeSingle()` by user id
   - If found → `localStorage.setItem('userRole', profile.role)` → redirect to `index.html`
5. Query `customers` table with `.maybeSingle()` by user email
   - If found → `localStorage.setItem('userRole', 'customer')` → redirect to `client-dashboard.html`
6. If neither found → `supabase.auth.signOut()` + `alert('Account type not recognized.')`
7. Any unexpected errors caught by outer try/catch → `alert('An unexpected error occurred.')`

## Session Lock Implementation
- **On login**: `localStorage.setItem('loginTime', Date.now())` in `signIn()`
- **On page load**: `checkSessionExpiration()` in `auth.js:110-119` runs immediately
  - Reads `loginTime` from localStorage
  - Calculates `hoursElapsed = (Date.now() - loginTime) / 3600000`
  - If > 1 hour → `supabase.auth.signOut()` + `window.location.href = 'login.html'`
- **Gatekeeper in index.html** (lines 203-220, FIRST script):
  - Checks `loginTime` directly (no Supabase dependency — pure localStorage math)
  - If expired/missing → `localStorage.clear()` + `window.location.replace('login.html')` (prevents back-button)
  - If valid → registers `DOMContentLoaded` listener to set `document.body.style.display = 'block'`
- `body { display: none; }` in CSS — page stays hidden until gatekeeper approves

## Auth Guard (`public/js/authGuard.js`)
- IIFE that runs immediately when script loads
- Checks Supabase session via `getSession()`
- If no session → redirect to `login.html`
- This is a SECONDARY check (gatekeeper is primary for index.html)

## Role-Based UI (`public/js/index.html:336-352`)
- `applyRoleBasedUI()` called on DOMContentLoaded
- Reads `localStorage.getItem('userRole')` — case-sensitive storage, all comparisons `.toLowerCase()`
- If admin → `document.getElementById('admin-controls').style.setProperty('display', 'block', 'important')` + show remaining `.admin-only` elements
- If staff → hide all `.admin-only` elements
- **Role is stored with original casing from DB** (e.g., 'Admin' with capital A) — comparisons always lowercase

## UI Fixes Applied
1. **Password visibility toggle** — button inside `.password-wrapper`, toggles input type + icon (👁️ open / 🙈 closed)
2. **Login error handling** — `auth.js` now catches everything internally with `alert()`, login.html form handler simplified (no try/catch)
3. **Gatekeeper flicker fix** — `html { display: none }` approach tried then reverted; final solution: `body { display: none }` + gatekeeper shows it after session check
4. **Back-button prevention** — `window.history.pushState(null, '', ...)` + `onpopstate`
5. **Logout button** — hidden by CSS default (`display: none`), shown in `DOMContentLoaded` handler
6. **Nav bar buttons** — "View Bookings" renamed to "Manage Bookings", added "Dashboard" link to all management pages
7. **Bookings metric** renamed to "Manage Bookings"

## Database Tables

### profiles (MUST CREATE — doesn't exist yet)
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'staff'
);
```
After creating table, insert admin row:
```sql
insert into profiles (id, role)
values ('<USER_UUID>', 'admin');
```

### customers (MUST CREATE — doesn't exist yet)
```sql
create table customers (
  id uuid primary key references auth.users(id),
  email text not null,
  name text
);
```

### services (assumed existing)
- Columns: `id (uuid PK)`, `name`, `price` (numeric)

### stylists (assumed existing)
- Columns: `id (uuid PK)`, `name`, `role` (text — e.g. 'barber', 'stylist'), `is_active` (boolean, used for soft-delete)

### bookings (MAY NEED CREATION)
- Columns needed: `id (uuid PK)`, `service_id (FK → services.id)`, `stylist_id (FK → stylists.id)`, `start_time (timestamptz)`, `customer_name (text)`, `created_at (timestamptz default now())`

## Script Loading Order (all pages)
```
supabase CDN (https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2)
→ config.js (sets window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
→ supabaseClient.js (creates supabase client)
→ auth.js (defines signIn, logout, getSession, etc.)
→ authGuard.js (IIFE session check)
→ page-specific inline script
```
**Exception**: `index.html` has a gatekeeper `<script>` BEFORE the supabase CDN (first script in body) that does localStorage loginTime check without Supabase.

## Login Form (`login.html:101-117`)
- Email input (type email, required)
- Password input wrapped in `.password-wrapper` div with toggle button
- Submit button with loading state ("Signing in…")
- Error message div (`#error-message`) — hidden by default, shown on error
- Previous behavior (try/catch with error message display) simplified to just `await signIn(email, password)`

## What's Built (Complete)
- ✅ Login page with email/password + password toggle
- ✅ Supabase auth integration (signIn, logout, session management)
- ✅ Session lock with 1-hour timeout and gatekeeper
- ✅ Manager Dashboard with 5 metric cards (total bookings, active services, active stylists, total revenue, most popular service)
- ✅ Today's Bookings table on dashboard (date-filtered by current day)
- ✅ Action hub with links to Services, Roster, Bookings management
- ✅ Services management page (table + add/edit)
- ✅ Stylist roster (table + add/edit + soft-delete)
- ✅ Bookings management (form with service/stylist dropdowns + table with delete)
- ✅ Role-based UI (admin sees nav links + action hub, staff sees only dashboard + logout)
- ✅ Nav bar with Dashboard / Services / Roster / Bookings links + logout button
- ✅ authGuard.js redirects to login if no session
- ✅ Back-button prevention on dashboard
- ✅ Credentials moved to gitignored config.js
- ✅ AGENTS.md with full project memory

## What's NOT Built (Client Features)
- ❌ `customers` table not created in Supabase
- ❌ `client-dashboard.html` — doesn't exist yet
- ❌ Client booking view (client sees own appointments)
- ❌ Client self-registration (sign-up form)
- ❌ Client profile management
- ❌ The `profiles` table itself doesn't exist in Supabase yet (login will fail until created)

## Git Info
- Remote: `https://github.com/jeremygideonbareh/chelsea-man-spa-mobile2.git`
- Current branch: `feature/ui-redesign`
- Old branch: `feature/stylist-roster`
- Key commits:
  - `0a8367e` — Initial commit (Firebase era)
  - `1e42589` — Stable Manager/Staff dashboard with session lock and role-based UI
  - `ed83b55` — AGENTS.md added
  - `4780806` — Client features noted as not built
- `public/js/config.js` is gitignored — real creds never pushed

## Full Project Tree
```
chelsea-man-spa-mobile/
├── .firebaserc                    # Old Firebase config
├── .git/
├── .gitignore                     # Ignores config.js, node_modules/, etc.
├── AGENTS.md                      # This file — full session memory
├── DESIGN.md                      # Original Firebase-era design doc
├── firebase.json                  # Old Firebase hosting config
├── README.md                      # Old README
└── public/
    ├── index.html                 # Manager Dashboard
    ├── login.html                 # Login form
    ├── services.html              # Services management (admin only)
    ├── roster.html                # Stylist roster (admin only)
    ├── bookings.html              # Bookings management (admin only)
    └── js/
        ├── config.js              # Supabase creds (GITIGNORED)
        ├── config.example.js      # Placeholder template
        ├── supabaseClient.js      # Supabase client init
        ├── auth.js                # signIn, logout, getSession, requireAuth, checkSessionExpiration
        ├── authGuard.js           # Session guard IIFE
        ├── rosterManager.js       # Stylist CRUD via Supabase
        └── bookingsManager.js     # Bookings CRUD via Supabase
```

## Order of Work to Continue
1. Enable Email auth in Supabase Dashboard
2. Create `profiles` table with SQL above
3. Create Supabase auth user manually, get their UUID, insert into `profiles` with role='admin'
4. Create `customers` table with SQL above
5. Create `bookings` table if not exists
6. Test login as admin → should see all nav links + action hub
7. Create a second auth user with role='staff' in profiles → should see minimal dashboard
8. Build `client-dashboard.html` for customer role
9. Build client sign-up form
10. Build client booking view
