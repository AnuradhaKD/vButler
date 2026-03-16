# EPIC-09 — Housekeeping Services

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-09 |
| **Epic Name** | Housekeeping Services |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.8 Housekeeping Services |
| **Architecture Reference** | §5.2 JSON Schema (property.laundryPriceList), §5.3 localStorage (vb:requests), §6 Module Architecture (housekeeping/) |
| **Status** | Ready for Development |
| **Estimated Effort** | 10 Story Points |

---

## Problem Statement

Housekeeping is the single most-called service category in any hotel. Guests call reception for towels, to request room cleaning, to ask about laundry pricing — all easily handled digitally. The Do Not Disturb toggle is an especially high-value feature: a single tap replacing the physical door sign, and a real-time signal to housekeeping to skip the room. This epic transforms the most phone-heavy service category into the most self-serve one.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Room makeup, towel requests, DND management — all without calling the desk |
| G3 — Improve Guest Satisfaction | Guests control their room environment on their own terms, on their own schedule |
| G5 — Enable Data-Driven Hospitality | Laundry volumes, DND patterns, and housekeeping preferences become operational data |

---

## Scope

### In Scope
- Housekeeping hub screen with all housekeeping service types
- Do Not Disturb toggle (persisted to localStorage, simulates real-time PMS sync)
- Room Makeup / Turndown scheduling
- Extra Amenities request
- Ironing service request
- Laundry service (full sub-feature with itemised price list and order)
- All housekeeping services fed through the same `RequestService` as EPIC-06
- Laundry price list driven from `property.json → laundryPriceList[]`

### Out of Scope
- Real DND sync to room management system (Phase 1: localStorage state + simulated; Phase 2: real API)
- Laundry tracking via RFID or external system (Phase 1: manual status simulation)

---

## User Stories

### US-09.1 — Housekeeping Hub
**As a** guest,
**I want** a single screen for all housekeeping needs,
**so that** I can manage my room environment without calling the front desk.

**Acceptance Criteria:**
- [ ] Accessible from Quick Actions → Room Requests or Services catalog → Housekeeping
- [ ] Do Not Disturb toggle at the top of the page (most important, most prominent)
- [ ] Service grid (2 columns): Room Makeup, Turndown Service, Extra Amenities, Ironing Service, Laundry Service (links to laundry sub-screen), Extra Towels
- [ ] Active Requests section at bottom (shows in-progress housekeeping requests)

**Story Points:** 1

---

### US-09.2 — Do Not Disturb Toggle
**As a** guest who doesn't want to be disturbed,
**I want** to toggle Do Not Disturb from my phone,
**so that** I don't need to hang a physical sign or call anyone.

**Acceptance Criteria:**
- [ ] Large, prominent toggle switch at the top of the Housekeeping screen
- [ ] When **ON**: card background turns red/amber, "DND Active" badge shown, message: "Your room will not be serviced or disturbed while DND is on"
- [ ] When **OFF**: card returns to normal state, "Your room is available for servicing"
- [ ] DND state persisted to `localStorage` (`vb:requests` entry with `type: "dnd"`, `status: "active"/"inactive"`)
- [ ] DND state also shown in the Reservation Context Header as a small indicator
- [ ] Warning when turning DND ON during housekeeping hours: "Turning on DND means your room won't be serviced today. Are you sure?"

**Story Points:** 2

---

### US-09.3 — Room Makeup & Turndown Scheduling
**As a** guest,
**I want** to schedule room cleaning at a time that works for me,
**so that** my room is serviced without interrupting my plans.

**Acceptance Criteria:**
- [ ] Room Makeup and Turndown each open a request modal with:
  - Preferred time: Flatpickr time picker (within available hours from property JSON)
  - Special instructions: text field
  - "Submit Request" button
- [ ] On submit: request created in `vb:requests[]` with `type: "room_makeup"` or `"turndown"`
- [ ] Success: reference number, estimated service time
- [ ] Cannot schedule Room Makeup when DND is active: show warning "Turn off Do Not Disturb first"
- [ ] Available hours enforced: cannot schedule outside `service.availableHours`

**Story Points:** 2

---

### US-09.4 — Extra Amenities Request
**As a** guest who needs additional items in my room,
**I want** to request them from my phone,
**so that** I get what I need quickly without calling the front desk.

**Acceptance Criteria:**
- [ ] Amenity selection: chip multi-select with predefined items:
  - Towels: Bath Towel, Pool Towel, Face Towel (with quantity stepper per item)
  - Toiletries: Shampoo, Conditioner, Body Wash, Toothbrush Kit, Razor Kit, Shower Cap
  - Bedding: Extra Pillow, Extra Blanket, Baby Cot
  - Other: Hangers, Iron & Board, Voltage Adapter
- [ ] Quantity stepper for each selected item (default 1)
- [ ] Special instructions text field
- [ ] "Submit Request" creates request in `vb:requests[]` with `type: "extra_amenities"`, includes itemised list

**Story Points:** 2

---

### US-09.5 — Laundry Service
**As a** guest,
**I want** to submit a laundry order with the exact items and quantities I need cleaned,
**so that** I can get my clothes laundered without manually filling out a paper form.

**Acceptance Criteria:**
- [ ] Dedicated laundry screen (`#/housekeeping/laundry`) accessible from the Housekeeping hub
- [ ] Service type toggle at top: **Standard** (3–4 hours, base price) / **Express** (1–2 hours, +50% surcharge)
- [ ] Preferred pickup time: Flatpickr time picker
- [ ] Price list loaded from `property.json → laundryPriceList[]`
- [ ] Items grouped by category: Tops, Bottoms, Dresses & Suits, Underwear & Socks, Bedding
- [ ] Each item row: item name, wash price, iron-only price (if applicable), quantity stepper (+/-)
- [ ] Guests can select: wash only, iron only, or wash + iron (per item where applicable)
- [ ] Order summary section: item count, subtotal, express surcharge (if selected), **total in LKR**
- [ ] "Submit Laundry Request" button (disabled if no items selected)
- [ ] Success: reference number, estimated return time based on Standard/Express selection
- [ ] Laundry status tracking: Picked Up → In Laundry → Ready → Delivered (same status system as EPIC-06)

**Story Points:** 3

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Modal, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (room number) | Blocker | EPIC-03 |
| EPIC-06 RequestService (all housekeeping uses same request system) | Blocker | EPIC-06 |
| `data/properties/{id}.json → laundryPriceList` | Data dependency | — |

---

## Technical Notes

- Laundry order Alpine state: `items: {}` keyed by `item.id` with `{ quantity, serviceType }` — computed `total` derived from prices × quantities × express multiplier
- Express surcharge: `total × (expressMultiplier - 1)` e.g. `×0.5` for +50%
- Status lifecycle for laundry: `submitted` → `picked_up` → `in_laundry` → `ready` → `delivered` (simulated via setTimeout, custom to laundry type)
- DND state is a special type within `vb:requests` — not a standard request lifecycle

---

## Definition of Done

- [ ] Housekeeping hub shows all 6 service tiles
- [ ] DND toggle persists state correctly across page refresh
- [ ] DND warning shown when scheduling Room Makeup with DND active
- [ ] Laundry screen loads price list from property JSON
- [ ] Laundry order correctly calculates express surcharge
- [ ] Laundry submission creates request with itemised order
- [ ] Laundry status progression: Picked Up → In Laundry → Ready → Delivered simulated correctly
- [ ] Extra Amenities: multi-select with quantities works and submits correctly
- [ ] All housekeeping requests visible in My Requests (EPIC-06 feed)

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
