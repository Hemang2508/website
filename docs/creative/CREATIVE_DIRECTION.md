# RTG Live — Creative direction (branch `rtg-creative-experience`)

Framer was a reference for *creative quality*: confident typography, motion that explains, layered composition and scroll-led storytelling. Nothing was copied — no layouts, assets, colours or components. RTG Live's identity is built from its own idea: **two things meeting**.

## Three directions explored

| | A · Editorial Creator Universe | B · Interactive Digital Playground | C · Premium Creative Marketplace |
|---|---|---|---|
| Core idea | Magazine-like pages: oversized type, portrait-led stories, asymmetric layered layouts | The site as a toy: draggable objects, fluid backgrounds, playful transitions | Quiet luxury: refined type, immersive product previews, restrained effects |
| Strengths | Puts *people* first; memorable; typography carries the brand without colour | High delight; strong "creative tech" signal; great for discovery | Builds trust for payments, briefs, dashboards; easy to use |
| Risks | Can become static or text-heavy; needs strong imagery | Distracting; hurts accessibility and mobile; trivialises paid services | Can feel generic; low memorability |
| Fit for RTG Live | Excellent for creators, Passport, community | Good in small doses (discovery, map, filters) | Essential for booking, pitch, collaborate, dashboards |

## Selected: "The Meeting Point" — A as the voice, C as the structure, B as the spark

RTG Live sells *meetings*: an idea meeting influence, a founder meeting a creator, two creators meeting in a Duo, people meeting in a city. Every visual decision expresses that:

1. **Signature motif — the Lens.** Two circles overlapping (already in the logo). It becomes the system: the hero's light fields are two drifting circles whose overlap is where the CTA lives; portrait frames are arches and circles; Duos are literally two halves meeting; the Hyderabad map uses overlapping rings.
2. **Editorial typography (A).** Plus Jakarta Sans at poster scale paired with *Instrument Serif italic* for the emotional word in each line ("*meet*", "*influence*", "*together*"). Contrast of grotesk + serif replaces gradients as the main source of character. Words are revealed through masks, word by word.
3. **Paper, not night.** The hero moves from a dark gradient to warm paper (`#F5F3EF`) with ink type — a deliberate break from the "dark SaaS with purple glow" look. Dark surfaces are kept for moments of focus (the product story, the final CTA). Violet and teal are used only where the two circles overlap.
4. **Original creator figures (imagery).** No unlicensed or stock photos of real people pretending to be fictional creators. Each demo creator gets an original, deterministic SVG figure — a silhouette inside an arch, with hair and accessory variations and an overlapping lens accent in their own hue. Recognisably RTG, inclusive, lightweight (inline SVG, no image requests) and clearly labelled *illustrated demo creator*. A real `photo` still overrides the figure when licensed photography exists.
5. **Structure from C.** Product moments (booking, pitch scorecard, brief status) are shown as real, data-driven previews from the demo store — not generic dashboard mockups — inside calm, precise frames.
6. **Spark from B, where it helps discovery.** Cursor-aware light fields in the hero, magnetic primary buttons, a creator gallery that moves horizontally as you scroll, an interactive illustrative map of Hyderabad with event pins, and hover/tap profile previews.

## Motion system
| Layer | Technique | Timing |
|---|---|---|
| Type | Masked word-by-word reveal (`translateY(110%) → 0`), serif emphasis word slides in last | 700ms, 60ms stagger |
| Scroll | Reveal on enter; manifesto words brighten with scroll progress; pinned horizontal creator gallery (desktop, fine pointer only); sticky "five ways to meet" story with an active-chapter indicator | Linked to scroll, no inertia hijacking |
| Micro | Magnetic CTAs (max 8px), card tilt-free hover lift, profile previews expand on hover *and* focus/tap | 180–260ms |
| Visual | Two blurred light circles drift with the cursor (≤24px), SVG pins draw in, lens overlap pulses once | 600–900ms, never looping |
| Pages | Every route enters with a 280ms rise-and-fade (`app/template.tsx`) | No exit delays |

Rules: animate `transform`/`opacity` only; nothing loops continuously; no scroll-jacking; every pointer effect has a keyboard or tap equivalent; `prefers-reduced-motion` turns all of it into static, fully visible layouts (the pinned gallery becomes a normal swipeable row).

## Homepage storyboard (Stage 2)
1. **Hero** — paper canvas, poster headline "Where Ideas *Meet* Influence." revealed word by word; three creator figures arranged on the lens, each with a floating profile preview; magnetic CTAs (Explore Creators / Become a Creator); search.
2. **Manifesto** — one large sentence that lights up word by word as you scroll.
3. **Creator universe** — pinned horizontal gallery of creator figures with category filters (desktop); swipe row on mobile.
4. **Five ways to meet** — sticky chapter index (Connect, Pitch, Community, Duos, Collaborate) beside real product previews.
5. **Hyderabad, first** — illustrative city map with live event pins from the demo data.
6. **Transparent fees** — the existing calculator (anchor `#fees`).
7. **Roadmap note** (anchor `#ecosystem`) and **final CTA** — "Your idea. *Their* influence." with magnetic buttons.

## Dependencies
- `@fontsource/instrument-serif` (Latin 400 + italic, ~40 KB): the editorial accent face. No animation library or WebGL. Every effect is CSS, SVG and ~150 lines of hooks, because the effects chosen do not justify a 30–60 KB motion runtime or a 3D engine.

## Status
- **Stage 1** (this document) and **Stage 2** (homepage) are implemented on `rtg-creative-experience`. Review screenshots are in `docs/creative/stage2/` (`node scripts/creative-screens.js` regenerates them).
- Global changes made in Stage 2: light navigation over the homepage, flat ink footer with an outlined wordmark, 280ms route entry motion (`app/template.tsx`), Instrument Serif accent font.
- **Paused for review** before Stages 3–8 (discovery, Passport, Connect, Pitch, Collaborate, Community, Regional, Duos, dashboards).
