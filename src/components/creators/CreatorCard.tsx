import Link from "next/link";
import { ArrowUpRight, IdCard, MapPin, Megaphone, Star } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar, Portrait } from "@/components/ui/Avatar";
import { cardInteractive } from "@/components/ui/Card";
import { cn, compact, formatINR } from "@/lib/utils";

export function minPrice(c: Creator) {
  const prices = c.services.filter((s) => s.active && s.type !== "pitch").map((s) => s.price);
  return prices.length ? Math.min(...prices) : c.services.find((s) => s.active)?.price ?? 0;
}

/**
 * Editorial creator card. The whole card links to the profile (stretched link on the name);
 * the "View Creator Passport" action sits above that link layer.
 */
export function CreatorCard({ creator: c, href }: { creator: Creator; href?: string }) {
  const link = href ?? `/creators/${c.slug}`;
  return (
    <div className={cn("group relative flex flex-col overflow-hidden", cardInteractive)}>
      <Portrait initials={c.initials} hue={c.avatarHue} photo={c.photo} monogram={false} className="aspect-[16/9]">
        <div className="flex items-start justify-between p-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{c.rating.toFixed(1)}<span className="font-normal text-ink-subtle">({c.reviewCount})</span>
          </span>
          {c.acceptsPitches && <span className="inline-flex items-center gap-1 rounded-full bg-navy/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"><Megaphone className="h-3 w-3" />Pitches</span>}
        </div>
      </Portrait>
      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <Avatar initials={c.initials} hue={c.avatarHue} size="lg" verified={c.verified} photo={c.photo} ring className="-mt-8 mb-3 w-fit" />
        <p className="eyebrow text-[10.5px] text-brand-600">{c.category}</p>
        <Link href={link} className="mt-1 block truncate font-display text-[17px] font-bold tracking-[-0.015em] text-ink after:absolute after:inset-0 after:content-[''] focus:outline-none group-hover:text-brand-600">
          {c.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-muted">{c.headline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-canvas px-2.5 py-0.5 text-[11.5px] text-ink-muted">{t}</span>)}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.location}</span>
          <span>{compact(c.followers)} audience</span>
        </div>
        <div className="flex-1" />
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
          <p className="whitespace-nowrap text-[12px] text-ink-subtle">From <span className="font-display text-[17px] font-bold text-ink">{formatINR(minPrice(c))}</span></p>
          <Link
            href={`/creators/${c.slug}/passport`}
            className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-xl border border-line bg-white px-2.5 py-2 text-[11.5px] font-semibold text-ink transition-colors duration-fast hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <IdCard className="h-3.5 w-3.5" />View Creator Passport
          </Link>
        </div>
        <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-ink-subtle opacity-0 transition-[opacity,transform] duration-base group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
      </div>
    </div>
  );
}
