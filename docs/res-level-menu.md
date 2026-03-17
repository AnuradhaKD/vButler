# Reservation-Level Menu Access — Destinity vButler

> Defines which menu items and sub-items are visible and functional at each reservation status level.
> Last updated: 2026-03-17

---

## Reservation Status Levels

| Status | Meaning |
|---|---|
| **No Reservation** | Guest is logged in but has no booking |
| **Pre-Arrival** | Booking confirmed, check-in date is in the future |
| **In-House** | Guest is currently checked in and staying |
| **Checked-Out** | Stay is completed |
| **Cancelled** | Reservation was cancelled |

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Visible and fully functional |
| 👁️ | Visible but browse / read-only (no booking or editing) |
| ⚠️ | Visible but limited to specific sub-items only (see notes) |
| ❌ | Hidden — not shown in menu |

---

## Menu Access Matrix

| # | Menu Item | No Reservation | Pre-Arrival | In-House | Checked-Out | Cancelled |
|---|-----------|:--------------:|:-----------:|:--------:|:-----------:|:---------:|
| 1 | Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ |
| 2 | My Reservations | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 | Pre-Arrival | ❌ | ✅ | 👁️ | ❌ | ❌ |
| 4 | Change Stay | ❌ | ⚠️ | ✅ | ❌ | ❌ |
| 5 | Services | ❌ | ❌ | ✅ | ❌ | ❌ |
| 6 | Dining & Bars | ❌ | 👁️ | ✅ | ❌ | ❌ |
| 7 | Wellness & Spa | ❌ | 👁️ | ✅ | ❌ | ❌ |
| 8 | Housekeeping | ❌ | ⚠️ | ✅ | ❌ | ❌ |
| 9 | Transport | ❌ | ⚠️ | ✅ | ❌ | ❌ |
| 10 | Wake-Up Call | ❌ | ❌ | ✅ | ❌ | ❌ |
| 11 | Experiences | ❌ | 👁️ | ✅ | ❌ | ❌ |
| 12 | Local Explore | ❌ | 👁️ | ✅ | ❌ | ❌ |
| 13 | Billing | ❌ | ❌ | ✅ | 👁️ | ❌ |
| 14 | Rewards | ✅ | ✅ | ✅ | ✅ | ✅ |
| 15 | Complaints | ❌ | ❌ | ✅ | ✅ | ❌ |
| 16 | Feedback | ❌ | ❌ | ✅ | ✅ | ❌ |
| 17 | Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |
| — | Profile | ✅ | ✅ (editable) | 👁️ (read-only) | 👁️ (read-only) | ✅ |

---

## Detailed Menu & Sub-Item Breakdown

---

### 1. Dashboard
| Status | Access |
|---|---|
| No Reservation | ✅ Shown with account-level promotions only |
| Pre-Arrival | ✅ Full dashboard with upcoming reservation card |
| In-House | ✅ Full dashboard with active stay card, quick actions |
| Checked-Out | ✅ Past stay summary, "Stay Again" prompt |
| Cancelled | ❌ Hidden |

---

### 2. My Reservations
Visible at all statuses. Content differs per status.

| Status | Access |
|---|---|
| No Reservation | ✅ Empty state with "Make a Booking" prompt |
| Pre-Arrival | ✅ Upcoming reservation details, pre-arrival actions |
| In-House | ✅ Active reservation details, all actions |
| Checked-Out | ✅ Past reservation — read-only, "Stay Again" prompt |
| Cancelled | ✅ Cancellation details, contact hotel (WhatsApp / phone), "Book Again" prompt |

---

### 3. Pre-Arrival
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ✅ Editable | Guest completes all pre-arrival forms |
| In-House | 👁️ Read-only | Visible to review what was submitted, not editable |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**
- Personal & travel details
- Room preferences
- Special requests
- Document upload (Passport / NIC / Driving Licence via OCR)

---

### 4. Change Stay
| Status | Access | Available Request Types |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ⚠️ Limited | Early Check-in, Room Upgrade, Room Change |
| In-House | ✅ Full | Extend Stay, Early Check-out, Early Check-in, Room Upgrade, Room Change, Other |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

> Requests do not change reservation data directly — they send an alert to the Front Office PMS with an SRQ-XXXX reference and a WhatsApp follow-up.

---

### 5. Services
| Status | Access |
|---|---|
| No Reservation | ❌ |
| Pre-Arrival | ❌ |
| In-House | ✅ Full |
| Checked-Out | ❌ |
| Cancelled | ❌ |

**Sub-categories & items:**

#### Housekeeping (via Services page)
- Room Makeup
- Turndown Service
- Extra Towels / Beach Towels

#### Transport (via Services page)
- Airport Transfer (BIA)
- Colombo City Transfer

#### Concierge (via Services page)
- Luggage Storage
- Boat Rental Arrangement

---

### 6. Dining & Bars
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | 👁️ Browse only | Can view menus and restaurant info, no table bookings |
| In-House | ✅ Full | Browse menus, make table reservations |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**
- Restaurants (menu, table reservation)
- Bars (menu, browse only — bars don't take reservations)

---

### 7. Wellness & Spa
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | 👁️ Browse only | Can view treatments, classes, packages — no booking |
| In-House | ✅ Full | Browse and book treatments, classes, packages |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**
- Treatments (e.g. Swedish Massage, Couples Ritual)
- Classes (e.g. Sunrise Beach Yoga)
- Packages (e.g. Bentota Bliss Day Package)

---

### 8. Housekeeping
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ⚠️ Limited | Only pre-arrival relevant items (see below) |
| In-House | ✅ Full | All items |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**

| Sub-item | Pre-Arrival | In-House |
|---|---|---|
| Do Not Disturb toggle | ❌ | ✅ |
| Room Makeup | ❌ | ✅ |
| Turndown Service | ❌ | ✅ |
| Extra Towels / Beach Towels | ❌ | ✅ |
| Extra Pillows / Blankets | ❌ | ✅ |
| Laundry Service | ❌ | ✅ |
| **Special Occasion / Room Setup Request** | ✅ | ✅ |

**Special Occasion / Room Setup Request sub-types:**
- Honeymoon / Romance Setup (rose petals, candles, champagne)
- Birthday Decoration
- Anniversary Setup
- Baby / Family Arrival Setup
- Other (free text)

---

### 9. Transport
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ⚠️ Limited | Airport Arrival Transfer only |
| In-House | ✅ Full | All transport options |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**

| Sub-item | Pre-Arrival | In-House |
|---|---|---|
| Airport Arrival Transfer (BIA) | ✅ | ✅ |
| Airport Departure Transfer (BIA) | ❌ | ✅ |
| Colombo Day Trip / Shuttle | ❌ | ✅ |
| Other city transfers | ❌ | ✅ |

---

### 10. Wake-Up Call
| Status | Access |
|---|---|
| No Reservation | ❌ |
| Pre-Arrival | ❌ |
| In-House | ✅ Full |
| Checked-Out | ❌ |
| Cancelled | ❌ |

**Sub-items:**
- Set wake-up call (date, time, analog clock picker)
- View scheduled wake-up calls
- Cancel a wake-up call

---

### 11. Experiences
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | 👁️ Browse only | Can explore experiences to plan ahead, no booking |
| In-House | ✅ Full | Browse and book experiences |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**
- Featured experiences (e.g. Sunset Cruise, Water Sports, Turtle Watching)
- Add-ons per experience

---

### 12. Local Explore
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | 👁️ Browse only | Informational — good for trip planning |
| In-House | ✅ Full | Browse nearby places, distances, tips |
| Checked-Out | ❌ | — |
| Cancelled | ❌ | — |

**Sub-items:**
- Nearby places by category (Culture, Nature, Adventure, Shopping)
- Distance, travel time, opening hours, hotel tips per place

---

### 13. Billing
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ❌ | — |
| In-House | ✅ Full | Live bill, itemised charges |
| Checked-Out | 👁️ Read-only | Past bill, useful for expense claims |
| Cancelled | ❌ | — |

---

### 14. Rewards / Loyalty
Visible at all statuses — account-level feature.

| Status | Access |
|---|---|
| No Reservation | ✅ |
| Pre-Arrival | ✅ |
| In-House | ✅ |
| Checked-Out | ✅ |
| Cancelled | ✅ |

**Sub-items:**
- Loyalty card (tier, points balance)
- Tier benefits
- Redeem points
- Points history

---

### 15. Complaints
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ❌ | — |
| In-House | ✅ Full | Log complaints about current stay |
| Checked-Out | ✅ Full | Log complaints about past stay (billing errors, post-stay issues) |
| Cancelled | ❌ | — |

**Sub-categories:**
- Room (Cleanliness, Maintenance, Temperature, Noise, Amenities, Other)
- Dining (Food Quality, Service Speed, Order Incorrect, Billing Error, Hygiene, Other)
- Service (Request Not Fulfilled, Delayed Response, Staff Attitude, Other)
- Facilities (Pool, Spa, Beach, WiFi, Water Sports, Other)
- Staff (Rude/Unprofessional, Incorrect Information, Unhelpful, Other)
- Custom Complaint (subject + free-form description + urgency + location)

---

### 16. Feedback
| Status | Access | Notes |
|---|---|---|
| No Reservation | ❌ | — |
| Pre-Arrival | ❌ | — |
| In-House | ✅ Full | Mid-stay feedback encouraged |
| Checked-Out | ✅ Full | Post-stay feedback (most common scenario) |
| Cancelled | ❌ | — |

> One submission per reservation (guard prevents duplicate submissions).
> Score > 100 → redirect to TripAdvisor / Google review.
> Score < 60 → GM escalation message shown.

**Sections (emoji ratings 😞😕😐🙂😄):**
- Hotel Services (11 items, max 55 pts)
- Room & Facilities (8 items, max 40 pts)
- Associates (4 items, max 20 pts)
- Food & Beverage (7 items, max 35 pts)

---

### 17. Notifications
Visible at all statuses — account-level feature.

| Status | Access |
|---|---|
| No Reservation | ✅ |
| Pre-Arrival | ✅ |
| In-House | ✅ |
| Checked-Out | ✅ |
| Cancelled | ✅ |

---

### Profile
| Status | Access | Notes |
|---|---|---|
| No Reservation | ✅ Editable | Guest can maintain their profile |
| Pre-Arrival | ✅ Editable | Profile editing is open during pre-arrival stage |
| In-House | 👁️ Read-only | Profile locks once guest is checked in |
| Checked-Out | 👁️ Read-only | Remains read-only after checkout |
| Cancelled | ✅ Editable | No active stay — profile is open again |

**Tabs:**
- Profile (personal details, document scan, photo)
- Preferences (bed type, pillow, floor, temperature, wake-up style, amenities)
- Dietary & Allergies (diet type, food allergies, kitchen notes)
- Health & Accessibility (medical allergies, accessibility needs, emergency contact)

---

## Summary: What changes per status

| Feature area | No Res | Pre-Arrival | In-House | Checked-Out | Cancelled |
|---|---|---|---|---|---|
| Account features (Rewards, Notifications, Profile) | ✅ | ✅ | ✅ (profile read-only) | ✅ (profile read-only) | ✅ |
| Stay planning (Pre-Arrival, Change Stay) | ❌ | ✅ (limited) | ✅ (full) | ❌ | ❌ |
| In-room services (Housekeeping, Wake-Up, Services) | ❌ | ⚠️ (special requests only) | ✅ | ❌ | ❌ |
| Hotel services (Dining, Wellness, Experiences) | ❌ | 👁️ browse | ✅ | ❌ | ❌ |
| Information (Local Explore) | ❌ | 👁️ browse | ✅ | ❌ | ❌ |
| Transport | ❌ | ⚠️ (arrival only) | ✅ | ❌ | ❌ |
| Billing | ❌ | ❌ | ✅ (live) | 👁️ (past) | ❌ |
| Post-stay (Feedback, Complaints) | ❌ | ❌ | ✅ | ✅ | ❌ |
| Cancellation info + contact hotel | ❌ | ❌ | ❌ | ❌ | ✅ |
