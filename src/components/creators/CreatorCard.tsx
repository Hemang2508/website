import Link from "next/link";
import { ArrowUpRight, IdCard, MapPin, Megaphone, Star } from "lucide-react";
import type { Creator } from "@/lib/types";
import { CreatorFigure } from "@/components/creative/CreatorFigure";
import { BadgeCheck } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function minPrice(c: Creator) {
  const prices = c.services.filter((s) => s.active && s.type !== "pitch").map((s) => s.price);
  return prices.length ? Math.min(...prices) : c.services.find((s) => s.active)?.price ?? 0;
}

/**
 * Arch creator card. The whole card links to the profile (stretched link on the name); the
 * "View Creator Passport" action sits above that layer. On hover or keyboard focus the arch
 * reveals a quick look at the creator's services.
 */
export function CreatorCard({ creator: c, href }: { creator: Creator; href?: string }) {
  const link = href ?? `/creators/${c.slug}`;
  const services = c.services.filter((s) => s.active).slice(0, 3);
  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[5/6] overflow-hidden rounded-t-full rounded-b-[1.75rem] bg-white ring-1 ring-black/5 transition-[transform,box-shadow] duration-base ease-out group-hover:-translate-y-1.5 group-hover:shadow-pop group-focus-within:-translate-y-1.5 group-focus-within:shadow-pop">
        <div className="h-full w-full transition-transform duration-slow ease-out group-hover:scale-[1.04]"><CreatorFigure creator={c} /></div>
        <span className="absolute left-4 top-[42%] inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{c.rating.toFixed(1)}<span className="font-normal text-ink-subtle">({c.reviewCount})</span>
        </span>
        {c.acceptsPitches && <span className="absolute right-4 top-[42%] inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"><Megaphone className="h-3 w-3" />Pitches</span>}
        {/* quick look — services and prices */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+1rem)] rounded-2xl bg-white/95 p-3 shadow-lift backdrop-blur transition-transform duration-base ease-out group-hover:translate-y-0 group-focus-within:translate-y-0" aria-hidden>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">Quick look</p>
          {services.map((s) => (
            <p key={s.id} className="flex items-center justify-between gap-3 py-0.5 text-[12.5px]"><span className="truncate text-ink">{s.title}</span><span className="shrink-0 font-semibold text-ink">{formatINR(s.price)}</span></p>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{c.category}</p>
        <Link href={link} className="mt-1 flex items-center gap-1.5 font-display text-[19px] font-bold tracking-[-0.02em] text-ink after:absolute after:inset-0 after:content-[''] focus:outline-none group-hover:text-brand-600">
          <span className="truncate">{c.name}</span>{c.verified && <BadgeCheck className="h-4 w-4 shrink-0 fill-brand-500 text-white" aria-label="Verified (demo)" />}
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-muted">{c.headline}</p>
        <div className="flex-1" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-line pt-3">
          <p className="flex items-center gap-1 whitespace-nowrap text-[12.5px] text-ink-muted"><MapPin className="h-3.5 w-3.5" />{c.location} · from <b className="font-display text-[15px] text-ink">{formatINR(minPrice(c))}</b></p>
          <Link
            href={`/creators/${c.slug}/passport`}
            className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-ink transition-colors duration-fast hover:border-ink"
            aria-label={`View Creator Passport for ${c.name}`}
          >
            <IdCard className="h-3.5 w-3.5" />View Creator Passport
          </Link>
        </div>
        <ArrowUpRight className="absolute right-4 top-6 h-4 w-4 text-ink-subtle opacity-0 transition-[opacity,transform] duration-base group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
      </div>
    </div>
  );
}
