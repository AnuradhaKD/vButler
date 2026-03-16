# EPIC-08 — Wellness & Spa

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-08 |
| **Epic Name** | Wellness & Spa |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.7 Wellness & Spa |
| **Architecture Reference** | §5.2 JSON Schema (property.wellness), §6 Module Architecture (wellness.js) |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

Wellness and spa services are among the highest-margin offerings at Browns properties, yet they're frequently under-booked simply because guests don't know what's available or find calling to book too much friction. A well-designed wellness discovery and booking flow directly grows spa revenue while eliminating the phone-tag that puts both guests and spa staff in a bad experience.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G2 — Increase Upsell Revenue | Digital treatment menu drives spontaneous bookings guests wouldn't have made otherwise |
| G1 — Reduce Front Desk Load | Spa bookings handled in-app without calling reception or the spa directly |
| G3 — Improve Guest Satisfaction | Guests can browse, compare, and book treatments at their own pace |

---

## Scope

### In Scope
- Wellness hub screen (treatments + classes + packages overview)
- Treatment detail with booking flow
- Classes & activities schedule with booking
- Wellness packages (multi-session deals)
- Booking confirmation with cancellation policy
- All content from `property.json → wellness`
- Bookings stored in `vb:requests[]` (category: wellness)

### Out of Scope
- Real therapist calendar / availability (Phase 1: guest submits preference, staff confirm)
- Online payment at booking (charge added to folio via EPIC-14)
- Spa loyalty cards or membership discounts

---

## User Stories

### US-08.1 — Wellness Hub
**As a** guest,
**I want** to discover all wellness and spa offerings at my property,
**so that** I can plan a treatment without leaving my room.

**Acceptance Criteria:**
- [ ] Hub accessible from Quick Actions → Wellness (`#/wellness`)
- [ ] Hero banner (brand gradient + spa imagery) with "Rejuvenate & Restore" heading in Playfair Display
- [ ] 3 sections: **Spa Treatments**, **Classes & Activities**, **Packages**
- [ ] Each section has a "View All" if more than 4 items (collapse/expand)
- [ ] Empty section hidden if no items configured for that property

**Story Points:** 1

---

### US-08.2 — Spa Treatment Cards
**As a** guest,
**I want** to browse individual spa treatments with full details,
**so that** I can choose the right treatment for my needs.

**Acceptance Criteria:**
- [ ] Treatment card: name, duration chip (e.g., "60 min"), price (LKR), short description
- [ ] Tapping a card expands inline (accordion) or opens a bottom drawer with full details: full description, what's included, cancellation policy, "Book Now" button
- [ ] "Book Now" opens the booking flow (US-08.4)
- [ ] Treatments loaded from `property.json → wellness.treatments[]`

**Story Points:** 1

---

### US-08.3 — Classes & Activities Schedule
**As a** guest,
**I want** to see the schedule for yoga, fitness, and other activities,
**so that** I can plan my time and book a spot.

**Acceptance Criteria:**
- [ ] Each class shown as a schedule card: class name, day(s) + time, duration, price (or "Complimentary"), max participants, instructor name (if provided)
- [ ] "Book" button on each card; if class is full: shows "Full — Join Waitlist" (Phase 1: just shows full state, no real waitlist)
- [ ] Classes loaded from `property.json → wellness.classes[]`
- [ ] Schedule filtered by upcoming days (today + next 7 days) computed from `class.availableDays` and `class.startTime`

**Story Points:** 2

---

### US-08.4 — Wellness Booking Flow
**As a** guest who wants to book a treatment or class,
**I want** a smooth booking form that captures my preferences,
**so that** the spa team can prepare exactly what I need.

**Acceptance Criteria:**
- [ ] Booking form fields:
  - **Date**: Flatpickr date picker (within stay dates only)
  - **Time slot**: selectable pills generated from class schedule or available hours
  - **Therapist preference** (only for treatments with `therapistPreference: true`): Any / Female Therapist / Male Therapist
  - **Number of guests** (for classes): stepper
  - **Special health notes**: text field (e.g., injuries, sensitivities)
- [ ] Cancellation policy prominently shown before confirm button: loaded from `treatment.cancellationPolicy`
- [ ] "Confirm Booking" button — creates request in `vb:requests[]` with `category: "wellness"`
- [ ] Success state: booking reference, treatment name, date/time, cancellation deadline
- [ ] Charge added to reservation folio in localStorage

**Story Points:** 2

---

### US-08.5 — Wellness Packages
**As a** guest planning a longer stay or a special occasion,
**I want** to browse multi-session wellness packages,
**so that** I can get more value and plan ahead.

**Acceptance Criteria:**
- [ ] Packages loaded from `property.json → wellness.packages[]` (if configured)
- [ ] Package card: name, number of sessions, what's included (bullet list), total price, per-session saving (if applicable)
- [ ] "Book Package" follows same booking flow as single treatment (US-08.4)
- [ ] Package section hidden if no packages configured

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Modal/Drawer, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (stay dates for booking range) | Blocker | EPIC-03 |
| EPIC-06 RequestService | Blocker | EPIC-06 |
| `data/properties/{id}.json → wellness` | Data dependency | — |

---

## Technical Notes

- Available time slots for treatments computed from `wellness.availableHours` at 30-min intervals, excluding already-booked slots (Phase 1: no real calendar — all slots shown as available)
- Booking written to `vb:requests[]` with `type: "spa_treatment"` or `"yoga_class"` etc.
- Charge written to `vb:reservations[n].folio[]`

---

## Definition of Done

- [ ] Wellness hub renders all 3 sections from property JSON
- [ ] Treatment cards expand to show full details with booking CTA
- [ ] Class schedule shows upcoming sessions based on current date
- [ ] Booking flow fields render correctly for treatments (with therapist preference) and classes
- [ ] Cancellation policy shown before confirmation
- [ ] Booking creates request in localStorage and adds charge to folio
- [ ] Success screen shows booking reference and cancellation deadline

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
