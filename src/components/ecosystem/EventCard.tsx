"use client";

import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import type { RegionalEvent } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { VISUAL_ICONS } from "@/components/ui/Visual";
import { cardInteractive } from "@/components/ui/Card";
import { cn, formatDate, formatINR, formatTime } from "@/lib/utils";

export function EventCard({ event: e, compact }: { event: RegionalEvent; compact?: boolean }) {
  const { creators, registeredCount, myRegistration, hydrated } = useStore();
  const hosts = e.creatorIds.map((id) => creators.find((c) => c.id === id)).filter(Boolean);
  const taken = registeredCount(e);
  const full = taken >= e.capacity;
  const mine = hydrated && myRegistration(e.id);
  const Icon = VISUAL_ICONS[e.type] ?? CalendarDays;
  return (
    <Link href={`/regional/events/${e.id}`} className={cn("group flex h-full flex-col overflow-hidden", cardInteractive)}>
      {/* ticket stub */}
      <div className="relative flex items-end justify-between px-4 pb-4 pt-4" style={{ background: `hsl(${e.hue} 70% 91%)` }}>
        <div className="leading-none text-ink">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/60">{formatDate(e.date, { weekday: "short" })} · {formatDate(e.date, { month: "short" })}</p>
          <p className={cn("mt-1 font-display font-bold tracking-[-0.05em]", compact ? "text-4xl" : "text-5xl")}>{formatDate(e.date, { day: "numeric" })}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {mine ? <Badge tone="teal">You&apos;re going</Badge> : full ? <Badge tone="red">Sold out</Badge> : null}
          <Icon className="h-7 w-7 text-ink/70 transition-transform duration-base ease-out group-hover:-rotate-6 group-hover:scale-110" strokeWidth={1.5} aria-hidden />
        </div>
      </div>
      <div className="relative h-0 border-t-2 border-dashed border-white" aria-hidden>
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-canvas" />
        <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-canvas" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{e.type}</p>
        <p className="mt-1 font-display text-[16px] font-bold leading-snug tracking-[-0.01em] text-ink group-hover:text-brand-600">{e.title}</p>
        <div className="mt-2 space-y-1 text-[12.5px] text-ink-muted">
          <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(e.date, { weekday: "short", day: "numeric", month: "short" })} · {formatTime(e.time)}</p>
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.area}, {e.city}</p>
          {!compact && <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{Math.round(e.durationMins / 60 * 10) / 10} hrs</p>}
        </div>
        <div className="flex-1" />
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <div className="flex -space-x-2">
            {hosts.map((h) => <div key={h!.id} className="rounded-full ring-2 ring-white"><Avatar creator={h!} size="xs" /></div>)}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">{e.price ? formatINR(e.price) : "Free"}</p>
            <p className={cn("text-[11px]", full ? "text-red-600" : "text-ink-subtle")}>{full ? "Waitlist only" : `${e.capacity - taken} spots left`}</p>
            <span className="mt-1 block h-1 w-20 overflow-hidden rounded-full bg-canvas" aria-hidden><span className={cn("block h-full rounded-full", full ? "bg-red-400" : "bg-ink")} style={{ width: `${Math.min(100, (taken / e.capacity) * 100)}%` }} /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
