# RTG Live — Architecture & design system

## Stack
- **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3**
- `lucide-react` icons, self-hosted Inter Variable (`@fontsource-variable/inter`), so there are no external font or CDN requests
- Demo state: a typed React context store (`src/lib/store.tsx`) persisted to localStorage. The server renders the shell (navigation, footer and a skeleton); page content renders once the store has loaded (`components/layout/HydrationGate.tsx`), which avoids timezone/date hydration mismatches and flashes of seed data

## Folder structure
```
src/
  app/                         Routes
    page.tsx                   Landing
    explore/                   Explore creators (search, filters, sort)
    creators/[slug]/           Creator profile (services, availability, reviews)
    book/[slug]/               3-step booking & simulated checkout
    bookings/[id]/             Confirmation, status timeline, receipt
    pitch/new/                 4-step pitch submission & creator matching
    pitch/                     Pitch management (role-aware: user / creator / admin)
    pitch/[id]/                Pitch detail, responses, feedback summary
    dashboard/                 User dashboard
    creator/                   Creator dashboard (?tab=overview|bookings|pitches|services|availability|profile|earnings)
    admin/                     Admin console (?tab=overview|creators|transactions|pitches|ecosystem)
    creators/[slug]/passport/  Creator Passport
    community/ [slug]/         RTG Community list + detail
    regional/ events/[id]/     Regional Connect (city discovery) + event detail/registration
    duos/ [slug]/ [slug]/book/ Creator Duos list, detail, booking (reuses SlotPicker, PaymentModal, Booking model)
    collaborate/ [id]/ new/    RTG Collaborate briefs, detail/applications, post a brief
  components/
    ui/                        Design-system primitives (Button, Card, Badge, Field, Modal, Tabs, Stat, Avatar…)
    layout/                    Navbar, DemoBar, RoleSwitcher, Notifications, Toaster, Footer, Logo
    creators/ booking/ pitch/ dashboard/ creator-dashboard/ landing/
    ecosystem/                 EventCard, DuoCard, JoinButton, collab (CollabCard, ApplicationTracker, eligibility)
    ui/Visual.tsx              Cover visuals (tinted surface + icon), Skeleton / PageSkeleton loading states
  lib/
    types.ts                   Domain model
    pricing.ts                 Commission rules (8% / 15% / 15%)
    store.tsx                  State + all business actions
    metrics.ts                 Transactions, summaries, weekly series, CSV
    availability.ts            Slot generation (2-hour same-day notice)
    matching.ts                Explainable pitch↔creator match score
    data/                      Seed creators, bookings, pitches, reviews, notifications
    data/ecosystem.ts          Communities, events, duos, collaborations, applications (sample data)
    data/passport.ts, cities.ts  Portfolio items; city → state/region (Hyderabad pilot)
    passport.ts                Passport aggregation + badge rules
    integrations/              payments.ts (simulated Razorpay), supabase.ts (stub)
```

## Design system
| Token | Value | Use |
|---|---|---|
| `navy` | #111C30 | Text, dark surfaces, demo bar |
| `brand` | #6657CE | Primary actions, RTG Connect, platform fee |
| `teal` | #13A69A | Success, RTG Pitch, creator earnings |
| `canvas` | #F5F6FA | Page background, subtle fills |
| white | #FFFFFF | Cards |

- Type: Inter; page titles 28px semibold with tight tracking; body 14–15px; meta 11–13px.
- Surfaces: 1px `line` (#E4E7EF) borders, 18px radius cards, three shadow levels (`card`, `lift`, `pop`).
- Colour semantics are consistent: purple = platform / primary, teal = creator money and success, amber = pending or simulated, red = declined.
- Simulated features always carry the dashed amber **SIMULATED** tag.

## Domain model and state machines
- **Booking**: `pending` → `confirmed` → `completed`, or `pending/confirmed` → `declined` | `cancelled` (simulated refund). Stores `source`, `commissionRate`, `platformFee` and `creatorEarning` at the time of booking.
- **Pitch**: one product, many **PitchRequests** (one per creator): `pending` → `accepted` → `feedback_submitted`, or `pending` → `declined` (simulated refund).
- **Feedback**: 5 scores (1–5), strengths, improvements, audience fit, recommendation, collaboration interest.

- **Duo booking**: a normal `Booking` with `duoId` + `partnerCreatorId`; visible to both creators; slot is blocked for both; earnings 50/50.
- **Collaboration application**: `submitted` → `shortlisted` → `accepted`, or → `declined` / `withdrawn`. A brief moves to `in_progress` when all slots are accepted; owners can close/reopen.
- **Community membership / event registration**: keyed by the current demo viewer (user, admin or creator id).

## Production integration plan
1. **Supabase**: tables `profiles(role)`, `creators`, `services`, `availability`, `bookings`, `pitches`, `pitch_requests`, `pitch_feedback`, `reviews`, `notifications`, with row-level security by role. The product images bucket replaces data URLs. Store actions map 1:1 to server actions or RPCs.
2. **Razorpay**: server-side order creation and signature verification in a route handler, then Checkout on the client. Refunds go through the Refunds API. Creator payouts and any hold-until-delivery behaviour only via a compliant, verified mechanism such as Razorpay Route. Not implemented in the demo.
3. **Video**: a video SDK room created on booking confirmation (later phase).
4. **Notifications**: email/WhatsApp via provider webhooks.
5. **Ecosystem tables**: `communities`, `community_members`, `community_posts`, `events`, `event_registrations`, `duos`, `collaborations`, `collab_applications`; Creator Passport verification only via a vetted KYC provider after legal review.
