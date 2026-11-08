# RTG Live design system (v2: premium hybrid)

Tokens live in `tailwind.config.ts` and are mirrored as CSS variables in `src/app/globals.css`. Components use the token names, never raw hex values.

## Colour
| Token | Value | Role |
|---|---|---|
| `navy` / `--rtg-dark` | `#10172A` | Primary dark: hero bands, footer, active nav, dark buttons |
| `navy-800` / `--rtg-dark-2` | `#17223B` | Secondary dark surfaces |
| `brand-500` / `--rtg-accent` | `#6558E8` | Primary accent: primary buttons, links, focus rings |
| `teal-500` / `--rtg-accent-2` | `#19B8A6` | Secondary accent: success, creator earnings, highlights |
| `teal-600` | `#11907F` | Teal surfaces that carry white text (AA contrast) |
| `canvas` / `--rtg-bg` | `#F5F3EF` | Warm light page background |
| white | `#FFFFFF` | Cards, inputs |
| `ink` / `--rtg-text` | `#172033` | Primary text |
| `ink-muted` / `--rtg-text-2` | `#697386` | Secondary text |
| `ink-subtle` | `#737A89` | Meta text (≥4.5:1 on white) |
| `line` | `#E6E2DA` | Subtle warm borders |

Signature surfaces: `.surface-dark` (navy with soft violet/teal radial light), `.grid-faint` (masked grid texture) and `.text-gradient` (violet→teal headline accent, used sparingly).

## Typography
- Display: **Plus Jakarta Sans Variable** (`font-display`), used for h1–h3, prices and stat values.
- Body: **Inter Variable** (`font-sans`).
- Fluid scale: `text-display-xl` (hero), `text-display-lg` (section/page titles), `text-display-md` (detail titles); body 14–16px; meta 11–13px; `.eyebrow` (12px, 0.14em tracking, uppercase).
- Both fonts are self-hosted via `@fontsource-variable`, so there are no external font requests.

## Spacing, radii, shadows, layout
- Container: `max-w-7xl` (80rem) with a 16/24/32px gutter. Section rhythm `py-section` (6.5rem).
- Radii: `rounded-xl` 14px (controls), `rounded-2xl` 20px (cards), `rounded-3xl` 28px (feature panels, modals).
- Shadows: `shadow-card` (rest), `shadow-lift` (hover), `shadow-pop` (overlays), `shadow-glow` (primary button hover).
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1440`. Every responsive grid declares `grid-cols-1` as its mobile base.

## Motion
| Token | Duration | Used for |
|---|---|---|
| `duration-fast` / `--rtg-dur-micro` | 180ms | Buttons, chips, inputs, icon nudges |
| `duration-base` / `--rtg-dur-card` | 260ms | Card hover lift, dropdowns, modals, toggles |
| `duration-slow` / `--rtg-dur-section` | 480–560ms | Scroll reveals, hero entrance, chart growth, image zoom |
| `ease-out` / `--rtg-ease` | `cubic-bezier(0.22,1,0.36,1)` | All motion |

Everything animates `opacity`/`transform` only, so there is no layout shift. `prefers-reduced-motion: reduce` collapses all animations and transitions and disables scroll reveals.

## Components (`src/components/ui`)
- **Button / ButtonLink**: `primary`, `secondary`, `outline`, `ghost`, `text`, `teal`, `danger`, `dark`, `light`; sizes sm/md/lg (36/44/48px touch targets); hover, `active:scale`, focus ring and disabled states.
- **Card / `cardInteractive`**: one surface and one hover behaviour shared by creator, community, event, duo, campaign and dashboard cards.
- **Field, Input, Textarea, Select, Chip (light/dark), Toggle**: 44px controls, warm borders, brand focus ring, inline error messages with icon.
- **Modal**: centred dialog on desktop, bottom sheet on mobile; enter and exit transitions, Escape to close, focus moves into the dialog and is restored afterwards.
- **Tabs**: segmented pill control (`role="tab"`).
- **PageHero**: full-bleed dark hero for module pages and dashboards. **SectionHeading**: homepage section titles.
- **Avatar / Portrait**: monogram avatar and duotone portrait tile. Both render a real `photo` when present, with a hover zoom.
- **Visual**: hue-tinted cover art for communities, events and brands (light and dark tones).
- **Reveal**: IntersectionObserver scroll reveal (content stays visible without JS).
- **Skeleton / PageSkeleton**: shimmer loading states.
- **JourneySteps** (`components/booking`): progress indicator for booking, duo booking and pitch flows.
