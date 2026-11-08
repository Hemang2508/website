"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight, Briefcase, CalendarCheck, ClipboardCheck, Handshake, IdCard, LineChart, MapPin, MessagesSquare, PackageSearch, Search, ShieldCheck,
  ShoppingBag, Sparkles, UserRound, Users, UsersRound, Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Container } from "@/components/ui/Misc";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { HeroPreview } from "@/components/landing/HeroPreview";
import { FeeCalculator } from "@/components/landing/FeeCalculator";
import { CATEGORIES } from "@/lib/data/creators";
import { cn } from "@/lib/utils";

const audiences = {
  individuals: {
    label: "Individuals",
    icon: UserRound,
    title: "Get a straight answer from someone who has done it.",
    body: "Students, professionals and first-time founders book focused, paid conversations with practitioners — no cold DMs, no waiting for a reply.",
    points: ["Search by expertise, price, language and availability", "Pay per session with transparent pricing", "Rate every session to keep quality high"],
    cta: ["Explore creators", "/explore"],
  },
  creators: {
    label: "Creators & experts",
    icon: Sparkles,
    title: "Turn your expertise into a professional, bookable service.",
    body: "Influencers, consultants and industry leaders set their own prices, control their calendars and get paid for their time and opinion.",
    points: ["Set services, durations and prices yourself", "Accept or decline every request", "Track earnings, fees and payouts in one place"],
    cta: ["Open creator dashboard", "/creator"],
  },
  businesses: {
    label: "Businesses",
    icon: Briefcase,
    title: "Put your product in front of the right creators — with structure.",
    body: "Start-ups and brands submit a product once, match with relevant creators and receive scored, comparable feedback before spending on campaigns.",
    points: ["One pitch, many relevant creators", "Standardised scorecards you can compare", "Spot creators interested in future collaboration"],
    cta: ["Pitch a product", "/pitch/new"],
  },
} as const;

export default function LandingPage() {
  const { creators } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [aud, setAud] = useState<keyof typeof audiences>("individuals");
  const featured = creators.filter((c) => c.featured && c.status === "active").slice(0, 4);
  const A = audiences[aud];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#E4E7EF_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <Container className="relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <Badge tone="brand" className="mb-5">MVP preview · Connect, Pitch, Community & Collaborate</Badge>
            <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px]">
              Where ideas<br />meet <span className="text-brand-500">influence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Book paid conversations with creators and industry experts, or get structured creator feedback on your product — all in one trusted marketplace.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); router.push(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`); }}
              className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-lift sm:flex-row"
              role="search"
            >
              <label className="flex flex-1 items-center gap-2.5 px-3">
                <Search className="h-5 w-5 shrink-0 text-ink-subtle" />
                <span className="sr-only">Search creators</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “D2C pricing”, “pitch deck” or “skincare”" className="h-11 w-full bg-transparent text-[15px] text-ink placeholder:text-ink-subtle focus:outline-none" />
              </label>
              <button type="submit" className="h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600">Find experts</button>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
              <span>Popular:</span>
              {["Go-to-market", "Fundraising", "Influencer marketing", "Interview prep"].map((t) => (
                <Link key={t} href={`/explore?q=${encodeURIComponent(t)}`} className="rounded-full border border-line bg-white px-3 py-1 hover:border-[#D5D9E4] hover:text-ink">{t}</Link>
              ))}
            </div>
          </div>
          <HeroPreview />
        </Container>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-b border-line bg-white">
        <Container className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/explore?category=${encodeURIComponent(c)}`} className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-muted transition hover:bg-canvas hover:text-ink">{c}</Link>
          ))}
        </Container>
      </section>

      {/* MODULES */}
      <section className="py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-600">Two products, one marketplace</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-[36px]">Everything you need to reach the right people.</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ModuleCard
              color="brand"
              icon={<MessagesSquare className="h-5 w-5" />}
              name="RTG Connect"
              title="Book paid conversations with creators and experts"
              steps={[
                [Search, "Discover", "Search and filter by expertise, price and availability"],
                [CalendarCheck, "Book", "Choose a service and an open slot on their calendar"],
                [Wallet, "Pay securely", "Checkout and receive an instant confirmation"],
                [MessagesSquare, "Meet & review", "Join the session and leave a rating"],
              ]}
              cta={["Explore creators", "/explore"]}
            />
            <ModuleCard
              color="teal"
              icon={<PackageSearch className="h-5 w-5" />}
              name="RTG Pitch"
              title="Get structured creator feedback on your product"
              steps={[
                [PackageSearch, "Submit", "Describe your product, audience and goals"],
                [Users, "Match", "We suggest creators who review your category"],
                [Handshake, "Creators respond", "Each creator accepts or declines your pitch"],
                [ClipboardCheck, "Scored feedback", "Receive comparable scorecards and advice"],
              ]}
              cta={["Pitch a product", "/pitch/new"]}
            />
          </div>
        </Container>
      </section>

      {/* FEATURED CREATORS */}
      <section className="border-y border-line bg-white py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-600">Featured creators</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Practitioners, not personalities.</h2>
              <p className="mt-2 max-w-xl text-ink-muted">Every creator is reviewed before listing. Sample profiles shown for this demo.</p>
            </div>
            <ButtonLink href="/explore" variant="secondary">View all creators <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c) => <CreatorCard key={c.id} creator={c} />)}
          </div>
        </Container>
      </section>

      {/* AUDIENCES */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-600">Built for three sides of the market</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-[36px]">One platform. Three ways to win.</h2>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-xl border border-line bg-white p-1 shadow-card">
              {(Object.keys(audiences) as (keyof typeof audiences)[]).map((k) => {
                const I = audiences[k].icon;
                return (
                  <button key={k} onClick={() => setAud(k)} className={cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition sm:px-4 sm:text-sm", aud === k ? "bg-navy text-white" : "text-ink-muted hover:text-ink")}>
                    <I className="hidden h-4 w-4 sm:block" />{audiences[k].label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-ink">{A.title}</h3>
              <p className="mt-3 text-ink-muted">{A.body}</p>
              <ButtonLink href={A.cta[1]} className="mt-6">{A.cta[0]} <ArrowRight className="h-4 w-4" /></ButtonLink>
            </div>
            <ul className="space-y-3">
              {A.points.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-xl bg-canvas p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <span className="text-sm font-medium text-ink">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FEES */}
      <section id="fees" className="scroll-mt-24 border-y border-line bg-white py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-600">Transparent fees</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Creators keep the majority of every booking.</h2>
            <p className="mt-2 text-ink-muted">The platform fee and creator earnings are shown on every checkout, booking and payout.</p>
          </div>
          <div className="mt-10"><FeeCalculator /></div>
        </Container>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="scroll-mt-24 py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-600">The RTG ecosystem</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">From one conversation to a lasting relationship.</h2>
            <p className="mt-2 text-ink-muted">Discover creators, meet them in your city, join their communities and collaborate as a brand — every module connects to the next.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: IdCard, name: "Creator Passport", body: "A verified-style record of every creator: expertise, region, portfolio, track record and badges.", href: "/explore", cta: "Browse passports", tag: "Live in demo" },
              { icon: UsersRound, name: "RTG Community", body: "Creator-hosted communities like Hyderabad Foodies, Startup Founders and Gaming Zone.", href: "/community", cta: "Join a community", tag: "Live in demo" },
              { icon: MapPin, name: "Regional Connect", body: "City-based discovery with meetups, Coffee with Creators, food walks and workshops. Piloting in Hyderabad.", href: "/regional", cta: "See Hyderabad events", tag: "Hyderabad pilot" },
              { icon: Sparkles, name: "Creator Duos", body: "Two creators, one experience — Food + Travel, Finance + Career, Fitness + Lifestyle and more.", href: "/duos", cta: "Explore duos", tag: "Live in demo" },
              { icon: Handshake, name: "RTG Collaborate", body: "Brands post campaign briefs, creators apply, and both track every application to acceptance.", href: "/collaborate", cta: "View briefs", tag: "Beta" },
            ].map((m) => (
              <Link key={m.name} href={m.href} className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><m.icon className="h-5 w-5" /></span>
                  <Badge tone="teal">{m.tag}</Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{m.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{m.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:underline">{m.cta} <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
            <div className="flex flex-col rounded-2xl border border-dashed border-[#CCD2DE] bg-white/60 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-ink-muted"><ShoppingBag className="h-5 w-5" /></span>
                <Badge>Coming later</Badge>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">RTG Market & creator-owned products</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">Future phases could let creators sell digital products and co-develop their own products with brand partners. Not operational in this demo.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 sm:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/[0.04]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Walk through the full demo.</h2>
                <p className="mt-3 max-w-xl text-white/70">Use the role switcher in the header to experience RTG Live as a user, a creator or an administrator. Every action updates the dashboards in real time.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <ButtonLink href="/explore" size="lg" variant="light">Book a creator</ButtonLink>
                <ButtonLink href="/pitch/new" size="lg" variant="teal">Pitch a product <LineChart className="h-4 w-4" /></ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ModuleCard({
  color, icon, name, title, steps, cta,
}: {
  color: "brand" | "teal";
  icon: React.ReactNode;
  name: string;
  title: string;
  steps: [typeof Search, string, string][];
  cta: [string, string];
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", color === "brand" ? "bg-brand-50 text-brand-600" : "bg-teal-50 text-teal-600")}>{icon}</span>
        <span className="text-sm font-semibold text-ink">{name}</span>
        <Badge tone={color === "brand" ? "brand" : "teal"} className="ml-auto">Live in demo</Badge>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {steps.map(([I, t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold text-ink-muted">{i + 1}</span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink"><I className="h-3.5 w-3.5 text-ink-subtle" />{t}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <ButtonLink href={cta[1]} variant={color === "brand" ? "primary" : "teal"}>{cta[0]} <ArrowRight className="h-4 w-4" /></ButtonLink>
      </div>
    </div>
  );
}
