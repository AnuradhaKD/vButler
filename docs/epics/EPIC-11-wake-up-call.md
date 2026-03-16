# EPIC-11 — Wake-Up Call

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-11 |
| **Epic Name** | Wake-Up Call |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.10 Wake-Up Call |
| **Architecture Reference** | §5.3 localStorage (vb:wakeupCalls:{resvId}), §6 Module Architecture (wake-up.js) |
| **Status** | Ready for Development |
| **Estimated Effort** | 5 Story Points |

---

## Problem Statement

The wake-up call is a small but telling feature. A hotel that forces guests to call the front desk in 2026 to set a wake-up call has communicated that the digital experience is incomplete. It's also a disproportionate front-desk burden — especially at properties near nature destinations where guests regularly need early wake-ups for hikes or safaris. This is a high-visibility, quick-to-build feature that delivers immediate satisfaction.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Eliminates one of the highest-frequency, lowest-complexity phone call types |
| G3 — Improve Guest Satisfaction | Guests feel respected when a classic hotel service is modernised seamlessly |

---

## Scope

### In Scope
- Wake-up call scheduling screen
- Date selection: Today / Tomorrow / Specific Date
- Time selection (Flatpickr, time only)
- Recurring option (repeat for all remaining nights of stay)
- Multiple wake-up calls (different days/times)
- View, edit, and cancel existing wake-up calls
- Wake-up calls stored in `vb:wakeupCalls:{resvId}` in localStorage
- Available for Active (in-stay) reservations only

### Out of Scope
- Automated phone call triggering (Phase 1: request sent to front desk via request system; they make the call)
- App-based alarm notifications (this is a hotel phone call service, not a phone alarm)

---

## User Stories

### US-11.1 — Schedule a Wake-Up Call
**As a** guest on an active stay,
**I want** to schedule a wake-up call from the app,
**so that** I don't have to call the front desk before bed.

**Acceptance Criteria:**
- [ ] Screen accessible from Services catalog or Quick Actions
- [ ] Available only for `status: "active"` reservations
- [ ] Time input: large, centred Flatpickr time picker (HH:MM, 15-minute increments)
- [ ] Date selection: radio pill buttons — **Today**, **Tomorrow**, **Specific Date** (Flatpickr date picker appears only if Specific Date selected)
- [ ] Recurring toggle: "Repeat for all remaining nights of my stay" — when enabled, creates one wake-up call entry per remaining night
- [ ] Visual preview updates live: "Your wake-up call is set for **06:30 AM** on **Wednesday, 6 Apr**"
- [ ] "Schedule Wake-Up Call" primary button (brand bg, full width)
- [ ] On submit: entry written to `vb:wakeupCalls:{resvId}[]`; request also added to `vb:requests[]` with `type: "wakeup_call"` for dispatch to front desk
- [ ] Success state (same page, replace form): green checkmark, "Wake-Up Call Scheduled", summary of time/date, reference number
- [ ] Constraint: cannot schedule a wake-up call for a time that is less than 30 minutes from now (PRD §WUC-04)

**Story Points:** 3

---

### US-11.2 — Manage Existing Wake-Up Calls
**As a** guest,
**I want** to see, edit, and cancel my scheduled wake-up calls,
**so that** I'm in control if my plans change.

**Acceptance Criteria:**
- [ ] Active wake-up calls listed at the top of the screen (before the "Schedule New" section)
- [ ] Each call card: alarm icon, date, time, "Recurring" badge if applicable, Edit + Cancel buttons
- [ ] **Cancel**: confirmation prompt ("Cancel your 06:30 AM wake-up call?"), then removes entry from localStorage; sends a cancellation request to `vb:requests[]`
- [ ] Cancellation constraint: cannot cancel a wake-up call within 30 minutes of the scheduled time (button disabled with tooltip "Too close to scheduled time to cancel")
- [ ] **Edit**: re-opens scheduling form pre-filled with existing call's time/date; on save, replaces the existing entry
- [ ] Guest can have multiple wake-up calls for different days/times (PRD §WUC-02)
- [ ] Past wake-up calls (time already passed) auto-archived — not shown in active list

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Toast, Modal | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (stay dates, in-stay status required) | Blocker | EPIC-03 |
| EPIC-06 RequestService (wake-up call request dispatched via same system) | Blocker | EPIC-06 |

---

## Technical Notes

- Wake-up calls stored separately in `vb:wakeupCalls:{resvId}` (array of call objects) in addition to the standard request entry in `vb:requests[]`
- Recurring calls: generate one entry per remaining stay night (computed from `reservation.checkIn` to `reservation.checkOut`)
- "30 minutes from now" constraint checked client-side: `scheduledDateTime.diff(now, 'minute') < 30`
- Past call archiving: filter applied on load using `dayjs(call.datetime).isBefore(dayjs())`

---

## Definition of Done

- [ ] Wake-up call screen only accessible for active reservations
- [ ] Time picker and date selection work correctly
- [ ] Recurring toggle creates one entry per remaining night
- [ ] Visual preview updates live as time/date changes
- [ ] Submission creates entry in both `vb:wakeupCalls` and `vb:requests`
- [ ] Existing wake-up calls listed with edit and cancel actions
- [ ] 30-minute cancellation constraint enforced
- [ ] Past calls not shown in active list

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
