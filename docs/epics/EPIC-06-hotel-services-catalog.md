# EPIC-06 — Hotel Services Catalog & Request Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-06 |
| **Epic Name** | Hotel Services Catalog & Request Management |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.5 Hotel Services Catalog |
| **Architecture Reference** | §5.2 JSON Schema (property.services), §5.3 localStorage (vb:requests), §6 request.service.js, §10.1 Service Request Flow |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

The services catalog is the engine room of Destinity vButler. It's the primary channel through which guests replace phone calls and front-desk visits with digital self-service. A guest who can't quickly find and request what they need will pick up the phone instead — directly undermining the core business goal of reducing front-desk load.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | All common service requests fulfilled through the app rather than by phone |
| G3 — Improve Guest Satisfaction | Guests know their request status without having to call to follow up |
| G5 — Enable Data-Driven Hospitality | Every service request is a structured data point — categories, volumes, response times |

---

## Scope

### In Scope
- Services catalog screen with category filtering
- Service detail / request form (dynamic fields per service type)
- Request submission flow with confirmation and reference number
- "My Requests" feed with live status tracking
- Request status lifecycle: Submitted → Acknowledged → In Progress → Completed → Cancelled
- Status simulation (automated progression via `setTimeout` in Phase 1)
- All catalog content driven from `property.json → services`
- `RequestService` module

### Out of Scope
- Real PMS/WhatsApp dispatch (Phase 1: simulated; Phase 2: real API calls)
- Dining-specific booking (EPIC-07), Wellness bookings (EPIC-08), Housekeeping (EPIC-09), Transport (EPIC-10), Wake-Up Call (EPIC-11) — these are separate epics with specialised flows
- Paid services payment collection (references EPIC-14)

---

## User Stories

### US-06.1 — Services Catalog Browse
**As a** guest,
**I want** to browse all available hotel services in one place,
**so that** I can discover and request anything I need during my stay.

**Acceptance Criteria:**
- [ ] Catalog only accessible for reservations in `status: "active"` (In-Stay); attempting to access for other statuses shows a "Available during your stay" empty state
- [ ] Services loaded from `property.json → services.categories[]` for the active reservation's property
- [ ] Category filter chips (horizontal scroll at top): All + one chip per category
- [ ] Selecting a category filters the list to show only that category's services
- [ ] "All" chip selected by default
- [ ] Each category rendered with a section header (icon + label) and its service cards below

**Story Points:** 2

---

### US-06.2 — Service Card
**As a** guest browsing the catalog,
**I want** each service displayed with enough information to understand what I'm requesting,
**so that** I can make an informed decision without asking a staff member.

**Acceptance Criteria:**
- [ ] Card displays: service name, description (truncated to 2 lines with expand), price or "Complimentary", estimated delivery time, available hours (if applicable)
- [ ] Price shown as: amount + currency (e.g., "LKR 500") or "Complimentary" or "Charges apply to folio"
- [ ] Available hours shown as a pill: e.g., "Available 7:00 AM – 10:00 PM"
- [ ] If current time is outside available hours: card shows "Currently Unavailable" overlay and "Request" button is disabled
- [ ] "Request" button navigates to the service request form for that service
- [ ] Services not available for the current property are not shown (data-driven)

**Story Points:** 2

---

### US-06.3 — Service Request Form
**As a** guest who wants a service,
**I want** a simple form to provide the necessary details,
**so that** the hotel knows exactly what I need and when.

**Acceptance Criteria:**
- [ ] Form header: service name + service category icon
- [ ] Service summary card at top: description, estimated time, price
- [ ] Dynamic form fields rendered based on `service.fields[]` array in JSON:
  - `preferredTime`: Flatpickr time picker
  - `quantity`: numeric stepper (+/- buttons, min 1)
  - `deliveryTime`: time picker
  - `specialInstructions`: textarea (250 chars max, character counter)
  - `towelType`: chip selection (Bath / Pool / Face)
  - `date`: Flatpickr date picker (today + future only)
- [ ] Reservation context bar: "Requesting for: Room [N], [Property]"
- [ ] "Submit Request" primary button (brand bg, full width)
- [ ] Form submitting state: button disabled + spinner
- [ ] Validation: all required fields must be filled before submit enabled

**Story Points:** 3

---

### US-06.4 — Request Submission & Confirmation
**As a** guest who has submitted a service request,
**I want** immediate confirmation with a reference number,
**so that** I know my request was received and can track it.

**Acceptance Criteria:**
- [ ] On submit: `RequestService.create()` called; returns a reference number in format `REF-YYYYMMDD-XXXX`
- [ ] Request written to `vb:requests[]` in localStorage with: `id`, `referenceNumber`, `serviceId`, `serviceName`, `propertyId`, `resvId`, `status: "submitted"`, `details`, `submittedAt`, `updatedAt`
- [ ] Success screen shown (not a new page — replace form content): checkmark icon (green), "Request Submitted", reference number displayed prominently, estimated time, "Track Request" + "Back to Services" buttons
- [ ] In-app notification created: "[Service Name] request received — REF-XXXXXX"
- [ ] Status simulation: after 90 seconds → status changes to `"acknowledged"`; after 3 minutes → `"in_progress"` (setTimeout in Phase 1)

**Story Points:** 2

---

### US-06.5 — My Requests Feed
**As a** guest,
**I want** to see all my service requests and their current status,
**so that** I don't have to call the front desk to know if my request was handled.

**Acceptance Criteria:**
- [ ] Accessible from: Services catalog "My Requests" tab, Dashboard activity feed "View All"
- [ ] Lists all requests for the active reservation, sorted by `submittedAt` descending
- [ ] Each request card: service name, reference number, submitted time (Day.js `fromNow()`), status badge, status timeline indicator
- [ ] Status timeline (horizontal dots): Submitted → Acknowledged → In Progress → Completed — filled/unfilled dots indicating progress
- [ ] Tap on a request card: expands to show full details (Alpine.js accordion) including: submitted details, current status note, timestamps per status change
- [ ] "Cancel Request" option for requests still in `submitted` or `acknowledged` status
- [ ] Empty state: "No requests yet — browse our services"
- [ ] Tabs: Active Requests | Completed

**Story Points:** 4

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Toast, Modal | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (property context) | Blocker | EPIC-03 |
| EPIC-17 Notifications (request creates notification) | Soft dependency | EPIC-17 |
| `data/properties/{id}.json → services` | Data dependency | — |

---

## Technical Notes

- `RequestService` (`js/core/request.service.js`) methods: `create(serviceId, details, resvId)`, `getAll(resvId)`, `getById(id)`, `updateStatus(id, status)`, `cancel(id)`
- Reference number format: `REF-` + `YYYYMMDD` + `-` + 4-digit random (e.g., `REF-20260405-0034`)
- Status simulation in Phase 1 uses `window.setTimeout` chained: submitted → acknowledged (90s) → in_progress (3m) → completed (10m)
- Form fields are fully data-driven from `service.fields[]`; no hardcoded form per service
- `RequestService.create()` also calls `NotificationService.create()` to add an in-app notification

---

## Definition of Done

- [ ] Catalog loads services for the active reservation's property only
- [ ] Category filter chips work correctly
- [ ] Service cards show all required fields; unavailable services grayed out
- [ ] Request form dynamically renders correct fields per service
- [ ] Submission creates a request in localStorage with correct structure
- [ ] Reference number displayed on success screen
- [ ] My Requests feed shows all requests with status timeline
- [ ] Status simulation progresses correctly (submitted → acknowledged → in progress → completed)
- [ ] Cancel request works for eligible statuses
- [ ] In-app notification created on request submission

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
