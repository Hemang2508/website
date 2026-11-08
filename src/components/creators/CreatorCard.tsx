import Link from "next/link";
import { MapPin, Megaphone, Star, Users } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { compact, formatINR } from "@/lib/utils";

export function minPrice(c: Creator) {
  const prices = c.services.filter((s) => s.active && s.type !== "pitch").map((s) => s.price);
  return prices.length ? Math.min(...prices) : c.services.find((s) => s.active)?.price ?? 0;
}

export function CreatorCard({ creator: c, href }: { creator: Creator; href?: string }) {
  const link = href ?? `/creators/${c.slug}`;
  return (
    <Link
      href={link}
      className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-[#D5D9E4] hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <div className="flex items-start gap-3.5">
        <Avatar initials={c.initials} hue={c.avatarHue} size="lg" verified={c.verified} photo={c.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink group-hover:text-brand-600">{c.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-muted">{c.headline}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {c.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-canvas px-2 py-0.5 text-xs text-ink-muted">{t}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-ink">{c.rating.toFixed(1)}</span> ({c.reviewCount})</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{compact(c.followers)}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.location}</span>
      </div>
      <div className="flex-1" />
      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">From</p>
          <p className="text-base font-semibold text-ink">{formatINR(minPrice(c))}</p>
        </div>
        {c.acceptsPitches ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"><Megaphone className="h-3.5 w-3.5" />Reviews pitches</span>
        ) : (
          <span className="text-xs font-medium text-brand-600 group-hover:underline">View profile →</span>
        )}
      </div>
    </Link>
  );
}
