"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight, Briefcase, CalendarCheck, CheckCircle2, ClipboardCheck, FlaskConical, Handshake, IdCard, MapPin, MessagesSquare,
  PackageSearch, Search, ShieldCheck, ShoppingBag, Sparkles, UserRound, UsersRound, Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Container, SectionHeading } from "@/components/ui/Misc";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Visual } from "@/components/ui/Visual";
import { cardInteractive } from "@/components/ui/Card";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { HeroPreview } from "@/components/landing/HeroPreview";
import { FeeCalculator } from "@/components/landing/FeeCalculator";
import { EventCard } from "@/components/ecosystem/EventCard";
import { DuoCard } from "@/components/ecosystem/DuoCard";
import { CollabCard } from "@/components/ecosystem/collab";
import { SCORE_LABELS, avgScore } from "@/components/pitch/Feedback";
import { CATEGORIES } from "@/lib/data/creators";
import { cn, formatTime, toISODate } from "@/lib/utils";
import type { PitchFeedback } from "@/lib/types";

const AUDIENCES = [
  {
    id: "individuals", icon: UserRound, label: "For individuals", title: "Talk to someone who has done it.",
    steps: ["Search creators by expertise, city, price and language", "Pick a service and an open time slot", "Pay securely and join your session"],
    cta: ["Explore creators", "/explore"],
  },
  {
    id: "for-creators", icon: Sparkles, label: "For creators", title: "Turn expertise into a bookable business.",
    steps: ["Build your Creator Passport and set your prices", "Accept bookings, pitches and brand briefs", "Track earnings, fees and payouts in one place"],
    cta: ["Preview the creator dashboard", "/creator"],
  },
  {
    id: "businesses", icon: Briefcase, label: "For brands", title: "Reach the right creators, with structure.",
    steps: ["Pitch a product for scored creator feedback", "Post a collaboration brief with clear deliverables", "Shortlist and accept creators who fit"],
    cta: ["Pitch a product", "/pitch/new"],
  },
] as const;

export default function HomePage() {
  const { creators, communities, events, duos, collaborations, pitchRequests, pitches, memberCount } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const featured = creators.filter((c) => c.featured && c.status === "active").slice(0, 4);
  const today = toISODate(new Date());
  const upcoming = events.filter((e) => e.city === "Hyderabad" && e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const openBriefs = collaborations.filter((c) => c.status === "open").slice(0, 3);
  const sample = pitchRequests.find((r) => r.feedback && pitches.find((p) => p.id === r.pitchId)?.isDemoUser);
  const samplePitch = sample && pitches.find((p) => p.id === sample.pitchId);
  const sampleCreator = sample && creators.find((c) => c.id === sample.creatorId);
  const ananya = creators.find((c) => c.id === "c1");

  return (
    <>
      {/* 1 · HERO */}
      <section className="surface-dark relative overflow-hidden text-white">
        <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative grid grid-cols-1 items-center gap-16 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-medium text-white/80 animate-fade-up">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />Creator ecosystem · Hyderabad pilot
            </p>
            <h1 className="mt-6 font-display text-display-xl text-white animate-fade-up [animation-delay:80ms]">
              Where Ideas<br />Meet <span className="text-gradient">Influence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 animate-fade-up [animation-delay:160ms]">
              Discover creators, build meaningful connections and turn your ideas into opportunities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]">
              <ButtonLink href="/explore" size="lg">Explore Creators <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover/btn:translate-x-0.5" /></ButtonLink>
              <ButtonLink href="/#for-creators" size="lg" variant="outline" className="border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]">Become a Creator</ButtonLink>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); router.push(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`); }}
              className="mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.07] p-1.5 backdrop-blur animate-fade-up [animation-delay:320ms] focus-within:border-white/30"
              role="search"
            >
              <label className="flex flex-1 items-center gap-2.5 pl-3">
                <Search className="h-5 w-5 shrink-0 text-white/50" />
                <span className="sr-only">Search creators</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “D2C pricing”, “pitch deck” or “food walks”" className="h-11 w-full min-w-0 bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none" />
              </label>
              <button type="submit" className="h-11 shrink-0 rounded-xl bg-white px-4 text-sm font-semibold text-navy transition-colors duration-fast hover:bg-white/90 sm:px-5">Find experts</button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-white/50 animate-fade-up [animation-delay:380ms]">
              <span>Popular:</span>
              {["Go-to-market", "Fundraising", "Influencer marketing", "Interview prep"].map((t) => (
                <Link key={t} href={`/explore?q=${encodeURIComponent(t)}`} className="rounded-full border border-white/12 px-3 py-1 text-white/70 transition-colors duration-fast hover:border-white/35 hover:text-white">{t}</Link>
              ))}
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm animate-fade-up [animation-delay:440ms]">
              {[[creators.filter((c) => c.status === "active").length, "creators"], [communities.length, "communities"], [events.filter((e) => e.date >= today).length, "upcoming events"], [duos.length, "creator duos"]].map(([n, l]) => (
                <div key={l as string}><dt className="sr-only">{l}</dt><dd><span className="font-display text-2xl font-bold text-white">{n}</span> <span className="text-white/55">{l}</span></dd></div>
              ))}
              <p className="w-full text-[11px] text-white/35">Counts reflect the sample data in this demo.</p>
            </dl>
          </div>
          <HeroPreview />
        </Container>
      </section>

      {/* 2 · FEATURED CREATORS */}
      <section className="py-section">
        <Container>
          <Reveal><SectionHeading eyebrow="Featured creators" title="Practitioners, not personalities." description="Founders, operators and creators with real track records — every profile backed by a Creator Passport." action={<ButtonLink href="/explore" variant="secondary">View all creators <ArrowRight className="h-4 w-4" /></ButtonLink>} /></Reveal>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((c) => <Link key={c} href={`/explore?category=${encodeURIComponent(c)}`} className="shrink-0 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink-muted transition-colors duration-fast hover:border-navy hover:text-ink">{c}</Link>)}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c, i) => <Reveal key={c.id} delay={i * 70} className="flex"><div className="w-full"><CreatorCard creator={c} /></div></Reveal>)}
          </div>
        </Container>
      </section>

      {/* 3 · HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-line bg-white py-section">
        <Container>
          <Reveal><SectionHeading align="center" eyebrow="How RTG Live works" title="One platform. Three ways to win." description="Whether you're looking for advice, sharing expertise or building a brand, the journey takes three steps." /></Reveal>
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.id} delay={i * 90} className="h-full">
                <div id={a.id} className={cn("flex h-full scroll-mt-28 flex-col rounded-3xl border p-7", i === 1 ? "surface-dark border-transparent text-white" : "border-line bg-canvas")}>
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", i === 1 ? "bg-white/10 text-teal-400" : "bg-white text-brand-600 shadow-card")}><a.icon className="h-5 w-5" /></span>
                  <p className={cn("eyebrow mt-6", i === 1 ? "text-teal-400" : "text-brand-600")}>{a.label}</p>
                  <h3 className={cn("mt-2 font-display text-[22px] font-bold leading-tight tracking-[-0.02em]", i === 1 ? "text-white" : "text-ink")}>{a.title}</h3>
                  <ol className="mt-6 flex-1 space-y-4">
                    {a.steps.map((s, j) => (
                      <li key={s} className="flex gap-3">
                        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", i === 1 ? "bg-white/10 text-white" : "bg-white text-ink shadow-card")}>{j + 1}</span>
                        <span className={cn("pt-0.5 text-[14px]", i === 1 ? "text-white/75" : "text-ink-muted")}>{s}</span>
                      </li>
                    ))}
                  </ol>
                  <ButtonLink href={a.cta[1]} variant={i === 1 ? "light" : "secondary"} className="mt-8 w-full">{a.cta[0]} <ArrowRight className="h-4 w-4" /></ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 · RTG CONNECT */}
      <section className="py-section">
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 text-brand-600"><MessagesSquare className="h-4 w-4" />RTG Connect</p>
              <h2 className="mt-3 font-display text-display-lg text-ink">Book a conversation in minutes.</h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-muted">Choose a service, pick an open slot on the creator&apos;s calendar and check out. Creators confirm or decline — and declined requests are refunded in full.</p>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[[Search, "Discover by expertise & city"], [CalendarCheck, "Live availability calendar"], [Wallet, "Transparent fees at checkout"], [ShieldCheck, "Free cancellation up to 24h"]].map(([I, t]) => {
                  const Icon = I as typeof Search;
                  return <li key={t as string} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-ink shadow-card"><Icon className="h-5 w-5 text-brand-600" />{t as string}</li>;
                })}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/explore">Find a creator</ButtonLink><ButtonLink href="/duos" variant="secondary">Try a Creator Duo</ButtonLink></div>
            </Reveal>
            {ananya && (
              <Reveal delay={120}>
                <div className="rounded-3xl border border-line bg-white p-6 shadow-lift">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-[15px] font-bold text-ink">Book · {ananya.name}</p>
                    <Badge tone="brand">Step 1 of 3</Badge>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-canvas"><div className="h-full w-1/3 origin-left rounded-full bg-brand-500 animate-grow-x" /></div>
                  <div className="mt-5 space-y-2.5">
                    {ananya.services.filter((s) => s.type !== "pitch").map((s, i) => (
                      <Link key={s.id} href={`/book/${ananya.slug}?service=${s.id}`} className={cn("flex items-center justify-between rounded-2xl border p-4 transition-colors duration-fast hover:border-brand-300", i === 1 ? "border-brand-500 bg-brand-50/60" : "border-line")}>
                        <span><span className="block text-sm font-semibold text-ink">{s.title}</span><span className="text-xs text-ink-subtle">{s.durationMins} min · video call</span></span>
                        <span className="font-display font-bold text-ink">₹{s.price.toLocaleString("en-IN")}</span>
                      </Link>
                    ))}
                  </div>
                  <p className="mb-2 mt-5 text-xs font-semibold text-ink-muted">Popular times (IST)</p>
                  <div className="grid grid-cols-4 gap-2">{(ananya.availability[1] ?? ["10:00", "11:00", "16:00", "17:00"]).slice(0, 4).map((t, i) => <span key={t} className={cn("rounded-xl border py-2 text-center text-xs font-semibold", i === 1 ? "border-navy bg-navy text-white" : "border-line text-ink")}>{formatTime(t)}</span>)}</div>
                </div>
              </Reveal>
            )}
          </div>
          <div id="fees" className="mt-20 scroll-mt-24">
            <Reveal><SectionHeading eyebrow="Transparent fees" title="Creators keep the majority of every booking." description="The platform fee and creator earnings are shown on every checkout, booking and payout." /></Reveal>
            <Reveal delay={80}><div className="mt-10"><FeeCalculator /></div></Reveal>
          </div>
        </Container>
      </section>

      {/* 5 · RTG PITCH */}
      <section className="surface-dark relative overflow-hidden py-section text-white">
        <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
          <Reveal className="order-2 lg:order-1">
            {sample?.feedback && (
              <div className="rounded-3xl border border-white/10 bg-white p-6 text-ink shadow-pop">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">Creator feedback</p>
                    <p className="mt-1 font-display text-lg font-bold">{samplePitch?.productName}</p>
                    <p className="text-[13px] text-ink-muted">Reviewed by {sampleCreator?.name}</p>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2 text-center"><p className="font-display text-2xl font-bold">{avgScore(sample.feedback)}</p><p className="text-[10px] text-ink-subtle">out of 5</p></div>
                </div>
                <div className="mt-5 space-y-3">
                  {(Object.keys(SCORE_LABELS) as (keyof PitchFeedback["scores"])[]).map((k, i) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-[13px] text-ink-muted sm:w-44">{SCORE_LABELS[k]}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas"><div className="h-full origin-left rounded-full bg-gradient-to-r from-brand-500 to-teal-500 animate-grow-x" style={{ width: `${(sample.feedback!.scores[k] / 5) * 100}%`, animationDelay: `${i * 80}ms` }} /></div>
                      <span className="w-8 text-right text-[13px] font-bold">{sample.feedback!.scores[k]}/5</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-2xl bg-canvas p-4 text-[13px] leading-relaxed text-ink-muted">“{sample.feedback.strengths}”</p>
              </div>
            )}
          </Reveal>
          <Reveal delay={100} className="order-1 lg:order-2">
            <p className="eyebrow inline-flex items-center gap-2 text-teal-400"><PackageSearch className="h-4 w-4" />RTG Pitch</p>
            <h2 className="mt-3 font-display text-display-lg text-white">Structured feedback before you spend on campaigns.</h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70">Submit your product once, match with creators who review your category, and get comparable scorecards on clarity, value, design, pricing and audience fit.</p>
            <ol className="mt-8 space-y-3">
              {[[PackageSearch, "Submit product details and images"], [UsersRound, "Match with relevant creators"], [ClipboardCheck, "Track responses and compare scorecards"]].map(([I, t], i) => {
                const Icon = I as typeof Search;
                return <li key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-teal-400"><Icon className="h-4 w-4" /></span><span className="text-sm font-medium text-white/85">{t as string}</span></li>;
              })}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/pitch/new" variant="light">Pitch a product <ArrowRight className="h-4 w-4" /></ButtonLink><ButtonLink href="/explore?pitch=1" variant="outline" className="border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]">Creators who review pitches</ButtonLink></div>
          </Reveal>
        </Container>
      </section>

      {/* 6 · COMMUNITY & REGIONAL */}
      <section className="py-section">
        <Container>
          <Reveal><SectionHeading eyebrow="Community & regional experiences" title="Meet the people behind the profiles." description="Join creator-hosted communities and show up in person — food walks, Coffee with Creators, founder mixers and workshops, starting in Hyderabad." action={<div className="flex gap-2"><ButtonLink href="/community" variant="secondary">Communities</ButtonLink><ButtonLink href="/regional">Hyderabad events</ButtonLink></div>} /></Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {communities.slice(0, 3).map((c, i) => (
              <Reveal key={c.id} delay={i * 70} className="h-full">
                <Link href={`/community/${c.slug}`} className={cn("group block h-full overflow-hidden", cardInteractive)}>
                  <Visual hue={c.hue} icon={c.icon} className="h-36"><div className="p-4"><Badge className="bg-white">{c.category}</Badge></div></Visual>
                  <div className="p-5">
                    <p className="font-display text-lg font-bold text-ink group-hover:text-brand-600">{c.name}</p>
                    <p className="mt-1 line-clamp-2 text-[13px] text-ink-muted">{c.tagline}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-subtle"><UsersRound className="h-3.5 w-3.5" />{memberCount(c).toLocaleString("en-IN")} members · demo figure</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between">
            <p className="flex items-center gap-2 font-display text-lg font-bold text-ink"><MapPin className="h-5 w-5 text-teal-600" />Coming up in Hyderabad</p>
            <Link href="/regional" className="text-sm font-semibold text-brand-600 hover:underline">All events</Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">{upcoming.map((e, i) => <Reveal key={e.id} delay={i * 70} className="h-full"><EventCard event={e} /></Reveal>)}</div>
        </Container>
      </section>

      {/* 7 · CREATOR DUOS */}
      <section className="border-y border-line bg-white py-section">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 text-brand-600"><Sparkles className="h-4 w-4" />Creator Duos</p>
              <h2 className="mt-3 font-display text-display-lg text-ink">Two creators. One experience.</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">Food + Travel, Finance + Career, Fitness + Lifestyle, Gaming + Entertainment. Book a joint session in a single request — both creators share the work and the earnings.</p>
              <ButtonLink href="/duos" className="mt-8">Explore Creator Duos <ArrowRight className="h-4 w-4" /></ButtonLink>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{duos.slice(0, 2).map((d, i) => <Reveal key={d.id} delay={i * 90} className="h-full"><DuoCard duo={d} /></Reveal>)}</div>
          </div>
        </Container>
      </section>

      {/* 8 · BRAND COLLABORATIONS */}
      <section className="py-section">
        <Container>
          <Reveal><SectionHeading eyebrow="RTG Collaborate · Beta" title="Brand collaborations, organised." description="Brands post briefs with clear requirements and deliverables. Creators apply, and both sides track every application to acceptance." action={<ButtonLink href="/collaborate" variant="secondary">View all briefs <ArrowRight className="h-4 w-4" /></ButtonLink>} /></Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">{openBriefs.map((c, i) => <Reveal key={c.id} delay={i * 70} className="h-full"><CollabCard collab={c} /></Reveal>)}</div>
          <Reveal>
            <div id="ecosystem" className="mt-8 grid grid-cols-1 scroll-mt-24 gap-5 rounded-3xl border border-dashed border-[#D6D1C7] bg-white/50 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex gap-2"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-muted shadow-card"><ShoppingBag className="h-5 w-5" /></span><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink-muted shadow-card"><FlaskConical className="h-5 w-5" /></span></div>
              <div>
                <p className="font-display font-bold text-ink">Coming later: RTG Market, video sessions & creator-owned products</p>
                <p className="mt-1 text-[13px] text-ink-muted">Future phases could add digital product sales, built-in video calls and co-developed creator products. None of these are operational in this demo.</p>
              </div>
              <Badge>Future roadmap</Badge>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 9 · FINAL CTA */}
      <section>
        <Container>
          <Reveal>
            <div className="surface-dark relative overflow-hidden rounded-[2rem] px-6 py-16 text-white sm:px-14">
              <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h2 className="font-display text-display-lg text-white">Walk through the full demo.</h2>
                  <p className="mt-4 max-w-xl text-white/70">Use the role switcher in the header to experience RTG Live as a user, a creator or an administrator. Every action updates the dashboards instantly.</p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                    {[[IdCard, "Creator Passports"], [Handshake, "Brand briefs"], [CheckCircle2, "Simulated payments, clearly labelled"]].map(([I, t]) => { const Icon = I as typeof Search; return <li key={t as string} className="flex items-center gap-2"><Icon className="h-4 w-4 text-teal-400" />{t as string}</li>; })}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <ButtonLink href="/explore" size="lg" variant="light">Book a creator</ButtonLink>
                  <ButtonLink href="/pitch/new" size="lg" variant="teal">Pitch a product</ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
