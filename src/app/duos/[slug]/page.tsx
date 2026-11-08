"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, Check, Clock, Globe2, MapPin, Star, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { nextAvailable, WEEKDAYS } from "@/lib/availability";
import { bookingRate, pct, splitAmount } from "@/lib/pricing";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Misc";
import { PageSkeleton } from "@/components/ui/Visual";
import { DuoCard } from "@/components/ecosystem/DuoCard";
import { cn, formatDate, formatINR, formatTime } from "@/lib/utils";

export default function DuoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { duos, creators, isDuoSlotTaken, hydrated } = useStore();
  const duo = duos.find((d) => d.slug === slug);
  if (!duo) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const pair = duo.creatorIds.map((id) => creators.find((c) => c.id === id)!);
  const next = nextAvailable(duo, (d, t) => isDuoSlotTaken(duo, d, t));
  const { platformFee, creatorEarning } = splitAmount(duo.price, bookingRate("marketplace"));
  const others = duos.filter((d) => d.id !== duo.id).slice(0, 3);

  return (
    <Container className="py-8 sm:py-10">
      <Link href="/duos" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />All Creator Duos</Link>
      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <Badge tone="brand">{duo.pairing}</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-[32px]">{duo.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-muted">
            <span className="flex items-center gap-1.5">{duo.format === "Online" ? <Globe2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}{duo.format}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{duo.durationMins} minutes</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />Up to {duo.maxGuests} guest{duo.maxGuests > 1 ? "s" : ""}</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pair.map((c) => (
              <div key={c.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} hue={c.avatarHue} size="lg" verified={c.verified} />
                  <div className="min-w-0"><p className="font-semibold text-ink">{c.name}</p><p className="text-xs text-ink-muted">{c.category} · {c.location}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{c.rating.toFixed(1)} ({c.reviewCount})</p></div>
                </div>
                <p className="mt-3 line-clamp-2 text-[13px] text-ink-muted">{c.headline}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/creators/${c.slug}`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">Profile</Link>
                  <Link href={`/creators/${c.slug}/passport`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">Creator Passport</Link>
                </div>
              </div>
            ))}
          </div>

          <Card className="mt-6 p-5">
            <h2 className="text-[15px] font-semibold text-ink">The experience</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{duo.description}</p>
            <h3 className="mt-5 text-sm font-semibold text-ink">What&apos;s included</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">{duo.includes.map((i) => <li key={i} className="flex items-start gap-2 text-[13.5px] text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />{i}</li>)}</ul>
          </Card>

          <Card className="mt-6 p-5">
            <h2 className="text-[15px] font-semibold text-ink">Joint availability</h2>
            <p className="mt-0.5 text-[13px] text-ink-muted">Slots when both creators are available (IST). Times already booked by either creator are hidden at checkout.</p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const slots = duo.availability[d] ?? [];
                return (
                  <div key={d} className={cn("rounded-xl border p-2 text-center", slots.length ? "border-line bg-white" : "border-dashed border-line")}>
                    <p className="text-xs font-semibold text-ink">{WEEKDAYS[d]}</p>
                    <p className={cn("mt-1 text-[11px]", slots.length ? "text-teal-600" : "text-ink-subtle")}>{slots.length ? slots.map(formatTime).join(", ") : "—"}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <aside>
          <div className="sticky top-24 space-y-4">
            <Card className="p-5">
              <p className="text-[13px] text-ink-muted">Joint experience</p>
              <p className="text-2xl font-semibold tracking-tight text-ink">{formatINR(duo.price)}</p>
              {next && <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-[13px] text-teal-800"><CalendarClock className="h-4 w-4" />Next: <b>{formatDate(next.date, { weekday: "short", day: "numeric", month: "short" })}, {formatTime(next.time)}</b></div>}
              <ButtonLink href={`/duos/${duo.slug}/book`} size="lg" className="mt-4 w-full">Request booking</ButtonLink>
              <dl className="mt-4 space-y-1.5 rounded-xl bg-canvas p-3 text-[12.5px]">
                <div className="flex justify-between"><dt className="text-ink-muted">Platform fee · {pct(bookingRate("marketplace"))}</dt><dd className="text-ink">{formatINR(platformFee)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-muted">{pair[0].name.split(" ")[0]} receives</dt><dd className="text-ink">{formatINR(Math.round(creatorEarning / 2))}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-muted">{pair[1].name.split(" ")[0]} receives</dt><dd className="text-ink">{formatINR(creatorEarning - Math.round(creatorEarning / 2))}</dd></div>
              </dl>
              <p className="mt-2 text-[11px] text-ink-subtle">Proposed marketplace rate and 50/50 split — assumptions for discussion.</p>
            </Card>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-semibold text-ink">More Creator Duos</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{others.map((d) => <DuoCard key={d.id} duo={d} />)}</div>
        </div>
      )}
    </Container>
  );
}
