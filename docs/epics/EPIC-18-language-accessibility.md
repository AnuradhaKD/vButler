# EPIC-18 — Language & Accessibility

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-18 |
| **Epic Name** | Language & Accessibility |
| **Product** | Destinity vButler Guest App |
| **Priority** | P1 — Should Have |
| **PRD Reference** | §7.17 Language & Accessibility |
| **Architecture Reference** | §12 i18n Architecture, §14 Theming System, §6 i18n.service.js, §15 Security Considerations |
| **Status** | Ready for Development |
| **Estimated Effort** | 13 Story Points |

---

## Problem Statement

Browns Hotels & Resorts hosts guests from across the world — including Arabic-speaking guests from the Middle East, German Europeans, and local Sri Lankan guests who speak Sinhala and Tamil. An app that forces every guest to navigate in English is not an inclusive app — it's a barrier. RTL support for Arabic is not a cosmetic feature; it requires systematic architectural work from day one. Accessibility compliance (WCAG 2.1 AA) is both a legal and ethical obligation.

---

## Business Value

| Goal | How This Epic Delivers |
|------|----------------------|
| G3 — Improve Guest Satisfaction | Guests who can use Destinity vButler in their own language report significantly higher NPS scores |
| G4 — Centralise Guest Journey | Multi-language support removes the language barrier as a reason to default to in-person service |
| G2 — Increase Upsell Revenue | Guests who understand the dining and experience offerings in their language are more likely to book |

---

## Scope

### In Scope
- i18n service (`I18nService`) with JSON-based translation loading
- 5 language files: English (default), Sinhala, Tamil, Arabic, German
- Language selector (dropdown in Settings and in top navigation bar)
- Language preference persisted to `vb:language` in localStorage
- Full RTL layout support for Arabic (`dir="rtl"`, Tailwind RTL utilities)
- Translation key binding on all UI strings (`data-i18n` attribute + Alpine.js bindings)
- WCAG 2.1 AA compliance: colour contrast, touch targets, ARIA labels, keyboard navigation, font scaling
- Screen reader support (ARIA roles, live regions)

### Out of Scope
- Machine translation (all translations are professionally provided per PRD §A5)
- Content translation (hotel-managed JSON content like service descriptions — Phase 2 with CMS multilingual support)
- Right-to-left text rendering for Sinhala or Tamil (both are LTR)
- Translation management tool / CMS (files edited directly in Phase 1)

---

## User Stories

### US-18.1 — i18n Service & Translation Loading
**As a** developer,
**I want** a translation service that loads the correct language file and resolves all UI strings,
**so that** every text element in the app can be translated without modifying component code.

**Acceptance Criteria:**
- [ ] `I18nService.load(langCode)` fetches `/data/i18n/{code}.json` on demand; caches in memory
- [ ] `I18nService.t(key)` returns the translated string for the given dotted key (e.g., `auth.login.title`)
- [ ] Supports template variables: `t('dashboard.welcome', { name: 'Anuradha' })` returns "Welcome back, Anuradha"
- [ ] Fallback: if a key is missing in the current language, fall back to English (`en.json`) value
- [ ] On app boot: language loaded from `vb:language` (localStorage), or system `navigator.language` first match, or `en` default
- [ ] All static UI strings (labels, button text, error messages, placeholders, empty state text) bound to translation keys

**Story Points:** 3

---

### US-18.2 — Language Selector
**As a** guest,
**I want** to select my preferred language easily,
**so that** I can use the app comfortably in my native language from the very first screen.

**Acceptance Criteria:**
- [ ] Language selector available in two locations: Settings screen (EPIC-16) and the top navigation header (globe icon → dropdown)
- [ ] Languages shown with flag emoji, native script name, and English name:
  - 🇬🇧 English
  - 🇱🇰 සිංහල (Sinhala)
  - 🇱🇰 தமிழ் (Tamil)
  - 🇸🇦 العربية (Arabic)
  - 🇩🇪 Deutsch (German)
- [ ] On selection: `I18nService.setLanguage(code)` called → language JSON loaded → Alpine `ui.language` updated → all `data-i18n` attributes and Alpine `$t()` helper updated → page re-renders without full reload
- [ ] Selection saved to `vb:language` in localStorage
- [ ] Language selector available from login/register screens (before authentication)
- [ ] Selected language shown as active in the selector

**Story Points:** 2

---

### US-18.3 — Arabic RTL Layout
**As an** Arabic-speaking guest,
**I want** the app to display in a right-to-left layout when I select Arabic,
**so that** the app feels natural to read and use, not like a mirrored afterthought.

**Acceptance Criteria:**
- [ ] On selecting Arabic: `<html dir="rtl" lang="ar">` attribute set; `rtl` class added to `<body>`
- [ ] All layout direction reverses: flex rows reverse, margins/padding swap sides, text aligns right by default
- [ ] Navigation: bottom tab bar items order reverses (Profile → Bill → Services → Stays → Home from left to right in RTL)
- [ ] Icons with directional meaning (back arrow, chevrons, forward arrows) mirror horizontally
- [ ] Input fields: text aligned right, cursor starts right
- [ ] Tailwind RTL utilities (`rtl:flex-row-reverse`, `rtl:text-right`, `rtl:ml-*` → `rtl:mr-*`) used consistently throughout all page modules
- [ ] Back-to-LTR: switching to any non-Arabic language removes `dir="rtl"` and `rtl` class
- [ ] Forms, modals, drawers, cards, toasts: all tested and confirmed working in RTL

**Story Points:** 4

---

### US-18.4 — Translation File Structure
**As a** developer,
**I want** complete, well-structured translation JSON files for all 5 languages,
**so that** the app can be fully translated with no English fallbacks in production.

**Acceptance Criteria:**
- [ ] `en.json` contains ALL translation keys as the master reference
- [ ] Translation key structure mirrors the app's feature structure:
  ```
  nav, auth.login, auth.register, auth.otp, auth.forgotPassword,
  dashboard, reservations, preArrival, services, dining, wellness,
  housekeeping, transport, wakeUp, experiences, local, billing,
  complaints, profile, settings, notifications, common
  ```
- [ ] `common` namespace for shared strings: save, cancel, submit, confirm, back, loading, error, success, noResults, viewAll
- [ ] `si.json`, `ta.json`, `ar.json`, `de.json` have identical key structure to `en.json`
- [ ] Phase 1: `en.json` is complete and correct; other language files contain English placeholders (marked with a `// TODO: translate` comment in a companion doc) — professional translation to be provided by Browns (PRD §A5)

**Story Points:** 2

---

### US-18.5 — Accessibility Compliance (WCAG 2.1 AA)
**As a** guest with accessibility needs,
**I want** Destinity vButler to be usable regardless of how I interact with technology,
**so that** I'm not excluded from self-service because of my device usage method.

**Acceptance Criteria:**

**Colour Contrast:**
- [ ] All text on backgrounds meets WCAG 2.1 AA: minimum 4.5:1 for normal text, 3:1 for large text
- [ ] Brand colour `#003c52` on white `#ffffff`: contrast ratio verified ≥ 4.5:1
- [ ] Status badge colours (green, blue, orange, red, grey) all tested against their background

**Touch Targets:**
- [ ] All interactive elements (buttons, links, icons, form controls) have minimum 44×44px touch area
- [ ] Navigation tab items: minimum 48px height
- [ ] Star rating in feedback: each star clickable area ≥ 44×44px

**Screen Reader Support (ARIA):**
- [ ] All icon-only buttons have `aria-label` (e.g., bell button: `aria-label="Notifications (3 unread)"`)
- [ ] Form fields have associated `<label>` elements
- [ ] Error messages use `role="alert"` for screen reader announcement
- [ ] Status changes (e.g., DND toggle) announce via `aria-live="polite"` region
- [ ] Modal/drawer: `role="dialog"`, `aria-modal="true"`, focus trapped inside when open
- [ ] Navigation tabs use `role="tab"`, `aria-selected`

**Keyboard Navigation:**
- [ ] All interactive elements focusable via Tab key on desktop
- [ ] Focus order is logical (left-to-right, top-to-bottom in LTR; reversed in RTL)
- [ ] Visible focus ring on all focused elements (Tailwind `focus:ring-2 focus:ring-brand`)
- [ ] Modals: close on Escape key
- [ ] Dropdown/select: keyboard-operable

**Font Scaling:**
- [ ] App remains usable and readable at 150% browser font zoom (test in Chrome Settings → Fonts → 150%)
- [ ] No content cut off or overlapping at 150% zoom
- [ ] Use `rem`/`em` units for font sizes (Tailwind default), not `px`

**Story Points:** 2

---

## Dependencies

| Dependency | Type | Epic |
|------------|------|------|
| EPIC-01 App Shell (HTML `lang` attribute, `dir` attribute control) | Blocker | EPIC-01 |
| All epics (every UI string must use `data-i18n` or `$t()` bindings) | Cross-cutting | All epics |
| EPIC-16 Settings (language selector in settings screen) | Soft link | EPIC-16 |
| Professional translations from Browns brand team | External dependency | — |

---

## Technical Notes

- `I18nService.setLanguage(code)` updates `document.documentElement.lang`, sets `dir` attribute, adds/removes `rtl` class on `<body>`, saves to `vb:language`
- Alpine.js `$t(key, params)` magic helper: registered in `app.js` as `Alpine.magic('t', () => (key, params) => I18nService.t(key, params))`
- `data-i18n="auth.login.title"` attribute processed by a DOM observer (or initial render pass) that sets `element.textContent = I18nService.t(key)` — used for non-Alpine HTML elements
- Template variable interpolation: simple regex replace: `str.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? '')`
- RTL Tailwind config: `tailwind.config.theme.extend` does NOT need changes; Tailwind's built-in RTL variant (`rtl:`) is used throughout
- Accessibility audit tool: axe DevTools browser extension used during QA; Lighthouse accessibility score target ≥ 90

---

## Definition of Done

- [ ] `I18nService` loads correct language file and resolves all translation keys
- [ ] Language selector works from both header and Settings; switches language immediately without reload
- [ ] All 5 language codes selectable; preference persisted across sessions
- [ ] Selecting Arabic: `dir="rtl"` set, layout mirrors correctly across all pages
- [ ] Back arrows and directional icons mirror in Arabic
- [ ] `en.json` contains 100% of all UI string keys
- [ ] Colour contrast of all brand colours passes WCAG 2.1 AA (verified with tool)
- [ ] All icon buttons have `aria-label`; all form fields have `<label>`
- [ ] Modal focus trap and Escape key close work correctly
- [ ] Keyboard navigation works through all core flows (login, dashboard, service request)
- [ ] App usable at 150% browser font zoom with no layout breakage
- [ ] Lighthouse Accessibility score ≥ 90

---

*Epic Owner: Product — Browns Hotels & Resorts Digital*
*Last Updated: 2026-03-15*
