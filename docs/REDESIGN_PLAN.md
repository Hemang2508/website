# RTG Live — UI/UX redesign plan (branch `rtg-ui-redesign`)

**Scope:** visual and interaction redesign only. Routes, store actions, data models, business rules, simulated payments and the role switcher are unchanged.

## Audit findings
- Next.js 14 App Router, TypeScript, Tailwind 3. Every page is styled with Tailwind utility tokens (`navy`, `brand`, `teal`, `canvas`, `ink`, `line`) defined in `tailwind.config.ts`. Changing the tokens re-themes the whole app, and the primitives in `src/components/ui/*` are shared by every module.
- No animation library is installed. Motion uses CSS keyframes/transitions plus a ~40-line IntersectionObserver `Reveal` component, so no runtime dependency is added.
- State: `src/lib/store.tsx` (localStorage `rtg-live-demo-v2`). It is not touched by the redesign.
- Journeys covered by `tests/e2e/core.js` (booking, pitch, creator, admin, persistence, mobile) and `tests/e2e/ecosystem.js` (passport, community, regional, duos, collaborate, link crawl, mobile).

## Stages
1. Design system: tokens (colour, type, spacing, radii, shadows, motion, breakpoints, containers) in `tailwind.config.ts` + CSS variables in `globals.css`, plus the display font.
2. Shared components: Button, Card, Field, Modal (enter + exit), Tabs, Badge, Stat, Avatar/Portrait, PageHero, Reveal, Navbar (dark over home hero, light elsewhere, animated dropdowns, mobile sheet), dark Footer. Then the homepage.
3. Explore (category chips, city filter, editorial cards), creator profile, Creator Passport (cover + portfolio layout).
4. Booking flow, RTG Pitch, Community, Regional Connect.
5. Creator Duos, Collaborate.
6. User, creator and admin dashboards (welcome band, animated charts, tables).
7. Motion polish, reduced motion, responsive and accessibility pass.
8. Regression: build, tsc, lint, both e2e suites, responsive and reduced-motion checks, docs.
