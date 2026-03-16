# EPIC-14 — Billing & Payments

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-14 |
| **Epic Name** | Billing & Payments |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.13 Billing & Payments |
| **Architecture Reference** | §5.2 JSON Schema (reservation.folio), §5.3 localStorage (vb:reservations), §6 billing/, §10.3 Billing & PDF Invoice Flow |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

Billing is one of the most anxiety-inducing parts of any hotel stay. Guests worry about unexpected charges, struggle to understand itemised bills, and are frustrated when they can't pay before checkout. At the same time, the hotel wants payment as early as possible and needs guests to understand their folio without staff having to explain every line. A transparent, real-time billing screen with in-app payment capability eliminates this friction entirely.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G1 — Reduce Front Desk Load | Guests view and query their bill digitally; far fewer billing questions at checkout |
| G2 — Increase Upsell Revenue | Advance payment captures revenue earlier and reduces last-minute disputes |
| G3 — Improve Guest Satisfaction | Transparent billing with full itemisation builds trust |
| G5 — Enable Data-Driven Hospitality | Structured folio data enables revenue reporting per service category |

---

## Scope

### In Scope
- Billing hub screen: account balance + charge summary grouped by category
- Itemised invoice detail (line-by-line folio view)
- Date range filter for charges
- Search charges by description
- PDF invoice generation (jsPDF + jsPDF-AutoTable) with Browns branding
- In-stay payment flow (full or partial payment simulation)
- Advance payment flow for upcoming reservations (from pre-arrival checklist)
- All billing data from `vb:reservations[n].folio[]` in localStorage
- In-app charges from Dining, Wellness, Experiences append to folio

### Out of Scope
- Real payment gateway integration (Phase 1: simulated payment; Phase 2: real gateway)
- PCI-DSS card tokenisation (Phase 1: mock payment confirmation)
- Multi-currency conversion (display only in property currency)

---

## User Stories

### US-14.1 — Billing Hub (Financial Summary)
**As a** guest,
**I want** to see my current hotel bill at a glance,
**so that** I know exactly what I owe before checkout without any surprises.

**Acceptance Criteria:**
- [ ] Accessible from Quick Actions → My Bill or bottom nav → Bill
- [ ] **Account Balance card** at top: outstanding balance in property currency (LKR), "Paid in Full" if balance = 0; "Pay Now" button if balance > 0
- [ ] **Charge Summary section**: total by category (Room, Dining, Wellness, Services, Extras, Payments) — each category as a row with amount
- [ ] Each category row is tappable to scroll to that section in the itemised view below
- [ ] **Date Range Filter**: quick filters: All | Today | Last 3 Days | Full Stay; or custom date range (Flatpickr)
- [ ] **Search**: debounced text search filters charges by description
- [ ] Reservation context shown: property name, reservation number, dates
- [ ] Billing data sourced from `vb:reservations[n].folio[]`

**Story Points:** 3

---

### US-14.2 — Itemised Invoice Detail
**As a** guest who wants to understand every charge,
**I want** to see a full line-by-line breakdown of my bill,
**so that** I can verify every item before I pay.

**Acceptance Criteria:**
- [ ] Itemised list below the summary section (or on a separate "View Full Invoice" screen)
- [ ] Each line item: date (formatted: "5 Apr"), description, quantity (if > 1), unit price, total
- [ ] Charges grouped by day, with a day subtotal row
- [ ] Tax breakdown row per day group (if `taxRate` configured in `chain.json`)
- [ ] Payment entries shown in green with a negative sign (deducting from total)
- [ ] Running total shown at the very bottom
- [ ] Horizontal rule separating charge groups
- [ ] "Download Invoice" button at top-right of the invoice section

**Story Points:** 2

---

### US-14.3 — PDF Invoice Download
**As a** guest,
**I want** to download a branded PDF copy of my invoice,
**so that** I can submit it for expense reimbursement or keep it for my records.

**Acceptance Criteria:**
- [ ] "Download Invoice" button triggers jsPDF generation immediately (no server call)
- [ ] PDF contents:
  - Browns Hotels & Resorts logo (top-left)
  - Property name, address, phone, email
  - "Invoice" heading (Playfair Display via jsPDF custom font or fallback)
  - Guest name, reservation number, room type
  - Check-in and check-out dates
  - Table of all charges (date | description | qty | unit | total) using jsPDF-AutoTable
  - Tax summary rows
  - Total outstanding or "Paid in Full"
  - Footer: property contact + "Thank you for choosing Browns Hotels & Resorts"
- [ ] PDF filename: `Invoice_{ReservationNumber}_{GuestLastName}.pdf`
- [ ] PDF opens in a new browser tab (not forced download) so guest can also print
- [ ] Works on mobile (Blob URL + `<a download>` fallback for iOS)

**Story Points:** 3

---

### US-14.4 — In-Stay Payment (Simulated)
**As a** guest who wants to pay my bill before checkout,
**I want** to make a payment through the app,
**so that** I can avoid queuing at the front desk on the morning I leave.

**Acceptance Criteria:**
- [ ] "Pay Now" button on Billing Hub navigates to Payment screen
- [ ] Payment screen shows current outstanding balance
- [ ] **Payment amount**: Full Balance (default) or Partial Amount (numeric input, must be ≤ balance)
- [ ] **Payment method selector**: Credit/Debit Card | Digital Wallet (radio cards with icons)
- [ ] For Card: card number (masked input: `•••• •••• •••• ____`), expiry, CVV, cardholder name — all fields shown but NOT stored (Phase 1 simulation)
- [ ] "Confirm Payment" button
- [ ] Payment processing state: full-screen overlay with spinner "Processing your payment..."
- [ ] Success state: receipt summary — amount paid, last 4 digits of card (mock), transaction reference, timestamp
- [ ] On success: payment entry appended to `vb:reservations[n].folio[]` as a negative amount (deduction); outstanding balance updated
- [ ] Receipt emailed: in Phase 1, console log only; receipt shown in-app
- [ ] In-app notification: "Payment of LKR X,XXX received — Thank you!"
- [ ] **Security note displayed**: "Your payment is processed securely. Card details are not stored." (Phase 1 disclaimer)

**Story Points:** 3

---

### US-14.5 — Advance Payment (Pre-Arrival)
**As a** guest with an upcoming reservation,
**I want** to pay my deposit or full balance before I arrive,
**so that** I can check in without payment delays.

**Acceptance Criteria:**
- [ ] Advance Payment accessible from Pre-Arrival Checklist (EPIC-05) → Advance Payment item
- [ ] Also accessible from Reservation Detail → "Pay Now" (for Upcoming reservations with balance > 0)
- [ ] Same payment flow as US-14.4 but with context: "Advance Payment — [Property], arriving [Date]"
- [ ] Option to pay: Deposit (fixed amount from `reservation.depositRequired` if configured) or Full Balance
- [ ] On success: balance in `vb:reservations[n]` updated; pre-arrival checklist item "Advance Payment" marked complete

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Toast, jsPDF CDN | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (folio data) | Blocker | EPIC-03 |
| EPIC-05 Pre-Arrival (advance payment linked from checklist) | Soft link | EPIC-05 |
| EPIC-07 Dining, EPIC-08 Wellness, EPIC-12 Experiences (append charges to folio) | Dependency consumer | EPIC-07, 08, 12 |
| EPIC-17 Notifications (payment triggers notification) | Soft dependency | EPIC-17 |

---

## Technical Notes

- Folio data structure in `vb:reservations[n].folio[]`: `{ date, description, amount, category, quantity?, unitPrice? }`
- Amount is positive for charges, negative for payments
- Outstanding balance = `folio.reduce((sum, entry) => sum + entry.amount, 0)`
- jsPDF and jsPDF-AutoTable loaded via CDN; used only on demand (lazy, triggered by "Download Invoice" action) to avoid blocking initial page load
- Phase 1 payment simulation: after 2-second `setTimeout`, payment "succeeds" — no real card processing
- iOS PDF: `window.open(pdfBlob.output('bloburl'), '_blank')` is required for iOS Safari; direct download is blocked

---

## Definition of Done

- [ ] Billing hub shows correct outstanding balance from folio
- [ ] Charge summary groups all charges by category with correct totals
- [ ] Itemised view shows all folio line items with day groups and running total
- [ ] Date range filter and search work correctly
- [ ] PDF invoice generates with all required fields and branding
- [ ] PDF downloads/opens on both mobile and desktop
- [ ] Payment flow correctly simulates processing and updates folio balance
- [ ] Partial payment correctly reduces outstanding balance
- [ ] Advance payment accessible from pre-arrival checklist and reservation detail
- [ ] Payment success triggers in-app notification
- [ ] "Paid in Full" state shown when balance reaches zero

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
