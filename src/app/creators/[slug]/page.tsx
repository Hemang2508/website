"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft, CalendarClock, Clock, Copy, Globe2, Link2, MapPin, Megaphone, MessageSquareText, Share2, Star, Timer, Users, Video,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container, Stars } from "@/components/ui/Misc";
import { compact, formatDate, formatINR, formatTime, cn } from "@/lib/utils";
import { nextAvailable, WEEKDAYS } from "@/lib/availability";
import { bookingRate, pct } from "@/lib/pricing";
import type { Service } from "@/lib/types";

export default function CreatorProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Profile />
    </Suspense>
  );
}

const serviceIcon = (s: Service) => (s.type === "pitch" ? Megaphone : s.type === "mentorship" ? CalendarClock : Video);

function Profile() {
  const { slug } = useParams<{ slug: string }>();
  const params = useSearchParams();
  const viaCreatorLink = params.get("ref") === "creator";
  const { getCreator, reviews, isSlotTaken, toast, hydrated } = useStore();
  const c = getCreator(slug);
  const [showAll, setShowAll] = useState(false);

  const creatorReviews = useMemo(() => reviews.filter((r) => r.creatorId === c?.id), [reviews, c?.id]);
  if (!c) {
    if (!hydrated) return <div className="min-h-[70vh]" />;
    notFound();
  }
  if (c.status === "suspended") {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">This creator is currently unavailable</h1>
        <ButtonLink href="/explore" className="mt-6">Explore other creators</ButtonLink>
      </Container>
    );
  }

  const ref = viaCreatorLink ? "&ref=creator" : "";
  const bookable = c.services.filter((s) => s.active && s.type !== "pitch");
  const pitchService = c.services.find((s) => s.active && s.type === "pitch");
  const next = nextAvailable(c, (d, t) => isSlotTaken(c.id, d, t));
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: creatorReviews.filter((r) => r.rating === n).length }));
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/creators/${c.slug}?ref=creator` : `/creators/${c.slug}?ref=creator`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch { /* clipboard blocked */ }
    toast({ title: "Personal booking link copied", body: `Bookings through this link use the ${pct(bookingRate("creator"))} creator-originated fee.` });
  };

  return (
    <>
      <div className="h-36 border-b border-line sm:h-44" style={{ background: `linear-gradient(180deg, hsl(${c.avatarHue} 40% 96%), hsl(${c.avatarHue} 30% 92%))` }}>
        <Container className="pt-5">
          <Link href="/explore" className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[13px] font-medium text-ink-muted backdrop-blur hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All creators
          </Link>
        </Container>
      </div>

      <Container className="pb-10">
        {viaCreatorLink && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-[13px] text-teal-800">
            <Link2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>You arrived through <b>{c.name}&apos;s personal booking link</b>. Bookings are treated as creator-originated, so the platform fee is {pct(bookingRate("creator"))} instead of {pct(bookingRate("marketplace"))}.</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {/* Header */}
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar initials={c.initials} hue={c.avatarHue} size="xl" verified={c.verified} ring photo={c.photo} />
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{c.name}</h1>
                  {c.verified && <Badge tone="brand">Verified</Badge>}
                </div>
                <p className="mt-1 text-[15px] text-ink-muted">{c.headline}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={copyLink} className="self-start sm:self-end"><Share2 className="h-4 w-4" />Share profile</Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [Star, `${c.rating.toFixed(1)} rating`, `${c.reviewCount} reviews`],
                [Users, compact(c.followers), "audience"],
                [MessageSquareText, String(c.sessionsCompleted), "sessions completed"],
                [Timer, c.responseTime.replace("Usually ", ""), "response time"],
              ].map(([I, a, b], i) => {
                const Icon = I as typeof Star;
                return (
                  <div key={i} className="rounded-xl border border-line bg-white p-3.5">
                    <Icon className="h-4 w-4 text-ink-subtle" />
                    <p className="mt-2 text-sm font-semibold text-ink">{a as string}</p>
                    <p className="text-xs text-ink-subtle">{b as string}</p>
                  </div>
                );
              })}
            </div>

            <Section title="About">
              <p className="text-[15px] leading-relaxed text-ink-muted">{c.bio}</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{c.location}, India</span>
                <span className="inline-flex items-center gap-1.5"><Globe2 className="h-4 w-4" />{c.languages.join(", ")}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />Member since {formatDate(c.joined, { month: "short", year: "numeric" })}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.tags.map((t) => <span key={t} className="rounded-lg bg-white px-2.5 py-1 text-[13px] text-ink-muted ring-1 ring-line">{t}</span>)}
                {c.socials.map((s) => <span key={s.platform} className="rounded-lg bg-canvas px-2.5 py-1 text-[13px] text-ink-muted">{s.platform} · {s.handle}</span>)}
              </div>
            </Section>

            <Section title="Services">
              <div className="space-y-3">
                {c.services.filter((s) => s.active).map((s) => {
                  const I = serviceIcon(s);
                  const href = s.type === "pitch" ? `/pitch/new?creator=${c.id}` : `/book/${c.slug}?service=${s.id}${ref}`;
                  return (
                    <div key={s.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center">
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.type === "pitch" ? "bg-teal-50 text-teal-600" : "bg-brand-50 text-brand-600")}><I className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{s.title}</p>
                          <Badge tone={s.type === "pitch" ? "teal" : "neutral"}>{s.type === "pitch" ? "RTG Pitch · async" : s.type === "mentorship" ? `${s.durationMins} min · weekly` : `${s.durationMins} min · video call`}</Badge>
                        </div>
                        <p className="mt-1 text-[13px] text-ink-muted">{s.description}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                        <p className="text-lg font-semibold text-ink">{formatINR(s.price)}</p>
                        <ButtonLink href={href} size="sm" variant={s.type === "pitch" ? "teal" : "primary"}>{s.type === "pitch" ? "Send pitch" : "Book"}</ButtonLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Weekly availability" subtitle="Times shown in IST. Exact open slots appear when you book.">
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const slots = c.availability[d] ?? [];
                  return (
                    <div key={d} className={cn("rounded-xl border p-2 text-center", slots.length ? "border-line bg-white" : "border-dashed border-line bg-transparent")}>
                      <p className="text-xs font-semibold text-ink">{WEEKDAYS[d]}</p>
                      <p className={cn("mt-1 text-[11px]", slots.length ? "text-teal-600" : "text-ink-subtle")}>{slots.length ? `${slots.length} slot${slots.length > 1 ? "s" : ""}` : "Off"}</p>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title={`Reviews (${c.reviewCount})`}>
              <div className="grid gap-6 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[180px_1fr]">
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-ink">{c.rating.toFixed(1)}</p>
                  <Stars value={c.rating} size="md" className="mt-1" />
                  <p className="mt-1 text-xs text-ink-subtle">Based on {c.reviewCount} reviews</p>
                </div>
                <div className="space-y-1.5">
                  {dist.map(({ n, count }) => (
                    <div key={n} className="flex items-center gap-3 text-xs text-ink-muted">
                      <span className="w-3">{n}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-canvas"><div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${creatorReviews.length ? (count / creatorReviews.length) * 100 : 0}%` }} /></div>
                      <span className="w-4 text-right">{count}</span>
                    </div>
                  ))}
                  <p className="pt-1 text-[11px] text-ink-subtle">Distribution of recent reviews shown below.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {(showAll ? creatorReviews : creatorReviews.slice(0, 3)).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-line bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{r.author}</p>
                        <p className="text-xs text-ink-subtle">{r.role}</p>
                      </div>
                      <div className="text-right">
                        <Stars value={r.rating} />
                        <p className="mt-0.5 text-[11px] text-ink-subtle">{formatDate(r.date)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{r.text}</p>
                  </div>
                ))}
                {creatorReviews.length > 3 && (
                  <Button variant="ghost" onClick={() => setShowAll((s) => !s)}>{showAll ? "Show fewer reviews" : `Show all ${creatorReviews.length} reviews`}</Button>
                )}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="lg:pt-8">
            <div className="sticky top-24 space-y-4">
              <Card className="p-5">
                <p className="text-[13px] text-ink-muted">Sessions from</p>
                <p className="text-2xl font-semibold tracking-tight text-ink">{formatINR(Math.min(...(bookable.length ? bookable.map((s) => s.price) : [0])))}</p>
                {next && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-[13px] text-teal-800">
                    <CalendarClock className="h-4 w-4" />
                    Next available: <b>{formatDate(next.date, { weekday: "short", day: "numeric", month: "short" })}, {formatTime(next.time)}</b>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {bookable.length > 0 && <ButtonLink href={`/book/${c.slug}?service=${bookable[0].id}${ref}`} className="w-full" size="lg">Book a session</ButtonLink>}
                  {pitchService && <ButtonLink href={`/pitch/new?creator=${c.id}`} variant="secondary" className="w-full" size="lg"><Megaphone className="h-4 w-4" />Send a product pitch · {formatINR(pitchService.price)}</ButtonLink>}
                </div>
                <p className="mt-4 text-center text-xs text-ink-subtle">Free cancellation up to 24 hours before the session.</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-semibold text-ink">Are you {c.name.split(" ")[0]}?</p>
                <p className="mt-1 text-[13px] text-ink-muted">Share your personal link — bookings you bring in carry a lower {pct(bookingRate("creator"))} platform fee.</p>
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={copyLink}><Copy className="h-4 w-4" />Copy personal booking link</Button>
              </Card>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
