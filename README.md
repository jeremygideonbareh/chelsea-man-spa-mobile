# Chelsea Man Spa — Mobile Booking App

A premium, single-page mobile web application for booking appointments at **Chelsea Man Spa**, a high-end men's grooming and wellness salon located in Dubai Marina. The app is designed for mobile Safari (iOS) and Chrome (Android) with a luxurious dark theme inspired by the Dubai Marina night aesthetic.

## Live Demo

- **Firebase Hosting**: (deploy to `salon-app-256d3` project)
- **Target Users**: Busy professionals in Dubai Marina who want a fast, elegant booking experience on their phone

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Vanilla JavaScript (ES6+) | Zero build step, no framework lock-in, direct deploy to Firebase Hosting |
| **Backend** | Firebase Firestore | Real-time data, serverless, free tier for small scale |
| **Authentication** | Firebase Auth (Google Sign-In via redirect) | Redirect flow required for mobile Safari (popups fail in iOS Safari) |
| **Hosting** | Firebase Hosting | Global CDN, one-command deploy, HTTP/2, free SSL |
| **Styling** | Vanilla CSS with custom properties | No preprocessor needed; CSS variables power the theme |
| **Animations** | CSS-only keyframe animations | Zero JS overhead, GPU-accelerated, 60fps |

### Why Vanilla JS?

- No build step means instant deployment — `firebase deploy` pushes raw files
- The app is simple enough that a framework adds complexity without benefit
- All DOM manipulation is straightforward — render functions replace innerHTML on state change
- Maximum compatibility with mobile Safari (no Webpack/vite polyfill issues)
- Readable, auditable code — a CS major can trace every execution path

---

## File Structure

```
chelsea-man-spa-mobile/
├── README.md                      # This file — project documentation
├── DESIGN.md                      # Design decisions and rationale
├── firebase.json                  # Firebase Hosting configuration
├── .firebaserc                    # Firebase project alias
└── public/
    ├── index.html                 # Entry point — loads all CSS/JS in order
    ├── css/
    │   └── styles.css             # All styles — theme, layout, animations
    ├── images/
    │   └── hero.jpg               # Hero banner image (add your own)
    └── js/
        ├── config.js              # Firebase config constants, time slots
        ├── data.js                # Hardcoded services, stylists, addons
        ├── state.js               # Global STATE object + date utilities
        ├── auth.js                # Google Sign-In, sign-out, auth state listener
        ├── navigation.js          # Tab bar, page push/pop stack
        ├── ui.js                  # Shared UI helpers (loading, errors, etc.)
        ├── views/
        │   ├── auth.js            # Sign-in screen renderer
        │   ├── home.js            # Home page with hero, promos, services scroll
        │   ├── services.js        # Service selection with search + filter
        │   ├── stylists.js        # Stylist selection with gender filter
        │   ├── datetime.js        # Date picker + time slot grid
        │   ├── checkout.js        # Review booking, add-ons, payment, VAT
        │   ├── confirmed.js       # Booking confirmation with checkmark animation
        │   ├── bookings.js        # My Bookings list
        │   └── profile.js         # User profile, settings, sign out
        └── app.js                 # Entry point — Firebase init, auth listener, boot
```

### Script Loading Order

Scripts load sequentially in `index.html` to ensure dependencies exist before use:

1. **CSS** — `styles.css`
2. **Config** — `config.js` (firebase config constants, no dependencies)
3. **Data** — `data.js` (SERVICES, STYLISTS, ADDONS — no dependencies)
4. **State** — `state.js` (STATE singleton, DATES, helper functions)
5. **Auth** — `auth.js` (Firebase auth functions — depends on global STATE)
6. **Navigation** — `navigation.js` (boot function, tab management — depends on STATE)
7. **UI** — `ui.js` (shared rendering helpers)
8. **Views** — All view files (each exposes a render function to window)
9. **App** — `app.js` (initializes Firebase, wires auth listener, calls boot)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ (for Firebase CLI)
- Firebase account (free tier)
- Google Cloud project with Firebase enabled

### 1. Clone the Repository

```bash
git clone <your-repo-url> chelsea-man-spa-mobile
cd chelsea-man-spa-mobile
```

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3. Log In to Firebase

```bash
firebase login
```

### 4. Initialize Firebase in the Project

```bash
firebase init
```

When prompted:
- Select **Hosting** (spacebar to select, enter to confirm)
- Use existing project: `salon-app-256d3`
- Set `public/` as your public directory
- Configure as a single-page app: **Yes**
- Set up automatic builds with GitHub: **No**
- Overwrite existing `index.html`: **No**

### 5. Deploy to Firebase Hosting

```bash
firebase deploy
```

Your app will be live at `https://salon-app-256d3.web.app` and `https://salon-app-256d3.firebaseapp.com`.

### 6. (Optional) Seed Firestore Data

The app works with hardcoded data out of the box. To use Firestore:

1. Create Firestore database in Firebase Console (start in test mode)
2. Create collections: `services`, `stylists`, `addons`
3. Add documents matching these field schemas:

**services/**
```json
{
  "id": "1",
  "name": "Men's Haircut",
  "price": 180,
  "dur": "30 min"
}
```

**stylists/**
```json
{
  "id": "1",
  "name": "Mustafa",
  "title": "Master Barber",
  "rating": 5.0,
  "reviews": 214,
  "avail": true,
  "gender": "male"
}
```

**addons/**
```json
{
  "id": "1",
  "name": "Scalp massage (10 min)",
  "price": 50
}
```

---

## Development Workflow

### Local Development

Since there is no build step, you can serve the app locally with any static file server:

```bash
# Using Firebase emulator:
firebase serve

# Or Python:
python3 -m http.server 8080 --directory public/

# Or Node:
npx serve public/
```

### Making Changes

1. Edit files in `public/` directly
2. Refresh browser to see changes
3. Deploy with `firebase deploy`

### Git Workflow

```bash
git checkout -b feature/my-feature
# make changes
git add .
git commit -m "feat: description of change"
git push origin feature/my-feature
# Create PR, merge to main
git checkout main
git pull
firebase deploy
```

---

## Architecture Decisions

### 1. Hardcoded Data First, Firebase as Enhancement

The app ships with 12 services, 6 stylists, and 3 addons hardcoded in `data.js`. On page load, it also tries to fetch from Firestore with a 3-second timeout. If Firestore returns data first, it overrides the hardcoded defaults.

**Why**: On slow connections, waiting for Firebase would show a blank screen. Hardcoded data ensures the app is usable immediately. Firestore enriches the experience when available.

### 2. Google Sign-In via Redirect

Firebase Auth offers two flows: **popup** and **redirect**. Safari on iOS blocks popups. The redirect flow navigates to the Google sign-in page, then redirects back. The auth result is handled in `app.js` via `firebase.auth().getRedirectResult()`.

### 3. Single-Page Architecture with Push/Pop Navigation

The app uses a hand-rolled navigation stack instead of a router:

- **Tab bar** (Home, Bookings, Profile) — calls `switchTab(tabName)`
- **Deep pages** (Services, Stylists, DateTime, Checkout, Confirmed) — calls `pushPage(pageId)` which hides the tab bar and pushes onto a stack
- **Back navigation** — calls `popPage()` which reveals the tab bar when returning to tab level

This keeps the URL hash-free and avoids mobile Safari's back-swipe gesture conflicts.

### 4. CSS-Only Animations

All animations are implemented as CSS `@keyframes`:

- `fadeUp` — elements fade in while sliding up 20px
- `heroShimmer` — gradient shimmer sweep across the hero image
- `badgePulse` — subtle pulse on promo badges
- `pop` — scale bounce for modals/cards
- `checkDraw` — SVG checkmark stroke animation

**Why**: CSS animations run on the GPU compositor thread and don't block the main JS thread. Zero JavaScript overhead for smooth 60fps animations.

### 5. No Emoji Policy

All UI text is plain text. Icons use SVG inline or Unicode symbols (e.g., star for ratings). This avoids cross-platform emoji rendering inconsistencies (Android vs iOS emoji look different).

### 6. Safe-Area-Viewport

The app uses `env(safe-area-inset-bottom)` for the tab bar padding, ensuring that on iPhone X+ devices with the home indicator, the tab bar doesn't overlap the system gesture area.

### 7. localStorage for Booking Persistence

Bookings are saved to `localStorage` under the key `bks`. On page load, `STATE.bookings` is initialized from `localStorage`. When a booking is confirmed, it's pushed both to `localStorage` and (if authenticated) to Firestore.

---

## Key Design Patterns

### Render Functions

Each view has a render function that returns an HTML string. Views are re-rendered by calling the render function and setting `innerHTML`:

```javascript
function renderHome() {
  const container = document.getElementById('page-home');
  container.innerHTML = `...template...`;
}
```

### State-Driven UI

The `STATE` object is the single source of truth. Views read from `STATE` and write through it. There is no two-way data binding — just re-render on state change.

### Global Function Exposure

All functions are assigned to `window` because HTML `onclick` attributes use string references. This is the standard pattern for vanilla JS SPAs without a build step.

```javascript
window.selectService = function(id) { ... };
```

---

## Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 800ms |
| Time to Interactive | < 1.5s |
| Animation Frame Rate | 60fps |
| Total Page Weight | < 200KB (excluding hero image) |

---

## Troubleshooting

### Firebase Auth not working on iOS

- Ensure **Google Sign-In** is enabled in Firebase Console > Authentication > Sign-in methods
- Add your domain (`localhost` and the Firebase Hosting URL) to the authorized domains list
- The redirect flow is used (`signInWithRedirect`) — popups will fail on Safari

### Firestore data not loading

- Check that Firestore is created and in test mode (or with appropriate security rules)
- The app silently falls back to hardcoded data — check browser console for errors
- Ensure collection names match: `services`, `stylists`, `addons`

### CSS not applying

- Verify the file path in `index.html`: `css/styles.css` (relative to `public/`)
- Check for syntax errors in the CSS file (missing closing braces)
- Test on a real device — iOS Safari has some CSS limits

---

## License

MIT
