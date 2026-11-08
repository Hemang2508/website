"use client";

import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import type { RegionalEvent } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Visual } from "@/components/ui/Visual";
import { cardInteractive } from "@/components/ui/Card";
import { cn, formatDate, formatINR, formatTime } from "@/lib/utils";

export function EventCard({ event: e, compact }: { event: RegionalEvent; compact?: boolean }) {
  const { creators, registeredCount, myRegistration, hydrated } = useStore();
  const hosts = e.creatorIds.map((id) => creators.find((c) => c.id === id)).filter(Boolean);
  const taken = registeredCount(e);
  const full = taken >= e.capacity;
  const mine = hydrated && myRegistration(e.id);
  return (
    <Link href={`/regional/events/${e.id}`} className={cn("group flex h-full flex-col overflow-hidden", cardInteractive)}>
      <Visual hue={e.hue} icon={e.type} className={compact ? "h-24" : "h-32"} size={compact ? "sm" : "md"}>
        <div className="flex items-start justify-between p-3.5">
          <div className="rounded-lg bg-white px-2.5 py-1 text-center shadow-sm">
            <p className="text-[10px] font-semibold uppercase text-brand-600">{formatDate(e.date, { month: "short" })}</p>
            <p className="text-lg font-semibold leading-tight text-ink">{formatDate(e.date, { day: "numeric" })}</p>
          </div>
          {mine ? <Badge tone="teal">You&apos;re going</Badge> : full ? <Badge tone="red">Sold out</Badge> : null}
        </div>
      </Visual>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{e.type}</p>
        <p className="mt-1 font-semibold leading-snug text-ink group-hover:text-brand-600">{e.title}</p>
        <div className="mt-2 space-y-1 text-[12.5px] text-ink-muted">
          <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(e.date, { weekday: "short", day: "numeric", month: "short" })} · {formatTime(e.time)}</p>
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.area}, {e.city}</p>
          {!compact && <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{Math.round(e.durationMins / 60 * 10) / 10} hrs</p>}
        </div>
        <div className="flex-1" />
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <div className="flex -space-x-2">
            {hosts.map((h) => <div key={h!.id} className="rounded-full ring-2 ring-white"><Avatar initials={h!.initials} hue={h!.avatarHue} size="xs" /></div>)}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">{e.price ? formatINR(e.price) : "Free"}</p>
            <p className={cn("text-[11px]", full ? "text-red-600" : "text-ink-subtle")}>{full ? "Waitlist only" : `${e.capacity - taken} spots left`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
