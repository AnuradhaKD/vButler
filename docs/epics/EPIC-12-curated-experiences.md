# EPIC-12 — Curated Experiences

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-12 |
| **Epic Name** | Curated Experiences |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.11 Curated Experiences |
| **Architecture Reference** | §5.2 JSON Schema (property.experiences), §5.3 localStorage (vb:wishlist), §6 Module Architecture (experiences/) |
| **Status** | Ready for Development |
| **Estimated Effort** | 10 Story Points |

---

## Problem Statement

Every Browns property offers unique signature experiences that set it apart — sunrise treks at Ella, cooking classes, cultural tours, and more. These experiences are often the most memorable part of a guest's stay, yet they go un-discovered because guests don't know they exist until they ask at the front desk (often too late). A compelling visual discovery hub, built around a magazine-style editorial layout, turns experience discovery into an active, enjoyable part of the stay.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G2 — Increase Upsell Revenue | Experiences are a direct revenue line — digital discovery converts to bookings |
| G3 — Improve Guest Satisfaction | Unique experiences are the stories guests tell — surfacing them digitally elevates the entire stay narrative |
| G1 — Reduce Front Desk Load | Experience inquiries and bookings handled through the app, not through the concierge queue |

---

## Scope

### In Scope
- Experiences hub screen (magazine-style, editorial layout)
- Featured experience hero card
- Category filter (Adventure, Cultural, Culinary, Wellness, Romantic, Family)
- Experience detail / booking flow
- Add-ons selection at booking
- Saved/wishlist experiences
- All content from `property.json → experiences[]`
- Experience bookings stored in `vb:requests[]` (category: experience)

### Out of Scope
- Real-time availability calendar (Phase 1: guest submits a preferred date; hotel confirms)
- External tour operator integrations
- Reviews or ratings by past guests

---

## User Stories

### US-12.1 — Experiences Hub
**As a** guest,
**I want** to discover what unique experiences my hotel offers,
**so that** I can make the most of my stay instead of just staying in my room.

**Acceptance Criteria:**
- [ ] Hub accessible from Quick Actions → Experiences (`#/experiences`)
- [ ] **Featured Experience** hero card at top: full-width image (brand gradient fallback), experience title in Playfair Display, category badge, duration, price, "Book Now" + "Save" buttons
- [ ] Featured experience driven by `experience.isFeatured: true` in property JSON; if none, first experience used
- [ ] Category filter chips below hero: All | Adventure | Cultural | Culinary | Wellness | Romantic | Family
- [ ] Experience grid: 2-column card grid (mobile), 3-column (tablet+)
- [ ] Selecting a category filters the grid
- [ ] "Saved" chip tab shows only wishlisted experiences

**Story Points:** 2

---

### US-12.2 — Experience Card
**As a** guest browsing experiences,
**I want** each experience summarised clearly,
**so that** I can assess it quickly before deciding to read more.

**Acceptance Criteria:**
- [ ] Card: hero image (brand gradient fallback), category badge, experience name, duration, price ("From LKR X,XXX per person"), save/wishlist heart icon
- [ ] Save icon (heart): filled = wishlisted; outline = not saved; toggle updates `vb:wishlist.experienceIds[]`
- [ ] Tapping card navigates to Experience Detail (`#/experiences/{id}`)
- [ ] "Fully Booked" overlay on card if experience has no available slots for the stay dates (Phase 1: simulated — never shown unless `available: false` in JSON)

**Story Points:** 1

---

### US-12.3 — Experience Detail
**As a** guest interested in an experience,
**I want** to read everything about it before booking,
**so that** I'm fully informed before committing.

**Acceptance Criteria:**
- [ ] Full-screen hero image (Swiper.js carousel if multiple images)
- [ ] Experience name in Playfair Display, category badge
- [ ] Description (full text, rendered from JSON)
- [ ] Details row: Duration chip, Start time, Available days (formatted nicely: "Mon, Wed, Fri")
- [ ] **Inclusions** section: bullet list from `experience.inclusions[]`
- [ ] **Pricing**: per person price, min/max guests, any per-group fees
- [ ] **Booking cutoff**: "Book at least [N] hours in advance" (from `experience.bookingCutoffHours`)
- [ ] **Add-Ons** section (if `experience.addOns[]` has items): e.g., "Packed Breakfast — LKR 1,200" with +/- selector
- [ ] Wishlist heart icon (same toggle as card)
- [ ] Sticky bottom CTA bar: "Book This Experience — From LKR X,XXX" (brand bg)

**Story Points:** 2

---

### US-12.4 — Experience Booking Flow
**As a** guest who wants to book an experience,
**I want** a clear booking form that captures everything needed,
**so that** the hotel can prepare the experience exactly as I want it.

**Acceptance Criteria:**
- [ ] Booking opens as a bottom drawer (mobile) or modal (desktop) from the Experience Detail sticky CTA
- [ ] **Date**: Flatpickr date picker constrained to stay dates AND `experience.availableDays` (greyed-out days that are not available)
- [ ] **Number of Guests**: stepper (min = `experience.minGuests`, max = `experience.maxGuests`)
- [ ] **Add-Ons**: checkbox list with price per add-on; auto-updates total at bottom
- [ ] **Special Requests**: text field
- [ ] Pricing summary: base price × guests + add-ons total = **Grand Total**
- [ ] "Confirm Booking" button
- [ ] On confirm: request written to `vb:requests[]` with `category: "experience"`, all booking details, charge added to folio
- [ ] Success state: booking reference, experience name, date, Grand Total, "Add to Calendar" button (generates `.ics` file via JS)
- [ ] Booking cutoff enforced: if selected date is within `bookingCutoffHours` of the start time, show "Booking window has closed for this date. Please select another."

**Story Points:** 3

---

### US-12.5 — Wishlist / Saved Experiences
**As a** guest,
**I want** to save experiences I'm interested in,
**so that** I can come back to them later without searching again.

**Acceptance Criteria:**
- [ ] Heart icon on every experience card and detail page
- [ ] Toggling saves/removes `experienceId` in `vb:wishlist.experienceIds[]`
- [ ] "Saved" filter chip on the Experiences hub shows only wishlisted experiences
- [ ] Wishlist persists across sessions (localStorage)
- [ ] Empty wishlist state: heart illustration + "Save experiences you're interested in"

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, Modal/Drawer, Swiper.js | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (stay dates constrain booking) | Blocker | EPIC-03 |
| EPIC-06 RequestService | Blocker | EPIC-06 |
| `data/properties/{id}.json → experiences[]` | Data dependency | — |

---

## Technical Notes

- `.ics` file generation: build iCalendar format string in JS and trigger download via Blob URL
- Available days filter on date picker: Flatpickr `disable` function checks if `dayjs(date).format('ddd')` is NOT in `experience.availableDays[]`
- Booking cutoff check: `dayjs(selectedDate).set('hour', startHour).diff(dayjs(), 'hour') < bookingCutoffHours`

---

## Definition of Done

- [ ] Experiences hub loads all experiences for active property
- [ ] Featured experience hero card displays correctly
- [ ] Category filter correctly filters experience grid
- [ ] Experience detail shows all sections including inclusions and add-ons
- [ ] Booking form date picker respects stay dates and available days
- [ ] Booking cutoff enforced correctly
- [ ] Add-ons update total price dynamically
- [ ] Booking creates request and adds charge to folio
- [ ] Wishlist heart toggle persists correctly
- [ ] "Saved" filter shows only wishlisted experiences

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
