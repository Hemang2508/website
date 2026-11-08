"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck, CalendarX2, ChevronRight, Megaphone, Star, Wallet, MessageSquareText } from "lucide-react";
import { useMyNotifications, useStore } from "@/lib/store";
import type { Booking } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, EmptyState, PageHeader, Stat, Tabs } from "@/components/ui/Misc";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { PitchListItem } from "@/components/pitch/PitchListItem";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import { RoleNotice } from "@/components/dashboard/RoleNotice";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { formatDate, formatINR, formatTime, timeAgo } from "@/lib/utils";

export default function UserDashboard() {
  const { bookings, pitches, pitchRequests, creators, demoUser, setBookingStatus, addReview, toast } = useStore();
  const notifications = useMyNotifications();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [reviewing, setReviewing] = useState<Booking | null>(null);

  const mine = useMemo(() => bookings.filter((b) => b.isDemoUser), [bookings]);
  const upcoming = mine.filter((b) => b.status === "pending" || b.status === "confirmed").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = mine.filter((b) => !(b.status === "pending" || b.status === "confirmed")).sort((a, b) => b.date.localeCompare(a.date));
  const spent = mine.filter((b) => b.paymentStatus === "paid_simulated").reduce((s, b) => s + b.amount, 0)
    + pitchRequests.filter((r) => pitches.find((p) => p.id === r.pitchId)?.isDemoUser && r.status !== "declined").reduce((s, r) => s + r.fee, 0);
  const myPitches = pitches.filter((p) => p.isDemoUser);
  const myReqs = pitchRequests.filter((r) => myPitches.some((p) => p.id === r.pitchId));
  const toReview = past.filter((b) => b.status === "completed" && !b.reviewed);
  const recommended = creators.filter((c) => c.status === "active" && !mine.some((b) => b.creatorId === c.id)).sort((a, b) => b.rating - a.rating).slice(0, 3);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <Container className="py-10">
      <RoleNotice expected="user" home="/dashboard" />
      <PageHeader
        eyebrow={demoUser.title}
        title={`${greeting}, ${demoUser.name.split(" ")[0]}`}
        description="Your sessions, pitches and activity in one place."
        actions={<><ButtonLink href="/explore" variant="secondary">Book a creator</ButtonLink><ButtonLink href="/pitch/new">Pitch a product</ButtonLink></>}
      />

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Upcoming sessions" value={upcoming.length} icon={<CalendarCheck className="h-4 w-4" />} sub={`${upcoming.filter((b) => b.status === "pending").length} awaiting confirmation`} />
        <Stat label="Sessions completed" value={mine.filter((b) => b.status === "completed").length} icon={<MessageSquareText className="h-4 w-4" />} accent="teal" />
        <Stat label="Active pitches" value={myPitches.length} icon={<Megaphone className="h-4 w-4" />} accent="navy" sub={`${myReqs.filter((r) => r.status === "feedback_submitted").length} feedback reports received`} />
        <Stat label="Total spent" value={formatINR(spent)} icon={<Wallet className="h-4 w-4" />} accent="amber" sub="Simulated payments" />
      </div>

      {toReview.length > 0 && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500"><Star className="h-5 w-5 fill-amber-400" /></span>
          <p className="flex-1 text-sm text-ink">How was your <b>{toReview[0].serviceTitle}</b> with {creators.find((c) => c.id === toReview[0].creatorId)?.name}?</p>
          <Button size="sm" onClick={() => setReviewing(toReview[0])}>Leave a review</Button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="px-5 pt-4">
              <h2 className="text-[15px] font-semibold text-ink">My bookings</h2>
              <Tabs className="mt-2" value={tab} onChange={setTab} tabs={[{ id: "upcoming", label: "Upcoming", count: upcoming.length }, { id: "past", label: "Past & cancelled", count: past.length }]} />
            </div>
            {list.length === 0 ? (
              <EmptyState icon={<CalendarX2 className="h-5 w-5" />} title={tab === "upcoming" ? "No upcoming sessions" : "No past sessions yet"} body="Find a creator and book your first conversation." action={<ButtonLink href="/explore" size="sm">Explore creators</ButtonLink>} />
            ) : (
              <ul className="divide-y divide-line">
                {list.map((b) => {
                  const c = creators.find((x) => x.id === b.creatorId)!;
                  return (
                    <li key={b.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                      <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1">
                        <div className="hidden w-14 shrink-0 rounded-xl border border-line py-1.5 text-center sm:block">
                          <p className="text-[10px] font-semibold uppercase text-brand-600">{formatDate(b.date, { month: "short" })}</p>
                          <p className="text-lg font-semibold leading-tight text-ink">{formatDate(b.date, { day: "numeric" })}</p>
                        </div>
                        <Avatar initials={c.initials} hue={c.avatarHue} size="sm" />
                        <div className="min-w-0">
                          <Link href={`/bookings/${b.id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-600">{b.serviceTitle} · {c.name}</Link>
                          <p className="truncate text-xs text-ink-muted">{formatDate(b.date, { weekday: "short", day: "numeric", month: "short" })}, {formatTime(b.time)} · {formatINR(b.amount)} · {b.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <BookingStatusBadge status={b.status} />
                        {b.status === "completed" && !b.reviewed && <Button size="sm" variant="secondary" onClick={() => setReviewing(b)}>Review</Button>}
                        {b.status === "completed" && b.reviewed && <span className="text-xs text-ink-subtle">Reviewed</span>}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <Button size="sm" variant="ghost" onClick={() => { if (confirm("Cancel this booking? A full simulated refund will be issued.")) { setBookingStatus(b.id, "cancelled"); toast({ title: "Booking cancelled", body: "Simulated refund issued." }); } }}>Cancel</Button>
                        )}
                        <Link href={`/bookings/${b.id}`} className="rounded-md p-1 text-ink-subtle hover:bg-canvas hover:text-ink" aria-label="View booking"><ChevronRight className="h-4 w-4" /></Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink">Pitch tracker</h2>
              <Link href="/pitch" className="text-[13px] font-medium text-brand-600 hover:text-brand-700">View all</Link>
            </div>
            <div className="space-y-3">
              {myPitches.length === 0 ? (
                <Card><EmptyState icon={<Megaphone className="h-5 w-5" />} title="No pitches yet" action={<ButtonLink href="/pitch/new" size="sm">Pitch a product</ButtonLink>} /></Card>
              ) : (
                myPitches.slice(0, 3).map((p) => <PitchListItem key={p.id} pitch={p} requests={pitchRequests.filter((r) => r.pitchId === p.id)} creators={creators} />)
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Recent activity" />
            <ul className="divide-y divide-line">
              {notifications.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <Link href={n.href ?? "#"} className="block px-5 py-3 hover:bg-canvas">
                    <p className="text-[13px] font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>
                    <p className="mt-1 text-[11px] text-ink-subtle">{timeAgo(n.createdAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <div>
            <h2 className="mb-3 text-[15px] font-semibold text-ink">Recommended for you</h2>
            <div className="space-y-4">{recommended.map((c) => <CreatorCard key={c.id} creator={c} />)}</div>
          </div>
        </aside>
      </div>

      {reviewing && (
        <ReviewModal
          open
          onClose={() => setReviewing(null)}
          creatorName={creators.find((c) => c.id === reviewing.creatorId)?.name ?? ""}
          onSubmit={(r, t) => { addReview(reviewing.id, r, t); toast({ title: "Review published", body: "Thank you — it now appears on the creator's profile." }); setReviewing(null); }}
        />
      )}
    </Container>
  );
}
