"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X, SearchX } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data/creators";
import { Container, EmptyState, PageHeader } from "@/components/ui/Misc";
import { Chip, Select, Toggle } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CreatorCard, minPrice } from "@/components/creators/CreatorCard";
import { cn } from "@/lib/utils";

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
  const [price, setPrice] = useState("any");
  const [minRating, setMinRating] = useState(0);
  const [langs, setLangs] = useState<string[]>([]);
  const [pitchOnly, setPitchOnly] = useState(params.get("pitch") === "1");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("recommended");
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const band = PRICE_BANDS.find((b) => b.id === price)!;
    const list = creators.filter((c) => {
      if (c.status !== "active") return false;
      if (category !== "All" && c.category !== category) return false;
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
  }, [creators, q, category, price, minRating, langs, pitchOnly, verifiedOnly, sort]);

  const activeCount = [category !== "All", price !== "any", minRating > 0, langs.length > 0, pitchOnly, verifiedOnly].filter(Boolean).length;
  const clear = () => { setCategory("All"); setPrice("any"); setMinRating(0); setLangs([]); setPitchOnly(false); setVerifiedOnly(false); setQ(""); };

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        <div className="flex flex-col gap-0.5">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={cn("rounded-lg px-2.5 py-1.5 text-left text-[13px] transition", category === c ? "bg-brand-50 font-medium text-brand-700" : "text-ink-muted hover:bg-canvas hover:text-ink")}>
              {c === "All" ? "All categories" : c}
            </button>
          ))}
        </div>
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
    <Container className="py-10">
      <PageHeader eyebrow="RTG Connect" title="Explore creators & experts" description="Book a paid conversation or send a product pitch to practitioners across business, marketing, technology and more." />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 shadow-card focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
          <Search className="h-4 w-4 text-ink-subtle" />
          <span className="sr-only">Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, skill, industry or city" className="h-full w-full bg-transparent text-sm focus:outline-none" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="text-ink-subtle hover:text-ink"><X className="h-4 w-4" /></button>}
        </label>
        <div className="flex gap-3">
          <Button variant="secondary" className="h-11 lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-brand-500 px-1.5 text-[11px] text-white">{activeCount}</span>}
          </Button>
          <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-11 w-full rounded-xl sm:w-52" aria-label="Sort by">
            <option value="recommended">Sort: Recommended</option>
            <option value="rating">Sort: Highest rated</option>
            <option value="price_asc">Sort: Price, low to high</option>
            <option value="price_desc">Sort: Price, high to low</option>
            <option value="followers">Sort: Largest audience</option>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Filters</p>
              {activeCount > 0 && <button onClick={clear} className="text-xs font-medium text-brand-600">Clear all</button>}
            </div>
            {filters}
          </div>
        </aside>

        <div>
          <p className="mb-4 text-[13px] text-ink-muted"><span className="font-semibold text-ink">{results.length}</span> creator{results.length === 1 ? "" : "s"} found</p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white">
              <EmptyState icon={<SearchX className="h-5 w-5" />} title="No creators match these filters" body="Try a broader search term or remove a filter." action={<Button variant="secondary" onClick={clear}>Reset filters</Button>} />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => <CreatorCard key={c.id} creator={c} />)}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-pop animate-fade-in">
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
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</p>
      {children}
    </div>
  );
}
