# RTG Live — MVP demo

**Where Ideas Meet Influence.** RTG Live is a creator ecosystem that connects individuals, founders and businesses with creators and industry experts: paid conversations (**RTG Connect**), structured product feedback (**RTG Pitch**), creator-hosted communities, city-based events, joint Creator Duo experiences and brand collaborations.

> RTG Live is a **proposed product concept** prepared for discussion with the management of Voyager Partners, Hyderabad. It is not an existing or approved Voyager Partners product. All payments in this demo are **simulated**, and the commission rates are **proposed assumptions**, not confirmed commercial terms.

## Design (v2 redesign: branch `rtg-ui-redesign`)

Premium hybrid look: dark hero bands, a warm light canvas, Plus Jakarta Sans display type over Inter, a single interactive card system and balanced CSS motion. Details are in [`docs/redesign/DESIGN_SYSTEM.md`](docs/redesign/DESIGN_SYSTEM.md) and the plan in [`docs/REDESIGN_PLAN.md`](docs/REDESIGN_PLAN.md). Screenshots are in [`docs/redesign/screenshots`](docs/redesign/screenshots).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
# or a production build
npm run build && npm start
```

No accounts, API keys or credentials are needed.

### Tests
```bash
npm run build && npx next start -p 3100   # in one terminal
npm run test:e2e                          # core journeys, ecosystem modules, responsive + reduced motion
```
The suites use the Playwright/Chromium available on the machine (`BASE_URL` overrides `http://localhost:3100`). `node scripts/screenshots.js` regenerates the screenshot set. Demo data is seeded on first load and saved in the browser (localStorage, key `rtg-live-demo-v2`; v1 data from the earlier build is ignored so the new sample data appears). Use **Reset demo** in the top bar to restore the original sample data.

## Demo accounts (role switcher)

Use the **Demo role** menu in the header (on mobile, it's in the menu):

| Role | Account | Lands on |
|---|---|---|
| User | Aarav Mehta, Founder of Kosha Naturals | `/dashboard` |
| Creator | Any of 8 creators (default **Ananya Rao**) | `/creator` |
| Admin | RTG Ops | `/admin` |

## Presenter script (about 10 minutes)

**Journey A: book a creator (User)**
1. On the landing page, search "go-to-market", or open **Explore creators** and try the filters.
2. Open **Ananya Rao**, then click **Book** on *Go-to-market deep dive*.
3. Pick a date and slot (booked slots are struck through), enter a topic and accept the terms.
4. Review the fee split (marketplace = 15%), then **Pay (simulated)**. You'll see the confirmation page with an `.ics` calendar download.
5. **My dashboard** now shows the request as *Awaiting creator*.

**Journey C: creator experience**
1. On the booking page, click **Open as creator** (or switch to Ananya in the role menu).
2. **Bookings**: accept the request. The user's dashboard and notifications update.
3. **Services & pricing**: change a price. Earnings at 15% and 8% are shown live, with validation.
4. **Availability**: toggle weekly slots and save. The booking calendar updates.
5. **Earnings**: gross, fees and net by source, with a weekly chart, CSV export and a simulated payout.
6. Copy the **personal booking link** (`?ref=creator`). Bookings made through it use the 8% creator-originated rate.

**Journey B: pitch a product (User → Creator → User)**
1. Go to **RTG Pitch**, fill in product details and upload images, then choose audience and goals.
2. See the ranked creator matches (category, audience overlap, rating), select up to 5, and pay (simulated).
3. On the pitch page, click **Open as creator**, then **Accept**, then **Submit feedback** (scorecard, written notes, recommendation, collaboration interest). Optionally decline another pitch with a reason.
4. Switch back to User. The pitch shows the delivered scorecard and the averaged feedback summary.

**Admin**: GTV, platform revenue by stream, booking pipeline, top creators, creator approval/verification/suspension, filterable transactions with CSV export, and all pitches.

## Ecosystem modules (added in v2)

| Module | Route(s) | What you can do | How it connects |
|---|---|---|---|
| **Creator Passport** | `/creators/[slug]/passport` | Profile, category, city/state/region, portfolio, socials, services & prices, ratings, completed sessions, collaborations, pitch reviews, events hosted, auto-earned badges, **demo** verification checklist | "View Creator Passport" on every creator card, profile, admin creator table, creator dashboard; services link to booking/pitch |
| **RTG Community** | `/community`, `/community/[slug]` | 5 sample communities (Hyderabad Foodies, Career and MBA, Travel Explorers, Gaming Zone, Startup Founders); join/leave; filter by category or "My communities"; details, hosts, guidelines, read-only sample discussions, upcoming events | Hosts link to profiles and passports; events link to Regional Connect; joined communities show on the user dashboard |
| **Regional Connect** | `/regional`, `/regional/events/[id]` | Pick a city (Hyderabad pilot); filter by event type (meetups, Coffee with Creators, food walks, startup networking, workshops) and free/paid; discover creators by city and category; register (free or simulated paid), cancel, waitlist, `.ics` download | Events link to host creators and communities; registrations appear on the user dashboard and notify hosts |
| **Creator Duos** | `/duos`, `/duos/[slug]`, `/duos/[slug]/book` | 4 pairings (Food + Travel, Finance + Career, Fitness + Lifestyle, Gaming + Entertainment); joint availability; booking request with simulated payment | Uses the **existing booking model and confirmation page**; appears in both creators' booking managers; either creator can accept; earnings split 50/50 in each creator's earnings view |
| **RTG Collaborate** (beta) | `/collaborate`, `/collaborate/[id]`, `/collaborate/new` | Brands post briefs (requirements, deliverables, budget, cities, slots, deadline); creators see eligibility and apply with a proposal; brand shortlists/accepts/declines; status tracker; close/reopen brief | New **Collaborations** tab in the creator dashboard; briefs summary on the user dashboard; creators who flagged "collaboration interest" in RTG Pitch feedback are surfaced to the brand; admin **Ecosystem** tab |

**Navigation:** Home · Explore Creators · Connect ▾ (1:1 sessions, Creator Duos, Regional Connect) · Pitch ▾ · Community ▾ (Communities, Regional Events) · Collaborate, plus a role-aware Dashboard button. Mobile uses a grouped menu.

**Extra demo accounts:** creators Shreya Iyer (food), Kavya Reddy (travel), Arnav Kulkarni (gaming) and Ishaan Malik (fitness), all Hyderabad-based, are selectable in the role switcher.

### Presenter script — ecosystem (≈8 minutes)
1. **Passport:** Explore → *View Creator Passport* on Shreya Iyer → badges, track record, demo verification → *Book* a service.
2. **Community:** Community → join *Travel Explorers* (member count updates) → open *Gaming Zone* → join to unlock discussions → click a host.
3. **Regional:** Connect ▾ → Regional Connect → *Food walks* tile → open the Old City food walk → register (simulated payment) → it appears on your dashboard. Switch the city to Chennai to see the "coming soon" state.
4. **Duos:** Connect ▾ → Creator Duos → *Money Moves for Your First Job* → *Request booking* → pay (simulated) → *Open as creator* → accept. Switch to Nisha Bhatt to see the same booking as the partner.
5. **Collaborate:** as the User, *Post a brief* → switch to Meera Krishnan → open the brief → apply → switch back to User → *Shortlist* → *Accept* → Meera's creator dashboard → **Collaborations** tab shows *Accepted*.
6. **Admin → Ecosystem** shows memberships, registrations, collaboration pipeline and duo bookings.

## Business logic (proposed)

| Stream | Platform fee |
|---|---|
| Creator-originated booking (via the creator's own link) | 8% |
| Marketplace booking | 15% |
| Product pitch review | 15% |

Defined in `src/lib/pricing.ts`. The fee and creator earnings appear on checkout, receipts, the creator dashboard and the admin console. Declined or cancelled requests receive a simulated full refund. **No escrow is implemented.** Holding funds until delivery would require a compliant, provider-supported mechanism (for example Razorpay Route with on-hold transfers), configured and verified first.

## Real vs simulated

| Feature | Status in demo |
|---|---|
| Navigation, search, filters, forms, validation, role-based dashboards | Real (client-side) |
| Bookings, pitches, reviews, notifications, earnings calculations | Real logic, stored in browser |
| CSV export, calendar (.ics) download, image upload & preview | Real |
| Payments (Razorpay) | **Simulated**, labelled in UI (`src/lib/integrations/payments.ts`) |
| Auth, database, storage (Supabase) | **Not connected**; adapter stub in `src/lib/integrations/supabase.ts` |
| Video sessions | **Later phase** (button shown disabled) |
| Creator Passport verification | **Demo checklist only.** No KYC / identity provider is integrated; no documents are checked |
| Community member counts, posts, event registrations, brand briefs, applicant numbers, portfolio items | **Sample data**, labelled in the UI. Posting/replying in communities is a later phase |
| Event tickets & duo bookings | **Simulated payments** (same mechanism as bookings); event commission terms are not defined |
| Collaboration payments | **Not processed or held** — fees are agreed directly between brand and creator in this MVP |
| Event venue sharing, waitlists, email/SMS notifications | **Not implemented** — only in-app demo notifications exist |
| City selection | Manual dropdown; the app never requests device location |
| RTG Market & creator-owned products | Shown as **future opportunities** only |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design system, folder structure and production integration plan.
