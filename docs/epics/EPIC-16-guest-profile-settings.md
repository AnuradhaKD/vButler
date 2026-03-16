# EPIC-16 — Guest Profile & Settings

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-16 |
| **Epic Name** | Guest Profile & Settings |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.15 Guest Profile & Settings |
| **Architecture Reference** | §5.3 localStorage (vb:profile, vb:theme, vb:language), §6 Module Architecture (profile/) |
| **Status** | Ready for Development |
| **Estimated Effort** | 8 Story Points |

---

## Problem Statement

Guest preferences — dietary requirements, bed types, pillow preferences, communication channels — are the raw material of personalised hospitality. When a guest tells the hotel their preferences once, they should never need to repeat them across stays or properties. The profile is also where trust is built: guests who can see, update, and control their data feel respected rather than surveilled. Settings give guests ownership of their app experience.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G3 — Improve Guest Satisfaction | Preferences pre-loaded at every stay; personalisation improves with each visit |
| G5 — Enable Data-Driven Hospitality | Guest profile data powers operational prep (F&B, housekeeping, amenity selection) |
| G4 — Centralise Guest Journey | One profile that persists and applies across all Browns properties |

---

## Scope

### In Scope
- Guest profile screen (personal information + preferences)
- Profile photo upload
- Settings screen (language, theme, notifications, password, sessions, account deletion)
- Communication preferences
- Privacy policy and T&C links
- Help & Support section
- All profile data stored in `vb:profile` in localStorage

### Out of Scope
- Real PMS sync of profile changes (Phase 2)
- Loyalty points or rewards history
- Social media account linking
- Real biometric profile recognition

---

## User Stories

### US-16.1 — Guest Profile Screen
**As a** guest,
**I want** to see and update my personal information in one place,
**so that** the hotel always has accurate information about me.

**Acceptance Criteria:**
- [ ] Profile screen accessible from avatar tap in header or bottom nav → Profile
- [ ] Profile header: avatar circle (photo if uploaded, initials if not), guest full name, email, "Edit Profile" button
- [ ] Sections as collapsible cards:
  - **Personal Information**: Full Name (editable), Email (read-only, shows "Change Email" link), Phone Number, Nationality (dropdown), Date of Birth
  - **Stay Preferences**: Bed Preference (King / Twin / Double chips), Pillow Preference (Soft / Medium / Firm), Room preferences (High Floor, Quiet, etc. multi-select chips)
  - **Dietary Preferences**: multi-select chips (Vegetarian, Vegan, Halal, Gluten-Free, Nut Allergy, Dairy-Free)
  - **ID / Passport**: passport number field, upload zone for document (links to same upload as EPIC-05)
- [ ] "Save Changes" button at bottom — writes to `vb:profile` in localStorage
- [ ] Success toast on save: "Profile updated successfully"
- [ ] All fields pre-filled from `vb:profile` on load

**Story Points:** 3

---

### US-16.2 — Profile Photo Upload
**As a** guest,
**I want** to add a profile photo,
**so that** the app feels more personal and my avatar shows in the header.

**Acceptance Criteria:**
- [ ] Tapping avatar circle on profile page opens: Take Photo / Choose from Gallery / Remove Photo (bottom drawer)
- [ ] File input (`accept="image/*"`) used for gallery selection
- [ ] `capture="user"` attribute used for camera on mobile
- [ ] Uploaded photo converted to Base64, stored in `vb:profile.avatarBase64`
- [ ] Photo displayed immediately as avatar in the profile header and app header
- [ ] "Remove Photo" clears the Base64 and reverts to initials avatar
- [ ] File size limit: 3MB (error toast if exceeded)

**Story Points:** 1

---

### US-16.3 — Settings Screen
**As a** guest,
**I want** full control over my app experience,
**so that** I can customise it to my preferences and manage my account.

**Acceptance Criteria:**
- [ ] Settings accessible from Profile → Settings tab or gear icon
- [ ] Settings sections:
  - **Appearance**: Light / Dark / System theme selector (three radio options)
  - **Language**: dropdown selector (English, Sinhala, Tamil, Arabic, German) — triggers immediate language switch
  - **Notifications**: toggle per category (Service Updates, Billing Alerts, Promotions, Check-in Reminders) — stored in `vb:profile.notificationPrefs`
  - **Account**: Change Password link, Linked Devices, Delete Account link
  - **Legal**: Privacy Policy (external URL), Terms & Conditions (external URL)
  - **Help & Support**: Help Centre link, Contact Us (hotel support email), App Version display

**Story Points:** 2

---

### US-16.4 — Change Password
**As a** guest,
**I want** to change my password from within the app,
**so that** I can keep my account secure without contacting the hotel.

**Acceptance Criteria:**
- [ ] Change Password form: Current Password, New Password, Confirm New Password (all with show/hide)
- [ ] Validation: current password must match stored hash; new passwords must match; new password minimum 8 characters
- [ ] On success: toast "Password updated successfully"; stored hash updated in `localStorage`
- [ ] On wrong current password: inline error "Incorrect current password"

**Story Points:** 1

---

### US-16.5 — Account Deletion
**As a** guest,
**I want** to be able to delete my account and all my data,
**so that** I can trust Browns with my information knowing I can remove it at any time.

**Acceptance Criteria:**
- [ ] "Delete Account" link in Settings → Account section
- [ ] Confirmation modal (two-step): Step 1: "Are you sure? This will permanently delete your account and all data." [Cancel] [Continue]; Step 2: "Type DELETE to confirm" text input + [Cancel] [Delete Account]
- [ ] On confirmed deletion: clears ALL `vb:*` localStorage keys, redirects to `#/login`, shows toast "Your account has been deleted"
- [ ] Deletion also clears: session, profile, reservations, requests, complaints, notifications, wishlist, theme, language preferences

**Story Points:** 1

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell, FileUpload component, Modal, Toast | Blocker | EPIC-01 |
| EPIC-02 Authentication (password change requires current password verification) | Blocker | EPIC-02 |
| EPIC-17 Notifications (notification preferences managed here) | Soft link | EPIC-17 |
| EPIC-18 i18n (language switch triggers i18n service) | Soft link | EPIC-18 |

---

## Technical Notes

- Profile data write pattern: load `vb:profile`, merge changes, write back — never overwrite entire profile on partial edit
- Avatar Base64 stored as `vb:profile.avatarBase64`; separate key to avoid massive object on every read
- Account deletion: loop through all `vb:` prefixed keys via `Object.keys(localStorage).filter(k => k.startsWith('vb:'))` and remove each
- Language switch in settings: calls `I18nService.setLanguage(code)` immediately, updates Alpine `ui.language` store, all `data-i18n` and Alpine bindings re-render

---

## Definition of Done

- [ ] Profile screen loads all personal info and preferences from localStorage
- [ ] All editable fields save correctly on "Save Changes"
- [ ] Profile photo upload, display, and removal works on mobile and desktop
- [ ] Settings screen renders all 5 sections with working controls
- [ ] Theme selector changes theme immediately and persists
- [ ] Language selector triggers language switch immediately
- [ ] Change password validates and updates stored hash correctly
- [ ] Account deletion two-step confirmation clears all localStorage data
- [ ] Notification preference toggles persist correctly

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
