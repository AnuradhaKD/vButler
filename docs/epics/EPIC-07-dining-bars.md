# EPIC-07 — Dining & Bars

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-07 |
| **Epic Name** | Dining & Bars |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.6 Dining & Bars |
| **Architecture Reference** | §5.2 JSON Schema (property.dining), §6 Module Architecture (dining/) |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

Dining is one of the highest-revenue, highest-interaction touchpoints of any hotel stay. Guests currently call the restaurant to book tables, call the front desk for in-room dining, and often miss dining options they didn't know existed. A digital dining hub drives more covers, more in-room orders, and a measurably better guest experience — all without adding front-desk workload.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G2 — Increase Upsell Revenue | Table reservations and in-room dining orders captured digitally drive F&B revenue |
| G1 — Reduce Front Desk Load | Restaurant bookings and IRD orders handled through the app rather than by phone |
| G3 — Improve Guest Satisfaction | Guests discover restaurant options and menus before they're even hungry |

---

## Scope

### In Scope
- Dining hub screen (restaurant listing + in-room dining entry point)
- Restaurant detail screen (info + table reservation form + menu)
- In-room dining screen (menu browser + cart + order submission)
- Bar booking (treated as a table reservation variant)
- All dining content driven from `property.json → dining.restaurants[]`
- Dining reservations stored in `vb:requests[]` (category: dining)

### Out of Scope
- Live table availability from PMS (Phase 1: guest submits a preference; hotel confirms via WhatsApp)
- Real payment at cart checkout (charges recorded to folio via EPIC-14)
- Loyalty points/discounts
- Third-party review links

---

## User Stories

### US-07.1 — Dining Hub
**As a** guest,
**I want** to see all dining and bar options at my hotel in one place,
**so that** I can choose where to eat without asking staff.

**Acceptance Criteria:**
- [ ] Dining hub accessible from Quick Actions → Dining (`#/dining`)
- [ ] Small property dining intro banner (brand gradient) with headline in Playfair Display
- [ ] List of all restaurants/bars from `property.json → dining.restaurants[]`
- [ ] Each listing: property image/thumbnail, restaurant name, cuisine type pill, operating hours summary, "Reserve Table" and "View Menu" buttons
- [ ] In-Room Dining featured card: prominent banner card with icon, "Available until [time] tonight", "Order Now" button (links to IRD screen)
- [ ] If no restaurants configured for property: "No dining options available" empty state

**Story Points:** 2

---

### US-07.2 — Restaurant Detail & Menu
**As a** guest,
**I want** to read the menu and see all details for a restaurant,
**so that** I can decide what to eat before I sit down.

**Acceptance Criteria:**
- [ ] Hero image/banner for the restaurant (brand gradient fallback)
- [ ] Restaurant name in Playfair Display, cuisine type, full operating hours
- [ ] Menu displayed as accordion sections by category: Starters, Mains, Desserts, Beverages etc.
- [ ] Each menu item: name, description, price, dietary tags (V, VG, GF, Halal) as coloured pills
- [ ] Menu loaded from `property.json → dining.restaurants[n].menu`
- [ ] "Reserve a Table" section embedded on the detail page (not a separate screen)

**Story Points:** 2

---

### US-07.3 — Table Reservation
**As a** guest,
**I want** to book a table at a hotel restaurant from my phone,
**so that** I don't have to call and can choose my preferences in advance.

**Acceptance Criteria:**
- [ ] Date picker (Flatpickr, today and future dates, within check-in/check-out range)
- [ ] Time slots displayed as selectable pills (e.g., 18:30, 19:00, 19:30, 20:00) — generated from `restaurant.hours` config
- [ ] Party size: numeric stepper (1–12 guests)
- [ ] Seating preference: Indoor / Outdoor / No Preference (radio button pills)
- [ ] Dietary notes free text field
- [ ] "Confirm Reservation" button — creates a request entry in `vb:requests[]` with `category: "dining"`, `type: "table_reservation"`
- [ ] Success state: confirmation card with booking summary, reference number, "Your reservation is confirmed — we'll see you then!"
- [ ] Cancellation policy note displayed before confirm: "Cancel at least [N] hour(s) before booking" (configurable per restaurant from `restaurant.cancellationCutoffHours`)
- [ ] Modify or cancel existing reservation: available from My Requests feed up to the cancellation cutoff time

**Story Points:** 3

---

### US-07.4 — In-Room Dining (IRD)
**As a** guest who doesn't want to leave my room,
**I want** to order food to my room from the hotel menu,
**so that** I can eat comfortably without going downstairs.

**Acceptance Criteria:**
- [ ] IRD screen accessible from Dining hub → "Order Now" or directly from Services catalog
- [ ] Delivery info bar pinned at top: "Delivering to Room [N] · Estimated 30–45 min"
- [ ] IRD availability: if current time is outside IRD hours (`restaurant.hours`), show "In-Room Dining is closed until [time]" state
- [ ] Menu category tabs (horizontal): Breakfast | All Day | Mains | Desserts | Beverages — filter menu items
- [ ] Each menu item card: name, description, price, dietary tags, Add button (+/- quantity stepper)
- [ ] Cart managed in Alpine.js component state (`items[]`, computed `subtotal`)
- [ ] Sticky bottom order summary bar: "N items · LKR X,XXX · Place Order" (brand bg) — hidden if cart empty
- [ ] Tapping "Place Order" opens an order review drawer:
  - Itemised cart
  - Delivery time: ASAP (default) or Scheduled (time picker)
  - Special instructions (textarea)
  - "Confirm Order" button
- [ ] On confirm: order written to `vb:requests[]` with `category: "dining"`, `type: "inroom_order"`; charges added to active reservation folio in localStorage
- [ ] Success state: order reference, estimated delivery time
- [ ] In-app notification: "Your in-room dining order has been received — ETA 30-45 min"

**Story Points:** 4

---

### US-07.5 — Bar / Event Booking
**As a** guest,
**I want** to reserve seating at the hotel bar for sundowners or a private event,
**so that** I have a guaranteed spot for a special evening.

**Acceptance Criteria:**
- [ ] Bar listings appear in the dining hub alongside restaurants (distinguished by `type: "bar"` in JSON)
- [ ] Bar detail page uses same layout as restaurant detail (without full menu — only drinks/snacks if applicable)
- [ ] Booking form: date, time slot, party size, occasion note
- [ ] Booking creates a request in `vb:requests[]` with `type: "bar_booking"`
- [ ] Success confirmation with reference number

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Modal/Drawer, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (room number, property) | Blocker | EPIC-03 |
| EPIC-06 RequestService (dining requests stored in same vb:requests) | Blocker | EPIC-06 |
| EPIC-17 Notifications | Soft dependency | EPIC-17 |
| `data/properties/{id}.json → dining` | Data dependency | — |

---

## Technical Notes

- IRD cart state is local Alpine component state (not persisted to localStorage — cart is session-only)
- When an IRD order is confirmed, charges are appended to `vb:reservations[n].folio[]` in localStorage
- Time slot generation for table reservations: computed from `restaurant.hours.dinner` (e.g., "18:30–22:00") at 30-min intervals
- `type: "bar"` restaurants can have `showMenu: false` in JSON to suppress menu accordion

---

## Definition of Done

- [ ] Dining hub lists all restaurants and bars for the active property
- [ ] Restaurant detail shows full menu in categorised accordion
- [ ] Table reservation form submits and returns reference number
- [ ] Cancellation policy shown before confirm; cancellation works within cutoff
- [ ] IRD availability gated by operating hours
- [ ] IRD cart correctly tallies quantities and total
- [ ] IRD order adds charge to reservation folio
- [ ] Bar booking creates request correctly
- [ ] All dining requests visible in My Requests (EPIC-06 feed)

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
