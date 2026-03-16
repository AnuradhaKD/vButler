# EPIC-02 — Authentication & Identity

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-02 |
| **Epic Name** | Authentication & Identity |
| **Product** | Destinity vButler Guest App |
| **Priority** | P0 — Must Have |
| **PRD Reference** | §7.1 Authentication |
| **Architecture Reference** | §6 Module Architecture (auth.service.js), §7 Routing (auth routes), §8 State Management |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

Every guest interaction in Destinity vButler is tied to a personal account. Without a secure, frictionless authentication system, guests cannot access their reservations, request services, or manage their stay. The login experience is also the guest's first impression of Destinity vButler — it must be polished, fast, and reassuring.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G4 — Centralise Guest Journey | One Browns account gives access to all reservations across all properties |
| G3 — Improve Guest Satisfaction | Smooth, passwordless-feeling OTP flow reduces login friction |
| G5 — Enable Data-Driven Hospitality | Authenticated identity links all in-app activity to a guest record |

---

## Scope

### In Scope
- Login screen (email + password)
- OTP verification screen (6-digit code, 10-minute expiry)
- Guest registration screen (new account creation)
- Forgot password / password reset flow
- Session persistence (30-day remember me via localStorage)
- Session expiry check on every page load
- Logout from any screen via Settings
- OTP simulation (console log / alert in Phase 1 — no real email delivery)
- `AuthService` module implementation
- Alpine.js auth store: `isLoggedIn`, `guest` object

### Out of Scope
- Social login (Google, Facebook, Apple) — explicitly excluded in PRD §AUTH-01
- Reservation number login — excluded in PRD §AUTH-01
- Real email delivery (requires backend — Phase 2)
- Biometric authentication (future phase)
- Real JWT token signing (mock session token in Phase 1)

---

## User Stories

### US-02.1 — Login Screen
**As a** returning guest,
**I want** to log in with my email and password,
**so that** I can access my reservations and stay services.

**Acceptance Criteria:**
- [ ] Split-panel layout on desktop: hero image/brand left, form right
- [ ] Full-screen card layout on mobile
- [ ] Form fields: Email Address, Password (with show/hide eye icon toggle)
- [ ] "Remember me" checkbox — when checked, session persists 30 days; unchecked, session ends on tab close
- [ ] "Forgot password?" text link navigates to `#/forgot-password`
- [ ] "New guest? Create account" link navigates to `#/register`
- [ ] On submit: validate email format and non-empty password client-side; show inline error if invalid
- [ ] On valid credentials (matched against `data/mock/guests.json`): navigate to `#/otp`
- [ ] On invalid credentials: show error toast "Incorrect email or password"
- [ ] Form submitting state: button shows spinner, disabled
- [ ] Browns logo + tagline visible in hero panel

**Story Points:** 3

---

### US-02.2 — OTP Verification
**As a** guest who has submitted login credentials,
**I want** to verify my identity with a one-time code sent to my email,
**so that** my account is protected even if my password is compromised.

**Acceptance Criteria:**
- [ ] 6 individual digit input boxes displayed in a row
- [ ] Auto-advance focus to next box on digit entry
- [ ] Backspace on an empty box moves focus to previous box
- [ ] Paste support: pasting a 6-digit string fills all boxes
- [ ] Countdown timer visible: "Expires in 9:45" — counts down from 10 minutes (Alpine.js interval)
- [ ] "Resend Code" button disabled until timer reaches 0:00; then becomes active
- [ ] On correct OTP (simulated: any 6-digit entry accepted in Phase 1): session written to `localStorage` (`vb:session`), navigate to `#/dashboard`
- [ ] On incorrect OTP: shake animation on boxes, increment error count
- [ ] After 3 failed attempts: show "Too many attempts. Please wait 5 minutes." lockout state (Alpine.js)
- [ ] "Back to login" link clears OTP state and returns to `#/login`
- [ ] OTP simulated value logged to browser console in Phase 1 with note: "⚠️ DEMO: OTP is 123456"

**Story Points:** 3

---

### US-02.3 — Guest Registration
**As a** new guest,
**I want** to create a Browns account,
**so that** I can link my reservations and access Destinity vButler services.

**Acceptance Criteria:**
- [ ] Same split-panel / mobile card layout as login
- [ ] Form fields: Full Name, Email Address, Phone Number (country code prefix selector), Password, Confirm Password
- [ ] Password strength indicator below password field: Weak (red) / Fair (amber) / Strong (green) — based on length and character mix
- [ ] Show/hide toggle on both password fields
- [ ] Client-side validation: all fields required; email format; passwords must match; password minimum 8 characters
- [ ] Terms & Conditions checkbox required with link to T&C text (modal or new page)
- [ ] On valid form submission: mock account created in `localStorage` (`vb:guests`), navigate to `#/otp` for email verification
- [ ] "Already have an account? Sign in" link navigates to `#/login`

**Story Points:** 3

---

### US-02.4 — Forgot Password
**As a** guest who has forgotten their password,
**I want** to receive a password reset link via email,
**so that** I can regain access to my account without contacting the hotel.

**Acceptance Criteria:**
- [ ] Centered card layout with lock icon at top
- [ ] Single email input field
- [ ] On submit: validate email format; show loading state on button
- [ ] Success state (Alpine.js toggle): icon changes to envelope, message "If an account exists for [email], a reset link has been sent."
- [ ] "Back to login" link on both the form and success states
- [ ] In Phase 1: simulate success for any valid email format (no real email sent); log to console

**Story Points:** 2

---

### US-02.5 — Session Management & Logout
**As a** guest,
**I want** my session to be remembered on my device,
**so that** I don't have to log in every time I open the app.

**Acceptance Criteria:**
- [ ] On login with "Remember me": write `vb:session` with `expiresAt = now + 30 days`
- [ ] On login without "Remember me": write `vb:session` with `expiresAt = now + 24 hours`
- [ ] On every page load: `AuthService.checkSession()` reads `vb:session`, compares `expiresAt` to `Date.now()`
- [ ] Expired session: clear `vb:session`, redirect to `#/login`
- [ ] Valid session: hydrate Alpine auth store (`isLoggedIn = true`, `guest = {...}`)
- [ ] Logout: available from Profile/Settings — clears `vb:session` from localStorage, resets Alpine auth store, redirects to `#/login`
- [ ] Logout confirmation modal: "Are you sure you want to log out?" with Cancel + Log Out buttons

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell & Router | Blocker | EPIC-01 |
| EPIC-01 StorageService | Blocker | EPIC-01 |
| EPIC-01 Toast component | Blocker | EPIC-01 |
| `data/mock/guests.json` | Data file required | — |
| EPIC-03 Reservations | Next — auth is gate to reservation load | EPIC-03 |

---

## Technical Notes

- `AuthService` (`js/core/auth.service.js`) handles all auth logic; pages only call service methods
- Session token in Phase 1: a random 32-char hex string generated on login, stored in `vb:session.token`
- OTP in Phase 1: randomly generated 6-digit number, stored temporarily in `sessionStorage` (not localStorage) and logged to console; cleared on successful verify or expiry
- `data/mock/guests.json` stores hashed passwords (SHA-256 via `SubtleCrypto` Web API) — never plaintext
- Password hashing: `await crypto.subtle.digest('SHA-256', encoder.encode(password))` — available in all modern browsers natively

---

## Definition of Done

- [ ] All 4 screens (Login, OTP, Register, Forgot Password) render correctly on mobile and desktop
- [ ] Login → OTP → Dashboard full flow works end-to-end
- [ ] Register → OTP → Dashboard full flow works end-to-end
- [ ] Session persistence works across browser tabs and page refreshes
- [ ] Expired session correctly redirects to login
- [ ] Logout clears all session data
- [ ] Form validation errors are clear and accessible (ARIA live regions)
- [ ] OTP lockout after 3 failed attempts works correctly
- [ ] No auth routes accessible when not logged in (router guard)
- [ ] All authenticated routes redirect to login if session is invalid

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
