# RTG Live — MVP demo

**Where Ideas Meet Influence.** RTG Live is a marketplace that connects individuals, founders and businesses with creators and industry experts, through paid conversations (**RTG Connect**) and structured product feedback (**RTG Pitch**).

> RTG Live is a **proposed product concept** prepared for discussion with the management of Voyager Partners, Hyderabad. It is not an existing or approved Voyager Partners product. All payments in this demo are **simulated**, and the commission rates are **proposed assumptions**, not confirmed commercial terms.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
# or a production build
npm run build && npm start
```

No accounts, API keys or credentials are needed. Demo data is seeded on first load and saved in the browser (localStorage). Use **Reset demo** in the top bar to restore the original sample data.

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
| RTG Collaborate, RTG Market, RTG Community | Shown as **future modules** only |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design system, folder structure and production integration plan.
