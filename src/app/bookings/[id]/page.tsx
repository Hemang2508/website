"use client";

import Link from "next/link";
import { Suspense } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CalendarPlus, CheckCircle2, Circle, Lightbulb, Receipt, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container } from "@/components/ui/Misc";
import { SimulatedTag } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { FeeBreakdown } from "@/components/booking/FeeBreakdown";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <BookingDetail />
    </Suspense>
  );
}

function downloadIcs(b: Booking, creatorName: string) {
  const start = new Date(`${b.date}T${b.time}:00+05:30`);
  const end = new Date(start.getTime() + b.durationMins * 60000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RTG Live//Demo//EN", "BEGIN:VEVENT",
    `UID:${b.id}@rtglive.demo`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:${b.serviceTitle} with ${creatorName} (RTG Live)`, `DESCRIPTION:${b.topic.replace(/\n/g, " ")}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url; a.download = `${b.id}.ics`; a.click();
  URL.revokeObjectURL(url);
}

function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const isNew = useSearchParams().get("new") === "1";
  const router = useRouter();
  const { bookings, getCreator, setBookingStatus, setRole, setActiveCreator, toast, hydrated, role } = useStore();
  const b = bookings.find((x) => x.id === id);
  if (!b) {
    if (!hydrated) return <div className="min-h-[70vh]" />;
    notFound();
  }
  const c = getCreator(b.creatorId)!;
  const partner = b.partnerCreatorId ? getCreator(b.partnerCreatorId) : undefined;
  const cancellable = b.status === "pending" || b.status === "confirmed";

  const timeline = [
    { label: "Request sent & payment recorded", done: true, at: formatDate(b.createdAt, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) },
    { label: b.status === "declined" ? "Declined by creator · refunded" : b.status === "cancelled" ? "Cancelled · refunded" : "Confirmed by creator", done: b.status !== "pending", failed: b.status === "declined" || b.status === "cancelled" },
    { label: "Session completed", done: b.status === "completed" },
  ];

  return (
    <Container className="max-w-5xl py-10">
      {isNew && (
        <div className="mb-8 flex flex-col items-center rounded-2xl border border-line bg-white px-6 py-10 text-center shadow-card">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50"><CheckCircle2 className="h-8 w-8 text-teal-500" /></span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">Booking request sent</h1>
          <p className="mt-2 max-w-md text-ink-muted">Your simulated payment was successful. {partner ? `${c.name.split(" ")[0]} & ${partner.name.split(" ")[0]}` : c.name.split(" ")[0]} will confirm your session shortly — we&apos;ll notify you on your dashboard.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/dashboard">Go to my dashboard <ArrowRight className="h-4 w-4" /></ButtonLink>
            <Button variant="secondary" onClick={() => downloadIcs(b, c.name)}><CalendarPlus className="h-4 w-4" />Add to calendar</Button>
          </div>
        </div>
      )}

      {role === "user" && b.status === "pending" && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center">
          <Lightbulb className="h-5 w-5 shrink-0 text-brand-600" />
          <p className="flex-1 text-[13px] text-brand-800"><b>Demo tip:</b> switch to {c.name}&apos;s creator account to accept or decline this request and watch your dashboard update.</p>
          <Button size="sm" onClick={() => { setRole("creator"); setActiveCreator(c.id); toast({ title: `Signed in as ${c.name}`, tone: "info" }); router.push("/creator?tab=bookings"); }}>Open as creator</Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader title={`Booking ${b.id}`} description={`Created ${formatDate(b.createdAt)}`} action={<BookingStatusBadge status={b.status} />} />
          <div className="p-5">
            <div className={partner ? "grid gap-3 sm:grid-cols-2" : ""}>
              {[c, ...(partner ? [partner] : [])].map((x) => (
                <Link key={x.id} href={`/creators/${x.slug}`} className="flex items-center gap-3 rounded-xl border border-line p-3 hover:bg-canvas">
                  <Avatar initials={x.initials} hue={x.avatarHue} size="md" verified={x.verified} />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{x.name}</p>
                    <p className="truncate text-xs text-ink-muted">{x.headline}</p>
                  </div>
                </Link>
              ))}
            </div>
            {partner && b.duoId && <p className="mt-2 text-xs text-ink-subtle">Creator Duo booking — either creator can confirm; earnings are split 50/50.</p>}
            <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Row label="Service" value={`${b.serviceTitle} · ${b.durationMins} min`} />
              <Row label="When" value={`${formatDate(b.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}, ${formatTime(b.time)} IST`} />
              <Row label="Booked by" value={b.userName} />
              <Row label="Contact" value={`${b.userEmail} · ${b.userPhone}`} />
              <Row label="Topic" value={b.topic} className="sm:col-span-2" />
              {b.notes && <Row label="Notes" value={b.notes} className="sm:col-span-2" />}
            </dl>

            <h3 className="mt-8 text-sm font-semibold text-ink">Status</h3>
            <ol className="mt-3 space-y-3">
              {timeline.map((t) => (
                <li key={t.label} className="flex items-start gap-3">
                  {t.failed ? <XCircle className="h-5 w-5 text-red-500" /> : t.done ? <CheckCircle2 className="h-5 w-5 text-teal-500" /> : <Circle className="h-5 w-5 text-line" />}
                  <div>
                    <p className={cn("text-sm", t.done ? "font-medium text-ink" : "text-ink-muted")}>{t.label}</p>
                    {t.at && <p className="text-xs text-ink-subtle">{t.at}</p>}
                  </div>
                </li>
              ))}
            </ol>

            {cancellable && role === "user" && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">
                <Button variant="secondary" onClick={() => downloadIcs(b, c.name)}><CalendarPlus className="h-4 w-4" />Add to calendar</Button>
                <Button variant="danger" onClick={() => { if (confirm("Cancel this booking? A full simulated refund will be issued.")) { setBookingStatus(b.id, "cancelled"); toast({ title: "Booking cancelled", body: "A simulated refund has been issued." }); } }}>Cancel booking</Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader title={<span className="inline-flex items-center gap-2"><Receipt className="h-4 w-4" />Payment receipt</span>} action={<SimulatedTag />} />
          <div className="p-5">
            <FeeBreakdown amount={b.amount} rate={b.commissionRate} platformFee={b.platformFee} creatorEarning={b.creatorEarning} label={b.source === "creator" ? "Creator-originated booking" : "Marketplace booking"} />
            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-xs">
              <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Payment ID</dt><dd className="truncate font-mono text-ink-muted">{b.paymentId}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-subtle">Status</dt><dd className="text-ink-muted">{b.paymentStatus === "refunded_simulated" ? "Refunded (simulated)" : "Paid (simulated)"}</dd></div>
            </dl>
          </div>
        </Card>
      </div>
    </Container>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
