# EPIC-05 — Pre-Arrival & Digital Check-In

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-05 |
| **Epic Name** | Pre-Arrival & Digital Check-In |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.4 Pre-Arrival & Check-In |
| **Architecture Reference** | §5.3 localStorage (vb:preArrival:{resvId}), §6 Module Architecture |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

The guest journey doesn't start at check-in — it starts the moment a booking is confirmed. Guests who arrive unprepared cause bottlenecks at the front desk: missing ID documents, unpaid balances, unknown arrival times, uncommunicated special requests. A pre-arrival checklist that lets guests handle this digitally, days before they arrive, directly reduces check-in friction and allows hotel staff to prepare personalised experiences in advance.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Digital pre-arrival means fewer guests arriving with missing info or unpaid balances |
| G3 — Improve Guest Satisfaction | Faster, more personalised check-in; hotel staff know guest preferences before arrival |
| G2 — Increase Upsell Revenue | Advance payment opportunity surfaces during the pre-arrival flow |
| G5 — Enable Data-Driven Hospitality | Structured pre-arrival data (preferences, requests, arrival times) enriches guest profiles |

---

## Scope

### In Scope
- Pre-arrival checklist screen (available for Upcoming reservations only)
- 6 checklist items: Personal Details, ID/Passport Upload, Estimated Arrival Time, Special Requests, Advance Payment, Terms & Conditions
- Per-item completion tracking with visual progress indicator
- Save and resume (checklist progress persisted to `localStorage`)
- Checklist availability gating (only accessible for `status: "upcoming"` reservations)
- Configuration: each item can be marked mandatory/optional via `property.json`

### Out of Scope
- Real document scanning or OCR (Base64 file storage only in Phase 1)
- Real PMS sync (Phase 2 — Phase 1 saves to localStorage)
- Real payment processing for advance payment (links to EPIC-14 billing flow)
- Express check-in kiosk integration (future phase)

---

## User Stories

### US-05.1 — Pre-Arrival Checklist Screen
**As a** guest with an upcoming reservation,
**I want** a clear checklist of things to complete before I arrive,
**so that** I can prepare in advance and have a smooth, fast check-in experience.

**Acceptance Criteria:**
- [ ] Screen accessible from: Reservation Detail → "Pre-Arrival Checklist" quick link, and Dashboard for Upcoming reservations
- [ ] Screen only accessible for reservations with `status: "upcoming"`; attempting to access for other statuses shows an error state
- [ ] Reservation context strip at top showing property name and check-in date
- [ ] Overall progress bar: "X of 6 complete" with percentage fill
- [ ] Each checklist item shown as a collapsible card (Alpine.js accordion)
- [ ] Completed items: green checkmark, green border-left accent, item summary shown inline
- [ ] Incomplete items: empty circle icon, default border
- [ ] Mandatory items marked with a red asterisk in the label

**Story Points:** 2

---

### US-05.2 — Personal Details Confirmation
**As a** guest,
**I want** to confirm my profile details are correct before arriving,
**so that** the hotel has accurate information for my stay.

**Acceptance Criteria:**
- [ ] Pre-filled from `vb:profile` in localStorage: Full Name, Email, Phone, Nationality, Date of Birth
- [ ] Guest can edit any field inline
- [ ] On Save: updated values written back to `vb:profile`; item marked complete
- [ ] Item marked complete automatically if all required fields are already populated when checklist loads

**Story Points:** 1

---

### US-05.3 — ID / Passport Upload
**As a** guest,
**I want** to upload my ID or passport photo before arrival,
**so that** the hotel can process express check-in without delays at the front desk.

**Acceptance Criteria:**
- [ ] Upload zone with dashed border, upload icon, and label "Upload ID or Passport"
- [ ] Accepts: JPG, PNG, PDF
- [ ] File converted to Base64 and stored in `vb:preArrival:{resvId}.idDocument`
- [ ] Preview of uploaded document shown (image thumbnail or PDF icon)
- [ ] Remove/replace button available after upload
- [ ] File size limit: 5MB (show error if exceeded)
- [ ] Item marked complete once a file is uploaded

**Story Points:** 1

---

### US-05.4 — Estimated Arrival Time
**As a** guest,
**I want** to set my expected arrival time,
**so that** the hotel staff can have my room and welcome ready.

**Acceptance Criteria:**
- [ ] Time picker input (Flatpickr, time only, 30-minute increments)
- [ ] Default: 14:00 (standard check-in time)
- [ ] Optional note field: "Any notes for the team?" (e.g. "Arriving by train")
- [ ] On save: value stored in `vb:preArrival:{resvId}.arrivalTime`; item marked complete

**Story Points:** 1

---

### US-05.5 — Special Requests
**As a** guest,
**I want** to communicate my dietary needs, room preferences, and any special occasions before I arrive,
**so that** the hotel can personalise my stay without me having to ask again at check-in.

**Acceptance Criteria:**
- [ ] Multi-select chips for **Dietary Preferences**: Vegetarian, Vegan, Halal, Gluten-Free, Nut Allergy, Dairy-Free, Other
- [ ] Multi-select chips for **Room Preferences**: Ground Floor, High Floor, Away from Elevator, Quiet Room, Connecting Room
- [ ] Multi-select chips for **Bed Preferences**: King, Twin, Double
- [ ] Occasion field: Honeymoon / Anniversary / Birthday / None (radio selection)
- [ ] Free-text "Additional Requests" textarea (500 chars max)
- [ ] On save: stored in `vb:preArrival:{resvId}.specialRequests`; also synced to `vb:profile.dietaryPreferences`
- [ ] Item marked complete once saved (even if all optional fields left empty)

**Story Points:** 1

---

### US-05.6 — Terms & Conditions Acknowledgement
**As a** guest,
**I want** to review and accept the hotel's terms,
**so that** I understand the policies (cancellation, payment, check-in/out times) before I arrive.

**Acceptance Criteria:**
- [ ] T&C text loaded from `chain.json` (short summary) with "Read full Terms & Conditions" expanding link
- [ ] Checkbox: "I have read and accept the Hotel Terms & Conditions and Payment Policy"
- [ ] Checkbox must be ticked before item can be marked complete
- [ ] On accept: stored in `vb:preArrival:{resvId}.tcsAccepted = true` with timestamp

**Story Points:** 1

---

### US-05.7 — Progress Persistence & Save
**As a** guest,
**I want** my checklist progress saved automatically,
**so that** I can complete it across multiple sessions without losing my work.

**Acceptance Criteria:**
- [ ] Every item save/completion writes to `localStorage` immediately
- [ ] Returning to the checklist restores all previously saved values and completion states
- [ ] "Save Progress" button at bottom of page (explicitly saves all open/edited items)
- [ ] On complete (all mandatory items done): a "You're all set!" success state with summary and confetti animation (CSS keyframes)
- [ ] Notification sent to guest's notification history: "Pre-arrival checklist complete for [Property]"

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, FileUpload component, Modal | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Reservation (must have `upcoming` reservation) | Blocker | EPIC-03 |
| EPIC-14 Billing (Advance Payment item links to billing flow) | Soft link | EPIC-14 |
| `data/properties/{id}.json` — checklist mandatory/optional config | Data dependency | — |

---

## Technical Notes

- Checklist state stored under `vb:preArrival:{reservationId}` as a structured object: `{ personalDetails: {completed, data}, idUpload: {completed, base64}, arrivalTime: {completed, time, note}, specialRequests: {completed, data}, advancePayment: {completed}, tcs: {completed, acceptedAt} }`
- File upload uses the native `<input type="file">` element + `FileReader.readAsDataURL()` for Base64 conversion
- Base64 documents stored in localStorage — size can be an issue for large files; 5MB hard limit enforced client-side before storage
- Mandatory vs optional config read from `property.json → preArrivalConfig.mandatory[]`
- Advance Payment item: links to `#/billing/pay?resvId=X&context=preArrival` (EPIC-14)

---

## Definition of Done

- [ ] Pre-arrival checklist only accessible for `status: "upcoming"` reservations
- [ ] Progress bar accurately reflects completed items out of total
- [ ] All 6 checklist items open, save, and mark complete correctly
- [ ] ID upload accepts image/PDF, enforces 5MB limit, shows preview
- [ ] Progress persists correctly across page refresh and app restart
- [ ] "You're all set!" completion state shown when all mandatory items done
- [ ] Quick link from Reservation Detail navigates directly to the checklist
- [ ] Pre-arrival data visible from the dashboard for upcoming reservation context

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
