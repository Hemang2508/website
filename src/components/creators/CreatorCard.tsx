import Link from "next/link";
import { IdCard, MapPin, Megaphone, Star, Users } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { compact, formatINR } from "@/lib/utils";

export function minPrice(c: Creator) {
  const prices = c.services.filter((s) => s.active && s.type !== "pitch").map((s) => s.price);
  return prices.length ? Math.min(...prices) : c.services.find((s) => s.active)?.price ?? 0;
}

/** Whole card links to the profile (stretched link); the Passport action sits above it. */
export function CreatorCard({ creator: c, href }: { creator: Creator; href?: string }) {
  const link = href ?? `/creators/${c.slug}`;
  return (
    <div className="group relative flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-[#D5D9E4] hover:shadow-lift focus-within:ring-2 focus-within:ring-brand-400">
      <div className="flex items-start gap-3.5">
        <Avatar initials={c.initials} hue={c.avatarHue} size="lg" verified={c.verified} photo={c.photo} />
        <div className="min-w-0 flex-1">
          <Link href={link} className="block truncate text-[15px] font-semibold text-ink after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus:outline-none group-hover:text-brand-600">
            {c.name}
          </Link>
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
        {c.acceptsPitches && <span className="inline-flex items-center gap-1 text-teal-700"><Megaphone className="h-3.5 w-3.5" />Pitches</span>}
      </div>
      <div className="flex-1" />
      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">From</p>
          <p className="text-base font-semibold text-ink">{formatINR(minPrice(c))}</p>
        </div>
        <Link
          href={`/creators/${c.slug}/passport`}
          className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:border-brand-300 hover:text-brand-700"
        >
          <IdCard className="h-3.5 w-3.5" />View Creator Passport
        </Link>
      </div>
    </div>
  );
}
