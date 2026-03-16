# Destinity vButler — Product Requirements Document

**Product:** Destinity vButler Guest App
**Chain:** Browns Hotels & Resorts
**Version:** 1.0 — Full Product Vision
**Date:** 2026-03-15
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Success Metrics](#3-success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Core Concept: Reservation-Centric Model](#5-core-concept-reservation-centric-model)
6. [Platform & Design System](#6-platform--design-system)
7. [Feature Modules](#7-feature-modules)
   - 7.1 Authentication
   - 7.2 Reservation Management
   - 7.3 Home Dashboard
   - 7.4 Pre-Arrival & Check-In
   - 7.5 Hotel Services Catalog
   - 7.6 Dining & Bars
   - 7.7 Wellness & Spa
   - 7.8 Housekeeping Services
   - 7.9 Transport & Transfers
   - 7.10 Wake-Up Call
   - 7.11 Curated Experiences
   - 7.12 Local Exploration
   - 7.13 Billing & Payments
   - 7.14 Complaints & Feedback
   - 7.15 Guest Profile & Settings
   - 7.16 Notifications
   - 7.17 Language & Accessibility
8. [Content Management (Two-Tier)](#8-content-management-two-tier)
9. [Integrations](#9-integrations)
10. [Technical Requirements](#10-technical-requirements)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Out of Scope](#12-out-of-scope)
13. [Assumptions & Dependencies](#13-assumptions--dependencies)

---

## 1. Executive Summary

**Destinity vButler** is the official guest-facing digital companion for **Browns Hotels & Resorts**. It puts the full power of a personal butler in every guest's pocket — accessible from any device, at any point in their stay journey: before arrival, during the stay, and after checkout.

The app is built around the guest's **reservations**, not a fixed identity. A single guest may have multiple active, upcoming, or past reservations across multiple Browns properties simultaneously. Every feature — services, billing, requests, experiences — is contextual to the **active reservation** being viewed.

Destinity vButler is a **Progressive Web App (PWA)**: it renders as a native-like mobile application on smartphones and as a full responsive website on desktops and laptops. No App Store installation is required.

---

## 2. Product Vision & Goals

### Vision Statement
> *"Every Browns guest deserves a personal butler — available 24/7, across every property, in the palm of their hand."*

### Strategic Goals

| # | Goal | Description |
|---|------|-------------|
| G1 | Reduce Front Desk Load | Allow guests to self-serve for >80% of common requests (wake-up calls, laundry, transport, room makeup) without calling or visiting the front desk |
| G2 | Increase Upsell Revenue | Surface curated experiences, dining reservations, wellness bookings, and upgrades contextually throughout the guest journey |
| G3 | Improve Guest Satisfaction | Deliver measurable improvements in NPS, TripAdvisor, and post-stay survey scores by reducing friction and improving responsiveness |
| G4 | Centralise Guest Journey | Provide a single digital touchpoint from pre-arrival to post-checkout across all Browns properties |
| G5 | Enable Data-Driven Hospitality | Capture structured service request and feedback data to drive operational improvements at both property and chain level |

---

## 3. Success Metrics

| Metric | Baseline Target | Long-Term Target |
|--------|-----------------|------------------|
| Digital self-service adoption | 40% of requests via app | 75%+ |
| Front desk call volume reduction | 20% reduction | 50% reduction |
| In-app upsell conversion | 5% of active guests | 15%+ |
| Guest NPS (post-stay) | +5 points | +15 points |
| Average complaint resolution time | Tracked from app submission | <2 hours for standard issues |
| App session per stay | 3+ sessions per reservation | 6+ sessions |
| Payment via app (advance + in-stay) | Tracked from launch | 30%+ of eligible transactions |

---

## 4. Target Users & Personas

> **Important:** Destinity vButler is a **guest-facing consumer app**. It is NOT a hotel staff tool, PMS portal, or back-office system. Every design and feature decision must centre on the guest experience.

### 4.1 Primary Persona — The Modern Traveller

| Attribute | Description |
|-----------|-------------|
| **Who** | Leisure and business travellers aged 25–55 staying at Browns properties |
| **Devices** | Smartphone (primary), laptop/desktop (secondary for planning) |
| **Expectations** | Instant, app-like experience; no learning curve; on-demand service |
| **Pain Points** | Waiting on hold, not knowing request status, paper-based processes, language barriers |
| **Goals** | Manage their stay effortlessly, discover local experiences, get issues resolved fast |

### 4.2 Secondary Persona — The Repeat Browns Guest

| Attribute | Description |
|-----------|-------------|
| **Who** | Loyalty guests with multiple bookings across Browns properties (e.g., Newburge Ella, Colombo properties) |
| **Devices** | Smartphone + laptop |
| **Expectations** | Seamless multi-property experience; history and preferences remembered; one login for all stays |
| **Goals** | Manage multiple reservations in one place; quick access to billing across stays |

### 4.3 Secondary Persona — The International Guest

| Attribute | Description |
|-----------|-------------|
| **Who** | Non-English speaking guests (Arabic, German, Sinhala, Tamil speakers) |
| **Devices** | Smartphone |
| **Expectations** | App in their preferred language; culturally appropriate content |
| **Goals** | Communicate service needs without language barriers |

---

## 5. Core Concept: Reservation-Centric Model

### 5.1 What It Means

Destinity vButler is **reservation-centric, not guest-centric**. This is the most important architectural concept of the entire product.

- A guest logs in once with their **Browns account** (email + password).
- The app displays **all reservations** linked to that account across every Browns property — past, present, and upcoming.
- Each **reservation** is the anchor for all in-app activity: services, billing, complaints, experiences, and check-in tasks are all scoped to a specific reservation.
- A guest may have **Reservation A** at Newburge Ella in April and **Reservation B** at a Colombo property in June — both visible and manageable simultaneously.

### 5.2 Reservation States

| State | Description | Available Actions |
|-------|-------------|-------------------|
| **Upcoming** | Booking confirmed, check-in date in the future | Pre-arrival checklist, advance payments, service pre-booking |
| **Active / In-Stay** | Guest is currently checked in | All services, billing, complaints, experiences, requests |
| **Checked Out** | Stay completed | View bill, download invoice, submit feedback |
| **Cancelled** | Reservation cancelled | View cancellation details only |

### 5.3 Context Switching

- Guests can switch between reservations from any screen using the **Reservations** section.
- The active reservation's **property name, hotel image, and dates** are always visible in the app header/dashboard to confirm context.
- Service requests, billing, and complaints are always linked to the **currently selected reservation**.

---

## 6. Platform & Design System

### 6.1 Platform

| Context | Behaviour |
|---------|-----------|
| **Mobile browsers** (iOS Safari, Android Chrome) | Full-screen PWA; app-like bottom navigation; touch-optimised; installable to home screen |
| **Desktop & Laptop browsers** | Responsive website layout; sidebar navigation; wider content areas |
| **No native app required** | Works entirely in browser; no App Store / Play Store distribution |

### 6.2 Design System

| Token | Value |
|-------|-------|
| **Primary colour** | `#003c52` (Browns deep teal) |
| **Background light** | `#f5f8f8` |
| **Background dark** | `#0f1e23` |
| **Primary font** | Inter (all UI elements) |
| **Display/serif font** | Playfair Display (hero headings, featured content) |
| **Icon set** | Google Material Symbols Outlined |
| **Border radius** | Default `4px`, Large `8px`, XL `12px`, Full `9999px` |

### 6.3 Theme

- **Light mode** (default) and **Dark mode** supported.
- Theme toggle accessible from Settings / Profile.
- Colour contrast ratios must meet WCAG 2.1 AA standards.

### 6.4 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `< 1024px` (Mobile & Tablet) | Bottom tab bar navigation; full-width cards; single-column layout; touch-optimised; max-width 480px shell centred on screen |
| `≥ 1024px` (Desktop & Laptop) | Fixed left sidebar (260px) with grouped navigation; content area fills remaining width; bottom nav hidden; mobile header hidden; full-width layout with no max-width cap |

### 6.5 Desktop Sidebar Navigation

The left sidebar is shown exclusively on screens ≥ 1024px and replaces both the mobile header and the bottom tab bar.

| Section | Links |
|---------|-------|
| **Main** | Dashboard, My Stays, Pre-Arrival |
| **Dining & Leisure** | Dining, Wellness & Spa, Experiences, Local Explore |
| **Room Services** | Services, Housekeeping, Transport, Wake-Up Call |
| **Account** | Billing, Complaints, Notifications, Profile, Settings |

- Sidebar background uses the primary brand colour (`#003c52`)
- Guest name, avatar, active room number and notification bell shown in a card at the top of the sidebar
- Language selector and Sign Out button fixed at the sidebar footer
- Active route is highlighted with a filled icon and bold label
- Sidebar scrolls independently from the content area

---

## 7. Feature Modules

---

### 7.1 Authentication

#### 7.1.1 Overview
Guests access Destinity vButler using their Browns account credentials. Authentication is a two-step process: email/password followed by OTP verification.

#### 7.1.2 User Flows

**Registration (New Guest)**
1. Guest lands on the registration screen.
2. Enters: Full Name, Email Address, Phone Number (with country code), Password, Confirm Password.
3. Accepts Terms & Conditions.
4. System sends OTP to registered email.
5. Guest verifies OTP → account created → redirected to Reservations screen.

**Login (Returning Guest)**
1. Guest enters email and password on the login screen.
2. System sends OTP to registered email.
3. Guest enters OTP on verification screen.
4. On success → redirected to Home Dashboard.

**Forgot Password**
1. Guest enters registered email.
2. Receives password reset link via email.
3. Sets new password → redirected to login.

#### 7.1.3 Requirements

| ID | Requirement |
|----|-------------|
| AUTH-01 | Login must use email + password only (no social login, no reservation number login) |
| AUTH-02 | OTP must be sent to the guest's registered email address |
| AUTH-03 | OTP must expire after 10 minutes |
| AUTH-04 | Maximum 3 failed OTP attempts before a cooldown (5-minute lockout) |
| AUTH-05 | Session must persist for 30 days on trusted devices (remember me) |
| AUTH-06 | Guest must be able to log out from any screen via Settings |
| AUTH-07 | All authentication pages must be accessible without being logged in |
| AUTH-08 | Registration requires phone number for WhatsApp-based service notifications |

#### 7.1.4 Screens
- Login Screen (email/password split-panel layout — image left, form right on desktop; full-screen card on mobile)
- OTP Verification Screen
- Guest Registration Screen
- Forgot Password Screen

---

### 7.2 Reservation Management

#### 7.2.1 Overview
The Reservations screen is the central hub where guests view and manage all their Browns Hotel bookings. It is the primary navigation destination after login.

#### 7.2.2 Reservation List View

**Tabs:**
- **Active** — Currently checked-in stays (badge with count)
- **Upcoming** — Confirmed future reservations
- **Past** — Completed stays
- **Cancelled** — Cancelled bookings

**Each Reservation Card shows:**
- Hotel property image (thumbnail)
- Property name (e.g., Browns Hotel Newburge Ella)
- Reservation number / booking reference
- Room type
- Check-in and check-out dates
- Number of guests
- Status badge (Active / Upcoming / Checked Out / Cancelled)
- Quick action button (e.g., "Manage Stay" / "View Details")

#### 7.2.3 Reservation Detail View

Tapping a reservation card opens the full reservation detail, which becomes the **operational context** for all in-app features during that stay.

**Reservation Detail shows:**
- Full property details (name, address, phone)
- Room number and room type
- Check-in / check-out date and time
- Number of adults and children
- Booking source
- Special requests noted at booking
- Current balance / outstanding amount
- Quick links: Services, Billing, Complaints, Pre-Arrival Checklist

#### 7.2.4 Requirements

| ID | Requirement |
|----|-------------|
| RES-01 | All reservations linked to the guest's email/account must be visible across all Browns properties |
| RES-02 | Reservations must be fetched in real-time from the connected PMS |
| RES-03 | Guest cannot create a new reservation in Destinity vButler (reservations originate in the PMS / booking engine) |
| RES-04 | Status updates from the PMS (e.g., checked in, checked out) must reflect in the app within 5 minutes |
| RES-05 | Past reservations must be retained indefinitely for the guest's viewing |
| RES-06 | Cancelled reservations must be visible but all action buttons must be disabled |
| RES-07 | Switching between reservations must not require re-authentication |

---

### 7.3 Home Dashboard

#### 7.3.1 Overview
The Dashboard is the first screen a logged-in guest sees. It provides a contextual overview of the guest's most relevant active or upcoming reservation, with quick access to all key features.

#### 7.3.2 Dashboard Content

**Header:**
- Browns Hotels & Resorts logo
- Property name (currently active or next upcoming reservation)
- Guest name and avatar
- Notification bell (with badge)
- Dark/Light mode toggle

**Hero Section:**
- Property image / hero banner for active reservation property
- Welcome message: "Welcome back, [Guest First Name]"
- Active stay dates and countdown (e.g., "Check-in in 3 days" or "Day 2 of 4")

**Quick Actions Grid:**
- Services
- Dining
- Wellness
- My Bill
- Experiences
- Complaints
- Room Requests
- Explore

**Recent Activity Feed:**
- Latest service request statuses
- Recent billing charges
- Unread messages / notifications

**Upcoming Reservations Teaser:**
- If guest has multiple reservations, show a compact strip with other bookings and a "View All" link

#### 7.3.3 Requirements

| ID | Requirement |
|----|-------------|
| DASH-01 | Dashboard must default to the currently active (checked-in) reservation context |
| DASH-02 | If no active reservation, default to the next upcoming reservation |
| DASH-03 | If only past reservations exist, show a "No active stays" state with a prompt to make a new booking via the hotel website |
| DASH-04 | Quick action grid must be configurable per property by hotel staff content managers |
| DASH-05 | All quick actions must deep-link to their respective feature screens |

---

### 7.4 Pre-Arrival & Check-In

#### 7.4.1 Overview
For **Upcoming** reservations, guests can complete a pre-arrival checklist to prepare for their stay. This reduces check-in friction and allows hotel staff to prepare personalised experiences in advance.

#### 7.4.2 Pre-Arrival Checklist Items

| Item | Description |
|------|-------------|
| Personal Details | Confirm or update guest profile details |
| ID/Passport Upload | Upload identification document for early check-in processing |
| Estimated Arrival Time | Set expected arrival time so hotel can prepare |
| Special Requests | Dietary requirements, room preferences, accessibility needs, celebration setups |
| Advance Payment | Settle deposit or full balance before arrival |
| Terms & Conditions | Acknowledge hotel T&Cs and payment policy |

#### 7.4.3 Requirements

| ID | Requirement |
|----|-------------|
| PRE-01 | Pre-arrival checklist is only available for reservations in "Upcoming" state |
| PRE-02 | Completed checklist items must be marked with a visual tick/progress indicator |
| PRE-03 | Arrival time and special requests must sync to the PMS in real-time |
| PRE-04 | Guest can save and return to the checklist at any point before check-in date |
| PRE-05 | Hotel can configure which checklist items are mandatory vs. optional |

---

### 7.5 Hotel Services Catalog

#### 7.5.1 Overview
The Services Catalog is the central discovery hub for everything the hotel offers during a guest's active stay. Services are organised by category and are contextual to the **currently active reservation's property**.

#### 7.5.2 Service Categories

| Category | Example Services |
|----------|-----------------|
| **Dining & Bars** | Restaurant reservations, in-room dining, bar bookings, private dining |
| **Wellness & Spa** | Spa treatments, yoga, personal training, pool reservations |
| **Room Services** | Room setup, pillow menu, extra amenities request, baby cot |
| **Housekeeping** | Room makeup, laundry service, turndown service, DND management |
| **Transport** | Airport transfers, hotel shuttle, car hire, tuk-tuk booking |
| **Experiences** | Curated property experiences (safaris, cooking classes, cultural tours) |
| **Business Services** | Meeting room booking, printing, secretarial services |

#### 7.5.3 Service Request Flow

1. Guest browses catalog and selects a service.
2. Views service description, pricing, and availability.
3. Fills in request details (date, time, preferences, quantity).
4. Reviews and confirms the request.
5. Request submitted → PMS updated → WhatsApp notification sent to hotel internal group.
6. Guest sees request confirmation with reference number.
7. Guest can track status in **My Requests** feed.

#### 7.5.4 Requirements

| ID | Requirement |
|----|-------------|
| SVC-01 | Services catalog content must be managed per-property by hotel staff |
| SVC-02 | Each service must display name, description, price (if applicable), estimated delivery time |
| SVC-03 | All service requests must generate a reference number visible to the guest |
| SVC-04 | Service requests must be dispatched to both the connected PMS and the hotel's WhatsApp internal group |
| SVC-05 | Services not available for the current property must not be shown |
| SVC-06 | Paid services must integrate with the billing module; charges added to guest folio |
| SVC-07 | Guest must receive a push/in-app notification when their request status changes |
| SVC-08 | Service availability hours (e.g., in-room dining until 10pm) must be configurable per service |

---

### 7.6 Dining & Bars

#### 7.6.1 Overview
Guests can discover and book dining experiences within the property, including restaurants, bars, and in-room dining.

#### 7.6.2 Features

- **Restaurant Listing:** All hotel restaurants/bars with description, cuisine type, operating hours, photos.
- **Table Reservation:** Date, time, party size, seating preference, dietary notes.
- **In-Room Dining:** Browse menu, add items to cart, specify delivery time.
- **Bar Bookings:** Reserve seating for sundowners, themed evenings, private bar events.

#### 7.6.3 Requirements

| ID | Requirement |
|----|-------------|
| DIN-01 | Restaurant menus and availability are managed by hotel staff |
| DIN-02 | In-room dining orders add charges to the guest's active reservation folio |
| DIN-03 | Booking confirmations must be sent via in-app notification and optionally via email |
| DIN-04 | Guest must be able to modify or cancel a dining reservation up to 1 hour before the booking time (configurable per property) |

---

### 7.7 Wellness & Spa

#### 7.7.1 Overview
Guests can browse wellness offerings and book treatments, classes, and sessions.

#### 7.7.2 Features

- **Treatment Menu:** All spa treatments with descriptions, duration, price.
- **Booking Flow:** Select treatment → therapist preference (if applicable) → date and time → confirm.
- **Classes & Activities:** Yoga, fitness classes, meditation — with schedule and booking.
- **Wellness Packages:** Multi-session deals or couples' packages.

#### 7.7.3 Requirements

| ID | Requirement |
|----|-------------|
| WEL-01 | Wellness bookings must sync to the PMS and trigger WhatsApp notification |
| WEL-02 | Cancellation policy must be displayed before booking confirmation |
| WEL-03 | Charges for wellness bookings must be added to guest folio |

---

### 7.8 Housekeeping Services

#### 7.8.1 Overview
Guests can manage housekeeping without calling the front desk.

#### 7.8.2 Services

| Service | Description |
|---------|-------------|
| **Room Makeup Request** | Request full room cleaning at a specified time |
| **Turndown Service** | Evening turndown with time preference |
| **Do Not Disturb** | Toggle DND status (syncs to PMS / room management system) |
| **Extra Amenities** | Request extra towels, toiletries, pillows, hangers, etc. |
| **Laundry Service** | Submit laundry items with the price list and pickup time preference |
| **Ironing Service** | Request ironing with time preference |

#### 7.8.3 Laundry Sub-Feature

- Guest views the **laundry price list** (managed by hotel staff, per property).
- Selects items and quantities.
- Chooses pickup time and express/standard service.
- Submits request → PMS + WhatsApp notification.
- Tracks status: Picked Up → In Laundry → Ready → Delivered.

#### 7.8.4 Requirements

| ID | Requirement |
|----|-------------|
| HK-01 | All housekeeping requests must reach the property via PMS and WhatsApp |
| HK-02 | Laundry price list must be configurable per property by hotel staff |
| HK-03 | DND toggle must sync in real-time to the room management system |
| HK-04 | Guest must see a time slot selector for scheduled housekeeping requests |

---

### 7.9 Transport & Transfers

#### 7.9.1 Overview
Guests can arrange transportation to/from the hotel and for local travel.

#### 7.9.2 Services

- **Airport Transfer:** Arrival or departure transfer; vehicle type selection; flight details input.
- **Hotel Shuttle:** Schedule and book available hotel shuttle services.
- **Car Hire:** Browse and request self-drive or chauffeur options.
- **Local Transport:** Tuk-tuk, taxi, or private vehicle for local trips.

#### 7.9.3 Requirements

| ID | Requirement |
|----|-------------|
| TRN-01 | Transport requests must capture: date, time, pickup/drop-off location, number of passengers, vehicle type preference |
| TRN-02 | Transport request dispatched to PMS + WhatsApp |
| TRN-03 | Charges for transport must be added to guest folio or payable in-app |

---

### 7.10 Wake-Up Call

#### 7.10.1 Overview
Guests can schedule a wake-up call directly from the app, replacing the need to call the front desk.

#### 7.10.2 Features

- Select date and time for wake-up call.
- Option for recurring wake-up call (e.g., every day of the stay).
- Confirmation of scheduled wake-up call with reference.
- Cancel or modify existing wake-up call.

#### 7.10.3 Requirements

| ID | Requirement |
|----|-------------|
| WUC-01 | Wake-up call request dispatched to PMS and WhatsApp notification group |
| WUC-02 | Guest can set multiple wake-up calls for different days of the stay |
| WUC-03 | Wake-up call requests only available for active (checked-in) reservations |
| WUC-04 | Guest can cancel a wake-up call up to 30 minutes before the scheduled time |

---

### 7.11 Curated Experiences

#### 7.11.1 Overview
Each Browns property offers unique curated experiences — from safari drives to tea estate tours, cooking classes, and cultural immersions. These are added and managed by hotel staff per property.

#### 7.11.2 Features

- **Experience Cards:** Rich visual cards with hero image, title, description, duration, price, and availability.
- **Featured Experience:** Highlighted hero experience in a magazine-style layout.
- **Categories:** Filter by type (Adventure, Cultural, Culinary, Wellness, Romantic, Family).
- **Booking Flow:** Select date, number of guests, add-ons → confirm and pay.
- **Saved Experiences:** Guests can save experiences to a wishlist.

#### 7.11.3 Requirements

| ID | Requirement |
|----|-------------|
| EXP-01 | Experiences are property-specific and managed by hotel staff |
| EXP-02 | Experience content must include: name, description, duration, inclusions, pricing, booking cut-off, images |
| EXP-03 | Booked experiences add to guest folio or require in-app payment |
| EXP-04 | Booking dispatched to PMS + WhatsApp |
| EXP-05 | Experiences must show real-time availability (staff-managed slots) |
| EXP-06 | Guests can save/wishlist experiences for later |

---

### 7.12 Local Exploration

#### 7.12.1 Overview
The Local Exploration feature helps guests discover nearby places of interest — restaurants, attractions, nature spots, shopping — curated and recommended by the hotel.

#### 7.12.2 Features

- **Nearby:** Places close to the hotel with distance indicator.
- **Popular:** Top-rated places recommended by the hotel.
- **Saved:** Guest's saved/bookmarked places.
- **Place Cards:** Name, category, distance/travel time, description, hotel's recommendation note, map link.
- **Categories:** Food, Nature, Culture, Shopping, Adventure, Nightlife.

#### 7.12.3 Requirements

| ID | Requirement |
|----|-------------|
| LOC-01 | Local place content is managed per-property by hotel staff |
| LOC-02 | Guests can save/bookmark places |
| LOC-03 | Map links must open in the device's native map app (Google Maps / Apple Maps) |
| LOC-04 | Hotel can add a personal recommendation note per place |

---

### 7.13 Billing & Payments

#### 7.13.1 Overview
Guests can view, understand, and pay their hotel bill entirely through Destinity vButler. This is one of the most business-critical features of the app.

#### 7.13.2 Financial Hub (Invoice Summary)

- **Account Balance:** Current outstanding balance for the active reservation.
- **Charge Summary:** All charges grouped by category (Room, Dining, Wellness, Services, Extras).
- **Date Range Filter:** View charges for specific periods.
- **Download / Print:** Export invoice as PDF.
- **Search:** Search charges by description or date.

#### 7.13.3 Invoice Detail

- Line-by-line itemised charges.
- Date, description, quantity, unit price, and total for each charge.
- Tax breakdown.
- Running total.
- Print / Download PDF.

#### 7.13.4 Payment Flow

**In-Stay Payment:**
1. Guest views outstanding balance.
2. Taps "Pay Now."
3. Selects payment amount (full balance or partial).
4. Selects payment method (card, bank transfer, digital wallet).
5. Confirms payment → receipt generated → folio updated in PMS.

**Advance Payment (Pre-Arrival):**
1. Available for **Upcoming** reservations from the pre-arrival checklist.
2. Guest can pay a deposit or the full stay cost before arrival.
3. Payment reflected in the PMS against the reservation.

#### 7.13.5 Requirements

| ID | Requirement |
|----|-------------|
| PAY-01 | Billing data must be fetched in real-time from the connected PMS |
| PAY-02 | Guests can make full or partial payments in-app |
| PAY-03 | Advance payment must be supported for upcoming reservations |
| PAY-04 | Supported payment methods: Credit/Debit card, Digital wallets (configurable per property) |
| PAY-05 | All payments must trigger a PMS folio update and send a receipt to the guest's email |
| PAY-06 | Invoice PDF must include Browns Hotels & Resorts branding, property details, and all line items |
| PAY-07 | Payment gateway must be PCI-DSS compliant |
| PAY-08 | Currency must match the property's configured currency |
| PAY-09 | Guests can view billing across all reservations (per-reservation scope) |

---

### 7.14 Complaints & Feedback

#### 7.14.1 Overview
Guests can report issues and provide feedback at any point during their stay. Complaints have full lifecycle tracking visible to the guest — from submission through to resolution.

#### 7.14.2 Complaint Submission

**Form Fields:**
- Category (Room, Dining, Service, Facilities, Staff, Other)
- Subcategory (based on main category)
- Description (free text, up to 500 characters)
- Attachments (optional — photos/videos)
- Priority (Guest-selected: Normal / Urgent)

#### 7.14.3 Complaint Status Tracking

| Status | Description |
|--------|-------------|
| **Submitted** | Complaint received, reference number generated |
| **Acknowledged** | Hotel staff have seen and assigned the complaint |
| **In Progress** | Active resolution underway |
| **Resolved** | Issue resolved; resolution notes visible to guest |
| **Closed** | Guest confirmed resolution or auto-closed after 24h |

**Guest visibility:** Full status timeline with timestamps and staff resolution notes.

#### 7.14.4 Post-Stay Feedback

- Triggered after check-out (push notification + in-app prompt).
- 5-star rating per category: Room, Cleanliness, Service, Dining, Overall.
- Open-ended comments field.
- Ratings submitted to hotel management dashboard.

#### 7.14.5 Requirements

| ID | Requirement |
|----|-------------|
| COM-01 | Complaint submissions must reach hotel staff via PMS and WhatsApp internal group |
| COM-02 | Guest must receive a reference number for every complaint submitted |
| COM-03 | Guest must be able to track complaint status in real-time |
| COM-04 | Hotel staff resolution notes must be visible to the guest within the app |
| COM-05 | Post-stay feedback prompt must be sent within 1 hour of check-out |
| COM-06 | Guests can submit complaints for any active reservation |
| COM-07 | Feedback data must be stored and accessible for hotel management reporting |

---

### 7.15 Guest Profile & Settings

#### 7.15.1 Overview
Guests manage their personal information, preferences, and app settings from the Profile section.

#### 7.15.2 Profile Information

- Full Name
- Email Address (primary, read-only after verification)
- Phone Number (with country code)
- Nationality
- Date of Birth
- Profile Photo
- ID / Passport Number (optional, for express check-in)
- Dietary Preferences (vegetarian, vegan, halal, gluten-free, allergies)
- Bed Preferences (king, twin, etc.)
- Pillow Preferences
- Communication Preferences (email, in-app, WhatsApp)

#### 7.15.3 Settings

- **Language:** Select from English, Sinhala, Tamil, Arabic, German
- **Theme:** Light / Dark mode
- **Notifications:** Manage notification preferences per category
- **Password Change**
- **Linked Devices:** View and revoke active sessions
- **Delete Account**
- **Privacy Policy & Terms**
- **Help & Support**

#### 7.15.4 Requirements

| ID | Requirement |
|----|-------------|
| PRF-01 | Profile updates (name, phone, preferences) must sync to the PMS against the guest record |
| PRF-02 | Email address change requires re-verification via OTP |
| PRF-03 | Profile photo must be uploadable from device camera or gallery |
| PRF-04 | Guest preferences must be visible to hotel staff in the PMS for personalisation |
| PRF-05 | Account deletion must comply with data privacy regulations and erase all PII |

---

### 7.16 Notifications

#### 7.16.1 Overview
Destinity vButler delivers timely, relevant notifications to keep guests informed without overwhelming them.

#### 7.16.2 Notification Types

| Type | Trigger | Channel |
|------|---------|---------|
| Service request status update | Status changes on any request | In-app + Push |
| Complaint status update | Complaint progresses through workflow | In-app + Push |
| Billing alert | New charge added to folio | In-app |
| Check-in reminder | 24 hours before check-in date | Push + Email |
| Pre-arrival checklist incomplete | 48 hours before check-in, if checklist not done | Push + Email |
| Post-stay feedback prompt | 1 hour after check-out | Push + Email |
| Advance payment reminder | 7 days before check-in if balance outstanding | Push + Email |
| Promotional / Experience | Hotel staff sends property-specific offers | In-app (opt-in) |

#### 7.16.3 Requirements

| ID | Requirement |
|----|-------------|
| NOT-01 | Guests must be able to opt out of each notification category individually |
| NOT-02 | Promotional notifications require explicit opt-in |
| NOT-03 | Critical notifications (payment confirmation, complaint resolution) cannot be disabled |
| NOT-04 | Notification history must be accessible from the notification bell icon |

---

### 7.17 Language & Accessibility

#### 7.17.1 Language Support

| Language | Code | Notes |
|----------|------|-------|
| English | `en` | Default language |
| Sinhala | `si` | Full RTL/LTR support required for app text (LTR) |
| Tamil | `ta` | LTR |
| Arabic | `ar` | **RTL layout required** — full UI mirroring for Arabic |
| German | `de` | LTR |

- Language selector available as a **dropdown** accessible from the top navigation bar and from Settings.
- Language preference is saved to the guest's profile and persists across sessions and devices.
- All user-facing strings, labels, and system messages must be fully translated.
- **Arabic requires full RTL (Right-to-Left) layout support** — text alignment, navigation order, icon placement, and scrolling direction must mirror.

#### 7.17.2 Accessibility Requirements

| Requirement | Standard |
|-------------|---------|
| Colour contrast | WCAG 2.1 AA (minimum 4.5:1 for normal text) |
| Touch targets | Minimum 44×44px on mobile |
| Screen reader support | ARIA labels on all interactive elements |
| Keyboard navigation | Full keyboard navigation on desktop |
| Font scaling | App must remain usable at 150% browser font zoom |

---

## 8. Content Management (Two-Tier)

Destinity vButler uses a **two-tier content management model**. Content is owned at two levels: the **chain level** and the **property level**.

### 8.1 Chain Level (Browns Hotels & Resorts)

Managed centrally by the Browns chain team:

| Content | Description |
|---------|-------------|
| Brand Identity | Logo, primary colour (`#003c52`), typography, favicon |
| Chain-Wide Messaging | Welcome messages, app store descriptions, T&Cs |
| Feature Toggles | Enable/disable features across all properties |
| Chain-Level Promotions | Group-wide offers visible to all guests |
| PMS Integration Config | Global PMS settings applicable to all properties |
| Language Translations | Master translation strings for all 5 languages |

### 8.2 Property Level (e.g., Browns Hotel Newburge Ella)

Managed by each property's designated hotel staff:

| Content | Description |
|---------|-------------|
| Property Info | Hotel name, address, phone, facilities description |
| Hero Images / Gallery | Property photography used in the app |
| Service Catalog | All services available at this property (with prices, hours) |
| Curated Experiences | Unique experiences specific to this property |
| Local Exploration | Nearby places and hotel recommendations |
| Restaurant Menus | Dining menus and operating hours |
| Laundry Price List | Per-item laundry pricing |
| Staff WhatsApp Groups | Configure which WhatsApp group receives which notification type |
| Quick Action Grid | Configure which shortcuts appear on the guest dashboard |

---

## 9. Integrations

### 9.1 Property Management System (PMS)

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Reservation fetch | PMS → App | Pull all reservations for authenticated guest |
| Check-in / check-out status | PMS → App | Real-time reservation state updates |
| Guest profile sync | App ↔ PMS | Two-way sync of guest preferences and profile data |
| Service requests | App → PMS | All service requests logged as tasks/work orders in PMS |
| Billing & folio | PMS → App | Real-time charge data pulled from PMS folio |
| Payment posting | App → PMS | In-app payments posted back to PMS folio |
| DND / room status | App → PMS | Do Not Disturb and housekeeping request states |
| Complaint logging | App → PMS | Complaints created as guest feedback entries in PMS |
| Arrival time / special requests | App → PMS | Pre-arrival data synced to PMS reservation record |

### 9.2 WhatsApp Business API

| Trigger | Recipient | Message Content |
|---------|-----------|-----------------|
| Service request submitted | Property-specific WhatsApp group | Guest name, room number, service type, details, time |
| Housekeeping request | Housekeeping WhatsApp group | Guest name, room, request type, preferred time |
| Transport request | Transport/concierge group | Pickup details, destination, time, vehicle type |
| Complaint submitted | Duty manager group | Complaint reference, category, description, priority |
| Complaint escalated (Urgent) | GM / Senior duty manager group | Full complaint details with escalation flag |

- Each property configures **separate WhatsApp groups per department** (Housekeeping, F&B, Concierge, Front Desk, Management).
- Message routing is determined by request/complaint category.

### 9.3 Payment Gateway

- PCI-DSS Level 1 compliant payment gateway.
- Support for: Visa, Mastercard, AMEX, local digital wallets (configurable per property).
- Tokenised card storage for repeat guests (opt-in).
- Multi-currency support based on property configuration.

### 9.4 Email Service

- Transactional emails for: OTP, registration confirmation, payment receipts, feedback prompts, complaint acknowledgements.
- HTML branded templates with Browns Hotels & Resorts branding.

---

## 10. Technical Requirements

### 10.1 Architecture

| Requirement | Detail |
|-------------|--------|
| **App Type** | Progressive Web App (PWA) |
| **Offline Support** | Core navigation must work offline; data-dependent features show graceful error states |
| **Installable** | Must be installable to home screen on iOS (Safari) and Android (Chrome) via PWA manifest |
| **Performance** | Lighthouse performance score ≥ 85 on mobile; First Contentful Paint < 2s on 4G |
| **Security** | HTTPS only; JWT-based session management; all API calls authenticated |

### 10.2 Browser & Device Support

| Platform | Version Support |
|----------|----------------|
| iOS Safari | iOS 15+ |
| Android Chrome | Android 9+ |
| Chrome (Desktop) | Last 2 major versions |
| Firefox (Desktop) | Last 2 major versions |
| Safari (Desktop) | macOS 12+ |
| Edge (Desktop) | Last 2 major versions |

### 10.3 API Design

- RESTful API with JSON responses.
- API versioning from v1 (e.g., `/api/v1/reservations`).
- Rate limiting on all public endpoints.
- Webhooks from PMS for real-time reservation and folio updates.

---

## 11. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Availability** | 99.9% uptime SLA (excluding scheduled maintenance) |
| **Response Time** | API responses < 500ms for 95th percentile under normal load |
| **Scalability** | Must handle concurrent sessions from all active guests across all Browns properties |
| **Data Privacy** | Full compliance with applicable data protection regulations; no PII stored unnecessarily |
| **Security** | OWASP Top 10 mitigation; penetration testing before go-live; all data encrypted at rest and in transit |
| **PCI Compliance** | Payment flows must be PCI-DSS compliant; card data never stored on app servers |
| **Auditability** | All service requests, payments, and complaints must have immutable audit logs |
| **Backup** | Daily automated backups; recovery point objective (RPO) < 4 hours |

---

## 12. Out of Scope

The following are explicitly **not** in scope for Destinity vButler:

| Item | Reason |
|------|--------|
| Hotel staff / PMS portal | Destinity vButler is a guest-only consumer app; staff tools are separate systems |
| New reservation / booking engine | Reservations are made via the Browns website or third-party booking channels; Destinity vButler only manages existing reservations |
| Loyalty points & rewards programme | May be added in a future phase; current scope is reservation management |
| In-app chat / live messaging with staff | WhatsApp is the staff notification channel; guest-to-staff real-time chat is out of scope for v1 |
| Restaurant / spa booking for non-hotel guests | All services are scoped to guests with an active Browns reservation |
| Social features (sharing, reviews) | Guest shares their experience on external platforms; in-app social features not required |
| Native iOS / Android apps | The PWA covers the full mobile use case; no native app required |

---

## 13. Assumptions & Dependencies

| # | Assumption / Dependency |
|---|------------------------|
| A1 | Browns Hotels & Resorts operates a central PMS (or per-property PMS with a unified API layer) that exposes reservation, folio, and guest profile data via a documented API |
| A2 | Hotel staff will be responsible for content management (services, experiences, menus) through a separate CMS/admin portal — this PRD covers guest-facing features only |
| A3 | Each property will configure and maintain their own WhatsApp Business group structure before go-live |
| A4 | A PCI-DSS compliant payment gateway partner will be selected and integrated |
| A5 | Professional translations for Sinhala, Tamil, Arabic, and German will be provided by Browns or a contracted translation service |
| A6 | Arabic RTL support will require dedicated front-end development effort and a separate QA cycle |
| A7 | Guest accounts in Destinity vButler are linked to reservations via the email address used at booking |
| A8 | The Browns brand design system (colours, fonts, logo assets) will be provided in the correct formats for development use |

---

*Document Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
*Next Review: Prior to development kickoff*
