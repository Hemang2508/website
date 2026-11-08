"use client";

import { BadgeCheck, CalendarDays, Check, Handshake, MapPin, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar, Portrait } from "@/components/ui/Avatar";
import { formatDate, formatINR, formatTime } from "@/lib/utils";

/** Hero composition built from real demo data: a creator card, a booking, an application and an event. */
export function HeroPreview() {
  const { creators, collaborations, events } = useStore();
  const c = creators.find((x) => x.id === "c1") ?? creators[0];
  const svc = c.services.filter((s) => s.type !== "pitch").slice(0, 2);
  const collab = collaborations.find((x) => x.id === "cb2") ?? collaborations[0];
  const ev = events.find((x) => x.id === "ev1") ?? events[0];

  return (
    <div className="relative mx-auto w-full max-w-[540px] pb-24 pt-16 lg:ml-auto" aria-label="Product preview" role="img">
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-brand-500/25 via-transparent to-teal-500/20 blur-2xl" aria-hidden />

      {/* Creator card */}
      <div className="relative z-10 w-[80%] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-pop animate-fade-up [animation-delay:150ms]">
        <Portrait initials={c.initials} hue={c.avatarHue} photo={c.photo} monogram={false} className="h-24" />
        <div className="px-5 pb-5">
          <Avatar creator={c} size="lg" ring className="-mt-8 mb-2 w-fit" />
          <div className="flex items-center gap-2">
            <p className="font-display text-lg font-bold text-ink">{c.name}</p>
            <BadgeCheck className="h-5 w-5 fill-brand-500 text-white" />
          </div>
          <p className="truncate text-[13px] text-ink-muted">{c.headline}</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><b className="text-ink">{c.rating}</b> · {c.sessionsCompleted} sessions · {c.location}</p>
          <div className="mt-4 space-y-2">
            {svc.map((s, i) => (
              <div key={s.id} className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${i === 1 ? "border-brand-500 bg-brand-50" : "border-line"}`}>
                <div><p className="text-[13px] font-semibold text-ink">{s.title}</p><p className="text-xs text-ink-subtle">{s.durationMins} min · video call</p></div>
                <p className="text-sm font-bold text-ink">{formatINR(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration application */}
      <div className="absolute right-0 top-0 z-20 w-[50%] rounded-2xl border border-line bg-white p-4 shadow-pop animate-fade-up [animation-delay:320ms]">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle"><Handshake className="h-3.5 w-3.5" />Brand brief</p>
        <p className="mt-1.5 text-[13px] font-bold leading-snug text-ink">{collab.title}</p>
        <p className="text-xs text-ink-muted">{collab.brand}</p>
        <div className="mt-3 flex items-center gap-1.5">
          {["Submitted", "Shortlisted", "Accepted"].map((s, i) => (
            <span key={s} className={`flex h-1.5 flex-1 rounded-full ${i < 2 ? "bg-teal-500" : "bg-line"}`} title={s} />
          ))}
        </div>
        <p className="mt-1.5 text-[11px] font-medium text-teal-700">Application shortlisted</p>
      </div>

      {/* Event */}
      <div className="absolute bottom-0 right-0 z-20 flex w-[60%] items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-lift animate-fade-up [animation-delay:460ms]">
        <div className="rounded-xl bg-canvas px-2.5 py-1.5 text-center">
          <p className="text-[10px] font-bold uppercase text-brand-600">{formatDate(ev.date, { month: "short" })}</p>
          <p className="font-display text-lg font-bold leading-none text-ink">{formatDate(ev.date, { day: "numeric" })}</p>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-bold text-ink">{ev.title}</p>
          <p className="flex items-center gap-1 text-[11px] text-ink-muted"><MapPin className="h-3 w-3" />{ev.area} · {formatTime(ev.time)}</p>
        </div>
      </div>

      {/* Booking confirmed */}
      <div className="absolute bottom-8 left-0 z-30 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-lift animate-fade-up [animation-delay:600ms] sm:-left-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white"><Check className="h-4 w-4" /></span>
        <span>
          <span className="block text-xs font-bold text-ink">Booking confirmed</span>
          <span className="flex items-center gap-1 text-[11px] text-ink-muted"><CalendarDays className="h-3 w-3" />{svc[1]?.title ?? svc[0]?.title}</span>
        </span>
      </div>
    </div>
  );
}
