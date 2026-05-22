# Chelsea Man Spa — Staff Management Platform

## Project Overview
Staff management platform for Chelsea Man Spa (men's salon). Started as a Firebase mobile booking app, migrated to Supabase. Built with vanilla HTML/CSS/JS (no frameworks).

### What's Built
- ✅ Admin dashboard with 5 metric cards, today's bookings table (date-filtered), action hub
- ✅ Staff login + role-based UI (staff see minimal dashboard with only logout, admin sees nav + action hub)
- ✅ Stylist roster with add/edit, soft-delete via `is_active = false`
- ✅ Bookings management (create with service/stylist dropdowns, hard delete)
- ✅ Services page shell (table exists but NO JS logic yet — no servicesManager.js)
- ✅ Session lock (1-hour timeout) with gatekeeper pattern
- ✅ Password visibility toggle (👁️ open / 🙈 closed)
- ✅ Back-button prevention on dashboard
- ✅ Supabase credentials in gitignored `config.js`
- ✅ AGENTS.md

### What's NOT Built (Client Features)
- ❌ `customers` table not created in Supabase
- ❌ `client-dashboard.html` — doesn't exist
- ❌ Client booking view (client sees own appointments)
- ❌ Client self-registration (sign-up form)
- ❌ Client profile management

### Known Issues / Gaps
- ❌ **services.html has NO inline script and NO servicesManager.js** — the table is a static shell, no JS to load/populate/add/edit services
- ❌ **Management pages have NO role redirect** — services.html, roster.html, bookings.html don't have the `if (role !== admin) redirect to index.html` inline script. Staff users can access them directly by URL
- ❌ `profiles` table doesn't exist in Supabase yet — login will fail until created
- ❌ `bookings` table may not exist in Supabase yet

## Tech Stack
- **Auth & Database**: Supabase (`pzbiydpbwrkmjjvhfokm` project)
- **Frontend**: Vanilla HTML/CSS/JS
- **Theme**: Dark/gold (#0A0907 bg, #D4AF37 gold, #F5EDE3 text, Inter font)
- **Serving**: `python -m http.server <port>` from `public/`

## Supabase Credentials
- Project URL: `https://pzbiydpbwrkmjjvhfokm.supabase.co`
- Anon Key: `sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y`
- Stored in: `public/js/config.js` (gitignored via `.gitignore` line 6)
- Public template: `public/js/config.example.js` (placeholder values, committed)
- **Must enable Email Auth Provider** in Supabase Dashboard > Authentication > Providers

## All Files — Complete Reference

### Root Files
| File | Purpose | Notes |
|---|---|---|
| `.gitignore` | Ignores `node_modules/`, `.env`, `.DS_Store`, `dist/`, `build/`, `public/js/config.js` | Line 6 excludes config.js with real creds |
| `.firebaserc` | Old Firebase config | Legacy, not used |
| `firebase.json` | Old Firebase hosting config | Legacy, not used |
| `DESIGN.md` | Original Firebase-era design doc | Not read/updated |
| `README.md` | Old README | Not read/updated |
| `AGENTS.md` | This file | Full project memory |

### public/ — Pages

#### index.html (Manager Dashboard) — 364 lines
- **Gatekeeper script** (lines 203-221): FIRST script in body, runs before Supabase loads
  - Reads `loginTime` from localStorage (no Supabase dependency)
  - If missing or > 1 hour → `localStorage.clear()` + `window.location.replace('login.html')`
  - If valid → registers `DOMContentLoaded` listener → `document.body.style.display = 'block'`
- **Script loading order**: gatekeeper → supabase CDN → config.js → supabaseClient.js → auth.js → authGuard.js → inline script
- **Inline script** (lines 227-364):
  - `window.history.pushState(null, '', ...)` + `onpopstate` for back-button prevention
  - `loadMetrics()` — queries bookings (count), services (count + price sum for revenue + popularity), stylists (active count). Sets 5 metric card textContent
  - `loadTodayBookings()` — queries bookings with joins (services.name, stylists.name), filtered to today (midnight to midnight), ordered by start_time. Renders table rows with time formatted en-GB
  - `DOMContentLoaded` handler — calls show logout button, loadMetrics, loadTodayBookings, applyRoleBasedUI
  - `applyRoleBasedUI()` — reads userRole, compares lowercase. Admin: `document.getElementById('admin-controls').style.setProperty('display', 'block', 'important')` + shows other `.admin-only` elements. Staff: hides all `.admin-only`
  - `showLogoutButton()` — gets session via getSession(), sets logout-btn display to inline-block
- **CSS**: body display none (hidden until gatekeeper approves), #admin-controls used for role visibility, .admin-only class
- **HTML structure**: container > nav-bar (#admin-controls span with links, spacer, logout-btn) > header (h1 "Manager Dashboard") > metrics grid (5 cards) > section-title ("Bookings Today") > today-wrap table (Customer/Service/Stylist/Time) > action-hub.admin-only (3 action cards: Services/Roster/Bookings)

#### login.html (Login Form) — 120 lines
- **Form**: id="login-form", email input (type email, required), password input wrapped in `.password-wrapper` div, toggle button (id="toggle-pw"), submit button (id="btn-login"), error message div (id="error-message", class="error-msg")
- **Toggle password**: click handler checks `pw.type === 'password'`, toggles between 'text'/'password', swaps icon text between 👁️ (open/visible) and 🙈 (closed/hidden)
- **Submit handler**: prevents default, disables button + "Signing in…", hides error, `await signIn(email, password)`, resets button (no try/catch — errors handled in auth.js via alert())
- **CSS**: .form-group input (dark bg #0A0907, focus border #D4AF37), .password-wrapper position relative with input padding-right 36px, .toggle-pw absolute right 10px top 50% translateY(-50%), .btn-login (#D4AF37 bg, #0A0907 text), .error-msg (#E87A7A color, display none)
- **Script loading**: supabase CDN → config.js → supabaseClient.js → auth.js → inline script
- **No authGuard.js** on login page (would cause redirect loop)

#### services.html (Services Management — INCOMPLETE) — 124 lines
- **NO inline script** — no role redirect, no service management JS
- **NO servicesManager.js** file exists
- Table with columns: Name, Price, Duration, Actions — but empty/unpopulated
- Has `#btn-add-service` button but no event listener wired up
- **Nav bar**: Dashboard, Roster, Bookings links + logout
- **Script loading**: supabase CDN → config.js → supabaseClient.js → auth.js → authGuard.js (no page-specific JS)
- **Needs**: role redirect inline script + servicesManager.js or inline JS for CRUD

#### roster.html (Stylist Roster) — 191 lines
- **NO inline role redirect** — staff could access directly
- **Table**: #stylist-table-body, columns: Name, Role, Status, Actions (Edit/Delete buttons)
- **Modal (add/edit)**: #stylist-modal overlay > .modal with form (name input, role input, Cancel/Save buttons). `#modal-title` changes between "Add New Stylist" / "Edit Stylist"
- **Delete modal**: #deleteModal overlay > .modal with confirmation text, Cancel/Delete buttons. Delete button styled red (#3D1A1A bg, #E87A7A text)
- **Nav bar**: Dashboard, Services, Bookings links + logout
- **Script loading**: supabase CDN → config.js → supabaseClient.js → auth.js → authGuard.js → rosterManager.js

#### bookings.html (Bookings Management) — 176 lines
- **NO inline role redirect** — staff could access directly
- **Booking form**: #booking-form with service-select, stylist-select, customer-name input, appointment-time (datetime-local), Confirm Booking button
- **Table**: #bookings-table-body, columns: Customer, Service, Stylist, Time, Actions (Delete button)
- **Nav bar**: Dashboard, Services, Roster links + logout
- **Script loading**: supabase CDN → config.js → supabaseClient.js → auth.js → authGuard.js → bookingsManager.js

### public/js/ — All Scripts

#### config.js — Gitignored
- Sets `window.SUPABASE_URL = 'https://pzbiydpbwrkmjjvhfokm.supabase.co'`
- Sets `window.SUPABASE_ANON_KEY = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y'`

#### config.example.js — Committed (placeholder)
- Sets `window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'`
- Sets `window.SUPABASE_ANON_KEY = 'sb_publishable_YOUR_ANON_KEY'`

#### supabaseClient.js — 4 lines
```js
window.supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);
```

#### auth.js — 121 lines
Full function reference:
- `getSession()` — wraps `supabaseClient.auth.getSession()`, returns session or null
- `signIn(email, password)` — try/catch wrapper:
  1. Remove old userRole + loginTime from localStorage
  2. `signInWithPassword()` — if error, `alert(error.message)` and return
  3. If no user → `alert('Login failed.')` and return
  4. Set `loginTime = Date.now()` in localStorage
  5. Query `profiles` table `.maybeSingle()` by user id → if found, set userRole, redirect to `index.html`
  6. Query `customers` table `.maybeSingle()` by user email → if found, set userRole = 'customer', redirect to `client-dashboard.html`
  7. If neither → `signOut()` + `alert('Account type not recognized.')`
  8. Catch all → `alert('An unexpected error occurred.')`
- `signOut()` — removes userRole from localStorage, calls `supabaseClient.auth.signOut()`
- `logout()` — calls signOut, localStorage.clear(), sessionStorage.clear(), location.reload()
- `onAuthStateChange(callback)` — wraps `supabaseClient.auth.onAuthStateChange()`, removes userRole on SIGNED_OUT
- `requireAuth()` — gets session, if none → redirect to login.html. If userRole missing but session exists, fetches profile from profiles table
- `checkSessionExpiration()` — reads loginTime from localStorage, calculates hoursElapsed, if > 1 calls signOut + redirect to login.html
- Auto-executes `checkSessionExpiration()` at module bottom (line 121)

#### authGuard.js — 10 lines
```js
(async function () {
  try {
    var { data } = await window.supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = 'login.html';
    }
  } catch (e) {
    window.location.href = 'login.html';
  }
})();
```
- Pure session check — NO role-based redirect
- On management pages, staff users with valid session pass through (should also have role redirect)

#### rosterManager.js — 164 lines
Functions:
- `loadStylists()` — queries stylists table ordered by name, renders #stylist-table-body with rows (name, role, status badge "Available"/"Unavailable", Edit/Delete buttons with data-id attributes). Binds click handlers for edit/delete buttons
- `openModal()` / `closeModal()` — toggle .show class on #stylist-modal. closeModal resets editingStylistId, modal title, button text, form fields
- `editStylist(id)` — sets editingStylistId, changes modal to "Edit Stylist" mode, fetches stylist data from Supabase by id, fills form fields, opens modal
- `deleteStylist(id)` — sets stylistToDeleteId, opens deleteModal
- `closeDeleteModal()` — closes deleteModal, clears stylistToDeleteId
- `saveStylist(e)` — form submit handler. Validates name. If editingStylistId → UPDATE, else → INSERT. On error → alert. On success → closeModal + reloadStylists
- DOMContentLoaded: binds #btn-add-stylist (opens fresh modal), #btn-cancel (closeModal), #stylist-form (saveStylist), modal overlay click (close), #confirmDeleteBtn (soft-delete: `update({ is_active: false })` + closeDeleteModal + reload), #cancelDeleteBtn (closeDeleteModal), deleteModal overlay click

#### bookingsManager.js — 144 lines
Functions:
- `loadServices()` — queries services (id, name), populates #service-select dropdown
- `loadStylists()` — queries active stylists (id, name, is_active=true), populates #stylist-select dropdown
- `loadBookings()` — queries bookings with joins (services.name, stylists.name), orders by start_time DESC, renders table rows with formatted datetime (en-GB), binds delete buttons (hard delete: `delete().eq('id', id)`)
- `setDefaultDateTime()` — sets #appointment-time value to current datetime (YYYY-MM-DDTHH:MM), sets min to same
- DOMContentLoaded: setDefaultDateTime, loadServices, loadStylists, loadBookings, binds form submit (validates all fields, inserts booking, resets form, reloads bookings)

## Script Loading Order (all pages)
```
gatekeeper (index.html only — FIRST script)
↓
supabase CDN (https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2)
↓
config.js (window.SUPABASE_URL + window.SUPABASE_ANON_KEY)
↓
supabaseClient.js (creates window.supabaseClient)
↓
auth.js (signIn, logout, getSession, requireAuth, checkSessionExpiration)
↓
authGuard.js (IIFE — redirects to login if no session)
↓
page-specific JS (rosterManager.js / bookingsManager.js / inline script)
```

## Login Flow (`auth.js:10-63`)
1. Clear old userRole + loginTime from localStorage
2. `signInWithPassword(email, password)` — if Supabase error → `alert(error.message)` and STOP
3. If no user object → `alert('Login failed.')` and STOP
4. `localStorage.setItem('loginTime', Date.now())`
5. Query `profiles` `.maybeSingle()` by user id → if row exists → `localStorage.setItem('userRole', profile.role)` → `window.location.href = 'index.html'`
6. Query `customers` `.maybeSingle()` by user email → if row exists → `localStorage.setItem('userRole', 'customer')` → `window.location.href = 'client-dashboard.html'`
7. Neither found → `supabase.auth.signOut()` + `alert('Account type not recognized.')`
8. Any unexpected error → `alert('An unexpected error occurred.')`

## Session Lock (1-hour timeout)
- `localStorage.setItem('loginTime', Date.now())` set on every successful login
- **Gatekeeper** (index.html first script): reads loginTime directly, no Supabase needed. If expired/missing → `localStorage.clear()` + `window.location.replace('login.html')` (replace prevents back-button). If valid → registers DOMContentLoaded listener to `document.body.style.display = 'block'`
- **auth.js checkSessionExpiration()**: reads loginTime, calculates hoursElapsed, if > 1 → `supabase.auth.signOut()` + `window.location.href = 'login.html'`
- CSS: `body { display: none; }` — page stays invisible until gatekeeper approves

## Role-Based UI
- `localStorage.getItem('userRole')` — stored with original casing from DB (e.g., 'Admin'), all comparisons use `.toLowerCase()`
- `applyRoleBasedUI()` in index.html DOMContentLoaded:
  - **Admin**: `document.getElementById('admin-controls').style.setProperty('display', 'block', 'important')` + show other `.admin-only` elements
  - **Staff**: hide all `.admin-only` elements
- `.admin-only` class on: nav links span, action hub div
- **Known gap**: management pages have NO role redirect — staff with valid session could navigate to services/roster/bookings by URL

## CSS / Design Token Reference
| Token | Value | Used On |
|---|---|---|
| Background | `#0A0907` | body, input backgrounds |
| Gold accent | `#D4AF37` | headings, metric numbers, hover states, buttons |
| Text primary | `#F5EDE3` | body text, table cells |
| Text muted | `#9C927D` | nav links, metric labels, descriptions |
| Text darker | `#6B655A` | sub-labels, empty state |
| Card bg | `#12110E` | metric cards, table wrapper, action cards |
| Border | `#1E1C18` | nav bottom, cards, table rows, inputs |
| Red/error | `#E87A7A` | logout button text, error messages, delete button text |
| Red bg | `#3D1A1A` | logout/delete button borders and hover backgrounds |
| Font | `'Inter', sans-serif` | everything |
| Max width | `960px` | `.container` |
| Radius | `6px` | inputs, buttons; `8px` for cards |

## Database Tables (Supabase)

### profiles — MUST CREATE, doesn't exist
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'staff'
);
-- After creating auth user manually:
-- insert into profiles (id, role) values ('<USER_UUID>', 'admin');
```

### customers — MUST CREATE, doesn't exist
```sql
create table customers (
  id uuid primary key references auth.users(id),
  email text not null,
  name text
);
```

### services — assumed existing
Columns: `id (uuid PK)`, `name`, `price (numeric)`

### stylists — assumed existing
Columns: `id (uuid PK)`, `name`, `role (text)`, `is_active (bool)` — soft-delete via is_active=false

### bookings — MAY NEED CREATION
Columns: `id (uuid PK)`, `service_id (FK → services.id)`, `stylist_id (FK → stylists.id)`, `start_time (timestamptz)`, `customer_name (text)`, `created_at (timestamptz default now())`

## Complete UI Fixes Applied (Chronological)
1. **"View Bookings" → "Manage Bookings"** — renamed on index.html action card
2. **Password visibility toggle** — eye button in `.password-wrapper`, swaps between 👁️ (password visible) and 🙈 (password hidden)
3. **Auth error handling** — signIn() now catches all errors internally via try/catch + alert(). login.html form handler simplified (no try/catch, just `await signIn()` + button reset)
4. **Login error message** — was showing Supabase error text, changed to static "Wrong credentials, please try again." Now handled by auth.js alert() instead
5. **Session flicker fix (iteration 1)** — added `html { display: none }` + gatekeeper reveals. User reported blank page
6. **Session flicker fix (iteration 2)** — removed all `display: none`. User reported flickering
7. **Session flicker fix (final)** — `body { display: none }` + gatekeeper checks loginTime directly (no Supabase). Only reveals body after check passes. This is the current approach
8. **Back-button prevention** — `window.history.pushState(null, '', window.location.href)` + `window.onpopstate`
9. **Logout button disappeared** — `showLogoutButton()` was removed during refactors. Fixed by adding `document.getElementById('logout-btn').style.display = 'inline-block'` directly in DOMContentLoaded handler
10. **Red border debugging** — added `#admin-controls { border: 2px solid red }` then removed it
11. **applyRoleBasedUI()** — changed from `el.style.display = ''` to `document.getElementById('admin-controls').style.setProperty('display', 'block', 'important')` to override any conflicting CSS
12. **Nav bar unification** — added "Dashboard" link to services.html, roster.html, bookings.html nav bars
13. **Credentials extraction** — moved hardcoded Supabase URL + anon key from supabaseClient.js into gitignored config.js, created config.example.js as committed placeholder
14. **Login flow rewrite** — changed from single profile check → profiles first (admin/staff → index.html), then customers (client → client-dashboard.html), fallback alert

## Git Repository
- Remote URL: `https://github.com/jeremygideonbareh/chelsea-man-spa-mobile2.git` (NOT yet pushed)
- Current branch: `feature/ui-redesign`
- Previous branch: `feature/stylist-roster`
- Git author: Jeremy Bareh <jeremy.gideon@btech.christuniversity.in>
- Key commits:
  - `0a8367e` — "Initial commit: Chelsea Man Spa mobile booking app" (Firebase era, old config.js with Firebase keys was tracked)
  - `1e42589` — "Stable Manager/Staff dashboard with session lock and role-based UI" (migration to Supabase, config.js deleted from tracking)
  - `ed83b55` — "Add AGENTS.md with full project context for session continuity"
  - `4780806` — "AGENTS.md: note client features still need to be built"
  - `a27d12c` — "AGENTS.md: exhaustive project memory dump"
- `public/js/config.js` is gitignored — real Supabase creds never pushed
- Old Firebase config (`.firebaserc`, `firebase.json`, Firebase API keys) was in initial commit but that repo/project is separate

## Critical Design Decisions
- **Vanilla JS only** — no React, Vue, or build tools. All DOM manipulation is imperative
- **Scripts at bottom of body** — ensures DOM is parsed before JS runs. Exceptions: index.html gatekeeper is first script in body
- **Supabase anon key is technically publishable** (it's meant for client-side use with RLS policies), but still gitignored for best practice
- **`maybeSingle()` vs `single()`** — used `maybeSingle()` for profile/customer queries so missing rows don't throw errors (returns null instead)
- **Soft-delete for stylists** (`is_active = false`) vs **hard delete for bookings** (`delete().eq('id', id)`)
- **No `.env` file** — browser JS can't read server-side env vars. Config is via a regular JS file that's gitignored
- **Role casing** — stored from DB as-is (e.g., 'Admin'), always compared via `.toLowerCase()`
- **`window.location.replace()`** used in gatekeeper (not `href=`) to prevent back-button from returning to expired session

## Order of Work to Continue
1. [ ] Enable Email auth provider in Supabase Dashboard
2. [ ] Create `profiles` table via SQL Editor
3. [ ] Create auth user(s) manually in Supabase, get UUID(s), insert into profiles with role='admin' or 'staff'
4. [ ] Create `customers` table
5. [ ] Create `bookings` table if not exists
6. [ ] Test login flow: admin → full dashboard with nav + action hub; staff → minimal dashboard
7. [ ] Add role redirect inline script to services.html, roster.html, bookings.html
8. [ ] Create `servicesManager.js` or add inline JS to services.html for CRUD
9. [ ] Build `client-dashboard.html` for customer role
10. [ ] Build client registration flow
11. [ ] Build client booking view
12. [ ] Push to GitHub: `git remote add origin https://github.com/jeremygideonbareh/chelsea-man-spa-mobile2.git && git push -u origin feature/ui-redesign`

## Project Tree
```
chelsea-man-spa-mobile/
├── .firebaserc                    # Old Firebase config
├── .git/
├── .gitignore                     # Ignores config.js, node_modules/, etc.
├── AGENTS.md                      # This file
├── DESIGN.md                      # Old Firebase-era design doc
├── firebase.json                  # Old Firebase hosting config
├── README.md                      # Old README
└── public/
    ├── index.html                 # Manager Dashboard (364 lines)
    ├── login.html                 # Login form (120 lines)
    ├── services.html              # Services — INCOMPLETE, shell only (124 lines)
    ├── roster.html                # Stylist roster with modals (191 lines)
    ├── bookings.html              # Bookings form + table (176 lines)
    └── js/
        ├── config.js              # Supabase creds (GITIGNORED)
        ├── config.example.js      # Placeholder template (committed)
        ├── supabaseClient.js      # Client init from window vars (4 lines)
        ├── auth.js                # Auth functions (121 lines)
        ├── authGuard.js           # Session guard IIFE (10 lines)
        ├── rosterManager.js       # Stylist CRUD (164 lines)
        └── bookingsManager.js     # Bookings CRUD (144 lines)
```
