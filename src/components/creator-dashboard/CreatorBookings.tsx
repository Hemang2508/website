"use client";

import { useState } from "react";
import { Check, Inbox, Link2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Booking } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState, Tabs } from "@/components/ui/Misc";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatINR, formatTime, toISODate } from "@/lib/utils";
import { pct } from "@/lib/pricing";

type F = "requests" | "upcoming" | "past";

export function CreatorBookings({ creatorId }: { creatorId: string }) {
  const { bookings, setBookingStatus, toast, creators } = useStore();
  const [f, setF] = useState<F>("requests");
  const mine = bookings.filter((b) => b.creatorId === creatorId || b.partnerCreatorId === creatorId);
  const groups: Record<F, Booking[]> = {
    requests: mine.filter((b) => b.status === "pending").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    upcoming: mine.filter((b) => b.status === "confirmed").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    past: mine.filter((b) => ["completed", "declined", "cancelled"].includes(b.status)).sort((a, b) => b.date.localeCompare(a.date)),
  };
  const today = toISODate(new Date());

  const act = (b: Booking, status: Booking["status"], msg: string) => {
    setBookingStatus(b.id, status);
    toast({ title: msg, body: `${b.serviceTitle} · ${b.userName}` });
  };

  return (
    <div>
      <Tabs value={f} onChange={setF} tabs={[{ id: "requests", label: "Requests", count: groups.requests.length }, { id: "upcoming", label: "Upcoming", count: groups.upcoming.length }, { id: "past", label: "Past" }]} />
      <div className="mt-4 space-y-3">
        {groups[f].length === 0 && (
          <div className="rounded-2xl border border-line bg-white"><EmptyState icon={<Inbox className="h-5 w-5" />} title={f === "requests" ? "No pending requests" : f === "upcoming" ? "No upcoming sessions" : "No past sessions"} body={f === "requests" ? "New booking requests will appear here for you to accept or decline." : undefined} /></div>
        )}
        {groups[f].map((b) => (
          <div key={b.id} className="rounded-2xl border border-line bg-white shadow-card">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className="w-16 shrink-0 rounded-xl border border-line py-2 text-center">
                <p className="text-[10px] font-semibold uppercase text-brand-600">{formatDate(b.date, { weekday: "short" })}</p>
                <p className="text-xl font-semibold leading-tight text-ink">{formatDate(b.date, { day: "numeric" })}</p>
                <p className="text-[10px] text-ink-subtle">{formatDate(b.date, { month: "short" })}</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{b.userName}</p>
                  <BookingStatusBadge status={b.status} />
                  {b.partnerCreatorId && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                      Duo with {creators.find((x) => x.id === (b.creatorId === creatorId ? b.partnerCreatorId : b.creatorId))?.name}
                    </span>
                  )}
                  {b.source === "creator" && <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700"><Link2 className="h-3 w-3" />Your link</span>}
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">{b.serviceTitle} · {formatTime(b.time)} · {b.durationMins} min · {b.id}</p>
                <p className="mt-2 text-sm text-ink">“{b.topic}”</p>
                {b.notes && <p className="mt-1 text-[13px] text-ink-muted">{b.notes}</p>}
              </div>
              <div className="shrink-0 rounded-xl bg-canvas px-4 py-3 text-[13px] sm:w-52">
                <div className="flex justify-between"><span className="text-ink-muted">Price</span><span className="text-ink">{formatINR(b.amount)}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Fee ({pct(b.commissionRate)})</span><span className="text-ink">−{formatINR(b.platformFee)}</span></div>
                {b.partnerCreatorId && <div className="flex justify-between"><span className="text-ink-muted">Partner share (50%)</span><span className="text-ink">−{formatINR(b.creatorEarning - Math.round(b.creatorEarning / 2))}</span></div>}
                <div className="mt-1 flex justify-between border-t border-line pt-1 font-semibold"><span className="text-ink">You earn</span><span className="text-teal-700">{formatINR(b.partnerCreatorId ? Math.round(b.creatorEarning / 2) : b.creatorEarning)}</span></div>
              </div>
            </div>
            {(b.status === "pending" || b.status === "confirmed") && (
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
                {b.status === "pending" && (
                  <>
                    <Button size="sm" variant="teal" onClick={() => act(b, "confirmed", "Booking confirmed")}><Check className="h-4 w-4" />Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => { if (confirm(`Decline ${b.userName}'s request? They will receive a full simulated refund.`)) act(b, "declined", "Booking declined & refunded"); }}><X className="h-4 w-4" />Decline</Button>
                  </>
                )}
                {b.status === "confirmed" && (
                  <>
                    <Button size="sm" variant="secondary" disabled title="Video SDK integration is planned for a later phase">Join video call · later phase</Button>
                    <Button size="sm" variant="teal" onClick={() => act(b, "completed", "Session marked as completed")}>{b.date > today ? "Mark completed (demo)" : "Mark completed"}</Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
