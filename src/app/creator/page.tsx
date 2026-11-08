"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CalendarCheck, Copy, ExternalLink, IdCard, Inbox, Megaphone, Star, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container, EmptyState, PageHero, Stat, Tabs } from "@/components/ui/Misc";
import { Badge } from "@/components/ui/Badge";
import { RoleNotice } from "@/components/dashboard/RoleNotice";
import { BarChart } from "@/components/dashboard/BarChart";
import { CreatorBookings } from "@/components/creator-dashboard/CreatorBookings";
import { CreatorServices } from "@/components/creator-dashboard/CreatorServices";
import { CreatorAvailability } from "@/components/creator-dashboard/CreatorAvailability";
import { CreatorProfileEditor } from "@/components/creator-dashboard/CreatorProfileEditor";
import { CreatorAppearanceEditor } from "@/components/creator-dashboard/CreatorAppearanceEditor";
import { CreatorEarnings, useCreatorTx } from "@/components/creator-dashboard/CreatorEarnings";
import { IncomingPitches } from "@/components/pitch/IncomingPitches";
import { CreatorCollabs } from "@/components/creator-dashboard/CreatorCollabs";
import { weeklySeries } from "@/lib/metrics";
import { bookingRate, pct } from "@/lib/pricing";
import { formatDate, formatINR, formatTime, timeAgo, toISODate } from "@/lib/utils";

type Tab = "overview" | "bookings" | "pitches" | "collabs" | "services" | "availability" | "profile" | "earnings";

export default function CreatorDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <CreatorDashboard />
    </Suspense>
  );
}

function CreatorDashboard() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = (params.get("tab") as Tab) || "overview";
  const setTab = (t: Tab) => router.replace(`${pathname}?tab=${t}`, { scroll: false });
  const { creators, activeCreatorId, bookings, pitchRequests, pitches, reviews, toast, notifications, applications } = useStore();
  const c = creators.find((x) => x.id === activeCreatorId) ?? creators[0];
  const { tx, summary } = useCreatorTx(c.id);

  const myBookings = bookings.filter((b) => b.creatorId === c.id || b.partnerCreatorId === c.id);
  const pendingBookings = myBookings.filter((b) => b.status === "pending");
  const upcoming = myBookings.filter((b) => b.status === "confirmed").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const myReqs = pitchRequests.filter((r) => r.creatorId === c.id);
  const pendingPitches = myReqs.filter((r) => r.status === "pending");
  const feedbackDue = myReqs.filter((r) => r.status === "accepted");
  const monthStart = toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const thisMonth = tx.filter((t) => t.status !== "refunded" && t.date >= monthStart).reduce((s, t) => s + t.creatorEarning, 0);
  const myNotifs = notifications.filter((n) => n.role === "creator" && n.creatorId === c.id).slice(0, 5);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/creators/${c.slug}?ref=creator`); } catch { /* blocked */ }
    toast({ title: "Personal booking link copied", body: `Bookings via this link carry a ${pct(bookingRate("creator"))} platform fee.` });
  };

  return (
    <>
    <PageHero
      compact
      eyebrow="Creator dashboard"
      title={<span className="flex items-center gap-4"><Avatar creator={c} size="lg" verified={c.verified} photo={c.photo} /><span>Welcome back, {c.name.split(" ")[0]}</span></span>}
      description={c.headline}
      actions={<>
        <ButtonLink href={`/creators/${c.slug}/passport`} variant="light" size="sm"><IdCard className="h-4 w-4" />My Creator Passport</ButtonLink>
        <Button variant="outline" size="sm" className="border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]" onClick={copyLink}><Copy className="h-4 w-4" />Copy booking link</Button>
        <ButtonLink href={`/creators/${c.slug}`} variant="outline" size="sm" className="border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]"><ExternalLink className="h-4 w-4" />Public profile</ButtonLink>
      </>}
    />
    <Container className="py-10">
      <RoleNotice expected="creator" home="/creator" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "bookings", label: "Bookings", count: pendingBookings.length },
          { id: "pitches", label: "Pitches", count: pendingPitches.length + feedbackDue.length },
          { id: "collabs", label: "Collaborations", count: applications.filter((a) => a.creatorId === c.id && a.status === "shortlisted").length },
          { id: "services", label: "Services & pricing" },
          { id: "availability", label: "Availability" },
          { id: "profile", label: "Profile" },
          { id: "earnings", label: "Earnings" },
        ]}
      />

      <div className="mt-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Earned this month" value={formatINR(thisMonth)} icon={<Wallet className="h-4 w-4" />} accent="teal" sub="Net of platform fees" />
              <Stat label="Pending requests" value={pendingBookings.length + pendingPitches.length} icon={<Inbox className="h-4 w-4" />} accent="amber" sub={`${pendingBookings.length} bookings · ${pendingPitches.length} pitches`} />
              <Stat label="Upcoming sessions" value={upcoming.length} icon={<CalendarCheck className="h-4 w-4" />} />
              <Stat label="Rating" value={<span className="inline-flex items-center gap-1.5">{c.rating.toFixed(1)}<Star className="h-5 w-5 fill-amber-400 text-amber-400" /></span>} icon={<Star className="h-4 w-4" />} accent="navy" sub={`${c.reviewCount} reviews · ${c.sessionsCompleted} sessions`} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader title="Net earnings" description="Last 7 weeks and the week ahead" action={<button onClick={() => setTab("earnings")} className="text-[13px] font-medium text-brand-600">Details</button>} />
                <div className="p-5"><BarChart data={weeklySeries(tx, (t) => t.creatorEarning)} color="teal" /></div>
                <div className="grid grid-cols-3 border-t border-line text-center">
                  <div className="p-4"><p className="text-[11px] text-ink-subtle">Gross</p><p className="font-semibold text-ink">{formatINR(summary.gmv)}</p></div>
                  <div className="border-x border-line p-4"><p className="text-[11px] text-ink-subtle">Platform fees</p><p className="font-semibold text-ink">{formatINR(summary.platformFees)}</p></div>
                  <div className="p-4"><p className="text-[11px] text-ink-subtle">Your earnings</p><p className="font-semibold text-teal-700">{formatINR(summary.creatorEarnings)}</p></div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Needs your attention" />
                <ul className="divide-y divide-line">
                  {pendingBookings.length === 0 && pendingPitches.length === 0 && feedbackDue.length === 0 && (
                    <li><EmptyState icon={<Inbox className="h-5 w-5" />} title="You're all caught up" /></li>
                  )}
                  {pendingBookings.slice(0, 3).map((b) => (
                    <li key={b.id}><button onClick={() => setTab("bookings")} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-canvas">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><CalendarCheck className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-ink">Booking request · {b.userName}</span><span className="block text-xs text-ink-muted">{b.serviceTitle} · {formatDate(b.date, { day: "numeric", month: "short" })}, {formatTime(b.time)}</span></span>
                      <ArrowRight className="h-4 w-4 text-ink-subtle" />
                    </button></li>
                  ))}
                  {[...pendingPitches, ...feedbackDue].slice(0, 3).map((r) => {
                    const p = pitches.find((x) => x.id === r.pitchId);
                    return (
                      <li key={r.id}><button onClick={() => setTab("pitches")} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-canvas">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Megaphone className="h-4 w-4" /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-ink">{r.status === "pending" ? "New pitch" : "Feedback due"} · {p?.productName}</span><span className="block text-xs text-ink-muted">{p?.company} · earn {formatINR(r.creatorEarning)}</span></span>
                        <ArrowRight className="h-4 w-4 text-ink-subtle" />
                      </button></li>
                    );
                  })}
                </ul>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader title="Upcoming sessions" />
                {upcoming.length === 0 ? <EmptyState icon={<CalendarCheck className="h-5 w-5" />} title="No confirmed sessions" /> : (
                  <ul className="divide-y divide-line">
                    {upcoming.slice(0, 4).map((b) => (
                      <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-12 shrink-0 rounded-lg border border-line py-1 text-center"><p className="text-[9px] font-semibold uppercase text-brand-600">{formatDate(b.date, { month: "short" })}</p><p className="font-semibold leading-tight text-ink">{formatDate(b.date, { day: "numeric" })}</p></div>
                        <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-ink">{b.userName} · {b.serviceTitle}</p><p className="text-xs text-ink-muted">{formatTime(b.time)} · {b.durationMins} min</p></div>
                        <span className="text-[13px] font-semibold text-teal-700">{formatINR(b.partnerCreatorId ? Math.round(b.creatorEarning / 2) : b.creatorEarning)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <CardHeader title="Recent activity" />
                <ul className="divide-y divide-line">
                  {myNotifs.map((n) => (
                    <li key={n.id} className="px-5 py-3"><p className="text-[13px] font-medium text-ink">{n.title}</p><p className="text-xs text-ink-muted">{n.body}</p><p className="mt-0.5 text-[11px] text-ink-subtle">{timeAgo(n.createdAt)}</p></li>
                  ))}
                  {myNotifs.length === 0 && <li className="px-5 py-8 text-center text-[13px] text-ink-muted">No recent activity</li>}
                </ul>
              </Card>
            </div>

            <Card>
              <CardHeader title="Latest reviews" action={<Link href={`/creators/${c.slug}`} className="text-[13px] font-medium text-brand-600">See all</Link>} />
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                {reviews.filter((r) => r.creatorId === c.id).slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-xl bg-canvas p-4">
                    <div className="flex items-center justify-between"><p className="text-[13px] font-semibold text-ink">{r.author}</p><Badge tone="amber">{r.rating}★</Badge></div>
                    <p className="mt-2 line-clamp-3 text-[13px] text-ink-muted">{r.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        {tab === "bookings" && <CreatorBookings creatorId={c.id} />}
        {tab === "pitches" && (c.acceptsPitches || myReqs.length ? <IncomingPitches creatorId={c.id} /> : (
          <Card><EmptyState icon={<Megaphone className="h-5 w-5" />} title="Pitch reviews are turned off" body="Enable RTG Pitch in your profile settings to receive paid product pitches from brands." action={<Button size="sm" onClick={() => setTab("profile")}>Open profile settings</Button>} /></Card>
        ))}
        {tab === "collabs" && <CreatorCollabs creator={c} />}
        {tab === "services" && <CreatorServices creator={c} />}
        {tab === "availability" && <CreatorAvailability key={c.id} creator={c} />}
        {tab === "profile" && <div className="space-y-6"><CreatorAppearanceEditor key={`ap-${c.id}`} creator={c} /><CreatorProfileEditor key={c.id} creator={c} /></div>}
        {tab === "earnings" && <CreatorEarnings creatorId={c.id} />}
      </div>
    </Container>
    </>
  );
}
