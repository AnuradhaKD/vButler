# EPIC-01 — App Foundation & PWA Infrastructure

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-01 |
| **Epic Name** | App Foundation & PWA Infrastructure |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §6 Platform & Design System, §10 Technical Requirements, §13 PWA Configuration |
| **Architecture Reference** | §1 Architecture Overview, §2 Tech Stack, §4 Project Structure, §13 PWA Configuration, §14 Theming System |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

Before any guest-facing feature can be built, the app needs a stable, performant, and installable shell to run in. Without a proper foundation — routing, theming, design tokens, service worker, and shared component scaffolding — every subsequent epic will be built on sand. This epic is the non-negotiable bedrock of the entire product.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G4 — Centralise Guest Journey | A single PWA entry point works across mobile and desktop without App Store friction |
| G3 — Improve Guest Satisfaction | Fast load times and offline resilience reduce frustration |
| G1 — Reduce Front Desk Load | Guests can install the app to their home screen and access it instantly |

---

## Scope

### In Scope
- Single-page app shell (`index.html`) with hash-based router
- Tailwind CSS configuration with Browns design tokens (colours, fonts, radius)
- Alpine.js global store bootstrapping (auth, reservation context, ui state)
- PWA manifest (`manifest.json`) — installable on iOS and Android
- Service Worker (`sw.js`) — cache-first for app shell, network-first for JSON data
- Light/Dark theme system with `localStorage` persistence
- Bottom navigation bar (mobile) and sidebar navigation (desktop)
- Shared component scaffolding: Toast, Modal/Drawer, Status Badge, Loading State, Empty State
- Reservation context header strip (visible on all authenticated pages)
- `DataService` — JSON file loader with in-memory cache
- `StorageService` — localStorage abstraction with namespaced keys
- Responsive breakpoints: mobile (`<768px`), tablet (`768–1024px`), desktop (`>1024px`)
- Google Fonts CDN integration: Inter + Playfair Display
- Google Material Symbols Outlined icon set

### Out of Scope
- Any feature-specific UI (handled in EPIC-02 through EPIC-18)
- Backend integration
- Real push notification subscription (infrastructure only in this epic)

---

## User Stories

### US-01.1 — App Shell & Routing
**As a** guest,
**I want** the app to load instantly and navigate between sections without full page reloads,
**so that** the experience feels native and seamless.

**Acceptance Criteria:**
- [ ] `index.html` is the single entry point; all navigation is hash-based (`#/route`)
- [ ] Router reads `window.location.hash` and renders the appropriate page module
- [ ] Unknown routes redirect to `#/login` (unauthenticated) or `#/dashboard` (authenticated)
- [ ] Browser back/forward buttons work correctly
- [ ] Page transitions are smooth (fade or slide, ≤150ms)

**Story Points:** 3

---

### US-01.2 — Design Tokens & Tailwind Config
**As a** designer/developer,
**I want** Browns brand design tokens baked into the Tailwind config,
**so that** every component uses the correct brand colours, fonts, and spacing without manual overrides.

**Acceptance Criteria:**
- [ ] Tailwind config includes: `brand.DEFAULT = #003c52`, `brand.light = #00516e`, `brand.dark = #002838`
- [ ] Tailwind config includes: `surface.light = #f5f8f8`, `surface.dark = #0f1e23`
- [ ] Font families configured: `sans = Inter`, `display = Playfair Display`
- [ ] Border radius tokens configured: default `4px`, lg `8px`, xl `12px`, full `9999px`
- [ ] Dark mode configured as `class` strategy

**Story Points:** 1

---

### US-01.3 — PWA Manifest & Installability
**As a** guest,
**I want** to install Destinity vButler to my phone's home screen,
**so that** I can access it like a native app without opening a browser.

**Acceptance Criteria:**
- [ ] `manifest.json` present with: name, short_name, start_url, display: standalone, theme_color: `#003c52`, background_color: `#003c52`
- [ ] Icons provided at 192×192 and 512×512 (maskable)
- [ ] Install prompt works on iOS Safari (Add to Home Screen) and Android Chrome
- [ ] App launches in standalone mode (no browser chrome)
- [ ] Splash screen shows Browns brand colour on launch

**Story Points:** 2

---

### US-01.4 — Service Worker & Offline Support
**As a** guest with unreliable connectivity,
**I want** the app to remain functional when my internet is slow or drops,
**so that** I am not left with a blank screen mid-stay.

**Acceptance Criteria:**
- [ ] Service worker registered on first load
- [ ] App shell (HTML, CSS, JS, fonts) cached using cache-first strategy
- [ ] JSON data files cached using network-first with cache fallback
- [ ] Property images cached on first load per property
- [ ] Offline state: data-dependent features show a graceful "You're offline" state rather than crashing
- [ ] Service worker updates silently in the background without disrupting the user

**Story Points:** 3

---

### US-01.5 — Light / Dark Theme
**As a** guest,
**I want** to switch between light and dark mode,
**so that** the app is comfortable to use at night or in dim environments.

**Acceptance Criteria:**
- [ ] Theme toggle accessible from the top header and from Settings
- [ ] Toggling applies/removes `dark` class on `<html>` element
- [ ] Selected theme saved to `localStorage` (`vb:theme`) and restored on next load
- [ ] All UI surfaces have correct dark mode variants (backgrounds, text, borders, cards)
- [ ] Theme respects OS preference on first visit (`prefers-color-scheme`)

**Story Points:** 1

---

### US-01.6 — Navigation (Mobile Bottom Bar + Desktop Sidebar)
**As a** guest,
**I want** clear, persistent navigation that matches my device,
**so that** I can jump between sections without getting lost.

**Acceptance Criteria:**
- [ ] Mobile (`<768px`): fixed bottom tab bar with 5 tabs — Home, Stays, Services, Bill, Profile
- [ ] Desktop (`>1024px`): left sidebar with all navigation items and Browns logo
- [ ] Active route is visually highlighted in navigation
- [ ] Navigation is not shown on auth pages (login, register, OTP, forgot password)
- [ ] Navigation tab bar clears body content (`pb-20` on mobile)

**Story Points:** 2

---

### US-01.7 — Shared Component Library
**As a** developer,
**I want** a library of shared UI components,
**so that** every page is consistent and I don't re-implement common patterns.

**Acceptance Criteria:**
- [ ] `Toast` component: success (green), error (red), info (blue) — auto-dismiss after 4s
- [ ] `Modal` component: desktop centred overlay + mobile bottom drawer
- [ ] `StatusBadge` component: Active (green), Upcoming (blue), Checked Out (grey), Cancelled (red), Submitted (yellow), In Progress (orange), Resolved (green)
- [ ] `LoadingState` component: spinner overlay with optional message
- [ ] `EmptyState` component: icon + title + subtitle + optional CTA button
- [ ] `ReservationContextHeader` strip: property name, dates, status badge — visible on all authenticated pages

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| Browns logo assets (SVG, light + dark) | External — Browns brand team | — |
| Inter + Playfair Display fonts | CDN (Google Fonts) | — |
| Material Symbols icon set | CDN (Google Fonts) | — |
| Tailwind CSS CDN | CDN (jsDelivr) | — |
| Alpine.js CDN | CDN (jsDelivr) | — |
| None of the other epics can start until US-01.1 and US-01.6 are complete | Blocker | EPIC-02 through EPIC-18 |

---

## Technical Notes

- Zero build step in Phase 1: all libraries loaded via CDN script tags
- Tailwind CDN Play config block injected via `<script>` before the CDN script
- Alpine.js global store (`Alpine.store`) bootstrapped in `js/app.js`
- `DataService` implements in-memory LRU cache to avoid refetching JSON on every page visit
- `StorageService` wraps all `localStorage` calls with `try/catch` to handle storage quota errors gracefully
- Service Worker uses Workbox strategies conceptually (implemented manually without npm)
- All `localStorage` keys namespaced under `vb:` prefix

---

## Definition of Done

- [ ] App loads in under 2 seconds on a 4G connection (Lighthouse FCP < 2s)
- [ ] Lighthouse PWA score ≥ 90
- [ ] Lighthouse Performance score ≥ 85 on mobile
- [ ] App is installable on iOS Safari and Android Chrome
- [ ] Light and dark mode work correctly across all shared components
- [ ] Navigation renders correctly at mobile, tablet, and desktop breakpoints
- [ ] Service worker caches app shell and JSON data
- [ ] No console errors on load
- [ ] WCAG 2.1 AA colour contrast verified on all shared components

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
