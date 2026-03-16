# EPIC-17 — Notifications

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-17 |
| **Epic Name** | Notifications |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.16 Notifications |
| **Architecture Reference** | §5.3 localStorage (vb:notifications), §6 notification.service.js |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

Notifications are the connective tissue between the guest and their stay. Without them, a guest who submits a service request has no way to know it was received or completed — they must actively check. A notification system that is timely, relevant, and not spammy turns passive guests into engaged ones: they know their request is being handled, their bill has a new charge, and their pre-arrival checklist is incomplete. Done badly, notifications become noise that gets turned off immediately.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G3 — Improve Guest Satisfaction | Proactive status updates mean guests never feel ignored |
| G1 — Reduce Front Desk Load | Automatic status updates eliminate "just calling to check on my request" calls |
| G5 — Enable Data-Driven Hospitality | Notification engagement data reveals which touchpoints matter most to guests |

---

## Scope

### In Scope
- In-app notification system (`vb:notifications[]` in localStorage)
- Notification bell in header with unread count badge
- Notification history screen (full list, read/unread states)
- `NotificationService` module (used by all other epics to create notifications)
- Browser Push Notification API integration (opt-in prompt)
- Notification types: service request updates, complaint updates, billing alerts, check-in reminders, pre-arrival nudges, post-stay feedback prompt
- Per-category opt-out (managed in Settings, EPIC-16)
- Notification triggers for all key guest journey events

### Out of Scope
- Email notifications (Phase 2 — requires backend)
- WhatsApp notifications to guests (WhatsApp is the staff-notification channel per PRD)
- Promotional push notifications (can be enabled by hotel staff — Phase 2)
- Real-time server-sent push to inactive devices (Phase 1: Web Push API for in-browser; full device push requires backend)

---

## User Stories

### US-17.1 — Notification Bell & Badge
**As a** guest,
**I want** to see at a glance when I have new notifications,
**so that** I don't miss important updates about my stay.

**Acceptance Criteria:**
- [ ] Notification bell icon in the app header on all authenticated pages
- [ ] Red badge with count shows the number of unread notifications (hidden if 0)
- [ ] Badge count updates reactively via Alpine.js store whenever `vb:notifications[]` changes
- [ ] Tapping the bell navigates to the Notification History screen
- [ ] Badge disappears once all notifications are marked as read

**Story Points:** 1

---

### US-17.2 — Notification History Screen
**As a** guest,
**I want** to review all my notifications in one place,
**so that** I don't miss anything important that came in while I wasn't looking.

**Acceptance Criteria:**
- [ ] Screen at `#/notifications` lists all notifications for the logged-in guest, sorted by `createdAt` descending
- [ ] Unread notifications: white background with a brand-coloured left border accent
- [ ] Read notifications: grey/muted background
- [ ] Each notification: icon (based on type), title, body text, relative timestamp (Day.js `fromNow()`)
- [ ] Tapping a notification: marks it as read (`isRead: true` in localStorage), navigates to the relevant screen (e.g., tapping a request update goes to `#/services/request/{id}`)
- [ ] "Mark All as Read" button at top
- [ ] Swipe-to-dismiss (or long-press → delete) removes a notification
- [ ] Empty state: bell illustration + "You're all caught up!"
- [ ] Notifications grouped by day: "Today", "Yesterday", "Earlier"

**Story Points:** 3

---

### US-17.3 — NotificationService (Internal)
**As a** developer/system,
**I want** a centralised service to create and manage notifications,
**so that** any feature can trigger a notification without duplicating logic.

**Acceptance Criteria:**
- [ ] `NotificationService.create({ type, title, body, resvId, linkTo })` method
- [ ] Creates a notification object: `{ id, type, title, body, isRead: false, resvId, linkTo, createdAt }`
- [ ] Appends to `vb:notifications[]` in localStorage
- [ ] Updates Alpine `notifications.unreadCount` store reactively
- [ ] `NotificationService.markRead(id)` sets `isRead: true`
- [ ] `NotificationService.markAllRead()` sets all `isRead: true`
- [ ] `NotificationService.delete(id)` removes entry
- [ ] `NotificationService.getUnreadCount()` returns count of `isRead: false` entries for the current guest

**Story Points:** 1

---

### US-17.4 — Notification Triggers (All Epics)
**As a** guest,
**I want** to receive relevant notifications at the right moments in my stay journey,
**so that** I'm always informed without having to actively check every section.

**Notification events and requirements:**

| Event | Title | Body | Link To | Can Opt Out? |
|-------|-------|------|---------|-------------|
| Service request submitted | "Request Received" | "[Service Name] — REF-XXXXXX" | Request detail | No |
| Service request status change | "Request Update" | "[Service Name] is now [Status]" | Request detail | No |
| Complaint submitted | "Complaint Received" | "CMP-XXXXXX — Our team is on it" | Complaint detail | No |
| Complaint status change | "Complaint Update" | "Your [Category] complaint is now [Status]" | Complaint detail | No |
| Billing charge added | "New Charge" | "[Description] — LKR [Amount] added to your bill" | Billing hub | Yes |
| Payment confirmed | "Payment Confirmed" | "LKR [Amount] received. Thank you!" | Billing hub | No |
| Pre-arrival checklist incomplete (48h before check-in) | "Pre-Arrival Reminder" | "Complete your checklist for [Property]" | Pre-arrival | Yes |
| Check-in reminder (24h before) | "Check-In Tomorrow" | "Your stay at [Property] begins tomorrow" | Reservation detail | Yes |
| Post-stay feedback prompt (on check-out) | "How Was Your Stay?" | "Share your experience at [Property]" | Feedback form | Yes |
| Wake-up call confirmed | "Wake-Up Call Set" | "Scheduled for [Time] on [Date]" | Wake-up screen | No |

**Acceptance Criteria:**
- [ ] Each event above creates a notification via `NotificationService.create()` at the correct moment
- [ ] Notification not created if guest has opted out of that category (check `vb:profile.notificationPrefs`)
- [ ] Critical notifications (payment confirmed, complaint/request status) cannot be opted out
- [ ] Pre-arrival and check-in reminders simulated on app open if conditions are met (no cron in Phase 1)

**Story Points:** 2

---

### US-17.5 — Browser Push Notifications (Optional)
**As a** guest,
**I want** to receive notifications on my phone even when the app isn't open,
**so that** I don't miss time-sensitive updates.

**Acceptance Criteria:**
- [ ] On first login, prompt for notification permission using the Web Push API (`Notification.requestPermission()`)
- [ ] Prompt timing: shown after dashboard loads, not immediately on login (less intrusive)
- [ ] If permission granted: service worker handles push events and shows browser notifications
- [ ] If permission denied: in-app notifications still work as normal; do not re-prompt
- [ ] Browser push notification content mirrors the in-app notification (same title + body)
- [ ] Phase 1 limitation: push notifications only work while the browser is open (no real VAPID/service push); service worker `showNotification()` fires for in-tab simulated events

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Service Worker | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Reservation context | Blocker | EPIC-03 |
| EPIC-06 RequestService (triggers notifications on status change) | Soft dependency | EPIC-06 |
| EPIC-15 ComplaintService (triggers notifications on status change) | Soft dependency | EPIC-15 |
| EPIC-16 Settings (notification opt-out preferences managed in profile) | Soft dependency | EPIC-16 |

---

## Technical Notes

- `NotificationService` must be imported and used by `RequestService`, `ComplaintService`, `billing.js` — it's a shared utility
- `vb:notifications[]` capped at 100 entries; oldest entries pruned when limit exceeded
- Pre-arrival and check-in reminders: on app load, `NotificationService` checks if any upcoming reservations are within 48h/24h and haven't already sent that notification (checked via `vb:notifications` for existing entry of that type + resvId)
- Alpine `notifications.unreadCount` computed from `vb:notifications.filter(n => !n.isRead).length` on every page load and on every `NotificationService.create()` call

---

## Definition of Done

- [ ] Bell badge shows correct unread count and updates reactively
- [ ] Notification history screen shows all notifications in correct order
- [ ] Read/unread state distinction visible
- [ ] Tapping notification marks as read and navigates to correct screen
- [ ] "Mark All as Read" clears badge
- [ ] All 10 notification event types trigger correctly from their respective features
- [ ] Opt-out preferences from EPIC-16 settings are respected
- [ ] Pre-arrival and check-in reminder triggers on app open if conditions met
- [ ] Push notification permission prompt shown after dashboard loads
- [ ] Empty notification state shown correctly

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
