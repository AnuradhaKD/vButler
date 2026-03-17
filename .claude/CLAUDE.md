# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Destinity vButler** — a Progressive Web App (PWA) for Browns Hotels & Resorts guests. Guests manage hotel stays, service requests, dining, wellness, complaints, and more from their mobile device.

## No Build Step

This is a **zero-dependency, zero-build static app**. There are no `npm`, `node_modules`, or build tools. Deploy by serving the root directory as-is (e.g., `npx serve .` or any static host). Tailwind CSS and fonts are loaded via CDN.

To run locally: `npx serve .` or `python -m http.server 8080`

## Architecture

**Stack:** Vanilla ES6 JavaScript · Tailwind CSS (CDN) · Material Symbols (Google Fonts) · localStorage

### Single JS Module: `js/app.js`
All application logic lives in one ~500-line `App` global object with these sub-modules:

| Module | Responsibility |
|---|---|
| `App.storage` | localStorage CRUD wrapper (key prefix: `vb:`) |
| `App.auth` | Session management, login, SHA-256 password hashing via Web Crypto API |
| `App.reservations` | Multi-reservation state, active reservation switching |
| `App.requests` | Service request CRUD (linked to reservations) |
| `App.complaints` | Complaint submission and status tracking |
| `App.data` | Fetch + cache JSON data files from `/data/` |
| `App.header` | Renders shared page header |
| `App.bottomNav` | Mobile bottom navigation |
| `App.sidebar` | Desktop sidebar navigation |
| `App.toast` | Toast notification UI (success/error/warning/info) |
| `App.helpers` | Date formatting, currency, status badges, ID generation |

### Data Layer
All data is static JSON — no backend API:
- `data/chain.json` — brand config, feature flags, promotions, property list
- `data/mock/guests.json` — demo guest accounts (email + hashed passwords)
- `data/mock/reservations.json` — demo reservations
- `data/properties/{propertyId}.json` — property-specific services, dining, experiences, laundry

### localStorage Schema (prefix `vb:`)
```
vb:session            {guestId, email, expiresAt}
vb:profile            {id, email, fullName, phone, photoBase64, ...}
vb:reservations       [{id, guestEmail, propertyId, roomNumber, checkIn, checkOut, ...}]
vb:activeReservation  string (reservation ID)
vb:requests           [{id, reservationId, serviceName, status, createdAt, ...}]
vb:complaints         [{id, ref, reservationId, status, timeline, ...}]
vb:notifications      [{id, type, title, message, read, timestamp}]
vb:wishlist           [{id, type, savedAt}]
vb:wakeupCalls        [{id, reservationId, date, time, status}]
vb:theme              'light' | 'dark'
vb:language           'en' | 'si' | 'ta' | 'ar' | 'de'
vb:preArrival:{resId} {completed fields...}
```

### Pages (37 HTML files)
Each HTML file is a standalone page. Pages follow a consistent pattern:
1. Load `js/app.js` and `assets/css/app.css`
2. Call `App.auth.requireAuth()` to guard protected pages
3. Call `App.header.render()`, `App.bottomNav.render()`, `App.sidebar.render()` for shared chrome
4. Fetch data via `App.data.load(url)` then render DOM

### UI Layout
- **Mobile:** bottom navigation (5 items), full-width cards, safe-area padding
- **Desktop:** left sidebar (14 items), content panel
- Responsive breakpoint: `md` (768px) via Tailwind

## Key Conventions

- **Reservation-centric:** all service requests, complaints, and billing are linked to a `reservationId`. Use `App.reservations.getActive()` to get the current context.
- **Feature flags:** check `chain.json` features object (e.g., `features.wakeUpCall`, `features.loyaltyPoints`) before rendering feature UI.
- **Status badges:** use `App.helpers.statusBadge(status)` for consistent color-coded badges across all pages.
- **ID generation:** use `App.helpers.generateId('REQ')` etc. for new entity IDs.
- **Dark mode:** toggled via `dark` class on `<html>`. All Tailwind dark variants (`dark:bg-*`, `dark:text-*`) must be included when adding new UI.
- **Icons:** use Material Symbols with `<span class="material-symbols-rounded">icon_name</span>`. Filled variant: add class `fill-icon`.
- **Currency:** always use `App.helpers.formatCurrency(amount)` — reads currency from active property config.

## Documentation
Detailed specs are in `/docs/`:
- `architecture.md` — system design, data flow, PWA config
- `prd.md` — product requirements and feature modules
- `design-system.md` — design tokens, color palette, typography, component specs
- `epics/` — 18 feature epics with acceptance criteria
