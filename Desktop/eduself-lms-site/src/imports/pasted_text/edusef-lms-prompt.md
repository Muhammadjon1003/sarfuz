# AI Agent Prompt — EduSelf LMS (v2, Performance-First, Multi-Page)

You are a Senior Product Designer, Senior UX Researcher, Brand Strategist,
Frontend Architect, Motion Designer, and Conversion Rate Optimization (CRO)
Expert.

Your mission: design and build a **world-class, multi-page marketing website**
for **EduSelf LMS** — an Enterprise AI-powered Learning Management System for
schools, universities, private learning centers, educational organizations,
corporate academies, and training centers.

Visual and interaction quality must be comparable to Stripe, Linear, Notion,
Framer, Vercel, and Apple. But unlike a generic "AI prompt," this spec is
**shippable**: every requirement below is testable, measurable, or maps
directly to a file/component.

---

## 0. Why v2 exists (changes from v1)

The original brief asked for a **single "landing page"** while listing 19
content sections, 6 role-based dashboards, and 40+ features — that much
content on one route makes a 95+ PageSpeed score unrealistic (heavy DOM,
huge JS bundle, no route-level code splitting). v2 fixes this by:

1. Splitting content across **real routes** (multi-page site), not anchor
   tags on one page.
2. Replacing vague performance language ("fast", "optimized") with **hard
   numeric budgets** per page.
3. Locking the stack to **Next.js (App Router) + TypeScript + Tailwind CSS**
   so rendering strategy (SSG/ISR), image optimization, and code-splitting
   are concrete, not aspirational.
4. Turning "generate 40+ features" into a **content/data-driven** pattern
   (CMS/JSON-driven components) so pages stay light and maintainable.

---

## 1. Tech Stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+, App Router, React Server Components by default |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3+, `tailwind.config` design tokens (no arbitrary magic numbers in components) |
| Animation | Framer Motion, used only for `'use client'` islands — never wraps whole pages |
| Components | Headless primitives (Radix UI) + custom design system on top; optional shadcn/ui as a base, restyled to match brand tokens |
| Charts | Recharts or visx (client-only, lazy-loaded) |
| i18n | `next-intl` or `next-i18next` — Uzbek (uz), Russian (ru), English (en), instant switch, no full reload, locale-based routing (`/uz`, `/ru`, `/en`) |
| Icons | `lucide-react` (tree-shakeable) |
| Forms | React Hook Form + Zod validation |
| Fonts | `next/font` with Inter or Plus Jakarta Sans, self-hosted, `font-display: swap` |
| Images | `next/image`, AVIF/WebP, responsive `sizes` |
| Hosting target | Vercel (Edge + ISR) |
| State | Server state via RSC/fetch cache; client state kept minimal (Zustand only where truly needed — e.g., dashboard tab switcher) |

Do not introduce a second UI kit, a second animation library, or client-side
data fetching for content that could be static. Every added dependency must
be justified against the performance budget in Section 3.

---

## 2. Site Map (multi-page, not single scroll)

```
/                      → Home (hero, why-us summary, top AI features, social proof, CTA)
/platform              → Platform Overview (dashboard tabs: Admin, Assistant Admin,
                          Teacher, Student, Parent, Telegram Bot)
/platform/[role]       → Deep-dive page per dashboard (SSG, one page per role)
/features              → Full feature grid (40+ features, filterable/searchable)
/ai                    → AI Features deep-dive (AI Test Generator, AI Grading, etc.)
/analytics             → AI Analytics & Realtime Monitoring showcase
/telegram              → Telegram Bot Integration (per-role bot flows)
/gamification          → Coins, badges, leaderboard, challenges
/security              → Security, roles/permissions, audit logs, compliance
/pricing               → Starter / Professional / Enterprise + comparison table
/customers             → Testimonials, case studies, logos, stats
/faq                   → FAQ (accordion, 15+ Q&A, searchable)
/contact               → Book demo / Contact sales / Free trial form
```

Rules:
- Each route is its own Next.js page with its own metadata, own JS bundle,
  and its own Core Web Vitals budget.
- The homepage only **teases** other sections (3–4 items each) and links out
  — it never inlines the full feature grid or all 6 dashboards.
- Shared chrome (nav, mega menu, footer, language switcher, dark-mode
  toggle) lives in a layout, server-rendered, with only the toggle buttons
  hydrated as small client islands.

---

## 3. Performance Budget (per page, enforced, not aspirational)

| Metric | Budget |
|---|---|
| Lighthouse Performance score | ≥ 95 (mobile, throttled 4G) |
| LCP (Largest Contentful Paint) | ≤ 2.0s |
| INP (Interaction to Next Paint) | ≤ 150ms |
| CLS (Cumulative Layout Shift) | ≤ 0.05 |
| Initial JS shipped per route | ≤ 130KB gzipped |
| Total page weight (first load) | ≤ 1.2MB including images |
| Font requests | ≤ 2 font files, self-hosted, preloaded |
| Above-the-fold images | ≤ 1, `priority` + explicit width/height |
| Third-party scripts | 0 render-blocking; analytics loaded via `next/script` `strategy="afterInteractive"` |

Enforcement mechanics:
- Route Segments use **static generation** (SSG) wherever content isn't
  personalized; only `/contact` form submission is dynamic.
- Charts, dashboard mockup animations, and the realtime monitoring demo are
  `dynamic(() => import(...), { ssr: false })` and lazy-loaded on scroll
  into view (Intersection Observer), never in the initial bundle.
- All decorative motion (glassmorphism glows, floating cards, gradient
  blobs) is CSS-only (Tailwind + custom keyframes), reserving Framer Motion
  for meaningful interaction feedback only (tab switches, accordion, modal).
- Feature grids (40+ items) render from a typed JSON/MDX data source, not
  hand-written JSX per card, and paginate/virtualize if the list is long.
- A CI budget check (e.g. `next build` + `@next/bundle-analyzer` or
  Lighthouse CI) must fail the build if any page exceeds the JS budget.

---

## 4. Brand & Visual System

**Personality:** Modern, professional, innovative, AI-first, reliable,
minimal, premium, enterprise, technology-driven, educational.

**Color tokens** (define once in `tailwind.config.ts`, reference everywhere
— no hard-coded hex in components):

```
primary:    #2563EB
secondary:  #4F46E5
accent:     #06B6D4
success:    #22C55E
warning:    #F59E0B
danger:     #EF4444
neutral:    gray scale (50–950)
background: white (light) / near-black (dark)
```

Dark mode: `class` strategy, tokens defined for both themes, toggle persists
in `localStorage`/cookie, no flash-of-wrong-theme (set via inline script in
`<head>` before hydration).

**Typography:** Inter or Plus Jakarta Sans, full type scale (display, h1–h6,
body, caption) defined in Tailwind config, not ad hoc `text-[19px]` values.

**Design system deliverables:** color tokens, type scale, 8pt spacing scale,
elevation/shadow scale, motion duration/easing tokens, icon set (lucide,
consistent stroke width), component library (buttons, badges, cards, tabs,
accordion, charts, timeline, progress bars, glass cards) — all documented in
a `/design-system` Storybook or MDX catalog, not just described in prose.

---

## 5. Page-by-Page Content (condensed from v1, redistributed across routes)

- **Home (`/`):** Hero with headline + subtitle + primary/secondary CTA +
  animated dashboard preview (lazy) + floating stat glass-cards + trusted-by
  logo row + 3-item "Why EduSelf" teaser + 3-item AI features teaser +
  testimonial carousel teaser + final CTA.
- **Platform (`/platform`, `/platform/[role]`):** Tab/segment switcher
  between Admin, Assistant Admin, Teacher, Student, Parent, Telegram Bot —
  each tab deep-links to its own SSG page with real mockup screenshots
  (optimized `next/image`, not embedded SVML illustrations pretending to be
  screenshots).
- **Features (`/features`):** Searchable/filterable grid of the 40+ features
  (Course Management, Attendance, Gamification, Financial Management,
  Security/Audit, Telegram Integration, Multi-school Support, etc.), driven
  by a typed data file, grouped by category tabs (Academic, Engagement,
  Operations, Security, Integrations).
- **AI (`/ai`):** Card grid for AI Test Generator, Auto Assignment/Homework
  Checking, Essay Checking, Video Summary, Lesson Recommendations,
  Performance Prediction, AI Analytics, Chatbot, Learning Assistant, Report
  Generation, Smart Notifications, Attendance Insights, Learning Path,
  Recommendation Engine, Plagiarism Detection, Exam Analysis, Classroom
  Assistant.
- **Analytics (`/analytics`):** Charts/graphs/heatmaps for attendance,
  student growth, teacher performance, exam stats, learning progress;
  realtime monitoring UI (online users, device/browser/country/role,
  security alerts, system health, API health) — all client-side, lazy.
- **Telegram (`/telegram`):** Bot flows per role (student/teacher/parent/
  admin) — homework alerts, attendance, exam reminders, reports,
  announcements, certificates, payments, support, AI chat.
- **Gamification (`/gamification`):** Coins, badges, levels, achievements,
  leaderboard, team/AI challenges, rewards.
- **Security (`/security`):** Roles & permissions, audit/activity logs,
  cyber-attack detection, backups, API integration, compliance messaging.
- **Pricing (`/pricing`):** Starter / Professional / Enterprise tiers, full
  comparison table, FAQ teaser.
- **Customers (`/customers`):** Testimonials (institution/teacher/student/
  parent), animated stat counters (schools, students, teachers,
  assignments, AI analyses, certificates, tests).
- **FAQ (`/faq`):** 15+ Q&A, accordion, searchable.
- **Contact (`/contact`):** Book demo / start trial / contact sales form
  (React Hook Form + Zod), no client-heavy scheduling widget on first load.

---

## 6. UX & Accessibility

- Follow Apple HIG, Material Design 3 spacing/elevation logic, Nielsen's 10
  heuristics, and WCAG 2.2 AA at minimum (color contrast, focus states,
  keyboard navigation, `aria-*` on all interactive/custom components,
  reduced-motion media query respected for all animation).
- Sticky nav + mega menu must be keyboard-navigable and screen-reader
  labeled.
- Language switcher and dark-mode toggle are always reachable, never hidden
  behind a hover-only menu on touch devices.

---

## 7. SEO

- Per-route `generateMetadata` (title, description, canonical, hreflang for
  uz/ru/en).
- Open Graph + Twitter Card images generated per page (`next/og` or static).
- JSON-LD structured data: `Organization`, `SoftwareApplication`,
  `FAQPage` (on `/faq`), `Product`/`Offer` (on `/pricing`).
- Semantic HTML landmarks (`header`, `nav`, `main`, `footer`, `section`
  with `aria-labelledby`), one `h1` per page, logical heading order.
- `sitemap.xml` and `robots.txt` generated via Next.js file conventions.

---

## 8. Deliverables (revised)

1. Next.js multi-page project (routes as in Section 2), TypeScript strict.
2. Tailwind config with full design-token system (colors, type scale,
   spacing, shadows, motion tokens).
3. Component library (buttons, cards, badges, tabs, accordion, charts,
   timeline, progress bars, glass cards, mega menu, language switcher,
   dark-mode toggle) — documented, reusable, no route-specific one-offs.
4. Data-driven content sources (JSON/MDX) for: features grid, AI features,
   testimonials, FAQ, pricing tiers — so content edits don't require
   touching component code.
5. Responsive layouts: mobile, tablet, desktop for every route.
6. Dark mode for every route.
7. i18n setup for uz/ru/en with instant switching, no reload.
8. SEO metadata + structured data per route.
9. Lighthouse CI (or equivalent) config enforcing the Section 3 budgets.
10. A short `PERFORMANCE.md` documenting actual measured LCP/INP/CLS/bundle
    size per route after build, so the "95+ PageSpeed" claim is verifiable,
    not just requested.

The final output must feel like a premium global SaaS platform — and,
unlike v1, must be able to **prove** its performance claims with real
build-time numbers rather than describing them as goals.