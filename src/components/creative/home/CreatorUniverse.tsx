"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { useFinePointer, useReducedMotion, useScrollProgress } from "@/lib/motion";
import { Container } from "@/components/ui/Misc";
import { CreatorFigure } from "../CreatorFigure";
import { minPrice } from "@/components/creators/CreatorCard";
import { cn, formatINR } from "@/lib/utils";

/**
 * Creator gallery. On desktop with a fine pointer the section pins and the row of portraits moves
 * horizontally as you scroll (vertical scroll is never hijacked, only mapped). On touch or with
 * reduced motion it is a normal swipeable row.
 */
export function CreatorUniverse() {
  const { creators } = useStore();
  const active = creators.filter((c) => c.status === "active");
  const cats = ["All", ...Array.from(new Set(active.map((c) => c.category)))];
  const [cat, setCat] = useState("All");
  const list = active.filter((c) => cat === "All" || c.category === cat);

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const pinned = fine && !reduced && wide;
  const [dist, setDist] = useState(0);
  useEffect(() => {
    if (!pinned) return;
    const measure = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 64));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned, list.length]);
  useScrollProgress(section, "pin", pinned);

  return (
    <section ref={section} id="creators" className="relative bg-canvas" style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={cn(pinned && "sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden")}>
        <Container className={cn(!pinned && "pt-24")}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display text-display-lg text-ink">A universe of <em className="font-serif font-normal italic">practitioners</em>.</h2>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:max-w-[52%] lg:flex-wrap lg:justify-end lg:px-0" role="group" aria-label="Filter creators by category">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
                  className={cn("h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-fast", cat === c ? "border-ink bg-ink text-white" : "border-ink/15 text-ink-muted hover:border-ink/40 hover:text-ink")}>
                  {c === "All" ? `All · ${active.length}` : c}
                </button>
              ))}
            </div>
          </div>
        </Container>
        <div data-carousel className={cn("mt-10", !pinned && "overflow-x-auto pb-6 scrollbar-none")}>
          <div
            ref={track}
            className="flex w-max gap-5 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            style={pinned ? { transform: `translate3d(calc(var(--p, 0) * -${dist}px), 0, 0)`, willChange: "transform" } : undefined}
          >
            {list.map((c, i) => (
              <Link key={`${cat}-${c.id}`} href={`/creators/${c.slug}`} className="group w-[15rem] shrink-0 animate-fade-up focus:outline-none sm:w-[17rem]" style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-3xl bg-white ring-1 ring-black/5 transition-[transform,box-shadow] duration-base ease-out group-hover:-translate-y-2 group-hover:shadow-pop group-focus-visible:ring-4 group-focus-visible:ring-brand-300">
                  <div className="h-full w-full transition-transform duration-slow ease-out group-hover:scale-[1.04]"><CreatorFigure creator={c} /></div>
                  <span className="absolute left-3 top-1/2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{c.rating.toFixed(1)}</span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-[opacity,transform] duration-base group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
                </div>
                <div className="px-1 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{c.category}</p>
                  <p className="mt-1 font-display text-lg font-bold tracking-[-0.015em] text-ink group-hover:text-brand-600">{c.name}</p>
                  <p className="mt-1 flex items-center justify-between text-[13px] text-ink-muted"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.location}</span><span>from <b className="text-ink">{formatINR(minPrice(c))}</b></span></p>
                </div>
              </Link>
            ))}
            <Link href="/explore" className="group flex w-[15rem] shrink-0 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/15 text-center transition-colors hover:border-ink/40 sm:w-[17rem]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white transition-transform duration-base group-hover:scale-110"><ArrowRight className="h-5 w-5" /></span>
              <span className="mt-4 font-display text-lg font-bold text-ink">Explore all creators</span>
              <span className="mt-1 text-[13px] text-ink-muted">Filters, cities, prices</span>
            </Link>
          </div>
        </div>
        <Container><p className="mt-6 text-[11.5px] text-ink-subtle">Creators are illustrated demo profiles — not real people.</p></Container>
      </div>
    </section>
  );
}
