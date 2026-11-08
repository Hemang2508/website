"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Rows3, SlidersHorizontal, Search, X, SearchX } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data/creators";
import { Container, EmptyState } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { Chip, Select, Toggle } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CreatorCard, minPrice } from "@/components/creators/CreatorCard";
import { CreatorFigure } from "@/components/creative/CreatorFigure";
import { SplitWords } from "@/components/creative/SplitWords";
import { cn, formatINR } from "@/lib/utils";

type Sort = "recommended" | "rating" | "price_asc" | "price_desc" | "followers";
const PRICE_BANDS = [
  { id: "any", label: "Any price", max: Infinity, min: 0 },
  { id: "u1500", label: "Under ₹1,500", max: 1499, min: 0 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", max: 3000, min: 1500 },
  { id: "3000+", label: "₹3,000+", max: Infinity, min: 3001 },
];
const LANGS = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Gujarati"];

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Explore />
    </Suspense>
  );
}

function Explore() {
  const params = useSearchParams();
  const { creators } = useStore();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<string>(params.get("category") ?? "All");
  const [city, setCity] = useState<string>(params.get("city") ?? "All");
  const [price, setPrice] = useState("any");
  const [minRating, setMinRating] = useState(0);
  const [langs, setLangs] = useState<string[]>([]);
  const [pitchOnly, setPitchOnly] = useState(params.get("pitch") === "1");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("recommended");
  const [drawer, setDrawer] = useState(false);
  const [view, setView] = useState<"gallery" | "index">("gallery");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const band = PRICE_BANDS.find((b) => b.id === price)!;
    const list = creators.filter((c) => {
      if (c.status !== "active") return false;
      if (category !== "All" && c.category !== category) return false;
      if (city !== "All" && c.location !== city) return false;
      if (term) {
        const hay = [c.name, c.headline, c.bio, c.category, c.location, ...c.tags, ...c.services.map((s) => s.title)].join(" ").toLowerCase();
        if (!term.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      const p = minPrice(c);
      if (p < band.min || p > band.max) return false;
      if (c.rating < minRating) return false;
      if (langs.length && !langs.some((l) => c.languages.includes(l))) return false;
      if (pitchOnly && !c.acceptsPitches) return false;
      if (verifiedOnly && !c.verified) return false;
      return true;
    });
    const sorters: Record<Sort, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      recommended: (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating * Math.log(b.reviewCount + 1) - a.rating * Math.log(a.reviewCount + 1),
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      price_asc: (a, b) => minPrice(a) - minPrice(b),
      price_desc: (a, b) => minPrice(b) - minPrice(a),
      followers: (a, b) => b.followers - a.followers,
    };
    return [...list].sort(sorters[sort]);
  }, [creators, q, category, city, price, minRating, langs, pitchOnly, verifiedOnly, sort]);
  const cities = Array.from(new Set(creators.filter((c) => c.status === "active").map((c) => c.location))).sort();

  const activeCount = [category !== "All", city !== "All", price !== "any", minRating > 0, langs.length > 0, pitchOnly, verifiedOnly].filter(Boolean).length;
  const clear = () => { setCategory("All"); setCity("All"); setPrice("any"); setMinRating(0); setLangs([]); setPitchOnly(false); setVerifiedOnly(false); setQ(""); };

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="City">
        <Select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
          <option value="All">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}{c === "Hyderabad" ? " · Pilot city" : ""}</option>)}
        </Select>
      </FilterGroup>
      <FilterGroup title="Starting price">
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => <Chip key={b.id} active={price === b.id} onClick={() => setPrice(b.id)}>{b.label}</Chip>)}
        </div>
      </FilterGroup>
      <FilterGroup title="Rating">
        <div className="flex flex-wrap gap-2">
          {[0, 4.5, 4.8].map((r) => <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r === 0 ? "Any" : `${r}+ ★`}</Chip>)}
        </div>
      </FilterGroup>
      <FilterGroup title="Language">
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <Chip key={l} active={langs.includes(l)} onClick={() => setLangs((xs) => (xs.includes(l) ? xs.filter((x) => x !== l) : [...xs, l]))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>
      <div className="space-y-4">
        <label className="flex items-center justify-between gap-3 text-[13px] font-medium text-ink">Reviews product pitches <Toggle checked={pitchOnly} onChange={setPitchOnly} label="Reviews product pitches" /></label>
        <label className="flex items-center justify-between gap-3 text-[13px] font-medium text-ink">Verified creators only <Toggle checked={verifiedOnly} onChange={setVerifiedOnly} label="Verified only" /></label>
      </div>
    </div>
  );

  return (
    <>
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-ink/10" aria-hidden />
      <div className="pointer-events-none absolute -right-2 -top-10 h-80 w-80 rounded-full border border-ink/10" aria-hidden />
      <Container className="relative pb-6 pt-10 sm:pt-14">
        <p className="eyebrow text-ink-muted animate-fade-in">RTG Connect · Explore</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.05em] text-ink">
            <SplitWords items={["Find", "your", <em key="p" className="font-serif font-normal italic tracking-[-0.02em] text-brand-600">person.</em>]} label="Find your person." />
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-muted animate-fade-up [animation-delay:300ms]">
            <span className="font-display text-3xl font-bold text-ink">{results.length}</span> of {creators.filter((c) => c.status === "active").length} creators match — book a conversation or send a product pitch.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-14 flex-1 items-center gap-3 border-b-2 border-ink/80 transition-colors focus-within:border-brand-500">
            <Search className="h-5 w-5 text-ink-muted" />
            <span className="sr-only">Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, skill, industry or city" className="h-full w-full bg-transparent text-[17px] text-ink placeholder:text-ink-subtle focus:outline-none" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search" className="text-ink-subtle hover:text-ink"><X className="h-4 w-4" /></button>}
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" className="h-12 lg:hidden" onClick={() => setDrawer(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-brand-500 px-1.5 text-[11px] text-white">{activeCount}</span>}
            </Button>
            <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-12 w-full rounded-full sm:w-56" aria-label="Sort by">
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest rated</option>
              <option value="price_asc">Sort: Price, low to high</option>
              <option value="price_desc">Sort: Price, high to low</option>
              <option value="followers">Sort: Largest audience</option>
            </Select>
            <div className="hidden h-12 items-center rounded-full border border-line bg-white p-1 sm:flex" role="group" aria-label="View">
              {(["gallery", "index"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={cn("flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors", view === v ? "bg-ink text-white" : "text-ink-muted hover:text-ink")}>
                  {v === "gallery" ? <LayoutGrid className="h-4 w-4" /> : <Rows3 className="h-4 w-4" />}{v === "gallery" ? "Gallery" : "Index"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="-mx-4 mt-6 flex gap-1 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Category">
          {["All", ...CATEGORIES].map((c) => {
            const n = c === "All" ? creators.filter((x) => x.status === "active").length : creators.filter((x) => x.status === "active" && x.category === c).length;
            return (
              <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}
                className={cn("relative shrink-0 rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors duration-fast", category === c ? "text-ink" : "text-ink-muted hover:text-ink")}>
                {c === "All" ? "All categories" : c}<sup className="ml-0.5 text-[10px] font-medium text-ink-subtle">{n}</sup>
                <span className={cn("absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-ink transition-transform duration-base ease-out", category === c ? "scale-x-100" : "scale-x-0")} />
              </button>
            );
          })}
        </div>
      </Container>
    </section>
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Filters</p>
              {activeCount > 0 && <button onClick={clear} className="text-xs font-medium text-brand-600">Clear all</button>}
            </div>
            {filters}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
            <span><span className="font-semibold text-ink">{results.length}</span> creator{results.length === 1 ? "" : "s"} found</span>
            {category !== "All" && <Chip active onClick={() => setCategory("All")}>{category}<X className="h-3.5 w-3.5" /></Chip>}
            {city !== "All" && <Chip active onClick={() => setCity("All")}>{city}<X className="h-3.5 w-3.5" /></Chip>}
          </div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white">
              <EmptyState icon={<SearchX className="h-5 w-5" />} title="No creators match these filters" body="Try a broader search term or remove a filter." action={<Button variant="secondary" onClick={clear}>Reset filters</Button>} />
            </div>
          ) : (
            view === "gallery" ? (
              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((c, i) => <Reveal key={c.id} delay={(i % 3) * 60} className="h-full"><div className="h-full [&>div]:h-full"><CreatorCard creator={c} /></div></Reveal>)}
              </div>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
                {results.map((c) => (
                  <li key={c.id} className="group relative flex items-center gap-4 px-4 py-3 transition-colors hover:bg-canvas sm:px-5">
                    <span className="h-14 w-12 shrink-0 overflow-hidden rounded-t-full rounded-b-lg"><CreatorFigure creator={c} label="" /></span>
                    <span className="min-w-0 flex-1">
                      <Link href={`/creators/${c.slug}`} className="block truncate font-display text-[16px] font-bold text-ink after:absolute after:inset-0 group-hover:text-brand-600">{c.name}</Link>
                      <span className="block truncate text-[13px] text-ink-muted">{c.category} · {c.location}</span>
                    </span>
                    <span className="hidden w-40 truncate text-[13px] text-ink-muted md:block">{c.tags.slice(0, 2).join(" · ")}</span>
                    <span className="hidden w-16 text-[13px] font-semibold text-ink sm:block">★ {c.rating.toFixed(1)}</span>
                    <span className="w-20 text-right font-display font-bold text-ink">{formatINR(minPrice(c))}</span>
                    <Link href={`/creators/${c.slug}/passport`} className="relative z-10 hidden rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink sm:block">Passport</Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col rounded-l-3xl bg-white shadow-pop animate-fade-in">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-semibold text-ink">Filters</p>
              <button onClick={() => setDrawer(false)} aria-label="Close filters"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
            <div className="flex gap-3 border-t border-line p-4">
              <Button variant="secondary" className="flex-1" onClick={clear}>Clear</Button>
              <Button className="flex-1" onClick={() => setDrawer(false)}>Show {results.length} results</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2.5 text-[10.5px] text-ink-subtle">{title}</p>
      {children}
    </div>
  );
}
