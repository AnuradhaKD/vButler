# Destinity vButler — Design System

**Product:** Destinity vButler Guest App
**Chain:** Browns Hotels & Resorts
**Version:** 1.0
**Date:** 2026-03-15
**Status:** Canonical Reference

> This document is the single source of truth for all visual and interaction design decisions in Destinity vButler. Every HTML page, component, and animation must conform to the patterns defined here. It is derived from direct analysis of the Destinity vButler redesign screens (`/Destinity vButler-redesign/`) and is aligned with the PRD (§6) and Architecture (`§2`, `§14`).

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Colour System](#2-colour-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Border Radius](#6-border-radius)
7. [Iconography](#7-iconography)
8. [Components](#8-components)
   - 8.1 Buttons
   - 8.2 Form Inputs
   - 8.3 Navigation — Sidebar (Desktop)
   - 8.4 Navigation — Bottom Tab Bar (Mobile)
   - 8.5 Top Header Bar
   - 8.6 Hero Banner
   - 8.7 Cards
   - 8.8 Status Badges
   - 8.9 Modals & Drawers
   - 8.10 Toast Notifications
   - 8.11 Progress Indicators
   - 8.12 Data Tables
   - 8.13 Avatar
   - 8.14 Empty States
   - 8.15 Loading States
9. [Patterns](#9-patterns)
   - 9.1 Glass Morphism
   - 9.2 Magazine Overlay
   - 9.3 Active Navigation State
   - 9.4 Category Filter Chips
   - 9.5 OTP Input
   - 9.6 Split-Panel Auth Layout
   - 9.7 Request Summary Panel
10. [Motion & Animation](#10-motion--animation)
11. [Responsive Breakpoints](#11-responsive-breakpoints)
12. [Dark Mode](#12-dark-mode)
13. [Accessibility](#13-accessibility)
14. [Tailwind Config (Canonical)](#14-tailwind-config-canonical)

---

## 1. Design Philosophy

Destinity vButler is a **luxury hospitality product**. The design must communicate calm authority, effortless elegance, and premium warmth — not clinical efficiency or startup minimalism.

### Four Design Principles

| Principle | Expression |
|-----------|-----------|
| **Calm Authority** | Deep teal `#003c52` as the single dominant colour. White space is generous. No visual noise. |
| **Editorial Luxury** | Playfair Display for hero text. Large, full-bleed imagery. Magazine-style content layouts. |
| **Invisible Clarity** | Every action is obvious without instruction. Labels are short. Hierarchy is unambiguous. |
| **Warm Precision** | Interactions feel responsive but unhurried. Transitions: 150–300ms. No abrupt jumps. |

---

## 2. Colour System

### 2.1 Brand Primitives

These are the exact values from the Tailwind config confirmed across all redesign screens.

```js
// Confirmed from: elevated_login_screen, elevated_guest_dashboard,
// elevated_service_catalog, all other screens
colors: {
  "primary":           "#003c52",   // Browns deep teal — the one brand colour
  "background-light":  "#f5f8f8",   // App background, light mode
  "background-dark":   "#0f1e23",   // App background, dark mode
}
```

### 2.2 Primary Scale (Opacity-Based)

The primary colour is used at multiple opacities as a complete tonal scale. Never invent new brand colours — use opacity steps.

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#003c52` at 100% | Primary buttons, active nav, logo, focus rings, badge borders |
| `primary/90` | `#003c52` at 90% | Hero image overlay bottom gradient |
| `primary/60` | `#003c52` at 60% | Glass button hover state |
| `primary/40` | `#003c52` at 40% | Ghost button default on dark hero |
| `primary/20` | `#003c52` at 20% | Avatar ring border, subtle card borders, nav active background base |
| `primary/10` | `#003c52` at 10% | Avatar fill, search bar background, nav active background |
| `primary/5` | `#003c52` at 5% | Lightest tint on inputs and chip backgrounds |

### 2.3 Neutral Scale (Tailwind Slate)

All text, borders, and neutral surfaces use Tailwind's `slate` palette — never `gray` or `zinc`.

| Token | Hex | Usage |
|-------|-----|-------|
| `slate-900` | `#0f172a` | Primary body text (light mode) |
| `slate-700` | `#334155` | Form labels, secondary headings |
| `slate-600` | `#475569` | Inactive nav items, helper text |
| `slate-500` | `#64748b` | Placeholder text, captions, timestamps |
| `slate-400` | `#94a3b8` | Input icons, disabled states |
| `slate-300` | `#cbd5e1` | Disabled input borders |
| `slate-200` | `#e2e8f0` | Default borders (light mode), dividers |
| `slate-100` | `#f1f5f9` | Hover backgrounds on white surfaces |
| `slate-50` | `#f8fafc` | Lightest hover state |

### 2.4 Semantic Colours

These are **not** custom tokens — use Tailwind's built-in palette for all semantic states.

| State | Colour | Tailwind Class Examples | Usage |
|-------|--------|------------------------|-------|
| **Success / Settled** | Green | `text-green-600`, `bg-green-50`, `border-green-200` | Paid status, resolved complaints, completed checklist |
| **Warning / Outstanding** | Amber | `text-amber-600`, `bg-amber-50`, `border-amber-200` | Pending payments, outstanding charges, in-progress requests |
| **Error / Urgent** | Red | `text-red-600`, `bg-red-50`, `border-red-200` | Form errors, urgent complaints, DND active, failed actions |
| **Info / Upcoming** | Blue | `text-blue-600`, `bg-blue-50`, `border-blue-200` | Upcoming reservation, acknowledged status, informational |
| **Neutral / Inactive** | Slate | `text-slate-500`, `bg-slate-100` | Cancelled reservations, past/closed states |

### 2.5 Surface Colours

| Surface | Light Mode | Dark Mode |
|---------|-----------|-----------|
| App background | `bg-background-light` (`#f5f8f8`) | `bg-background-dark` (`#0f1e23`) |
| Card / Panel | `bg-white` | `bg-slate-900` |
| Sidebar | `bg-white` | `bg-slate-900` |
| Sticky header | `bg-white/80` + `backdrop-blur-md` | `bg-slate-900/80` + `backdrop-blur-md` |
| Input field | `bg-white` | `bg-background-dark` |
| Hover on white | `bg-slate-50` | `bg-slate-800` |

---

## 3. Typography

### 3.1 Font Families

```html
<!-- Both fonts loaded via Google Fonts CDN in every page <head> -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

| Role | Font | Tailwind Class | When to Use |
|------|------|---------------|-------------|
| **UI / Body** | Inter | `font-sans` (default) | All UI text: labels, body, nav, buttons, forms |
| **Display / Editorial** | Playfair Display | `font-serif` | Hero headings, page section titles on service catalog, experience names, featured banners |

> **Rule:** Inter for everything functional. Playfair Display only where you want editorial gravitas — hero banners, magazine-style section headers, experience titles. Never use Playfair Display for labels, buttons, or form elements.

### 3.2 Type Scale

| Name | Size | Weight | Line Height | Tracking | Tailwind Classes | Usage |
|------|------|--------|-------------|----------|-----------------|-------|
| **Hero XL** | 60px / 3.75rem | 800 extrabold | 1.1 tight | `-0.025em` tight | `text-6xl font-extrabold tracking-tight` | Hero "Welcome Back" on dashboard |
| **Hero L** | 48px / 3rem | 700 bold | 1.1 | `-0.025em` | `text-5xl font-bold tracking-tight` (Playfair) | Experience feature titles, service catalog hero |
| **Display** | 36px / 2.25rem | 700 bold | 1.2 | `-0.01em` | `text-4xl font-bold` | Page section headers (Playfair) |
| **Heading 1** | 30px / 1.875rem | 700 bold | 1.3 | default | `text-3xl font-bold` | Page titles (e.g., "Pre-Arrival Checklist", "Billing Overview") |
| **Heading 2** | 24px / 1.5rem | 600 semibold | 1.4 | default | `text-2xl font-semibold` | Section headers within a page |
| **Heading 3** | 20px / 1.25rem | 600 semibold | 1.4 | default | `text-xl font-semibold` | Card titles, modal headers |
| **Heading 4** | 16px / 1rem | 600 semibold | 1.5 | default | `text-base font-semibold` | Sub-section labels |
| **Body** | 16px / 1rem | 400 regular | 1.6 | default | `text-base` | Main readable content |
| **Body Small** | 14px / 0.875rem | 400–500 | 1.5 | default | `text-sm` | Secondary text, descriptions, list items |
| **Caption** | 12px / 0.75rem | 400–500 | 1.4 | `+0.025em` | `text-xs` | Timestamps, meta info, helper text |
| **Label** | 14px / 0.875rem | 600 semibold | 1 | default | `text-sm font-semibold` | Form labels, data table column headers |
| **Overline** | 12px / 0.75rem | 700 bold | 1 | `+0.3em` widest | `text-xs font-bold uppercase tracking-widest` | Category pills on hero, section subtitles above headings |

### 3.3 Typography Rules

- **Line length:** Prose text max `max-w-xl` (36rem). Never full-width for readable copy.
- **Hierarchy:** Max 3 type sizes on any single screen.
- **White text on dark:** Always pair with a dark overlay (`from-primary/90`). Never raw white on image without overlay.
- **Italic Playfair:** Used selectively in hero sub-lines for editorial elegance (e.g., `<i class="font-normal">Azure Deep</i>`).

---

## 4. Spacing & Layout

### 4.1 Base Spacing Scale

Destinity vButler uses Tailwind's default 4px-based scale. Key values used across all screens:

| Token | px | rem | Common Usage |
|-------|----|-----|-------------|
| `1` | 4px | 0.25rem | Icon micro-gaps |
| `2` | 8px | 0.5rem | Icon-to-text gap in small components |
| `3` | 12px | 0.75rem | Button internal padding (y) |
| `4` | 16px | 1rem | Default component inner padding, card gaps |
| `6` | 24px | 1.5rem | Section internal spacing, nav item gap |
| `8` | 32px | 2rem | Page content padding (desktop) |
| `10` | 40px | 2.5rem | Section top margin |
| `12` | 48px | 3rem | Hero internal padding |
| `16` | 64px | 4rem | Large section spacing |

### 4.2 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Sticky Header (h-16 / h-20)                        │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │  Main Content                        │
│  w-72        │  flex-1 overflow-y-auto              │
│  (md: show)  │  p-4 md:p-8                          │
│              │  max-w-7xl mx-auto                   │
│              │                                      │
│              │  (some pages: lg:grid-cols-12        │
│              │   main: col-span-8                   │
│              │   aside: col-span-4)                 │
└──────────────┴──────────────────────────────────────┘
│  Bottom Nav (mobile only, fixed bottom)             │
└─────────────────────────────────────────────────────┘
```

- **Sidebar width:** `w-72` (288px) — desktop only (`md:flex`, `hidden` on mobile)
- **Content max-width:** `max-w-7xl` (1280px) centred with `mx-auto`
- **Content padding:** `p-4` mobile → `p-8` desktop (responsive with `md:p-8`)
- **Two-column pages** (service catalog, booking forms): `lg:grid lg:grid-cols-12 lg:gap-10` → content `lg:col-span-8` + sidebar `lg:col-span-4`
- **Section vertical rhythm:** `space-y-8` between major page sections

### 4.3 Component Internal Spacing

| Component | Padding |
|-----------|---------|
| Cards | `p-6` |
| Compact cards | `p-4` |
| Form sections | `space-y-6` between fields |
| Button (default) | `px-8 py-3` |
| Button (small) | `px-4 py-2.5` |
| Input | `px-4 py-3` (with icon: `pl-10 pr-4 py-3`) |
| Nav item | `px-4 py-3` |
| Hero content | `p-8 md:p-12` |

---

## 5. Elevation & Shadows

| Level | Tailwind Class | Usage |
|-------|---------------|-------|
| **0 — Flat** | `shadow-none` | Inline items, table rows, list items |
| **1 — Raised** | `shadow-sm` | Subtle card lift, input focus |
| **2 — Card** | `shadow-lg` | Standard cards, modals, dropdowns |
| **3 — Float** | `shadow-xl` | Drawers, popovers, booking panels |
| **4 — Hero** | `shadow-2xl` | Hero banner section, featured cards |
| **Branded** | `shadow-lg shadow-primary/20` | Primary CTA buttons only |

> **Rule:** Use elevation to express hierarchy, not decoration. A card should only shadow when it needs to lift off the page surface meaningfully.

---

## 6. Border Radius

Confirmed from Tailwind config across all screens:

```js
borderRadius: {
  "DEFAULT": "0.25rem",   // 4px  — subtle, form inputs
  "lg":      "0.5rem",    // 8px  — standard cards, nav items, standard buttons
  "xl":      "0.75rem",   // 12px — primary buttons, modal panels, larger cards
  "2xl":     "1rem",      // 16px — content section cards (Tailwind default)
  "3xl":     "1.5rem",    // 24px — hero banners (rounded-3xl in dashboard)
  "full":    "9999px",    // Pill — status badges, filter chips, avatar circles, pill buttons
}
```

| Element | Radius |
|---------|--------|
| Form inputs | `rounded-lg` (8px) |
| Standard buttons | `rounded-lg` (8px) |
| Primary CTA buttons | `rounded-xl` (12px) |
| Pill buttons (on hero) | `rounded-full` |
| Status badges / chips | `rounded-full` |
| Standard cards | `rounded-xl` (12px) |
| Large hero banners | `rounded-3xl` (24px) |
| Logo icon container | `rounded-lg` or `rounded-xl` |
| Avatar | `rounded-full` |
| Sidebar | Square (no radius — full height) |
| Search bar | `rounded-full` |

---

## 7. Iconography

### 7.1 Icon Set

**Google Material Symbols Outlined** — the only icon set used.

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

```html
<!-- Usage -->
<span class="material-symbols-outlined">hotel</span>
```

### 7.2 Icon Sizing

| Context | Size class | px |
|---------|-----------|-----|
| Inline body text icon | `text-base` | 16px |
| Form field prefix icon | `text-xl` | 20px |
| Navigation item icon | Default (24px) | 24px |
| Header action icon | Default (24px) | 24px |
| Card category icon | `text-2xl` | 28px |
| Hero / feature icon | `text-3xl` | 32px |
| Logo icon in brand container | `text-4xl` | 40px |

### 7.3 Icon Style Settings

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

- **Default:** `FILL 0` (outlined stroke style)
- **Active nav item:** Can use `FILL 1` to show filled version for selected state
- **Never use filled icons in non-active contexts**

### 7.4 Icon Colour Rules

| Context | Colour |
|---------|--------|
| Active nav icon | `text-primary` |
| Inactive nav icon | `text-slate-600 dark:text-slate-400` |
| Form field prefix icon | `text-slate-400` |
| Show/hide password icon | `text-slate-400 hover:text-primary` |
| Action buttons in cards | `text-primary` |
| White surface actions | `text-slate-600` |
| On dark/hero backgrounds | `text-white` |

### 7.5 Icon Reference

| Feature | Icon Name |
|---------|-----------|
| Dashboard / Home | `home` |
| Reservations / Stays | `hotel` |
| Services | `room_service` |
| Dining | `restaurant` |
| Wellness / Spa | `spa` |
| Housekeeping | `cleaning_services` |
| Laundry | `local_laundry_service` |
| Transport | `directions_car` |
| Airport | `flight` |
| Tuk-Tuk | `electric_rickshaw` |
| Wake-Up Call | `alarm` |
| Experiences | `hiking` |
| Local Explore | `explore` |
| Billing | `receipt_long` |
| Payment | `payment` |
| Complaints | `support_agent` |
| Notifications | `notifications` |
| Profile | `person` |
| Settings | `settings` |
| Language | `language` |
| Theme Toggle | `light_mode` / `dark_mode` |
| Search | `search` |
| Back | `arrow_back` |
| Close | `close` |
| Edit | `edit` |
| Delete | `delete` |
| Add | `add` |
| Check / Done | `check_circle` |
| Calendar | `calendar_month` |
| Clock / Time | `schedule` |
| Location | `location_on` |
| Upload | `upload` |
| Download | `download` |
| Chat | `chat_bubble` |
| Star / Rating | `star` |
| Favourite / Heart | `favorite` |
| Bookmark | `bookmark` |
| DND | `do_not_disturb_on` |
| Verified | `verified` |

---

## 8. Components

### 8.1 Buttons

#### Primary Button
The main call-to-action. Used once per form or flow section.

```html
<button class="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl
               shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
  <span>Sign In</span>
  <span class="material-symbols-outlined text-xl">login</span>
</button>
```

- Full-width in forms: add `w-full`
- Loading state: replace icon with spinner, add `cursor-not-allowed opacity-70 pointer-events-none`

#### Secondary / Outline Button
```html
<button class="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
               font-medium px-6 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800
               transition-colors flex items-center gap-2">
  Cancel
</button>
```

#### Ghost Button (on Hero / Dark Background)
```html
<button class="bg-primary/40 backdrop-blur-md text-white border border-white/30
               px-8 py-3 rounded-xl font-bold hover:bg-primary/60 transition-all">
  View Reservation
</button>
```

#### White Button (on Hero)
```html
<button class="bg-white text-primary px-8 py-3 rounded-xl font-bold
               hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg">
  <span class="material-symbols-outlined">explore</span>
  Explore Your Stay
</button>
```

#### Pill Button (Confirm / Booking)
```html
<button class="bg-white text-primary px-8 py-3 rounded-full font-bold
               uppercase tracking-wider text-sm hover:bg-primary hover:text-white transition-all">
  Book Private Session
</button>
```

#### Destructive Button
```html
<button class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl
               transition-colors">
  Delete Account
</button>
```

#### Button States Summary

| State | Classes to Add |
|-------|---------------|
| Loading | `opacity-70 cursor-not-allowed pointer-events-none` + swap content for spinner |
| Disabled | `opacity-40 cursor-not-allowed pointer-events-none` |
| Hover | Built into the hover: classes above |
| Focus | `focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none` |

---

### 8.2 Form Inputs

#### Text Input with Leading Icon
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">
    Email Address
  </label>
  <div class="relative">
    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                 text-slate-400 text-xl">mail</span>
    <input type="email"
           placeholder="name@company.com"
           class="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700
                  bg-white dark:bg-background-dark rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  outline-none transition-all
                  text-slate-900 dark:text-slate-100
                  placeholder:text-slate-400">
  </div>
</div>
```

#### Text Input — No Icon
```html
<input type="text"
       class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700
              bg-white dark:bg-background-dark rounded-lg
              focus:ring-2 focus:ring-primary focus:border-transparent
              outline-none transition-all text-slate-900 dark:text-slate-100">
```

#### Textarea
```html
<textarea rows="4"
          class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-background-dark rounded-lg
                 focus:ring-2 focus:ring-primary focus:border-transparent
                 outline-none transition-all resize-none
                 text-slate-900 dark:text-slate-100 placeholder:text-slate-400">
</textarea>
```

#### Select Dropdown
```html
<select class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700
               bg-white dark:bg-background-dark rounded-lg
               focus:ring-2 focus:ring-primary focus:border-transparent
               outline-none text-slate-900 dark:text-slate-100 appearance-none">
</select>
```

#### Checkbox
```html
<div class="flex items-center gap-2">
  <input type="checkbox" id="remember"
         class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary">
  <label for="remember" class="text-sm text-slate-600 dark:text-slate-400">
    Remember me
  </label>
</div>
```

#### Input States

| State | Border | Ring | Background |
|-------|--------|------|-----------|
| Default | `border-slate-200` | none | `bg-white` |
| Focus | `border-transparent` | `ring-2 ring-primary` | `bg-white` |
| Error | `border-red-400` | `ring-2 ring-red-200` | `bg-red-50` |
| Disabled | `border-slate-200` | none | `bg-slate-50 opacity-60` |
| Read-only | `border-slate-100` | none | `bg-slate-50` |

#### Form Section Spacing
```html
<form class="space-y-6">
  <!-- Field groups use space-y-6 -->
  <!-- Related field groups wrapped in a div -->
</form>
```

---

### 8.3 Navigation — Sidebar (Desktop)

```html
<aside class="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900
              border-r border-slate-200 dark:border-slate-800">

  <!-- Logo -->
  <div class="p-8 flex items-center gap-3">
    <div class="p-2 bg-primary rounded-lg text-white">
      <span class="material-symbols-outlined text-2xl">hotel</span>
    </div>
    <h1 class="text-xl font-bold tracking-tight text-primary uppercase">
      Browns Hotels
    </h1>
  </div>

  <!-- Nav Items -->
  <nav class="flex-1 px-4 space-y-2 mt-4">

    <!-- Active Item -->
    <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-lg
                       text-primary font-semibold active-nav">
      <span class="material-symbols-outlined">home</span>
      <span>Dashboard</span>
    </a>

    <!-- Inactive Item -->
    <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-lg
                       text-slate-600 dark:text-slate-400
                       hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <span class="material-symbols-outlined">hotel</span>
      <span>My Stays</span>
    </a>

  </nav>

  <!-- Bottom Settings -->
  <div class="p-6 border-t border-slate-200 dark:border-slate-800">
    <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-lg
                       text-slate-600 dark:text-slate-400
                       hover:bg-slate-50 transition-colors">
      <span class="material-symbols-outlined">settings</span>
      <span>Settings</span>
    </a>
  </div>

</aside>
```

#### Active Nav CSS (required in `<style>` block)
```css
.active-nav {
  background-color: rgba(0, 60, 82, 0.1);
  border-left: 4px solid #003c52;
}
```

---

### 8.4 Navigation — Bottom Tab Bar (Mobile)

```html
<nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900
            border-t border-slate-200 dark:border-slate-800
            flex md:hidden z-50 safe-b">

  <!-- Active Tab -->
  <a href="#/dashboard" class="flex-1 flex flex-col items-center py-2 pt-3 text-primary">
    <span class="material-symbols-outlined text-[22px]"
          style="font-variation-settings: 'FILL' 1">home</span>
    <span class="text-[10px] font-semibold mt-0.5">Home</span>
  </a>

  <!-- Inactive Tab -->
  <a href="#/reservations" class="flex-1 flex flex-col items-center py-2 pt-3 text-slate-400">
    <span class="material-symbols-outlined text-[22px]">hotel</span>
    <span class="text-[10px] font-medium mt-0.5">Stays</span>
  </a>

  <a href="#/services" class="flex-1 flex flex-col items-center py-2 pt-3 text-slate-400">
    <span class="material-symbols-outlined text-[22px]">room_service</span>
    <span class="text-[10px] font-medium mt-0.5">Services</span>
  </a>

  <a href="#/billing" class="flex-1 flex flex-col items-center py-2 pt-3 text-slate-400">
    <span class="material-symbols-outlined text-[22px]">receipt_long</span>
    <span class="text-[10px] font-medium mt-0.5">Bill</span>
  </a>

  <a href="#/profile" class="flex-1 flex flex-col items-center py-2 pt-3 text-slate-400">
    <span class="material-symbols-outlined text-[22px]">person</span>
    <span class="text-[10px] font-medium mt-0.5">Profile</span>
  </a>

</nav>
```
- Active tab: `text-primary` + filled icon (`FILL 1`)
- Inactive tab: `text-slate-400` + outlined icon (`FILL 0`)
- Always add `pb-20` to body content on mobile to clear the bar

---

### 8.5 Top Header Bar

```html
<header class="flex items-center justify-between px-8 py-4
               bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
               sticky top-0 z-10
               border-b border-slate-200 dark:border-slate-800">

  <!-- Left: Page title or breadcrumb -->
  <div class="flex items-center gap-4">
    <h2 class="text-lg font-medium text-slate-500 md:hidden uppercase tracking-widest">
      Browns
    </h2>
  </div>

  <!-- Right: Actions -->
  <div class="flex items-center gap-6">

    <!-- Notification Bell -->
    <button class="relative p-2 text-slate-600 dark:text-slate-400
                   hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
      <span class="material-symbols-outlined">notifications</span>
      <!-- Unread badge -->
      <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full
                   border-2 border-white dark:border-slate-900"></span>
    </button>

    <!-- Divider -->
    <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

    <!-- Guest Info + Avatar -->
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-bold">Mr. Sterling</p>
        <p class="text-xs text-slate-500">Elite Member</p>
      </div>
      <div class="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20
                  flex items-center justify-center overflow-hidden">
        <!-- Photo or initials -->
        <span class="text-sm font-bold text-primary">AK</span>
      </div>
    </div>

  </div>
</header>
```

---

### 8.6 Hero Banner

The hero banner is the signature visual element of every major screen.

```html
<section class="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl group">

  <!-- Background Image -->
  <img src="..." alt="..."
       class="absolute inset-0 w-full h-full object-cover
              transition-transform duration-1000 group-hover:scale-105">

  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t
              from-primary/90 via-primary/20 to-transparent z-10"></div>

  <!-- Content -->
  <div class="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full md:w-2/3">

    <!-- Overline Label -->
    <span class="inline-block px-4 py-1 bg-white/20 backdrop-blur-md text-white
                 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
      Current Stay
    </span>

    <!-- Headline (Playfair Display) -->
    <h1 class="font-serif text-4xl md:text-6xl font-bold text-white mb-4
               tracking-tight leading-tight">
      Welcome Back, <br>Mr. Sterling
    </h1>

    <!-- Sub-copy -->
    <p class="text-white/80 text-lg md:text-xl max-w-xl mb-8 font-light">
      Your private sanctuary is ready.
    </p>

    <!-- CTA Row -->
    <div class="flex flex-wrap gap-4">
      <button class="bg-white text-primary px-8 py-3 rounded-xl font-bold
                     hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg">
        <span class="material-symbols-outlined">explore</span>
        Explore Your Stay
      </button>
      <button class="bg-primary/40 backdrop-blur-md text-white border border-white/30
                     px-8 py-3 rounded-xl font-bold hover:bg-primary/60 transition-all">
        View Reservation
      </button>
    </div>

  </div>
</section>
```

**Hero height variants:**

| Context | Height |
|---------|--------|
| Main dashboard hero | `h-[450px]` |
| Service catalog hero | `h-[500px]` |
| Experience detail | Full-screen (`h-[60vh]`) |
| Room makeup / request page | `h-[300px]` |
| Compact section banner | `h-[200px]` |

---

### 8.7 Cards

#### Standard Content Card
```html
<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6
            border border-slate-100 dark:border-slate-800">
  <!-- content -->
</div>
```

#### Interactive / Hoverable Card
```html
<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6
            border border-slate-100 dark:border-slate-800
            hover:shadow-xl hover:-translate-y-0.5
            transition-all duration-200 cursor-pointer">
</div>
```

#### Image + Overlay Card (Experience / Place)
```html
<div class="relative rounded-xl overflow-hidden group cursor-pointer h-48">
  <img src="..." alt="..."
       class="w-full h-full object-cover transition-transform duration-500
              group-hover:scale-105">
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
  <div class="absolute bottom-0 left-0 p-4 text-white">
    <span class="text-xs font-bold uppercase tracking-widest text-white/70 mb-1 block">
      Category
    </span>
    <h3 class="font-semibold text-base leading-tight">Experience Title</h3>
  </div>
</div>
```

#### Reservation Card
```html
<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden
            border border-slate-100 dark:border-slate-800">
  <!-- Image strip -->
  <div class="h-32 bg-primary/10 relative overflow-hidden">
    <img src="..." class="w-full h-full object-cover">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"></div>
  </div>
  <!-- Content -->
  <div class="p-5">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="font-bold text-slate-900 dark:text-white">Browns Hotel Newburge Ella</h3>
        <p class="text-sm text-slate-500">Deluxe King · Room 205</p>
      </div>
      <!-- Status Badge -->
      <span class="px-3 py-1 rounded-full text-xs font-bold
                   bg-green-100 text-green-700 border border-green-200">
        Active
      </span>
    </div>
    <!-- Details row -->
    <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
      <span class="flex items-center gap-1">
        <span class="material-symbols-outlined text-base">calendar_month</span>
        Apr 5 – 8, 2026
      </span>
      <span class="flex items-center gap-1">
        <span class="material-symbols-outlined text-base">person</span>
        2 Guests
      </span>
    </div>
    <!-- CTA -->
    <button class="w-full bg-primary text-white font-bold py-2.5 rounded-lg
                   text-sm hover:bg-primary/90 transition-colors">
      Manage Stay
    </button>
  </div>
</div>
```

---

### 8.8 Status Badges

All badges use `rounded-full` pill shape. Always include both background tint and border for accessibility.

```html
<!-- Active / Success -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-green-100 text-green-700 border border-green-200">
  Active
</span>

<!-- Upcoming / Info -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-blue-100 text-blue-700 border border-blue-200">
  Upcoming
</span>

<!-- Outstanding / Warning -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-amber-100 text-amber-700 border border-amber-200">
  Outstanding
</span>

<!-- Urgent / Error -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-red-100 text-red-700 border border-red-200">
  Urgent
</span>

<!-- Checked Out / Neutral -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-slate-100 text-slate-600 border border-slate-200">
  Checked Out
</span>

<!-- Cancelled -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-slate-100 text-slate-400 border border-slate-200 line-through">
  Cancelled
</span>

<!-- Verified -->
<span class="px-3 py-1 rounded-full text-xs font-bold
             bg-primary/10 text-primary border border-primary/20
             flex items-center gap-1">
  <span class="material-symbols-outlined text-sm">verified</span>
  Verified
</span>
```

---

### 8.9 Modals & Drawers

#### Desktop Modal
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <!-- Panel -->
  <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl
              w-full max-w-lg max-h-[90vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between p-6
                border-b border-slate-200 dark:border-slate-800">
      <h2 class="text-xl font-bold">Modal Title</h2>
      <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <!-- Body -->
    <div class="p-6"><!-- content --></div>
    <!-- Footer -->
    <div class="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
      <button class="flex-1 border border-slate-200 py-3 rounded-xl font-semibold
                     hover:bg-slate-50 transition-colors">Cancel</button>
      <button class="flex-1 bg-primary text-white py-3 rounded-xl font-bold
                     hover:bg-primary/90 transition-colors">Confirm</button>
    </div>
  </div>
</div>
```

#### Mobile Bottom Drawer
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
  <!-- Drawer -->
  <div class="bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl w-full
              max-h-[90vh] overflow-y-auto">
    <!-- Drag handle -->
    <div class="flex justify-center pt-3 pb-2">
      <div class="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
    </div>
    <!-- Content -->
    <div class="p-6"><!-- content --></div>
  </div>
</div>
```

---

### 8.10 Toast Notifications

```html
<!-- Toast container: fixed top-right -->
<div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">

  <!-- Success Toast -->
  <div class="flex items-center gap-3 bg-white dark:bg-slate-800
              border border-green-200 dark:border-green-800
              rounded-xl shadow-xl px-5 py-4 min-w-[320px] pointer-events-auto
              animate-slide-in">
    <span class="material-symbols-outlined text-green-600 text-2xl flex-shrink-0">
      check_circle
    </span>
    <div>
      <p class="font-semibold text-slate-900 dark:text-white text-sm">Request Submitted</p>
      <p class="text-slate-500 text-xs mt-0.5">REF-20260405-0034 confirmed</p>
    </div>
    <button class="ml-auto text-slate-400 hover:text-slate-600 flex-shrink-0">
      <span class="material-symbols-outlined text-lg">close</span>
    </button>
  </div>

  <!-- Error Toast: border-red-200, text-red-600, icon: error -->
  <!-- Info Toast:  border-blue-200, text-blue-600, icon: info -->

</div>
```

```css
@keyframes slide-in {
  from { transform: translateX(calc(100% + 24px)); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.animate-slide-in { animation: slide-in 0.25s ease-out forwards; }
```

---

### 8.11 Progress Indicators

#### Linear Progress Bar
```html
<!-- From: check_in_checklist_redesign -->
<div class="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
  <div class="bg-primary h-full rounded-full transition-all duration-500"
       style="width: 65%">
  </div>
</div>
```

#### Step / Status Timeline (Vertical)
```html
<ol class="space-y-0">
  <!-- Completed Step -->
  <li class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-white text-sm">check</span>
      </div>
      <div class="w-0.5 flex-1 bg-primary/30 my-1"></div>
    </div>
    <div class="pb-6">
      <p class="font-semibold text-sm">Submitted</p>
      <p class="text-xs text-slate-500">Apr 5, 14:32</p>
    </div>
  </li>
  <!-- Current Step (Pulsing) -->
  <li class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center
                  flex-shrink-0 ring-4 ring-amber-200 animate-pulse">
        <span class="material-symbols-outlined text-white text-sm">schedule</span>
      </div>
      <div class="w-0.5 flex-1 bg-slate-200 my-1"></div>
    </div>
    <div class="pb-6">
      <p class="font-semibold text-sm text-amber-600">In Progress</p>
      <p class="text-xs text-slate-500">Staff assigned</p>
    </div>
  </li>
  <!-- Future Step -->
  <li class="flex gap-4">
    <div class="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center
                justify-center flex-shrink-0">
      <span class="material-symbols-outlined text-slate-400 text-sm">check</span>
    </div>
    <div class="pb-6">
      <p class="font-semibold text-sm text-slate-400">Resolved</p>
    </div>
  </li>
</ol>
```

---

### 8.12 Data Tables

```html
<!-- From: invoice_summary_redesign -->
<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden
            border border-slate-200 dark:border-slate-800">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-slate-200 dark:border-slate-800">
        <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest
                   text-slate-500">Invoice / Reservation</th>
        <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest
                   text-slate-500">Date</th>
        <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest
                   text-slate-500">Status</th>
        <th class="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest
                   text-slate-500">Amount</th>
        <th class="px-6 py-4"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4">
          <p class="font-semibold text-slate-900 dark:text-white">INV-8821</p>
          <p class="text-xs text-slate-500">Oceanfront Deluxe Suite</p>
        </td>
        <td class="px-6 py-4 text-slate-600 dark:text-slate-400">Oct 24, 2023</td>
        <td class="px-6 py-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold
                       bg-amber-100 text-amber-700 border border-amber-200">
            Outstanding
          </span>
        </td>
        <td class="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
          LKR 12,400.00
        </td>
        <td class="px-6 py-4 text-right">
          <button class="flex items-center gap-1 text-primary hover:underline text-sm font-medium">
            <span class="material-symbols-outlined text-base">download</span>
            Download
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 8.13 Avatar

```html
<!-- With photo -->
<div class="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20
            overflow-hidden flex-shrink-0">
  <img src="..." alt="Guest name" class="w-full h-full object-cover">
</div>

<!-- Initials fallback -->
<div class="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20
            flex items-center justify-center flex-shrink-0">
  <span class="text-sm font-bold text-primary">AK</span>
</div>

<!-- Large profile avatar (profile page) -->
<div class="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20
            flex items-center justify-center overflow-hidden">
  <span class="text-3xl font-bold text-primary">AK</span>
</div>
```

---

### 8.14 Empty States

```html
<div class="flex flex-col items-center justify-center py-20 px-8 text-center">
  <div class="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
    <span class="material-symbols-outlined text-primary/30 text-5xl">hotel</span>
  </div>
  <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
    No Active Stays
  </h3>
  <p class="text-slate-500 max-w-xs mb-8">
    You don't have any active reservations. Book your next Browns experience.
  </p>
  <a href="#" class="bg-primary text-white font-bold px-8 py-3 rounded-xl
                     hover:bg-primary/90 transition-colors">
    Book a Stay
  </a>
</div>
```

---

### 8.15 Loading States

```html
<!-- Inline Spinner -->
<svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
</svg>

<!-- Skeleton Card -->
<div class="bg-white dark:bg-slate-900 rounded-xl p-6 animate-pulse">
  <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
  <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
  <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
</div>

<!-- Full-Screen Processing Overlay -->
<div class="fixed inset-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm
            z-50 flex flex-col items-center justify-center gap-4">
  <svg class="animate-spin h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
  <p class="text-primary font-semibold">Processing your payment...</p>
</div>
```

---

## 9. Patterns

### 9.1 Glass Morphism

Used on the sticky top navigation in the service catalog and on hero overlay buttons.

```css
.glass-nav {
  backdrop-filter: blur(12px);
  background-color: rgba(245, 248, 248, 0.8); /* background-light at 80% */
}
```

```html
<!-- Tailwind equivalent -->
<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
```

---

### 9.2 Magazine Overlay

The signature full-bleed editorial hero with tonal gradient. From service catalog hero screen.

```css
.magazine-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 60, 82, 0.9) 0%,
    rgba(0, 60, 82, 0.4) 40%,
    rgba(0, 0, 0, 0) 100%
  );
}
```

Usage: Place as `<div class="absolute inset-0 magazine-overlay">` over hero images.

---

### 9.3 Active Navigation State

```css
.active-nav {
  background-color: rgba(0, 60, 82, 0.1);  /* primary/10 */
  border-left: 4px solid #003c52;           /* primary */
}
```

- Left border accent is the key differentiator from a hovered inactive item
- Active text: `text-primary font-semibold`
- Active icon: `FILL 1`

---

### 9.4 Category Filter Chips

Used in: Services Catalog, Experiences, Local Exploration, Laundry.

```html
<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

  <!-- Active chip -->
  <button class="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold
                 bg-primary text-white shadow-sm shadow-primary/20">
    All
  </button>

  <!-- Inactive chip -->
  <button class="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium
                 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                 border border-slate-200 dark:border-slate-700
                 hover:border-primary/30 hover:text-primary transition-colors">
    Housekeeping
  </button>

</div>
```

---

### 9.5 OTP Input

6-digit, individual boxes, auto-advance on input.

```html
<!-- From: elevated_otp_verification -->
<div class="flex gap-3 justify-center">
  <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]"
         class="w-12 h-14 text-center text-xl font-bold
                border-2 border-slate-200 dark:border-slate-700
                bg-white dark:bg-background-dark rounded-xl
                focus:ring-2 focus:ring-primary focus:border-primary
                outline-none transition-all
                text-slate-900 dark:text-slate-100">
  <!-- × 6 -->
</div>
```

---

### 9.6 Split-Panel Auth Layout

```html
<!-- Confirmed from: elevated_login_screen -->
<div class="flex min-h-screen">

  <!-- Left Panel: Image (desktop only) -->
  <div class="hidden lg:block lg:w-1/2 relative">
    <div class="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
    <div class="h-full w-full bg-cover bg-center"
         style="background-image: url('...')"></div>
    <div class="absolute bottom-12 left-12 right-12 text-white">
      <h2 class="text-4xl font-bold mb-4">Unparalleled Luxury</h2>
      <p class="text-lg opacity-90 max-w-md">
        Welcome back to your private gateway.
      </p>
    </div>
  </div>

  <!-- Right Panel: Form -->
  <div class="w-full lg:w-1/2 flex items-center justify-center p-8
              bg-white dark:bg-background-dark">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-10">
        <div class="bg-primary p-3 rounded-xl mb-6">
          <span class="material-symbols-outlined text-white text-4xl">hotel</span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Guest Portal
        </h1>
        <p class="text-slate-500 mt-2">Please enter your details to sign in</p>
      </div>
      <!-- Form content -->
    </div>
  </div>

</div>
```

---

### 9.7 Request Summary Side Panel

Used in booking forms (laundry, transport, room service). A sticky summary panel on desktop, collapsed accordion on mobile.

```html
<!-- From: laundry_service_redesign, transport_request_redesign -->
<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6
            border border-slate-100 dark:border-slate-800
            lg:sticky lg:top-24">
  <h3 class="font-bold text-base mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined text-primary">receipt_long</span>
    Request Summary
  </h3>
  <div class="space-y-3 text-sm">
    <div class="flex justify-between">
      <span class="text-slate-500">Service</span>
      <span class="font-medium">Room Makeup</span>
    </div>
    <div class="flex justify-between">
      <span class="text-slate-500">Room</span>
      <span class="font-medium">Suite 412</span>
    </div>
    <div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3
                flex justify-between font-bold text-base">
      <span>Total</span>
      <span class="text-primary">Complimentary</span>
    </div>
  </div>
  <button class="w-full bg-primary text-white font-bold py-3 rounded-xl mt-6
                 hover:bg-primary/90 transition-colors">
    Confirm Request
  </button>
</div>
```

---

## 10. Motion & Animation

All transitions in Destinity vButler are **calm and deliberate** — luxury brands don't rush.

| Type | Duration | Easing | Tailwind |
|------|----------|--------|---------|
| Colour / background transitions | 150ms | ease | `transition-colors duration-150` |
| Transform (hover lift, scale) | 200ms | ease | `transition-all duration-200` |
| Page fade in | 250ms | ease-out | CSS `@keyframes fade-in` |
| Hero image zoom (on hover) | 1000ms | ease | `transition-transform duration-1000` |
| Drawer / Modal slide in | 300ms | cubic-bezier(0.32, 0.72, 0, 1) | CSS `@keyframes slide-up` |
| Toast slide in | 250ms | ease-out | CSS `@keyframes slide-in` |
| Progress bar fill | 500ms | ease | `transition-all duration-500` |
| Skeleton pulse | Infinite | ease-in-out | `animate-pulse` (Tailwind) |
| Spinner | Infinite | linear | `animate-spin` (Tailwind) |
| Pulsing status indicator | Infinite | ease-in-out | `animate-pulse` with `ring` |

```css
/* Page fade-in — apply to main content wrapper on load */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: fade-in 0.25s ease-out forwards; }

/* Bottom drawer slide up */
@keyframes slide-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.drawer-enter { animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }

/* Toast slide in from right */
@keyframes slide-in-right {
  from { transform: translateX(calc(100% + 24px)); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.toast-enter { animation: slide-in-right 0.25s ease-out forwards; }
```

### Hover Micro-interactions

```html
<!-- Card hover: subtle lift -->
class="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"

<!-- Hero image zoom on card hover -->
class="group"  <!-- on container -->
class="transition-transform duration-700 group-hover:scale-105"  <!-- on img -->

<!-- Button tap feedback -->
class="active:scale-95 transition-transform duration-100"

<!-- Quick Action tile tap -->
class="active:scale-[0.95] transition-transform duration-100"
```

---

## 11. Responsive Breakpoints

| Name | Min Width | Layout Mode |
|------|-----------|-------------|
| Mobile | `< 768px` | Single column, bottom tab nav, full-width cards, stack all |
| Tablet (`md`) | `768px` | Sidebar begins to appear, two-column layouts emerge |
| Desktop (`lg`) | `1024px` | Full sidebar nav (`w-72`), multi-column grid, wide content |
| Wide (`xl`) | `1280px` | `max-w-7xl` content cap reached |

### Key Responsive Patterns

```html
<!-- Navigation: sidebar desktop / bottom tab mobile -->
<aside class="hidden md:flex ...">     <!-- sidebar -->
<nav class="flex md:hidden fixed bottom-0 ...">  <!-- bottom tab -->

<!-- Hero height: taller on desktop -->
<section class="h-[300px] md:h-[450px] ...">

<!-- Text size: scale up on desktop -->
<h1 class="text-4xl md:text-6xl ...">

<!-- Padding: comfortable on desktop -->
<div class="p-4 md:p-8 ...">

<!-- Columns: stack on mobile, side-by-side on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Two-panel booking layout: stack → side-by-side -->
<div class="lg:grid lg:grid-cols-12 lg:gap-10">
  <main class="lg:col-span-8">...</main>
  <aside class="lg:col-span-4 lg:sticky lg:top-24">...</aside>
</div>

<!-- Auth panels: hide image panel on mobile -->
<div class="hidden lg:block lg:w-1/2 ...">  <!-- image panel -->
<div class="w-full lg:w-1/2 ...">           <!-- form panel -->
```

---

## 12. Dark Mode

Dark mode uses Tailwind's `class` strategy — toggled by adding `dark` to `<html>`.

### Colour Mapping

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| App background | `bg-background-light` (#f5f8f8) | `bg-background-dark` (#0f1e23) |
| Card background | `bg-white` | `dark:bg-slate-900` |
| Sidebar | `bg-white` | `dark:bg-slate-900` |
| Sticky header | `bg-white/80` | `dark:bg-slate-900/80` |
| Primary text | `text-slate-900` | `dark:text-slate-100` |
| Secondary text | `text-slate-600` | `dark:text-slate-400` |
| Borders | `border-slate-200` | `dark:border-slate-800` |
| Input background | `bg-white` | `dark:bg-background-dark` |
| Input border | `border-slate-200` | `dark:border-slate-700` |
| Hover on surface | `hover:bg-slate-50` | `dark:hover:bg-slate-800` |
| Dividers | `bg-slate-200` | `dark:bg-slate-700` |
| Skeleton | `bg-slate-200` | `dark:bg-slate-700` |

### Dark Mode Toggle

```js
// ThemeService — js/core/theme.service.js
function setTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('vb:theme', mode);
}

// On app boot
const saved = localStorage.getItem('vb:theme');
const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setTheme(saved || preferred);
```

---

## 13. Accessibility

All components must meet **WCAG 2.1 AA**. Non-negotiable requirements:

### Colour Contrast

| Pair | Ratio | Pass? |
|------|-------|-------|
| `#003c52` on `#ffffff` | 9.5:1 | ✅ AAA |
| `#003c52` on `#f5f8f8` | 8.9:1 | ✅ AAA |
| White on `#003c52` | 9.5:1 | ✅ AAA |
| `slate-600` (#475569) on white | 5.9:1 | ✅ AA |
| `slate-500` (#64748b) on white | 4.6:1 | ✅ AA |
| `slate-400` (#94a3b8) on white | 2.9:1 | ❌ (use only for icons/decorative) |

### Touch Targets
- All tappable elements: **minimum 44×44px**
- Bottom nav tabs: `py-2 pt-3` = ~48px height
- Buttons: default `py-3` = 48px height ✅

### Focus Rings
```html
<!-- All interactive elements must show focus ring -->
class="focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none"
```

### ARIA Requirements

```html
<!-- Icon-only buttons -->
<button aria-label="Notifications (3 unread)">
  <span class="material-symbols-outlined">notifications</span>
</button>

<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

<!-- Status changes (DND toggle) -->
<div aria-live="polite" aria-atomic="true">
  DND is now active
</div>

<!-- Error messages -->
<p role="alert" class="text-red-600 text-sm mt-1">
  Incorrect email or password
</p>

<!-- Form fields -->
<label for="email" class="text-sm font-semibold">Email Address</label>
<input id="email" type="email" ...>
```

---

## 14. Tailwind Config (Canonical)

This is the exact, locked Tailwind config for all Destinity vButler HTML pages. Do not deviate.

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary":           "#003c52",
          "background-light":  "#f5f8f8",
          "background-dark":   "#0f1e23",
        },
        fontFamily: {
          "sans":    ["Inter", "sans-serif"],
          "display": ["Inter", "sans-serif"],
          "serif":   ["Playfair Display", "serif"],
        },
        borderRadius: {
          "DEFAULT": "0.25rem",
          "lg":      "0.5rem",
          "xl":      "0.75rem",
          "full":    "9999px",
        },
      },
    },
  }
</script>
```

### Required `<style>` Block (every page)

```html
<style>
  body { font-family: 'Inter', sans-serif; }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  /* Active nav sidebar item */
  .active-nav {
    background-color: rgba(0, 60, 82, 0.1);
    border-left: 4px solid #003c52;
  }

  /* Editorial hero overlay */
  .magazine-overlay {
    background: linear-gradient(
      to top,
      rgba(0, 60, 82, 0.9) 0%,
      rgba(0, 60, 82, 0.4) 40%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  /* Glass morphism nav */
  .glass-nav {
    backdrop-filter: blur(12px);
    background-color: rgba(245, 248, 248, 0.8);
  }

  /* Scrollbar hide for horizontal scroll chips */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  /* Page enter animation */
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-enter { animation: fade-in 0.25s ease-out forwards; }

  /* Drawer slide-up */
  @keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  .drawer-enter { animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }

  /* Toast slide-in */
  @keyframes slide-in-right {
    from { transform: translateX(calc(100% + 24px)); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  .toast-enter { animation: slide-in-right 0.25s ease-out forwards; }
</style>
```

### Required Google Fonts (every page `<head>`)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

---

*Document Owner: Design — Browns Hotels & Resorts Digital*
*Source: Analysis of /Destinity vButler-redesign/ (33 screens), PRD §6, Architecture §2 §14*
*Last Updated: 2026-03-15*
*Next Review: Before first HTML implementation sprint*
