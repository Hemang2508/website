"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft, Award, BadgeCheck, Briefcase, CalendarDays, CheckCircle2, Circle, ExternalLink, Globe2, Handshake, IdCard, MapPin,
  Megaphone, MessageSquareText, Share2, ShieldAlert, Star, Users, UsersRound, Video,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { buildPassport } from "@/lib/passport";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, SimulatedTag } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container, Stars } from "@/components/ui/Misc";
import { PageSkeleton } from "@/components/ui/Visual";
import { cn, compact, formatDate, formatINR } from "@/lib/utils";

const toneCls = { brand: "bg-brand-50 text-brand-700 ring-brand-100", teal: "bg-teal-50 text-teal-700 ring-teal-100", amber: "bg-amber-50 text-amber-700 ring-amber-100", navy: "bg-[#E8EAF0] text-navy ring-[#D9DCE5]" };

export default function PassportPage() {
  const { slug } = useParams<{ slug: string }>();
  const store = useStore();
  const { getCreator, reviews, hydrated, toast, creators } = store;
  const c = getCreator(slug);
  if (!c) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const p = buildPassport(c, store);
  const myReviews = reviews.filter((r) => r.creatorId === c.id);
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* blocked */ }
    toast({ title: "Passport link copied" });
  };

  return (
    <Container className="max-w-6xl py-8 sm:py-10">
      <Link href={`/creators/${c.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to profile</Link>

      {/* Passport header */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-5 py-3 text-white sm:px-6">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em]"><IdCard className="h-4 w-4 text-teal-400" />RTG Creator Passport</p>
          <p className="font-mono text-[12px] text-white/70">{p.id}</p>
        </div>
        <div className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-center">
          <Avatar initials={c.initials} hue={c.avatarHue} size="xl" verified={c.verified} photo={c.photo} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{c.name}</h1>
              {c.verified ? <Badge tone="brand"><BadgeCheck className="h-3 w-3" />Verified (demo)</Badge> : <Badge tone="amber">Verification pending</Badge>}
            </div>
            <p className="mt-1 text-[15px] text-ink-muted">{c.headline}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] sm:grid-cols-4">
              <div><dt className="text-ink-subtle">Category</dt><dd className="font-medium text-ink">{c.category}</dd></div>
              <div><dt className="text-ink-subtle">Home city</dt><dd className="font-medium text-ink">{c.location}, {p.region.state}</dd></div>
              <div><dt className="text-ink-subtle">Region</dt><dd className="font-medium text-ink">{p.region.region}</dd></div>
              <div><dt className="text-ink-subtle">Member since</dt><dd className="font-medium text-ink">{formatDate(c.joined, { month: "short", year: "numeric" })}</dd></div>
            </dl>
          </div>
          <div className="flex shrink-0 flex-row flex-wrap gap-2 md:flex-col">
            <ButtonLink href={`/creators/${c.slug}`}>Book a session</ButtonLink>
            <Button variant="secondary" onClick={share}><Share2 className="h-4 w-4" />Share passport</Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {/* Track record */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              [MessageSquareText, p.stats.sessions, "Sessions completed"],
              [Star, `${c.rating.toFixed(1)} · ${c.reviewCount}`, "Rating · reviews"],
              [Handshake, p.stats.collaborations, "Brand collaborations"],
              [Megaphone, p.stats.pitchesDelivered, "Pitch reviews on RTG"],
              [CalendarDays, p.stats.eventsHosted, "Regional events hosted"],
              [Users, compact(c.followers), "Social audience"],
            ].map(([I, v, l], i) => {
              const Icon = I as typeof Star;
              return (
                <div key={i} className="rounded-xl border border-line bg-white p-4">
                  <Icon className="h-4 w-4 text-ink-subtle" />
                  <p className="mt-2 text-lg font-semibold text-ink">{v as string}</p>
                  <p className="text-xs text-ink-subtle">{l as string}</p>
                </div>
              );
            })}
          </div>

          <Card>
            <CardHeader title={<span className="inline-flex items-center gap-2"><Award className="h-4 w-4" />Achievements & badges</span>} description="Earned automatically from activity on RTG Live" />
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {p.badges.map((b) => (
                <div key={b.id} className="flex items-start gap-3 rounded-xl border border-line p-3.5">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset", toneCls[b.tone])}><Award className="h-4 w-4" /></span>
                  <div><p className="text-sm font-semibold text-ink">{b.label}</p><p className="text-xs text-ink-muted">{b.description}</p></div>
                </div>
              ))}
              {p.badges.length === 0 && <p className="text-[13px] text-ink-muted">Badges appear as the creator completes sessions and collaborations.</p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="About & expertise" />
            <div className="p-5">
              <p className="text-[14px] leading-relaxed text-ink-muted">{c.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => <span key={t} className="rounded-lg bg-canvas px-2.5 py-1 text-[13px] text-ink">{t}</span>)}
              </div>
              {c.acceptsPitches && c.pitchCategories.length > 0 && (
                <p className="mt-4 text-[13px] text-ink-muted">Reviews product pitches in: <span className="text-ink">{c.pitchCategories.join(", ")}</span></p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title={<span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4" />Portfolio</span>} action={<Badge>Sample data</Badge>} />
            <ul className="divide-y divide-line">
              {p.portfolio.map((it) => (
                <li key={it.title} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                  <Badge tone="neutral" className="w-fit">{it.kind}</Badge>
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium text-ink">{it.title}</p><p className="text-xs text-ink-subtle">{it.org} · {it.year}</p></div>
                  {it.metric && <span className="text-[13px] font-semibold text-teal-700">{it.metric}</span>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Services & pricing" action={<Link href={`/creators/${c.slug}`} className="text-[13px] font-medium text-brand-600">Open profile</Link>} />
            <ul className="divide-y divide-line">
              {c.services.filter((s) => s.active).map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.type === "pitch" ? "bg-teal-50 text-teal-600" : "bg-brand-50 text-brand-600")}>{s.type === "pitch" ? <Megaphone className="h-4 w-4" /> : <Video className="h-4 w-4" />}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{s.title}</p><p className="text-xs text-ink-subtle">{s.type === "pitch" ? "Async · 5 days" : `${s.durationMins} min`}</p></div>
                  <span className="text-sm font-semibold text-ink">{formatINR(s.price)}</span>
                  <ButtonLink size="sm" variant={s.type === "pitch" ? "teal" : "primary"} href={s.type === "pitch" ? `/pitch/new?creator=${c.id}` : `/book/${c.slug}?service=${s.id}`}>{s.type === "pitch" ? "Pitch" : "Book"}</ButtonLink>
                </li>
              ))}
            </ul>
          </Card>

          {(p.duos.length > 0 || p.hosted.length > 0 || p.events.length > 0) && (
            <Card>
              <CardHeader title="On RTG Live" description="Duos, communities and events this creator is part of" />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {p.duos.map((d) => {
                  const partner = creators.find((x) => x.id === d.creatorIds.find((id) => id !== c.id));
                  return (
                    <Link key={d.id} href={`/duos/${d.slug}`} className="rounded-xl border border-line p-3.5 hover:border-brand-300">
                      <Badge tone="brand">Creator Duo</Badge>
                      <p className="mt-2 text-sm font-semibold text-ink">{d.title}</p>
                      <p className="text-xs text-ink-muted">With {partner?.name} · {formatINR(d.price)}</p>
                    </Link>
                  );
                })}
                {p.hosted.map((h) => (
                  <Link key={h.id} href={`/community/${h.slug}`} className="rounded-xl border border-line p-3.5 hover:border-brand-300">
                    <Badge tone="navy"><UsersRound className="h-3 w-3" />Community host</Badge>
                    <p className="mt-2 text-sm font-semibold text-ink">{h.name}</p>
                    <p className="text-xs text-ink-muted">{h.tagline}</p>
                  </Link>
                ))}
                {p.events.map((e) => (
                  <Link key={e.id} href={`/regional/events/${e.id}`} className="rounded-xl border border-line p-3.5 hover:border-brand-300">
                    <Badge tone="teal"><MapPin className="h-3 w-3" />{e.type}</Badge>
                    <p className="mt-2 text-sm font-semibold text-ink">{e.title}</p>
                    <p className="text-xs text-ink-muted">{formatDate(e.date, { weekday: "short", day: "numeric", month: "short" })} · {e.area}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Ratings & reviews" action={<Stars value={c.rating} />} />
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {myReviews.slice(0, 4).map((r) => (
                <div key={r.id} className="rounded-xl bg-canvas p-4">
                  <div className="flex items-center justify-between"><p className="text-[13px] font-semibold text-ink">{r.author}</p><Badge tone="amber">{r.rating}★</Badge></div>
                  <p className="mt-0.5 text-[11px] text-ink-subtle">{r.role}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{r.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader title="Verification" action={<SimulatedTag label="Demo data" />} />
            <ul className="space-y-3 p-5">
              {p.verification.map((v) => (
                <li key={v.label} className="flex items-start gap-3">
                  {v.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-500" /> : <Circle className="mt-0.5 h-4 w-4 text-[#C9CEDA]" />}
                  <div><p className="text-[13px] font-medium text-ink">{v.label}</p><p className="text-xs text-ink-subtle">{v.status}</p></div>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 border-t border-line px-5 py-3.5 text-[11.5px] leading-snug text-ink-muted">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
              Illustrative checklist for the concept demo. No KYC or identity-verification provider is integrated, and no documents have been checked.
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-ink">Region</p>
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between"><dt className="text-ink-subtle">City</dt><dd className="font-medium text-ink">{c.location}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-subtle">State</dt><dd className="font-medium text-ink">{p.region.state}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-subtle">Region</dt><dd className="font-medium text-ink">{p.region.region}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Languages</dt><dd className="text-right font-medium text-ink">{c.languages.join(", ")}</dd></div>
            </dl>
            {p.region.pilot && <Link href="/regional" className="mt-4 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-[12.5px] font-medium text-teal-800"><MapPin className="h-4 w-4" />Regional Connect pilot city</Link>}
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-ink">Social links</p>
            <ul className="mt-3 space-y-2">
              {c.socials.map((s) => (
                <li key={s.platform} className="flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-[13px]">
                  <span className="flex items-center gap-2 text-ink-muted"><Globe2 className="h-4 w-4" />{s.platform}</span>
                  <span className="flex items-center gap-1 font-medium text-ink">{s.handle}<ExternalLink className="h-3 w-3 text-ink-subtle" /></span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-ink-subtle">Handles are sample data and are not linked to live accounts.</p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
