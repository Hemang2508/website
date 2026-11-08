"use client";

import { useState } from "react";
import { Plus, Sparkles, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CreatorDuo } from "@/lib/types";
import { Container, EmptyState } from "@/components/ui/Misc";
import { Chip } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { DuoCard } from "@/components/ecosystem/DuoCard";
import { COMMISSION, pct } from "@/lib/pricing";

const PAIRINGS: ("All" | CreatorDuo["pairing"])[] = ["All", "Food + Travel", "Finance + Career", "Fitness + Lifestyle", "Gaming + Entertainment"];

export default function DuosPage() {
  const { duos } = useStore();
  const [p, setP] = useState<(typeof PAIRINGS)[number]>("All");
  const [format, setFormat] = useState<"All" | CreatorDuo["format"]>("All");
  const list = duos.filter((d) => (p === "All" || d.pairing === p) && (format === "All" || d.format === format));
  return (
    <>
    <section className="relative grid grid-cols-1 overflow-hidden border-b border-line md:grid-cols-2">
      <div className="relative bg-brand-50 px-6 pb-10 pt-12 sm:px-10 md:py-20 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <p className="eyebrow flex items-center gap-1.5 text-brand-700"><Sparkles className="h-4 w-4" />RTG Creator Duos</p>
        <p className="mt-4 font-display text-[clamp(2.6rem,6vw,5.25rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink animate-[meet-l_700ms_cubic-bezier(0.22,1,0.36,1)_both]" aria-hidden>Two<br />creators.</p>
      </div>
      <div className="relative bg-teal-50 px-6 pb-12 pt-10 sm:px-10 md:py-20 md:pr-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <p className="font-display text-[clamp(2.6rem,6vw,5.25rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink animate-[meet-r_700ms_cubic-bezier(0.22,1,0.36,1)_both] md:mt-8" aria-hidden><em className="font-serif font-normal italic text-teal-700">One</em><br />experience.</p>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-muted">Joint sessions and experiences where two creators combine their expertise — booked in a single request.</p>
      </div>
      <h1 className="sr-only">Two creators. One experience.</h1>
      <span className="absolute left-1/2 top-[80%] hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-pop animate-scale-in [animation-delay:500ms] md:flex" aria-hidden><Plus className="h-7 w-7" /></span>
    </section>
    <Container className="py-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">{PAIRINGS.map((x) => <Chip key={x} active={p === x} onClick={() => setP(x)}>{x === "All" ? "All pairings" : x}</Chip>)}</div>
        <div className="flex gap-2">{(["All", "Online", "In person · Hyderabad"] as const).map((f) => <Chip key={f} active={format === f} onClick={() => setFormat(f)}>{f === "All" ? "Any format" : f}</Chip>)}</div>
      </div>
      {list.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DuoCard key={d.id} duo={d} />)}</div>
      ) : (
        <Card className="mt-6"><EmptyState icon={<Users className="h-5 w-5" />} title="No duos match these filters" body="More creator pairings are being added during the pilot." action={<button onClick={() => { setP("All"); setFormat("All"); }} className="text-sm font-medium text-brand-600">Show all duos</button>} /></Card>
      )}
      <div className="mt-10 grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-3">
        {[
          ["One request, two creators", "Pick a time when both creators are available and send a single booking request."],
          ["Shared earnings", `Creators split their earnings 50/50 after the proposed ${pct(COMMISSION.marketplace)} marketplace fee.`],
          ["Same protections", "Declined or cancelled requests receive a full (simulated) refund, just like 1:1 sessions."],
        ].map(([t, d]) => <div key={t}><p className="text-sm font-semibold text-ink">{t}</p><p className="mt-1 text-[13px] text-ink-muted">{d}</p></div>)}
      </div>
    </Container>
    </>
  );
}
