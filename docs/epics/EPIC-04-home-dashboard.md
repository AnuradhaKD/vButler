# EPIC-04 — Home Dashboard

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-04 |
| **Epic Name** | Home Dashboard |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.3 Home Dashboard |
| **Architecture Reference** | §6 Module Architecture (dashboard.js), §8 State Management (Alpine store) |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

The dashboard is the first screen a guest sees after login. It needs to do four things simultaneously: orient the guest to their current stay, surface the most important actions instantly, show recent activity at a glance, and hint at other upcoming bookings. A weak dashboard means guests will default back to calling the front desk instead of self-serving through the app.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Quick action grid puts the 8 most-used services one tap away |
| G2 — Increase Upsell Revenue | Contextual promotions and experience teasers surface in the hero area |
| G3 — Improve Guest Satisfaction | Personalised welcome and real-time stay status make guests feel seen |
| G4 — Centralise Guest Journey | Single screen overview replaces the need to call the hotel for basic information |

---

## Scope

### In Scope
- Top header: logo, property name, guest avatar, notification bell with unread badge
- Hero section: property banner, welcome message, stay countdown/progress
- Quick Actions grid (8 configurable shortcuts)
- Recent Activity feed (latest service request and billing statuses)
- Upcoming Reservations teaser strip (compact multi-reservation view)
- Empty/edge-case states: no active stay, no upcoming stay, only past stays
- Dark/light mode toggle in header

### Out of Scope
- Full notification centre (covered in EPIC-17)
- Full reservation management (covered in EPIC-03)
- Individual service feature screens (covered in EPIC-06 through EPIC-18)

---

## User Stories

### US-04.1 — Dashboard Header
**As a** guest,
**I want** a clear header showing my current context,
**so that** I always know which property I'm looking at and if I have notifications.

**Acceptance Criteria:**
- [ ] Browns Hotels & Resorts logo (SVG) displayed top-left
- [ ] Property name of the active reservation displayed below/beside the logo
- [ ] Notification bell icon top-right; red badge shows unread count (hidden if 0)
- [ ] Guest avatar top-right (initials circle if no photo): tapping navigates to `#/profile`
- [ ] Dark/Light mode toggle icon in header
- [ ] Header is sticky (stays visible on scroll)

**Story Points:** 1

---

### US-04.2 — Hero Section
**As a** guest,
**I want** a welcoming hero section that shows my stay status at a glance,
**so that** I feel personally greeted and oriented to my stay.

**Acceptance Criteria:**
- [ ] Property hero image as background (or brand gradient if no image available)
- [ ] Dark overlay on image to ensure text readability
- [ ] Welcome message: "Welcome back, [Guest First Name]" in Playfair Display
- [ ] For **Active** reservation: "Day [N] of [Total]" pill + check-out date ("Checking out 8 Apr")
- [ ] For **Upcoming** reservation: "Check-in in [N] days" pill + check-in date
- [ ] For **Checked Out** (last stay): "Thank you for your stay" message with post-stay feedback prompt button
- [ ] Property name displayed in the hero in elegant typography
- [ ] Hero height: ~220px on mobile, ~280px on desktop

**Story Points:** 2

---

### US-04.3 — Quick Actions Grid
**As a** guest,
**I want** one-tap shortcuts to the services I use most,
**so that** I don't have to navigate multiple levels to do something simple.

**Acceptance Criteria:**
- [ ] Grid displays 8 quick action tiles: Services, Dining, Wellness, My Bill, Experiences, Complaints, Room Requests, Explore
- [ ] Each tile: icon in a brand-coloured circle, label text below
- [ ] 4×2 layout on mobile (2 columns, 4 rows), 8×1 on desktop (1 row)
- [ ] Each tile deep-links to its respective feature screen
- [ ] Quick actions are configurable per property via `property.json` → `quickActions` array (order and which tiles show)
- [ ] Tapping any tile navigates to the correct route
- [ ] Tiles animate subtly on tap (scale down 0.95, 100ms)

**Story Points:** 2

---

### US-04.4 — Recent Activity Feed
**As a** guest,
**I want** to see the latest status of my requests and charges on the dashboard,
**so that** I don't have to go into each section just to check for updates.

**Acceptance Criteria:**
- [ ] Shows up to 4 most recent items from: service requests + billing charges (combined, sorted by `updatedAt` descending)
- [ ] Each item shows: icon, title (service/charge name), status badge or charge amount, time ago ("2 hours ago" via Day.js)
- [ ] Tapping an activity item navigates to the relevant detail screen
- [ ] If no activity: "No recent activity" empty state message
- [ ] Section title: "Recent Activity" with "View All" link (navigates to notifications `#/notifications`)

**Story Points:** 2

---

### US-04.5 — Upcoming Reservations Teaser
**As a** guest with multiple bookings,
**I want** to see my other upcoming reservations on the dashboard,
**so that** I'm reminded of my other stays without having to navigate away.

**Acceptance Criteria:**
- [ ] Shown only if the guest has 2 or more non-cancelled reservations
- [ ] Horizontal scroll strip of compact reservation cards (property name, dates, status badge)
- [ ] "View All Stays" link navigates to `#/reservations`
- [ ] Cards are compact (not full reservation cards — smaller height ~80px)
- [ ] If guest has only 1 reservation: this section is hidden

**Story Points:** 1

---

### US-04.6 — Dashboard Empty States
**As a** guest with no active stays,
**I want** a helpful message and clear next step,
**so that** I'm not left with a blank or confusing dashboard.

**Acceptance Criteria:**
- [ ] **No active reservation, has upcoming**: hero shows upcoming reservation context (PRD §DASH-02)
- [ ] **No active or upcoming reservation, only past**: "No active stays" state with a hotel illustration, message, and "Book a stay at Browns" button that opens the Browns website URL from `chain.json`
- [ ] **No reservations at all**: same "No active stays" state as above
- [ ] Quick Actions grid still shows (allows exploration of the app even without a stay)
- [ ] Recent Activity section hidden if no reservations

**Story Points:** 0 (covered within other stories — part of conditions)

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Navigation, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Reservation Management (active reservation context) | Blocker | EPIC-03 |
| `data/properties/{id}.json` — `quickActions` array | Data dependency | — |
| EPIC-06 through EPIC-15 (quick actions must have destinations) | Soft dependency — stubs acceptable | EPIC-06–15 |

---

## Technical Notes

- Dashboard page re-renders whenever `Alpine.store('reservation').active` changes (watcher)
- Stay countdown calculated using Day.js: `dayjs(checkOut).diff(dayjs(), 'day')` for remaining nights
- Hero image loaded from `property.heroImages[0]`; fallback to CSS gradient using brand colour
- Recent activity feed merges two localStorage arrays: `vb:requests` filtered by `resvId` + `reservation.folio` charges
- Day.js `fromNow()` used for relative timestamps in the activity feed
- Quick actions grid order and visibility driven by `property.quickActions` array from property JSON

---

## Definition of Done

- [ ] Dashboard loads within 500ms after navigation (data already in localStorage)
- [ ] Hero correctly shows Active stay state, Upcoming state, and No-Stay state
- [ ] All 8 quick action tiles render and navigate correctly
- [ ] Recent activity feed shows merged request + charge data
- [ ] Upcoming reservations strip appears only when guest has multiple bookings
- [ ] Dashboard re-renders correctly when active reservation is switched
- [ ] All 3 empty/edge states handled gracefully
- [ ] Dark mode applied correctly across all dashboard sections
- [ ] Header notification badge reflects actual unread count from `vb:notifications`

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
