"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, CalendarPlus, CheckCircle2, Clock, MapPin, Ticket, Users, UsersRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, SimulatedTag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Container } from "@/components/ui/Misc";
import { PageSkeleton, Visual } from "@/components/ui/Visual";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { cn, formatDate, formatINR, formatTime } from "@/lib/utils";
import type { RegionalEvent } from "@/lib/types";

function ics(e: RegionalEvent) {
  const start = new Date(`${e.date}T${e.time}:00+05:30`);
  const end = new Date(start.getTime() + e.durationMins * 60000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RTG Live//Demo//EN", "BEGIN:VEVENT", `UID:${e.id}@rtglive.demo`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${e.title} (RTG Live)`, `LOCATION:${e.area}, ${e.city}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const a = document.createElement("a"); a.href = url; a.download = `${e.id}.ics`; a.click(); URL.revokeObjectURL(url);
}

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { events, creators, communities, registeredCount, myRegistration, registerForEvent, cancelRegistration, demoUser, role, activeCreatorId, toast, hydrated } = useStore();
  const defaultName = role === "user" ? demoUser.name : role === "creator" ? creators.find((c) => c.id === activeCreatorId)?.name ?? "" : "";
  const [name, setName] = useState(defaultName);
  const [err, setErr] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const e = events.find((x) => x.id === id);
  if (!e) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const hosts = e.creatorIds.map((cid) => creators.find((c) => c.id === cid)!).filter(Boolean);
  const community = communities.find((c) => c.id === e.communityId);
  const taken = registeredCount(e);
  const full = taken >= e.capacity;
  const reg = hydrated ? myRegistration(e.id) : undefined;

  const register = () => {
    if (name.trim().length < 2) { setErr("Enter the attendee name"); return; }
    setErr("");
    if (e.price > 0) { setPayOpen(true); return; }
    registerForEvent(e.id, name.trim());
    toast({ title: "You're registered", body: e.title });
  };

  return (
    <>
      <Visual hue={e.hue} icon={e.type} size="lg" className="h-40 border-b border-line sm:h-48">
        <Container className="pt-5"><Link href="/regional" className="inline-flex items-center gap-1.5 rounded-lg bg-white/85 px-2.5 py-1.5 text-[13px] font-medium text-ink-muted backdrop-blur hover:text-ink"><ArrowLeft className="h-4 w-4" />Regional events</Link></Container>
      </Visual>
      <Container className="pb-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="relative -mt-10 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap gap-2"><Badge tone="brand">{e.type}</Badge><Badge>{e.city}</Badge>{full && <Badge tone="red">Sold out</Badge>}</div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{e.title}</h1>
              <div className="mt-4 grid gap-3 text-[13.5px] text-ink-muted sm:grid-cols-3">
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-ink-subtle" />{formatDate(e.date, { weekday: "long", day: "numeric", month: "long" })}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-ink-subtle" />{formatTime(e.time)} · {Math.round((e.durationMins / 60) * 10) / 10} hrs</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-subtle" />{e.area}</p>
              </div>
            </div>

            <Card className="mt-6 p-5">
              <h2 className="text-[15px] font-semibold text-ink">About this event</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{e.description}</p>
              <h3 className="mt-6 text-sm font-semibold text-ink">Agenda</h3>
              <ol className="mt-3 space-y-2.5">
                {e.agenda.map((a, i) => (
                  <li key={a} className="flex items-start gap-3 text-[13.5px] text-ink"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-ink-muted">{i + 1}</span>{a}</li>
                ))}
              </ol>
              <p className="mt-6 flex items-start gap-2 rounded-xl bg-canvas p-3 text-[12.5px] text-ink-muted"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />Only the neighbourhood is shown publicly. In production the exact venue would be shared with registered attendees; this demo does not send messages.</p>
            </Card>

            <Card className="mt-6">
              <CardHeader title="Hosted by" />
              <ul className="divide-y divide-line">
                {hosts.map((h) => (
                  <li key={h.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar initials={h.initials} hue={h.avatarHue} size="md" verified={h.verified} />
                      <div className="min-w-0"><p className="font-semibold text-ink">{h.name}</p><p className="truncate text-xs text-ink-muted">{h.headline}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/creators/${h.slug}/passport`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">Passport</Link>
                      <Link href={`/creators/${h.slug}`} className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">Book 1:1</Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {community && (
              <Link href={`/community/${community.slug}`} className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card hover:border-brand-300">
                <Visual hue={community.hue} icon={community.icon} size="sm" className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1"><p className="text-xs text-ink-subtle">Organised with</p><p className="font-semibold text-ink">{community.name}</p><p className="truncate text-xs text-ink-muted">{community.tagline}</p></div>
                <UsersRound className="h-5 w-5 text-ink-subtle" />
              </Link>
            )}
          </div>

          <aside className="lg:pt-6">
            <div className="sticky top-24 space-y-4">
              <Card className="p-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-semibold tracking-tight text-ink">{e.price ? formatINR(e.price) : "Free"}</p>
                  <p className="text-xs text-ink-subtle">per person</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-ink-muted"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{taken} registered</span><span>{Math.max(0, e.capacity - taken)} of {e.capacity} left</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-canvas"><div className={cn("h-2 rounded-full", full ? "bg-red-400" : "bg-teal-500")} style={{ width: `${Math.min(100, (taken / e.capacity) * 100)}%` }} /></div>
                  <p className="mt-1 text-[11px] text-ink-subtle">Includes sample registrations for the demo.</p>
                </div>

                {reg ? (
                  <div className="mt-5">
                    <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-teal-800"><CheckCircle2 className="h-4 w-4" />You&apos;re registered</p>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-teal-800"><Ticket className="h-3.5 w-3.5" />{reg.id} · {reg.name}</p>
                      {reg.paymentId && <p className="mt-1 text-[11px] text-teal-700">Paid · {reg.paymentId} (simulated)</p>}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button size="sm" variant="secondary" onClick={() => ics(e)}><CalendarPlus className="h-4 w-4" />Calendar</Button>
                      <Button size="sm" variant="danger" onClick={() => { if (confirm("Cancel your registration?")) { cancelRegistration(e.id); toast({ title: "Registration cancelled", body: reg.paymentId ? "A simulated refund has been issued." : undefined, tone: "info" }); } }}>Cancel</Button>
                    </div>
                  </div>
                ) : full ? (
                  <div className="mt-5">
                    <Button className="w-full" variant="secondary" onClick={() => toast({ title: "Added to waitlist (demo)", body: "Waitlist notifications are not sent in this demo.", tone: "info" })}>Join waitlist</Button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <Field label="Attendee name" htmlFor="att" error={err} required><Input id="att" value={name} onChange={(ev) => setName(ev.target.value)} invalid={!!err} /></Field>
                    <Button className="w-full" size="lg" onClick={register} disabled={!hydrated}>{e.price ? `Register · ${formatINR(e.price)}` : "Register for free"}</Button>
                    {e.price > 0 && <p className="flex items-center justify-center gap-2 text-[11px] text-ink-subtle"><SimulatedTag />Payment is simulated</p>}
                  </div>
                )}
              </Card>
              <Card className="p-4 text-[12.5px] text-ink-muted">Free cancellation up to 24 hours before the event. Ticket fees are illustrative; event commission terms are not yet defined.</Card>
            </div>
          </aside>
        </div>
      </Container>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} amount={e.price} description={`${e.title} · 1 ticket`} onSuccess={(r) => { registerForEvent(e.id, name.trim(), r.paymentId); setPayOpen(false); toast({ title: "Ticket confirmed", body: e.title }); }} />
    </>
  );
}
