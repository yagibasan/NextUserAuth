# Design Guidelines for Back4App Authentication Application

## Design Approach
**Foundation:** Design System with Modern SaaS Polish - utility-first with emphasis on clarity, accessibility, and efficiency.

**Core Principles:**
- Clarity over decoration
- Systematic consistency across auth flows
- Responsive efficiency
- Equal polish in light/dark modes

---

## Typography

**Fonts:**
- Primary: Inter (UI, forms, body)
- Monospace: JetBrains Mono (IDs, API keys)

**Scale:**
- Hero: `text-4xl md:text-5xl font-bold`
- Headings: `text-2xl md:text-3xl font-semibold`
- Component Titles: `text-xl font-semibold`
- Body: `text-base font-normal leading-relaxed`
- Labels: `text-sm font-medium`
- Captions: `text-xs font-normal`

**Line Heights:** `leading-tight` (headings), `leading-relaxed` (body), `leading-normal` (forms)

---

## Layout & Spacing

**Spacing Scale:** 2, 4, 6, 8, 12, 16, 24 (Tailwind units)
- Micro: 2, 4 | Component padding: 6, 8 | Sections: 12, 16, 24

**Containers:**
- Auth forms: `max-w-md mx-auto`
- Dashboard: `max-w-7xl mx-auto`
- Admin panels: `max-w-6xl mx-auto`
- Text content: `max-w-prose`

**Grids:**
- User cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Dashboard stats: `grid-cols-2 md:grid-cols-4 gap-4`
- Forms: Single column, `max-w-md`

**Breakpoints:**
- Mobile: <768px | Tablet: 768-1024px | Desktop: >1024px

---

## Page Layouts

### Landing Page
- **Hero:** 60vh, centered `max-w-4xl`, `text-5xl md:text-6xl font-bold` headline, dual CTAs with `backdrop-blur-sm`
- **Features:** 3-column grid, 48px icons (lock, shield, user-group)
- **How It Works:** 3-step numbered cards
- **Footer:** Links, social, copyright

### Auth Pages (Login/Signup/Reset)
- Centered card: `max-w-md p-8 md:p-12 rounded-xl`
- Logo: `mb-8`
- Title: `text-3xl font-bold mb-2`
- Form fields: `space-y-6`
- Submit: Full width, `mt-8`
- Footer links: `mt-6 text-center`

### Email Verification
- Card: `max-w-lg`, centered icon (128px), message, resend button (secondary style)

### Dashboard/Profile
- **Sidebar:** `w-64` fixed (desktop), drawer (mobile), nav items `h-12 px-4 rounded-lg`
- **Content:** `ml-64` (desktop), `p-8 md:p-12`
- **Stats cards:** `grid-cols-2 md:grid-cols-4 h-32 p-6`
- **Activity list:** Items `h-16` with avatar, text, timestamp

### User Management/Admin
- **Table:** Sticky header `backdrop-blur-sm`, rows `h-16`, horizontal scroll (mobile)
- **Mobile cards:** `p-6 rounded-lg mb-4` per user
- **Search/Filter:** Top bar, `mb-6`
- **Pagination:** Bottom, centered

---

## Components

### Navigation
**Top Nav (Public):** `h-16 fixed backdrop-blur-md`, logo left, nav center, CTAs right, hamburger (mobile)

**Sidebar (Auth):** `w-64` fixed, logo/profile top `p-6`, nav items `h-12 px-4 rounded-lg` with 24px icons, logout bottom

**Breadcrumbs:** `text-sm flex items-center gap-2`, current page `font-medium`

### Forms
**Inputs:**
- Size: `h-12 px-4 rounded-lg`
- Border: `border-2` (normal), `border-3` (focus)
- Spacing: `mb-6` between fields
- **Password:** Eye toggle | **Email:** Icon prefix | **Search:** Magnifying glass, `rounded-full` option

**Buttons:**
- Primary: `h-12 px-8 rounded-lg font-semibold`, full width (mobile)
- Icon buttons: `w-10 h-10 rounded-lg`, 20px icons
- Loading: Spinner, disabled state
- Groups: `gap-4 flex flex-wrap`

### Cards
**Standard:** `p-6 rounded-xl`, subtle border, hover shadow

**Stats:** `p-6 h-32`, icon + `text-3xl font-bold` number + `text-sm` label + change badge

**User:** `p-6 flex items-start gap-4`, `w-12 h-12 rounded-full` avatar

### Data Display
**Tables:** Full width, sticky header, `p-4` cells, `border-b`, row hover effect

**Lists:** `h-16 flex items-center`, avatar + text + metadata, dividers

**Badges:** `px-3 py-1 rounded-full text-xs font-medium` (role/status)

### Overlays
**Modal:** `max-w-lg mx-auto mt-24 p-8 rounded-xl`, `text-2xl font-bold mb-6` header, footer with `justify-end` buttons

**Dropdown:** `min-w-48 p-2 rounded-lg`, items `h-10 px-4 rounded-md`

**Toast:** Fixed bottom-right, `max-w-md p-4 rounded-lg`, icon + message + close, 5s auto-dismiss

### States
**Loading:** Animated pulse skeletons, 32px centered spinner, 16px inline spinner

**Empty:** Centered `max-w-md text-center`, 128px icon, `text-xl font-semibold` headline, action button

**Theme Toggle:** Icon button (sun/moon), smooth transition, localStorage persist

---

## Responsive Behavior

**Mobile Adaptations:**
- Sidebar → drawer | Tables → cards | Multi-column → single | Padding: `p-8` → `p-4`
- Font sizes scale down | Fixed bottom nav for key actions

**Touch Targets:** Minimum 44px height, increased mobile padding

---

## Accessibility

**Focus:** `ring-2 ring-offset-2`, visible on all interactive elements, full keyboard navigation

**Error:** Red accent, message below field, icon indicator, ARIA labels

**Success:** Green accent, checkmark, confirmation toasts

**Disabled:** `opacity-50 cursor-not-allowed`, no hover

**Contrast:** WCAG AA - 4.5:1 text, 3:1 large text (18pt+)

---

## Animation
**Timings (use sparingly):**
- Page transitions: 150ms fade
- Modal: 200ms scale + fade
- Dropdown: 150ms slide
- Toast: 200ms slide-in
- Button hover (desktop): 100ms scale
- Theme toggle: 300ms color transition

**Avoid:** Excessive parallax, continuous animations, distracting micro-interactions

---

## Dark/Light Themes

**Implementation:** Tailwind dark mode (class strategy), navbar toggle, smooth transitions, session persistence

**Component Behavior:**
- Cards: Elevated (light), subtle (dark)
- Borders: More visible (dark)
- Shadows: Reduced (dark), replaced with borders
- Inputs: Clear distinction both modes

---

## Images & Icons

**Hero:** Full-width abstract geometric/gradient background with overlay, or centered isometric security illustration

**Icons:** Heroicons, 48px in feature cards, 24px in navigation

**Empty States:** 128px simple line drawings/icons

---

**Implementation Note:** All measurements use Tailwind utilities. Maintain systematic consistency across all auth flows. Test both themes and all breakpoints.