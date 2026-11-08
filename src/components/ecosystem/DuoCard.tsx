"use client";

import Link from "next/link";
import { ArrowRight, Clock, Globe2, MapPin, Plus, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CreatorDuo } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cardInteractive } from "@/components/ui/Card";
import { cn, formatINR } from "@/lib/utils";

/** Paired-creator card: two portrait halves meeting in the middle, then the joint experience. */
export function DuoCard({ duo }: { duo: CreatorDuo }) {
  const { creators } = useStore();
  const [a, b] = duo.creatorIds.map((id) => creators.find((c) => c.id === id)!);
  if (!a || !b) return null;
  return (
    <Link href={`/duos/${duo.slug}`} className={cn("group flex h-full flex-col overflow-hidden", cardInteractive)}>
      <div className="relative grid h-28 grid-cols-2">
        {[a, b].map((x, i) => (
          <div key={x.id} className="relative overflow-hidden transition-transform duration-base ease-out" style={{ background: `hsl(${x.appearance?.backdrop ?? x.avatarHue} 55% 86%)` }}>
            <span className={`absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full mix-blend-multiply transition-transform duration-slow ease-out ${i === 0 ? "-right-10 group-hover:-translate-x-2" : "-left-10 group-hover:translate-x-2"}`} style={{ background: `hsl(${((x.appearance?.backdrop ?? x.avatarHue) + 40) % 360} 70% 70%)`, opacity: 0.55 }} />
          </div>
        ))}
        <div className="absolute inset-x-0 -bottom-7 flex items-center justify-center">
          <Avatar creator={a} size="lg" ring />
          <span className="z-10 -mx-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-white ring-4 ring-white"><Plus className="h-3.5 w-3.5" /></span>
          <Avatar creator={b} size="lg" ring />
        </div>
        <Badge tone="neutral" className="absolute left-3 top-3 bg-white/95 text-ink">{duo.pairing}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-10 text-center">
        <p className="font-display text-lg font-bold leading-snug tracking-[-0.015em] text-ink group-hover:text-brand-600">{duo.title}</p>
        <p className="mt-1 text-[13px] text-ink-muted">{a.name} <span className="text-ink-subtle">&</span> {b.name}</p>
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">{duo.description}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1">{duo.format === "Online" ? <Globe2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}{duo.format}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duo.durationMins} min</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {duo.maxGuests}</span>
        </div>
        <div className="flex-1" />
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-left">
          <p className="font-display text-lg font-bold text-ink">{formatINR(duo.price)}<span className="ml-1 text-xs font-normal text-ink-subtle">per booking</span></p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">View experience <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  );
}
