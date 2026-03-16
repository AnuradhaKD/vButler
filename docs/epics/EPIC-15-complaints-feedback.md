# EPIC-15 — Complaints & Feedback

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-15 |
| **Epic Name** | Complaints & Feedback |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.14 Complaints & Feedback |
| **Architecture Reference** | §5.2 JSON Schema (property.complaintCategories), §5.3 localStorage (vb:complaints), §6 complaint.service.js |
| **Status** | Ready for Development |
| **Estimated Effort** | 10 Story Points |

---

## Problem Statement

An unhandled complaint is five times more expensive than a well-handled one. Guests who can't find an easy way to report an issue either suffer in silence (low NPS, bad review) or escalate to management (high staff cost). A transparent, trackable complaint system with a full status lifecycle — visible to the guest in real-time — converts problems into recovery opportunities. Post-stay feedback captures the voice of every guest, not just the loudest ones.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G3 — Improve Guest Satisfaction | Recovery from complaints handled fast and transparently increases NPS disproportionately |
| G5 — Enable Data-Driven Hospitality | Structured complaint data by category reveals systemic operational issues |
| G1 — Reduce Front Desk Load | Guests report issues through the app rather than confronting staff; staff triages digitally |

---

## Scope

### In Scope
- Complaints list screen (my complaints for the active reservation)
- Complaint submission form (category, subcategory, description, attachments, priority)
- Complaint detail screen (status timeline + staff resolution notes)
- Post-stay feedback form (star ratings + comments, triggered after check-out)
- Complaint categories driven from `property.json → complaintCategories[]`
- `ComplaintService` module
- All complaints stored in `vb:complaints[]` in localStorage

### Out of Scope
- Hotel staff response interface (staff-side tool — out of scope per PRD §12)
- Real-time PMS/WhatsApp dispatch (Phase 1: simulated; Phase 2: real API)
- Automated escalation rules (Phase 2)
- Anonymous complaints

---

## User Stories

### US-15.1 — Complaints List
**As a** guest,
**I want** to see all my submitted complaints and their current status,
**so that** I know my issues are being tracked and acted on.

**Acceptance Criteria:**
- [ ] Accessible from Quick Actions → Complaints or Reservation Detail quick link
- [ ] Lists all complaints for the active reservation, sorted by `submittedAt` descending
- [ ] Each complaint card: category icon, brief description (truncated), priority badge (Normal/Urgent), status badge, submitted time (Day.js `fromNow()`)
- [ ] Status badge colours: Submitted (yellow), Acknowledged (blue), In Progress (orange), Resolved (green), Closed (grey)
- [ ] Tapping a card navigates to Complaint Detail
- [ ] "Report an Issue" FAB button (floating action button, brand colour)
- [ ] Empty state: "No complaints — we hope your stay is perfect!" with a smiley illustration

**Story Points:** 2

---

### US-15.2 — Complaint Submission Form
**As a** guest experiencing a problem,
**I want** to report it quickly and clearly,
**so that** the hotel knows exactly what happened and can fix it fast.

**Acceptance Criteria:**
- [ ] Form accessible from: Complaints list → "Report an Issue" FAB, Quick Actions → Complaints
- [ ] **Category** selector: rendered as icon-and-label cards from `property.json → complaintCategories[]`
  - Room | Dining | Service | Facilities | Staff | Other
- [ ] **Subcategory** dropdown: dynamically populated based on selected category (from `category.subcategories[]`)
- [ ] **Description**: textarea, max 500 characters, character counter below
- [ ] **Attachments** (optional): file upload — accept images/video, up to 3 files, max 10MB each, Base64 stored in localStorage
- [ ] **Priority**: segmented control — **Normal** / **Urgent** (Urgent shows a note: "For immediate safety concerns or urgent issues only")
- [ ] Reservation context bar: "Reporting for: Room [N], [Property]"
- [ ] "Submit Complaint" button — validates all required fields
- [ ] On submit: complaint entry written to `vb:complaints[]`; in-app notification created; status simulation starts
- [ ] Success state (replace form): reference number (format: `CMP-YYYYMMDD-XXXX`), "We're on it", acknowledgement timeline message "Our team will acknowledge this within 15 minutes"

**Story Points:** 3

---

### US-15.3 — Complaint Detail & Status Tracking
**As a** guest who has submitted a complaint,
**I want** to see its full status history and any staff notes,
**so that** I'm kept informed without having to follow up.

**Acceptance Criteria:**
- [ ] Header: complaint reference number, category icon, priority badge
- [ ] **Complaint Summary**: category, subcategory, description, submitted date/time
- [ ] **Attachments**: thumbnail previews of uploaded photos (tappable to full-screen)
- [ ] **Status Timeline** (vertical stepper): Submitted → Acknowledged → In Progress → Resolved → Closed
  - Each reached status: filled icon, timestamp
  - Current status: pulsing indicator
  - Future status: grey, empty
- [ ] **Staff Resolution Notes**: shown when status is Resolved or Closed — staff note text in a highlighted card (in Phase 1: simulated auto-generated note e.g., "Our housekeeping team has addressed the issue. Please let us know if anything else is needed.")
- [ ] "Mark as Closed" button: available when status is Resolved — allows guest to confirm resolution (sets status to Closed)
- [ ] Status simulation in Phase 1: `submitted` → `acknowledged` (3 min) → `in_progress` (7 min) → `resolved` (15 min via setTimeout)

**Story Points:** 3

---

### US-15.4 — Post-Stay Feedback
**As a** guest who has checked out,
**I want** a quick and easy way to share my overall experience,
**so that** Browns can learn what they did well and what to improve.

**Acceptance Criteria:**
- [ ] Post-stay feedback prompt triggered when reservation status changes to `"checked-out"` — shows as a notification and as a dashboard prompt
- [ ] Feedback form accessible from: notification, dashboard CTA, or Complaints section tab "Leave Feedback"
- [ ] **Star ratings** (5-star, tap to rate) for each category:
  - Overall Stay ⭐
  - Room & Cleanliness ⭐
  - Service ⭐
  - Dining ⭐
  - Facilities ⭐
- [ ] **Highlights**: multi-select chips of positive aspects (Great View, Friendly Staff, Delicious Food, Clean Room, Good Location, etc.)
- [ ] **Open Comments**: textarea "What could we improve or what did you love?"
- [ ] "Submit Feedback" button
- [ ] On submit: feedback written to `vb:complaints[]` with `type: "post_stay_feedback"`; thank-you state shown
- [ ] Feedback can only be submitted once per reservation (submit button hidden after submission, replaced with "Feedback Submitted ✓")
- [ ] Feedback form available for 30 days post-checkout

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, FileUpload component, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation | Blocker | EPIC-03 |
| EPIC-17 Notifications (complaint creates notification; post-stay feedback prompt) | Soft dependency | EPIC-17 |
| `data/properties/{id}.json → complaintCategories[]` | Data dependency | — |

---

## Technical Notes

- `ComplaintService` (`js/core/complaint.service.js`) methods: `create(data, resvId)`, `getAll(resvId)`, `getById(id)`, `updateStatus(id, status, note)`, `submitFeedback(resvId, ratings, comments)`
- Complaint reference format: `CMP-YYYYMMDD-XXXX` (same pattern as RequestService references)
- Status simulation: setTimeout chain — more aggressive than service requests to show value quickly
- Attachment storage: Base64 strings in `complaint.attachments[]` array in localStorage; 3-file limit + 10MB check enforced before FileReader conversion
- Post-stay feedback stored as a special entry: `type: "post_stay_feedback"`, `resvId`, `ratings: { overall, room, service, dining, facilities }`, `highlights: []`, `comments`, `submittedAt`

---

## Definition of Done

- [ ] Complaints list shows all complaints for active reservation with correct status badges
- [ ] Submission form renders categories and subcategories from property JSON
- [ ] File attachment upload works with size and count limits enforced
- [ ] Priority selection (Normal/Urgent) persists correctly
- [ ] Submission creates complaint in localStorage with reference number
- [ ] Status timeline in detail view shows correct progress with timestamps
- [ ] Staff resolution note shown when status is Resolved
- [ ] "Mark as Closed" works correctly
- [ ] Status simulation progresses: submitted → acknowledged → in progress → resolved
- [ ] Post-stay feedback form shows after check-out status change
- [ ] Star ratings and highlights submit correctly
- [ ] Feedback can only be submitted once per reservation

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
