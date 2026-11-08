"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator } from "@/lib/types";
import { Container } from "@/components/ui/Misc";
import { buttonClass } from "@/components/ui/Button";
import { SplitWords } from "../SplitWords";
import { Magnetic } from "../Magnetic";
import { LensField } from "../LensField";
import { CreatorFigure } from "../CreatorFigure";
import { minPrice } from "@/components/creators/CreatorCard";
import { cn, formatINR } from "@/lib/utils";

/** Arch portrait + floating profile preview that expands on hover or keyboard focus (tap navigates). */
function PortraitPin({ c, className, size, side = "left", delay }: { c: Creator; className: string; size: string; side?: "left" | "right"; delay: number }) {
  return (
    <Link
      href={`/creators/${c.slug}/passport`}
      className={cn("group absolute animate-scale-in focus:outline-none", className)}
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${c.name}, ${c.category} — view Creator Passport`}
    >
      <span className={cn("block overflow-hidden rounded-t-full shadow-lift ring-1 ring-black/5 transition-transform duration-base ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5 group-focus-visible:ring-4 group-focus-visible:ring-brand-300", size)}>
        <CreatorFigure creator={c} />
      </span>
      <span className={cn(
        "absolute bottom-6 z-10 w-max max-w-[15rem] rounded-2xl border border-line bg-white/95 px-3.5 py-2.5 text-left shadow-lift backdrop-blur transition-[transform,box-shadow] duration-base ease-out group-hover:-translate-y-1 group-hover:shadow-pop",
        side === "left" ? "left-2 sm:-left-16" : "right-2 sm:-right-16",
      )}>
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink">{c.name}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-ink-muted">{c.rating.toFixed(1)}</span></span>
        <span className="block text-[11.5px] text-ink-muted">{c.category} · {c.location}</span>
        <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-base ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <span className="overflow-hidden">
            <span className="mt-2 flex items-center justify-between gap-4 border-t border-line pt-2 text-[11.5px]">
              <span className="text-ink-muted">From <b className="text-ink">{formatINR(minPrice(c))}</b></span>
              <span className="inline-flex items-center gap-0.5 font-semibold text-brand-600">Passport<ArrowUpRight className="h-3 w-3" /></span>
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export function Hero() {
  const { creators, communities, events, duos } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const pick = (id: string) => creators.find((c) => c.id === id && c.status === "active");
  const [a, b, c] = [pick("c14") ?? creators[0], pick("c1") ?? creators[1], pick("c16") ?? creators[2]];
  const inline = pick("c15") ?? creators[3];

  return (
    <section className="relative overflow-hidden bg-canvas">
      <LensField />
      {/* faint baseline grid gives the poster an editorial page structure */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,rgba(16,23,42,0.05)_1px,transparent_1px)] [background-size:calc(100%/6)_100%]" aria-hidden />
      <Container className="relative pb-16 pt-8 sm:pt-10 lg:pb-16">
        <div className="flex items-center justify-between text-[12px] font-medium text-ink-muted animate-fade-in">
          <p className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-teal-500 animate-ring" /><span className="relative h-2 w-2 rounded-full bg-teal-500" /></span>Creator ecosystem · Hyderabad pilot</p>
          <p className="hidden sm:block">Concept demo · {creators.filter((x) => x.status === "active").length} creators · {communities.length} communities · {events.length} events · {duos.length} duos</p>
        </div>

        <h1 className="relative z-10 mt-6 font-display text-poster text-ink sm:mt-8">
          <span className="block">
            <SplitWords items={["Where"]} label="" />
            <span className="mx-[0.06em] inline-block h-[0.74em] w-[1.25em] translate-y-[0.04em] overflow-hidden rounded-full align-baseline ring-[0.04em] ring-ink/10 animate-scale-in [animation-delay:240ms]" aria-hidden>
              <CreatorFigure creator={inline} crop="head" />
            </span>
            <SplitWords items={["Ideas"]} label="" delay={120} />
          </span>
          <span className="block">
            <SplitWords items={[<em key="m" className="pr-[0.08em] font-serif font-normal italic tracking-[-0.02em] text-brand-600">meet</em>, "Influence."]} label="" delay={260} stagger={110} />
          </span>
          <span className="sr-only">Where Ideas Meet Influence.</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:mt-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 max-w-xl animate-fade-up [animation-delay:520ms]">
            <p className="text-[18px] leading-relaxed text-ink-muted sm:text-xl">Discover creators, build meaningful connections and turn your ideas into opportunities.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic><Link href="/explore" className={buttonClass("dark", "lg", "h-14 px-7 text-base")}>Explore Creators <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover/btn:translate-x-1" /></Link></Magnetic>
              <Magnetic><Link href="/#for-creators" className={buttonClass("secondary", "lg", "h-14 px-7 text-base")}>Become a Creator</Link></Magnetic>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); router.push(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`); }}
              className="mt-8 flex items-center gap-2 border-b-2 border-ink/80 pb-2 transition-colors focus-within:border-brand-500"
              role="search"
            >
              <Search className="h-5 w-5 shrink-0 text-ink-muted" />
              <label className="sr-only" htmlFor="hero-q">Search creators</label>
              <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “D2C pricing”, “food walks” or “pitch deck”" className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink placeholder:text-ink-subtle focus:outline-none" />
              <button type="submit" className="shrink-0 text-sm font-bold text-ink underline-offset-4 hover:underline">Find experts</button>
            </form>
          </div>

          {/* Creator constellation — three portraits on the lens, connected by a hand-drawn line */}
          <div className="relative mx-auto h-[400px] w-full max-w-[560px] lg:-mt-24 lg:h-[440px]" aria-label="Featured demo creators">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 500" fill="none" aria-hidden preserveAspectRatio="none">
              <path d="M150 300 C 230 180, 330 170, 420 120 M150 300 C 260 360, 330 400, 400 430" stroke="#172033" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 6" className="animate-draw [--len:900] [stroke-dashoffset:900] motion-reduce:[stroke-dashoffset:0]" style={{ animationDelay: "700ms" }} />
            </svg>
            <PortraitPin c={a} size="h-64 w-52 sm:h-80 sm:w-64" className="left-[6%] top-[18%] sm:left-[10%]" side="left" delay={360} />
            <PortraitPin c={b} size="h-44 w-36 sm:h-56 sm:w-44" className="right-[2%] top-0" side="right" delay={480} />
            <PortraitPin c={c} size="h-36 w-28 sm:h-44 sm:w-36" className="bottom-0 right-[18%]" side="right" delay={600} />
          </div>
        </div>
      </Container>
    </section>
  );
}
