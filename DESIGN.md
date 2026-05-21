# Design System — Chelsea Man Spa

This document captures the design rationale, visual language, and interaction patterns used in the Chelsea Man Spa mobile booking app.

---

## 1. Theme: "Dubai Marina Night"

The visual identity is inspired by Dubai Marina at night — warm charcoal shadows, ambient gold reflections on water, and deep navy sky.

### Color Palette

```
--bg:       #0A0907   Warm charcoal — near-black with warm undertone
--card:     #141210   Elevated surface — slightly lighter than bg
--card-alt: #1C1A16   Hover/active state — subtle lift
--cream:    #E8E2D6   Off-white text — softer than pure white, easier on eyes
--border:   rgba(232,226,214,0.07)  Subtle borders — barely visible, structural only
--sec:      #9C958B   Secondary text — medium contrast, readable
--dim:      #6B655E   Muted/disabled — low contrast, tertiary information
--gold:     #C9A84C   Primary accent — luxury, highlights, active states
--gold-dim: rgba(201,168,76,0.12)  Gold at low opacity — subtle backgrounds
--gold-light: rgba(201,168,76,0.06)  Even subtler — hover states
--gold-glow: rgba(201,168,76,0.2)   Glow effect — selected items
--primary: #1F3A54   Deep navy — CTAs, buttons, links (contrasts with gold)
--primary-dim: rgba(31,58,84,0.2)  Navy at low opacity — button backgrounds
--cta:     #D4587A   Rose accent — special CTAs, price highlights
--success: #2D8A6E   Green — confirmation, success states
--error:   #D63939   Red — error messages, cancellations
```

### Why This Palette

- **Charcoal base (#0A0907)**: Premium dark mode feels more luxe than pure black. The warm undertone prevents the "washed out" look of #000.
- **Gold (#C9A84C)**: Universally associated with luxury and quality. Desaturated enough to be readable on dark backgrounds without being garish. Gold is used sparingly — only for:
  - Active tab state
  - Selected item borders
  - Price highlights
  - Star ratings
  - Confirmation checkmark
- **Navy (#1F3A54)**: Provides visual relief from the charcoal+gold palette. Used for primary buttons. Blue is trust-inducing and contrasts well with both gold and charcoal.
- **Rose (#D4587A)**: A calculated accent on the checkout page — draws attention to prices and the confirm button. Adds a touch of warmth to the otherwise cool palette.

### Dark Mode

The app is dark mode by design — no light mode toggle. This is intentional:
- Dark backgrounds hide bezels on OLED phones (true black = pixels off)
- Reduces eye strain in low-light salon environments
- Gold on dark charcoal feels significantly more premium than gold on white
- Consistent with luxury brand apps (think black credit cards, black packaging)

---

## 2. Typography

### Primary Display: Playfair Display

- Used for: H1 headlines, brand name, section headers
- Weight: 600 (semi-bold) for headings, 700 for brand
- Letter-spacing: -0.02em for headings (tight and elegant)
- Why: Playfair Display has high contrast strokes — thin hairlines and thick main strokes. It conveys editorial luxury, like a high-end magazine.

### Primary Body: Inter

- Used for: All body text, buttons, labels, input fields
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold)
- Why: Inter is highly legible on small mobile screens. Its tall x-height and open counters make it readable at small sizes. It pairs well with Playfair Display's classic feel.

### Type Scale

| Level | Size | Weight | Line Height | Font |
|-------|------|--------|-------------|------|
| Display | 2.25rem (36px) | 700 | 1.15 | Playfair Display |
| H1 | 1.75rem (28px) | 600 | 1.2 | Playfair Display |
| H2 | 1.375rem (22px) | 600 | 1.25 | Playfair Display |
| H3 | 1.125rem (18px) | 600 | 1.3 | Inter |
| Body | 0.9375rem (15px) | 400 | 1.5 | Inter |
| Small | 0.8125rem (13px) | 400 | 1.4 | Inter |
| Tiny | 0.6875rem (11px) | 500 | 1.3 | Inter |

---

## 3. Layout & Spacing

### Grid

- 16px horizontal padding on all screens
- 16px gutter between items in scrollable rows
- Content max-width: 480px (comfortable single-hand phone reading)

### Card Design

- Background: `--card` (#141210)
- Border-radius: 12px (`--radius`)
- Subtle border: `1px solid var(--border)`
- Padding: 16px inside cards
- Inner spacing: 12px between elements

### Tab Bar

- Frosted glass effect: `background: rgba(10,9,7,0.92)` with `backdrop-filter: blur(20px)`
- 3 tabs: Home, Bookings, Profile
- Only the active tab icon/text is gold; others are `--dim`
- Safe-area-inset-bottom padding for modern phones

### Touch Targets

- Minimum 44px height for all tappable elements
- Service items: 72px+ height for comfortable tapping
- Date chips: 48px × 48px
- Time slots: 44px minimum height
- Continue/CTA buttons: 56px height

---

## 4. Interaction Design

### Navigation Flow

```
[Home] → [Services] → [Stylists] → [Date & Time] → [Checkout] → [Confirmed]
   ↑                                                                       |
   └──────────────────────── [Bookings] ←──────────────────────────────────┘
```

Each step pushes a new page. Going back pops to the previous step. The tab bar hides during the booking flow and reappears when returning to a tab.

### Page Transitions

- Forward push: `translateX(100%)` → `translateX(0)` with 300ms ease-out
- Back pop: `translateX(0)` → `translateX(100%)` with 250ms ease-in
- Tab switch: Immediate no animation (bookmark-style switch)

### Micro-Interactions

- **Tab bar**: Active tab smoothly transitions the gold indicator
- **Service cards**: Scale up 1.02 on tap with gold border highlight
- **Date chips**: Selected chip has gold border and slight scale
- **Time slots**: Disabled slots (Friday prayer break, past times) are dimmed with a strikethrough
- **Checkout add-ons**: Toggle switches animate the checkmark draw
- **Confirmation**: Large circular checkmark draws via stroke-dasharray animation

### Loading States

- Initial load: Brand name fades in, an animated loading bar sweeps below it
- Inline loading: A subtle shimmer pulse on the affected area
- Error states: Inline error messages with red accent — no blocking modals

---

## 5. Animation Philosophy

### CSS-Only Rule

All animations are implemented with CSS `@keyframes` or CSS transitions. Zero JavaScript animation libraries. Reasoning:

1. **Performance**: CSS animations run on the GPU compositor thread. JS animations (even requestAnimationFrame) can be blocked by long paint frames.
2. **Battery**: GPU hardware is more power-efficient for animations than CPU.
3. **Simplicity**: No animation library to load, no API to learn.
4. **Mobile Safari**: CSS animations are well-supported; JS animation APIs have edge cases.

### Animation Catalog

| Animation | Type | Duration | Easing | Used On |
|-----------|------|----------|--------|---------|
| `fadeUp` | Keyframe | 0.4s | cubic-bezier(0.16,1,0.3,1) | Page content entrance |
| `heroShimmer` | Keyframe | 3s | linear | Hero image sweep |
| `badgePulse` | Keyframe | 2s | ease-in-out infinite | Promo badges |
| `pop` | Keyframe | 0.35s | cubic-bezier(0.34,1.56,0.64,1) | Modal/card appearance |
| `rise` | Keyframe | 0.5s | cubic-bezier(0.16,1,0.3,1) | Bottom sheet |
| `pulse` | Keyframe | 2s | ease-in-out infinite | Loading indicator |
| `checkDraw` | Keyframe | 0.6s | ease-in-out | Confirmation checkmark |
| `brandReveal` | Keyframe | 1s | ease-out | Brand name on load |
| `loadBar` | Keyframe | 1.5s | ease-in-out infinite | Loading bar animation |

### Easing Curves

We use custom cubic-bezier curves for a premium feel:
- `cubic-bezier(0.16, 1, 0.3, 1)`: "Overshoot" curve — starts quickly, decelerates smoothly. Used for entrances.
- `cubic-bezier(0.34, 1.56, 0.64, 1)`: Spring-like bounce. Used for pop effects.

We avoid `ease-in-out` for most animations because it creates a "soggy" middle feel.

---

## 6. The "No Emoji" Policy

**Why no emoji?** Emoji rendering varies significantly across platforms:

- Apple's emoji are detailed and 3D-like
- Google's emoji are flat and cartoonish
- Samsung's emoji have yet another style
- Some Android devices don't support recent emoji

This inconsistency undermines the premium brand experience. Instead:
- **Icons**: Inline SVG or CSS-based icons (star icon for ratings, checkmark for selection)
- **Decorative**: CSS shapes and gradients
- **Status**: Text labels or color cues

---

## 7. Mobile Safari Compatibility

### Critical Decisions

1. **Google Sign-In via Redirect (not Popup)**: Safari on iOS blocks `window.open` from async contexts. The redirect flow navigates the full page to Google, then back. `getRedirectResult()` handles the result on return.

2. **No `import`/`export`**: ES modules work in Safari but:
   - `type="module"` delays script execution
   - Modules are deferred by default — can't guarantee load order with inline event handlers
   - We use global script tags in explicit order

3. **`-webkit-` prefixes**: Safari still needs prefixes for `backdrop-filter` and some animation properties.

4. **Safe area insets**: Use `env(safe-area-inset-bottom)` for the tab bar padding. Without this, the home indicator overlaps the tab bar on iPhone X+.

5. **`user-scalable=no`**: We disable pinch-zoom because:
   - The booking form inputs should not trigger zoom on focus (iOS zooms on inputs at < 16px font size)
   - The app is designed for a fixed viewport
   - All content is sized for comfortable reading without zoom

---

## 8. Accessibility Considerations

- **Color contrast**: All text colors pass WCAG AA against the dark background
  - Cream (#E8E2D6) on charcoal (#0A0907): ratio ~12:1 (AAA)
  - Secondary (#9C958B) on charcoal (#0A0907): ratio ~5.5:1 (AA)
  - Gold (#C9A84C) on charcoal (#0A0907): ratio ~7:1 (AA)
- **Touch targets**: All interactive elements are at least 44×44px
- **Focus indicators**: Custom gold outline for keyboard navigation
- **Reduced motion**: `@media (prefers-reduced-motion)` disables animations

---

## 9. Firestore Data Strategy

### Hardcoded → Firestore Fallback Pattern

```
Page Load
    │
    ├── Show UI immediately with hardcoded data (SERVICES, STYLISTS, ADDONS)
    │
    └── Start Firestore fetch (with 3s timeout)
            │
            ├── Firestore responds first → override STATE data → re-render UI
            │
            └── Timeout (3s) → keep hardcoded data (silent fallback)
```

This pattern ensures the app is never blank. Even if Firebase is completely down, the app works perfectly with hardcoded data.

### Security Rules (Firestore)

For production, use these security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for catalog data
    match /{collection} {
      allow read: if true;
    }
    // User bookings: only authenticated user can read/write their own
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 10. Future Design Considerations

- **Light mode**: Not implemented but could be added by flipping CSS custom properties
- **RTL**: The app is English-only; Arabic RTL support would need layout mirroring in CSS
- **Offline mode**: Firestore persistence could be enabled for offline booking
- **PWA**: Add a service worker and manifest.json for "Add to Home Screen"
- **Payment integration**: Tabby/Tamara are shown as options but not integrated — they need iframe/redirect integration
