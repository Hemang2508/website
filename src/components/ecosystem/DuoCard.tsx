"use client";

import Link from "next/link";
import { Clock, Globe2, MapPin, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CreatorDuo } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

export function DuoCard({ duo }: { duo: CreatorDuo }) {
  const { creators } = useStore();
  const [a, b] = duo.creatorIds.map((id) => creators.find((c) => c.id === id)!);
  if (!a || !b) return null;
  return (
    <Link href={`/duos/${duo.slug}`} className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar initials={a.initials} hue={a.avatarHue} size="lg" ring />
          <Avatar initials={b.initials} hue={b.avatarHue} size="lg" ring className="-ml-4" />
        </div>
        <Badge tone="brand">{duo.pairing}</Badge>
      </div>
      <p className="mt-4 text-lg font-semibold leading-snug text-ink group-hover:text-brand-600">{duo.title}</p>
      <p className="mt-1 text-[13px] text-ink-muted">{a.name} <span className="text-ink-subtle">&</span> {b.name}</p>
      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">{duo.description}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1">{duo.format === "Online" ? <Globe2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}{duo.format}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duo.durationMins} min</span>
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {duo.maxGuests} guest{duo.maxGuests > 1 ? "s" : ""}</span>
      </div>
      <div className="flex-1" />
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <p className="text-base font-semibold text-ink">{formatINR(duo.price)}<span className="ml-1 text-xs font-normal text-ink-subtle">per booking</span></p>
        <span className="text-xs font-medium text-brand-600 group-hover:underline">View experience →</span>
      </div>
    </Link>
  );
}
