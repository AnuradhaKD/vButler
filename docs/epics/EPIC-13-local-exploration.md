# EPIC-13 — Local Exploration

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-13 |
| **Epic Name** | Local Exploration |
| **Product** | Destinity vButler Guest App |
| **Priority** | P2 — Nice to Have |
| **PRD Reference** | §7.12 Local Exploration |
| **Architecture Reference** | §5.2 JSON Schema (property.localPlaces), §5.3 localStorage (vb:wishlist), §6 Module Architecture (local-explore.js) |
| **Status** | Ready for Development |
| **Estimated Effort** | 5 Story Points |

---

## Problem Statement

Guests staying at a destination property — especially international visitors — constantly ask "What should I do around here?" and "Where should I eat locally?" Answering this question takes front desk time, printed leaflets go unread, and TripAdvisor doesn't have the hotel's local insight. A curated, hotel-vetted guide to the surrounding area, with the hotel's own recommendation notes, is a genuine value-add that no third-party app replicates.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G3 — Improve Guest Satisfaction | Guests who explore and have great local experiences attribute some of that positive feeling to the hotel that pointed them there |
| G1 — Reduce Front Desk Load | "What should I do today?" is one of the most common front-desk questions — answered digitally |

---

## Scope

### In Scope
- Local Exploration hub screen
- Nearby, Popular, and Saved tabs
- Place cards (name, category, distance, hotel recommendation note)
- Category filters (Food, Nature, Culture, Shopping, Adventure, Nightlife)
- Save/bookmark places
- Map link (opens native device map app)
- All content from `property.json → localPlaces[]`

### Out of Scope
- Real-time GPS proximity detection (distance is static from JSON)
- In-app map rendering (links to Google/Apple Maps)
- Guest reviews or ratings of local places
- Booking tables at local (non-hotel) restaurants

---

## User Stories

### US-13.1 — Local Exploration Hub
**As a** guest,
**I want** to discover what's around the hotel,
**so that** I can make the most of the local area during my stay.

**Acceptance Criteria:**
- [ ] Hub accessible from Quick Actions → Explore (`#/local`)
- [ ] Tab bar: **Nearby** (sorted by distance) | **Popular** (hotel staff curated) | **Saved** (bookmarked places)
- [ ] Category filter chips (horizontal scroll): All | Food | Nature | Culture | Shopping | Adventure | Nightlife
- [ ] Place cards in list view
- [ ] Category filter applies across all tabs
- [ ] Empty state for Saved tab: "Bookmark places you want to visit"
- [ ] All place data from `property.json → localPlaces[]`

**Story Points:** 1

---

### US-13.2 — Place Card
**As a** guest browsing local places,
**I want** each place summarised clearly with the hotel's personal take,
**so that** I get insider information I can't find on Google.

**Acceptance Criteria:**
- [ ] Card: place photo (brand gradient fallback), place name, category badge, distance from hotel, travel time
- [ ] Hotel's recommendation note displayed as a highlighted quote block (e.g., "Best viewed at 08:30 when the train passes — ask our concierge for exact timings")
- [ ] Save/bookmark icon (bookmark_add / bookmark): toggles `vb:wishlist.placeIds[]`
- [ ] "Get Directions" button: opens `place.mapUrl` in a new tab (Google Maps or Apple Maps link from JSON)
- [ ] Tapping card expands inline to show full description and larger image

**Story Points:** 2

---

### US-13.3 — Category Filtering
**As a** guest with specific interests,
**I want** to filter local places by category,
**so that** I see only what's relevant to me.

**Acceptance Criteria:**
- [ ] Category chips: All | Food | Nature | Culture | Shopping | Adventure | Nightlife
- [ ] Selecting a chip filters the displayed place cards to matching `place.category`
- [ ] "All" shows all places
- [ ] Filter state persists while navigating between tabs (Nearby/Popular/Saved)
- [ ] Chip count badge shows number of places in that category (optional enhancement)

**Story Points:** 1

---

### US-13.4 — Saved Places
**As a** guest,
**I want** to bookmark places I want to visit,
**so that** I can find them again quickly without searching.

**Acceptance Criteria:**
- [ ] Bookmark icon on every place card
- [ ] Toggling saves/removes `placeId` in `vb:wishlist.placeIds[]`
- [ ] "Saved" tab shows only bookmarked places
- [ ] Wishlist persists across sessions (localStorage)
- [ ] Removing a bookmark from the Saved tab removes the card from the Saved list immediately (Alpine.js reactive)

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell | Blocker | EPIC-01 |
| EPIC-02 Authentication | Blocker | EPIC-02 |
| EPIC-03 Active Reservation (property context) | Blocker | EPIC-03 |
| `data/properties/{id}.json → localPlaces[]` | Data dependency | — |

---

## Technical Notes

- Map links: `place.mapUrl` in JSON stores pre-formed Google Maps URL (e.g., `https://maps.google.com/?q=...`); on mobile, device handles the URL scheme and may open Apple Maps or Google Maps depending on device
- Distance sorting for Nearby tab: places sorted by `place.distanceKm` ascending
- Popular tab: places not filtered/sorted by distance — shown in JSON order (staff control order via JSON)

---

## Definition of Done

- [ ] Local hub loads all places for the active property from JSON
- [ ] Nearby tab sorts by distance, Popular shows in JSON order
- [ ] Category filter works across all tabs
- [ ] Place card shows hotel recommendation note as highlighted block
- [ ] "Get Directions" opens correct map URL in new tab
- [ ] Bookmark toggle persists correctly in localStorage
- [ ] Saved tab shows only bookmarked places and updates on unbookmark

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
