"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarX2, Coffee, Handshake, MapPin, Presentation, ShieldCheck, Users, UtensilsCrossed } from "lucide-react";
import { useStore } from "@/lib/store";
import { CITIES, cityInfo } from "@/lib/data/cities";
import type { EventType } from "@/lib/types";
import { Container, EmptyState } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { Chip, Select, Toggle } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { EventCard } from "@/components/ecosystem/EventCard";
import { cn, toISODate } from "@/lib/utils";

const TYPES: { id: EventType; label: string; icon: typeof Users; desc: string }[] = [
  { id: "Creator meetup", label: "Creator meetups", icon: Users, desc: "Meet creators and fans in person" },
  { id: "Coffee with Creators", label: "Coffee with Creators", icon: Coffee, desc: "Small-group conversations" },
  { id: "Food walk", label: "Food walks", icon: UtensilsCrossed, desc: "Eat your way through the city" },
  { id: "Startup networking", label: "Startup networking", icon: Handshake, desc: "Founders, operators, investors" },
  { id: "Creator workshop", label: "Creator workshops", icon: Presentation, desc: "Hands-on skills sessions" },
];

export default function RegionalPage() {
  return <Suspense fallback={<div className="min-h-[70vh]" />}><Regional /></Suspense>;
}

function Regional() {
  const params = useSearchParams();
  const { city, setCity, events, creators, communities } = useStore();
  const [type, setType] = useState<EventType | "All">((params.get("type") as EventType) || "All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [creatorCat, setCreatorCat] = useState("All");
  const info = cityInfo(city);
  const today = toISODate(new Date());

  const cityEvents = events.filter((e) => e.city === city && e.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const shown = cityEvents.filter((e) => (type === "All" || e.type === type) && (!freeOnly || e.price === 0));
  const cityCreators = creators.filter((c) => c.status === "active" && c.location === city);
  const cats = ["All", ...Array.from(new Set(cityCreators.map((c) => c.category)))];
  const shownCreators = cityCreators.filter((c) => creatorCat === "All" || c.category === creatorCat);
  const cityCommunities = communities.filter((c) => c.city === city || c.city === "All India");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-canvas">
        {/* concentric "ring road" lines — the city as a set of rings */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2" aria-hidden>
          {[1, 0.78, 0.56, 0.34].map((k) => <span key={k} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/15" style={{ width: `${k * 100}%`, height: `${k * 100}%` }} />)}
          <span className="absolute left-[38%] top-[44%] h-24 w-24 rounded-full bg-brand-400/25" />
          <span className="absolute left-[46%] top-[48%] h-24 w-24 rounded-full bg-teal-400/30" />
        </div>
        <Container className="relative py-12 sm:py-16">
          <p className="eyebrow flex items-center gap-2 text-ink-muted"><MapPin className="h-4 w-4 text-teal-600" />Regional Connect</p>
          <h1 className="mt-4 text-ink">
            <span className="block text-[clamp(1.1rem,2vw,1.5rem)] font-medium text-ink-muted">Creators and experiences in</span>{" "}
            <span key={city} className="block font-display text-[clamp(3.4rem,11vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.055em] animate-fade-up">{city}<span className="text-teal-600">.</span></span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              {info.pilot ? <Badge tone="teal" dot>Pilot city</Badge> : <Badge tone="amber" dot>Launching soon</Badge>}
              <span className="text-ink-muted">{info.state} · {info.region}</span>
              <span className="text-ink-subtle">·</span>
              <span className="text-ink-muted"><b className="text-ink">{cityCreators.length}</b> creators · <b className="text-ink">{cityEvents.length}</b> upcoming events · <b className="text-ink">{cityCommunities.length}</b> communities</span>
            </div>
            <div className="w-full max-w-xs">
              <label htmlFor="city" className="mb-1.5 block text-[13px] font-semibold text-ink">Your city</label>
              <Select id="city" value={city} onChange={(e) => { setCity(e.target.value); setCreatorCat("All"); }}>
                {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}{c.pilot ? " · Pilot city" : ""}</option>)}
              </Select>
              <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-ink-subtle"><ShieldCheck className="h-3.5 w-3.5" />Chosen manually — we never request your device location.</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TYPES.map((t) => {
            const n = cityEvents.filter((e) => e.type === t.id).length;
            const active = type === t.id;
            return (
              <button key={t.id} onClick={() => setType(active ? "All" : t.id)} aria-pressed={active}
                className={cn("group rounded-2xl border p-4 text-left transition-[background-color,border-color,transform,box-shadow] duration-base ease-out hover:-translate-y-0.5", active ? "border-navy bg-navy text-white shadow-lift" : "border-line bg-white shadow-card hover:shadow-lift")}>
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", active ? "bg-white/10 text-teal-400" : "bg-brand-50 text-brand-600")}><t.icon className="h-5 w-5" /></span>
                <p className={cn("mt-3 text-sm font-semibold", active ? "text-white" : "text-ink")}>{t.label}</p>
                <p className={cn("mt-0.5 text-xs", active ? "text-white/60" : "text-ink-muted")}>{t.desc}</p>
                <p className={cn("mt-2 text-[11px] font-semibold", active ? "text-teal-400" : "text-ink-subtle")}>{n} upcoming</p>
              </button>
            );
          })}
        </div>

        <div id="events" className="mt-10 scroll-mt-24 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-bold tracking-[-0.015em] text-ink">Upcoming in {city}{type !== "All" && ` · ${type}`}</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[13px] font-medium text-ink">Free events only <Toggle checked={freeOnly} onChange={setFreeOnly} label="Free events only" /></label>
            {(type !== "All" || freeOnly) && <button onClick={() => { setType("All"); setFreeOnly(false); }} className="text-[13px] font-medium text-brand-600">Clear filters</button>}
          </div>
        </div>
        {shown.length ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{shown.map((e, i) => <Reveal key={e.id} delay={(i % 4) * 60} className="h-full"><EventCard event={e} /></Reveal>)}</div>
        ) : (
          <Card className="mt-4">
            <EmptyState
              icon={<CalendarX2 className="h-5 w-5" />}
              title={cityEvents.length ? "No events match these filters" : `No events in ${city} yet`}
              body={cityEvents.length ? "Try another event type or include paid events." : `Regional Connect is piloting in Hyderabad. ${city} events are coming soon.`}
              action={cityEvents.length ? <Button size="sm" variant="secondary" onClick={() => { setType("All"); setFreeOnly(false); }}>Clear filters</Button> : <Button size="sm" onClick={() => setCity("Hyderabad")}>Explore Hyderabad</Button>}
            />
          </Card>
        )}

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-[-0.015em] text-ink">Creators based in {city}</h2>
            <p className="text-[13px] text-ink-muted">Book a session, or meet them at a local event.</p>
          </div>
          <Link href="/explore" className="text-[13px] font-medium text-brand-600">Explore all creators</Link>
        </div>
        {cityCreators.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{cats.map((c) => <Chip key={c} active={creatorCat === c} onClick={() => setCreatorCat(c)}>{c === "All" ? "All categories" : c}</Chip>)}</div>}
        {shownCreators.length ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{shownCreators.map((c, i) => <Reveal key={c.id} delay={(i % 4) * 60} className="h-full"><div className="h-full [&>div]:h-full"><CreatorCard creator={c} /></div></Reveal>)}</div>
        ) : (
          <Card className="mt-4"><EmptyState icon={<Users className="h-5 w-5" />} title={`No creators listed in ${city} yet`} body="Creators set their home city on their profile." /></Card>
        )}
      </Container>
    </>
  );
}
