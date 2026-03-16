# EPIC-03 — Reservation Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-03 |
| **Epic Name** | Reservation Management |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §5 Core Concept: Reservation-Centric Model, §7.2 Reservation Management |
| **Architecture Reference** | §5.2 JSON Schema (reservations.json), §5.3 localStorage (vb:reservations, vb:activeReservation), §6 reservation.service.js |
| **Status** | Ready for Development |
| **Estimated Effort** | 10 Story Points |

---

## Problem Statement

The reservation is the central anchor of the entire Destinity vButler experience. A guest may have multiple bookings across multiple Browns properties simultaneously. Every feature — services, billing, complaints, experiences — is meaningless without knowing *which stay* it belongs to. This epic establishes the reservation-centric model that every other epic depends on.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G4 — Centralise Guest Journey | Single view of all stays across all Browns properties |
| G3 — Improve Guest Satisfaction | Guests always know which property/stay context they're acting in |
| G5 — Enable Data-Driven Hospitality | All in-app activity tagged to a specific reservation and property |

---

## Scope

### In Scope
- Reservation list screen with 4 tabs: Active, Upcoming, Past, Cancelled
- Reservation card component (property thumbnail, name, dates, room type, status badge, CTA)
- Reservation detail screen (full stay information, quick links)
- Reservation context switcher (switch active reservation from any screen)
- `ReservationService` module
- Loading reservations from `data/mock/reservations.json` into `localStorage`
- `vb:activeReservation` persistence (last selected reservation survives app restart)
- Reservation status badges aligned to 4 states: Active, Upcoming, Checked Out, Cancelled

### Out of Scope
- Creating new reservations (PRD §RES-03 — reservations come from PMS/booking engine only)
- Modifying existing reservations
- Real-time PMS sync (mock data only in Phase 1; architecture supports it in Phase 2)

---

## User Stories

### US-03.1 — Reservation List View
**As a** guest,
**I want** to see all my Browns bookings in one place,
**so that** I can manage all my stays without logging in separately for each property.

**Acceptance Criteria:**
- [ ] 4 tabs: **Active** (currently checked-in stays), **Upcoming** (confirmed future stays), **Past** (completed stays), **Cancelled**
- [ ] Tabs show count badge when count > 0 (e.g., "Active (1)")
- [ ] Correct reservations appear under each tab based on their `status` field
- [ ] Empty tab state: illustration + "No [tab name] reservations" message
- [ ] Default tab on load: Active (if any exist), otherwise Upcoming

**Story Points:** 2

---

### US-03.2 — Reservation Card
**As a** guest browsing my reservations,
**I want** each reservation displayed as a clear card with key information,
**so that** I can identify the right stay at a glance.

**Acceptance Criteria:**
- [ ] Card displays: property image/thumbnail (brand colour placeholder if no image), property name, reservation number, room type, check-in and check-out dates, number of guests (adults + children), status badge
- [ ] Status badge colour matches state: Active = green, Upcoming = blue, Checked Out = grey, Cancelled = red/muted
- [ ] CTA button text changes by status: Active → "Manage Stay", Upcoming → "View Details", Past → "View Bill", Cancelled → "View Details" (disabled actions)
- [ ] Tapping card or CTA navigates to Reservation Detail screen with that reservation's ID
- [ ] Cards sorted: Active first, then by check-in date ascending

**Story Points:** 2

---

### US-03.3 — Reservation Detail View
**As a** guest,
**I want** to see the full details of a specific booking,
**so that** I know exactly what I've booked and can take action.

**Acceptance Criteria:**
- [ ] Hero area: property image placeholder with property name overlay in Playfair Display, status badge
- [ ] **Stay Details** section: check-in date/time, check-out date/time, room number, room type, number of adults, number of children, total nights (calculated)
- [ ] **Property Info** section: full address, phone number, email
- [ ] **Booking Info** section: reservation/reference number, booking source, number of guests
- [ ] **Special Requests** section: display any notes from booking; "None" if empty
- [ ] **Current Balance** section: outstanding amount in property currency; "Paid in Full" if balance = 0
- [ ] For Active/Upcoming reservations: "Pay Now" button on balance section if balance > 0 (links to EPIC-14 billing)
- [ ] **Quick Links** row: Services, My Bill, Complaints, Pre-Arrival (Pre-Arrival shown only for Upcoming)
- [ ] For Cancelled reservations: all action buttons disabled; cancellation notice shown

**Story Points:** 3

---

### US-03.4 — Reservation Context Switcher
**As a** guest with multiple active or upcoming reservations,
**I want** to switch between my reservations from anywhere in the app,
**so that** I don't need to go back to the reservations list every time.

**Acceptance Criteria:**
- [ ] Reservation context header strip visible on all authenticated, non-auth pages
- [ ] Strip shows: property name, stay dates, status badge
- [ ] If guest has >1 reservation: a "Switch" button/chevron appears on the strip
- [ ] Tapping "Switch" opens a bottom drawer (mobile) or dropdown (desktop) listing all reservations
- [ ] Each option in the switcher shows property name, dates, and status badge
- [ ] On selection: `vb:activeReservation` updated in localStorage, Alpine store updated, current page content re-renders for new reservation context
- [ ] Switching reservations does NOT require re-authentication (PRD §RES-07)
- [ ] If only 1 reservation exists: no switcher control shown (strip is non-interactive)

**Story Points:** 2

---

### US-03.5 — Reservation Data Loading
**As a** developer/system,
**I want** reservations loaded from JSON and stored in localStorage on login,
**so that** all features can access reservation data consistently.

**Acceptance Criteria:**
- [ ] On successful login: `ReservationService.loadForGuest(guestEmail)` fetches matching reservations from `data/mock/reservations.json`
- [ ] Reservations written to `vb:reservations` in localStorage
- [ ] `vb:activeReservation` set to: first Active reservation, or first Upcoming if no Active, or first Past if no Active/Upcoming
- [ ] On app load with valid session: reservations hydrated from localStorage into Alpine store (no re-fetch needed)
- [ ] Reservation folio (charges array) included in stored reservation object for use by EPIC-14

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell & Router | Blocker | EPIC-01 |
| EPIC-02 Authentication (login triggers reservation load) | Blocker | EPIC-02 |
| `data/mock/reservations.json` | Data file required | — |
| EPIC-01 ReservationContextHeader component | Blocker | EPIC-01 |
| All other epics (EPIC-04 through EPIC-18) depend on active reservation context | Dependency provider | EPIC-04–18 |

---

## Technical Notes

- `ReservationService` (`js/core/reservation.service.js`) is the single source of truth for all reservation state
- The service exposes: `getAll()`, `getActive()`, `getById(id)`, `setActive(id)`, `filterByStatus(status)`
- Alpine store key `reservation.active` always reflects the currently selected reservation object
- Property data for the active reservation is lazy-loaded from `data/properties/{propertyId}.json` when a reservation becomes active
- `DataService` caches property JSON in memory so switching back to a previously loaded property is instant
- Reservation `status` field in mock JSON: `"active"`, `"upcoming"`, `"checked-out"`, `"cancelled"`

---

## Definition of Done

- [ ] Reservation list renders all 4 tabs with correct reservations from mock data
- [ ] Reservation cards show all required fields and correct status badges
- [ ] Reservation detail screen shows all sections with correct data
- [ ] Context switcher correctly switches active reservation across all pages
- [ ] `vb:activeReservation` persists across page refresh and app restart
- [ ] Cancelled reservation: all action buttons disabled
- [ ] Empty state shown correctly for tabs with no reservations
- [ ] ReservationContextHeader updates immediately when active reservation changes

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
