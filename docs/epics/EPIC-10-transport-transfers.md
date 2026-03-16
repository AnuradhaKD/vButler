# EPIC-10 — Transport & Transfers

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-10 |
| **Epic Name** | Transport & Transfers |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.9 Transport & Transfers |
| **Architecture Reference** | §5.2 JSON Schema (property.transport), §6 Module Architecture (transport.js) |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

Transport is a pain point that spans the entire guest journey — from airport arrival to daily local trips to departure transfers. Currently, guests must call the concierge or front desk every time they need a vehicle. They have no visibility into pricing until they ask, and they can't pre-arrange transfers before they even arrive. A self-service transport booking tool removes friction at the beginning and end of every stay.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Airport transfers and local transport requests handled without concierge phone calls |
| G2 — Increase Upsell Revenue | Guests who can see transport options and prices spontaneously book more transfers |
| G3 — Improve Guest Satisfaction | Pre-arranged airport pickup removes the stress of arriving at an unfamiliar location |

---

## Scope

### In Scope
- Transport hub screen (4 transport types)
- Airport Transfer booking (arrival + departure)
- Hotel Shuttle schedule and booking
- Car Hire request
- Local Transport (tuk-tuk / taxi) request
- All transport options from `property.json → transport.options[]`
- Transport requests stored in `vb:requests[]` (category: transport)

### Out of Scope
- Real-time driver tracking
- Third-party ride-hailing integration (Uber, PickMe)
- Online payment at booking (charges to folio via EPIC-14, or on delivery)

---

## User Stories

### US-10.1 — Transport Hub
**As a** guest,
**I want** to see all transport options in one place,
**so that** I can arrange any kind of travel without speaking to a concierge.

**Acceptance Criteria:**
- [ ] 4 transport type cards (full-width tap cards): Airport Transfer, Hotel Shuttle, Car Hire, Local Transport
- [ ] Each card: icon, title, short description, price indicator ("From LKR X,XXX")
- [ ] Tapping a card expands the booking form inline (Alpine.js) or scrolls to the relevant section
- [ ] Cards loaded/shown based on what's available in `property.json → transport.options[]`
- [ ] My Upcoming Transfers section at bottom (requests of category: transport from `vb:requests[]`)

**Story Points:** 1

---

### US-10.2 — Airport Transfer Booking
**As a** guest,
**I want** to arrange an airport pickup or drop-off through the app,
**so that** I have reliable transport without last-minute scrambling.

**Acceptance Criteria:**
- [ ] Direction toggle: **Arrival Transfer** / **Departure Transfer**
- [ ] **Arrival Transfer** required fields: Flight Number, Arrival Date (Flatpickr), Arrival Time, Number of Passengers (stepper 1–8)
- [ ] **Departure Transfer** required fields: Departure Date, Desired Departure Time from Hotel, Flight Number, Number of Passengers
- [ ] Vehicle selection: card-style options with icon, label, capacity, price (e.g., Sedan LKR 15,000 / SUV LKR 18,000 / Van LKR 22,000) — loaded from `transport.option.vehicles[]`
- [ ] Special instructions text field (e.g., "We have 3 large suitcases")
- [ ] "Request Transfer" button creates request in `vb:requests[]` with `type: "airport_transfer"`, all flight and vehicle details included
- [ ] Success: confirmation with reference, driver will be arranged, "We will confirm your transfer by WhatsApp 24 hours before"

**Story Points:** 3

---

### US-10.3 — Hotel Shuttle
**As a** guest,
**I want** to know the hotel shuttle schedule and book a seat,
**so that** I can use the complimentary shuttle without guessing its timings.

**Acceptance Criteria:**
- [ ] Shuttle schedule shown as a timetable: departure time, destination, available seats
- [ ] Loaded from `property.json → transport.options[n]` where `type: "shuttle"`
- [ ] "Book Seat" button: opens form with: date, time slot selection, number of passengers
- [ ] On submit: request in `vb:requests[]` with `type: "shuttle_booking"`
- [ ] If shuttle is complimentary: shown with "Complimentary" badge
- [ ] If no shuttle configured: section hidden

**Story Points:** 2

---

### US-10.4 — Car Hire & Local Transport
**As a** guest who wants to explore independently,
**I want** to request a car or local tuk-tuk from the hotel,
**so that** I can travel at my own pace without arranging transport externally.

**Acceptance Criteria:**
- [ ] Car Hire form: date, duration (half day / full day / multi-day), driver preference (self-drive / chauffeur), vehicle preference (if multiple options), pickup time
- [ ] Local Transport form: destination (free text), date, time, number of passengers, vehicle type (tuk-tuk / taxi — from `transport.vehicles[]`)
- [ ] Price displayed before submission for local transport (fixed price per trip)
- [ ] On submit: request in `vb:requests[]` with `type: "car_hire"` or `"local_transport"`
- [ ] Success: confirmation note that concierge will confirm vehicle availability

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (dates, room number) | Blocker | EPIC-03 |
| EPIC-06 RequestService | Blocker | EPIC-06 |
| `data/properties/{id}.json → transport` | Data dependency | — |

---

## Technical Notes

- Transport options visibility is property-driven: if a property has no shuttle, shuttle section is hidden
- For airport transfers, stay date range used to constrain Flatpickr min/max (guest can book departure transfer for check-out day)
- Vehicle selection uses the same card-selection pattern as other booking flows (border highlight on selection, stores `vehicleType` in form state)

---

## Definition of Done

- [ ] Transport hub shows all configured transport types for the active property
- [ ] Airport transfer form captures all required fields for arrival and departure directions
- [ ] Vehicle selection cards render with prices from property JSON
- [ ] All 4 transport type requests submit and create entries in `vb:requests[]`
- [ ] My Upcoming Transfers section shows submitted transport requests
- [ ] Success screen shows reference and relevant confirmation message

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
