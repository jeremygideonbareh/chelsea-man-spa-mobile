# Chelsea Man Spa — React PWA (chelsea-spa-pwa)

## Project Overview
Full-service React/Vite PWA for Chelsea Man Spa (men's salon) with public marketing pages, role-based access control, and Supabase authentication. Migrated from a vanilla HTML/CSS/JS codebase (`chelsea-man-spa-mobile`).

## Tech Stack
- **Framework**: React 19 + Vite 8 + TypeScript
- **Styling**: Tailwind CSS v3 + shadcn/ui (CSS variables theme)
- **Router**: React Router v7 (imports from `react-router`)
- **Auth & Database**: Supabase (`pzbiydpbwrkmjjvhfokm` project) via `@supabase/supabase-js`
- **Icons**: lucide-react@0.562.0
- **Theme**: Dark/gold (#0F0F0F bg, #D4AF37 gold accents, #FFFFFF text, Inter font)
- **Dev server**: `npm run dev` → `localhost:3000` (strict, auto-opens)
- **Build**: `npm run build` → `dist/`

## Supabase Credentials
- Project URL: `https://pzbiydpbwrkmjjvhfokm.supabase.co`
- Anon Key: `sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y`
- Stored in: `.env.local` (gitignored by `*.local` pattern)
- Supabase client: `src/lib/supabase.ts` — exports `supabase` instance

## Project Structure
```
chelsea-spa-pwa/
├── public/
│   ├── images/          # hero-bg.jpg, 4 service images, 4 stylist images
│   ├── videos/          # hero.mp4 (loop background video)
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── components/
│   │   ├── ui/          # 53 shadcn/ui primitives
│   │   ├── booking/     # 6 booking flow components
│   │   ├── AdminLayout.tsx  # Admin sidebar layout
│   │   ├── LandingNav.tsx   # Public navigation
│   │   └── BottomNav.tsx    # Mobile bottom nav
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx  # Admin dashboard (metrics + today's bookings)
│   │   │   ├── Services.tsx   # Services CRUD
│   │   │   ├── Roster.tsx     # Stylist roster CRUD
│   │   │   └── Bookings.tsx   # Bookings CRUD
│   │   ├── Home.tsx           # Landing page
│   │   ├── Login.tsx          # Auth + RBAC routing
│   │   └── Dashboard.tsx      # Client booking dashboard
│   ├── sections/
│   │   ├── HeroSection.tsx    # Video background hero
│   │   ├── ServicesSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── FooterSection.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBookingFlow.ts
│   │   └── useServices.ts
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client init
│   │   └── utils.ts       # cn() helper
│   └── types/
│       ├── database.ts    # Supabase schema types
│       └── index.ts       # Shared types
```

## Routes
| Path | Component | Description |
|---|---|---|
| `/` | Home | Public landing page (LandingNav → HeroSection → ServicesSection → AboutSection → FooterSection) |
| `/login` | Login | Email/password auth with RBAC routing |
| `/dashboard` | Dashboard | Client booking dashboard |
| `/admin` | AdminLayout | Admin panel (sidebar layout with Outlet) |
| `/admin/services` | AdminServices | Services CRUD table |
| `/admin/roster` | AdminRoster | Stylist roster CRUD |
| `/admin/bookings` | AdminBookings | Bookings form + table |
| `*` | Navigate `/` | Catch-all redirect |

## RBAC Flow (Login.tsx)
1. `signInWithPassword(email, password)` — Supabase auth
2. Query `profiles` table `.single()` by user id
3. `role === 'admin'` → navigate to `/admin`
4. Any other role or fallback → navigate to `/dashboard`
5. Uses `<Navigate to={...} replace />` to avoid React rendering warnings

## What's Built

### Public Pages
- ✅ Landing page with full-screen video hero (auto-play, loop, muted, playsInline)
- ✅ Scroll-based fade transition (hero fades out as user scrolls, revealing services)
- ✅ Sections: Hero, Services, About, Footer
- ✅ Gradient overlays for video readability
- ✅ Mobile-responsive glass-morphism nav

### Admin Panel (`/admin/*`)
- ✅ **Dashboard** — 5 metric cards (total bookings, active services, active stylists, total revenue, most popular service), today's bookings table (date-filtered), quick action cards
- ✅ **Services** — Full CRUD table with add/edit modal, delete confirmation modal
- ✅ **Roster** — Full CRUD with add/edit modal, soft-delete (`is_active = false`), status badges (Available/Unavailable)
- ✅ **Bookings** — Create form with service/stylist dropdowns + datetime picker, full bookings table with service/stylist joins, hard delete
- ✅ **AdminLayout** — Responsive sidebar (collapsible on mobile with hamburger), navigation links with active state highlighting, logout button

### Configuration
- ✅ React Router v7 with nested admin routes via `<Outlet />`
- ✅ Tailwind v3 with PostCSS transformer (for Vite 8 compatibility)
- ✅ `css.transformer: 'postcss'` + `build.cssMinify: false` in vite.config.ts
- ✅ shadcn/ui CSS variable theme (border, background, foreground, primary, secondary, muted, accent, card, ring, popover, destructive)
- ✅ CSS utilities: `.glass-card`, `.glass-card-gold`, `.glass-nav`, `.gold-gradient-text`, `.gold-btn`, `.scrollbar-hide`, `.font-display`

## Database Tables (Supabase)

### profiles
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'staff'
);
```

### services
Columns: `id (uuid PK)`, `name (text)`, `price (numeric)`, `duration (int)`

### stylists
Columns: `id (uuid PK)`, `name (text)`, `role (text)`, `is_active (bool)`

### bookings
Columns: `id (uuid PK)`, `service_id (FK → services.id)`, `stylist_id (FK → stylists.id)`, `start_time (timestamptz)`, `customer_name (text)`, `created_at (timestamptz default now())`

## Database Query Reference

### Admin Dashboard Metrics (admin/Dashboard.tsx)
```ts
// Total bookings count
supabase.from('bookings').select('id, service_id')

// Services count + price mapping for revenue + popularity
supabase.from('services').select('id, name, price')

// Active stylists count
supabase.from('stylists').select('id').eq('is_active', true)

// Today's bookings with joins
supabase.from('bookings')
  .select('*, services(name), stylists(name)')
  .gte('start_time', todayStart.toISOString())
  .lt('start_time', tomorrowStart.toISOString())
  .order('start_time', { ascending: true })
```

### Services CRUD (admin/Services.tsx)
```ts
// Load all
supabase.from('services').select('*').order('name', { ascending: true })

// Create
supabase.from('services').insert([{ name, price, duration }])

// Update
supabase.from('services').update({ name, price, duration }).eq('id', id)

// Delete
supabase.from('services').delete().eq('id', id)
```

### Roster CRUD (admin/Roster.tsx)
```ts
// Load all
supabase.from('stylists').select('*').order('name', { ascending: true })

// Create
supabase.from('stylists').insert([{ name, role }])

// Update
supabase.from('stylists').update({ name, role }).eq('id', id)

// Soft-delete
supabase.from('stylists').update({ is_active: false }).eq('id', id)
```

### Bookings CRUD (admin/Bookings.tsx)
```ts
// Load services dropdown
supabase.from('services').select('id, name').order('name', { ascending: true })

// Load active stylists dropdown
supabase.from('stylists').select('id, name').eq('is_active', true).order('name', { ascending: true })

// Load all bookings with joins
supabase.from('bookings')
  .select('*, services(name), stylists(name)')
  .order('start_time', { ascending: false })

// Create
supabase.from('bookings').insert([{ service_id, stylist_id, customer_name, start_time }])

// Delete
supabase.from('bookings').delete().eq('id', id)
```

## Key Files
| File | Purpose |
|---|---|
| `vite.config.ts` | React + Tailwind v3, `@` alias, strict port 3000, postcss transformer |
| `tailwind.config.js` | shadcn/ui theme, border-radius scale, accordion animations |
| `postcss.config.js` | tailwindcss + autoprefixer plugins |
| `src/main.tsx` | Entry: `BrowserRouter` wrapping `<App />` |
| `src/App.jsx` | Route definitions (public + admin nested routes) |
| `src/lib/supabase.ts` | Supabase client from env vars |
| `src/lib/utils.ts` | `cn()` class merge utility |
| `src/index.css` | Theme variables, Tailwind directives, glass/gold utilities |
| `src/components/AdminLayout.tsx` | Responsive admin sidebar layout |
| `src/pages/admin/Dashboard.tsx` | Metrics + today's bookings dashboard |
| `src/pages/admin/Services.tsx` | Services CRUD with modals |
| `src/pages/admin/Roster.tsx` | Stylist CRUD with modals |
| `src/pages/admin/Bookings.tsx` | Bookings create form + table |
| `src/pages/Login.tsx` | Auth + RBAC routing |
| `src/sections/HeroSection.tsx` | Video background hero with scroll fade |
| `.env.local` | Real Supabase creds (gitignored) |

## Integration History

### Session 1 — Scaffold & Setup
- Scaffolded project with `create-vite@latest --template react`
- Installed all deps (react-router, supabase, lucide-react, shadcn/ui primitives, etc.)
- Switched Tailwind v4 → v3, added PostCSS, configured Vite 8 compatibility
- Created tsconfig, tailwind.config, postcss.config, supabase client, types
- Copied 69 files from blueprint (pages, components, sections, hooks, UI primitives)
- Copied 10 public assets (images, manifest, sw.js)
- Set up CSS with shadcn/ui theme variables + glass/gold utilities
- Wired React Router with 4 routes (/, /login, /dashboard, /admin)
- Locked dev server to port 3000
- Implemented RBAC in Login.tsx (profiles table query after signIn)
- Fixed "Cannot update a component while rendering" React warning
- Created AdminDashboard placeholder

### Session 2 — Admin Panel Integration
- Ported management HTML (index.html, services.html, roster.html, bookings.html) from old vanilla project
- Built `AdminLayout.tsx` — responsive sidebar with navigation + logout
- Built `admin/Dashboard.tsx` — 5 metric cards + today's bookings + quick actions
- Built `admin/Services.tsx` — CRUD with add/edit modal + delete confirmation
- Built `admin/Roster.tsx` — CRUD with add/edit modal + soft-delete + status badges
- Built `admin/Bookings.tsx` — create form + full bookings table with joins
- Updated `App.jsx` with nested admin routes (`/admin/*`)
- Deleted old placeholder `AdminDashboard.tsx`

### Session 3 — Video Hero
- Copied background video to `public/videos/hero.mp4`
- Replaced static image in HeroSection with `<video>` (autoPlay, muted, loop, playsInline)
- Preserved gradient overlays for text readability
- Scroll-based fade transition remains for smooth video-to-content transition

## CSS Utilities Available
- `.glass-card`, `.glass-card-gold`, `.glass-nav` — glass-morphism backgrounds
- `.gold-gradient-text` — gold gradient on text
- `.gold-btn` — gold accent button styling
- `.scrollbar-hide` — hide scrollbar
- `.font-display` — Playfair Display font

## Important Notes
- React Router v7 imports from `react-router` (not `react-router-dom`)
- lucide-react@0.562.0 — some icons renamed in newer versions (e.g., `Instagram`)
- Vite caches env vars on dev start — restart to pick up `.env.local` changes
- Admin routes use nested routing with `<Outlet />` in AdminLayout
- `profiles` table confirmed existing with admin user row
- Old `chelsea-man-spa-mobile` project is a sibling directory (no longer maintained)
