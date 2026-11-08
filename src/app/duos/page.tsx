"use client";

import { useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CreatorDuo } from "@/lib/types";
import { Container, EmptyState, PageHeader } from "@/components/ui/Misc";
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
    <Container className="py-10">
      <PageHeader eyebrow={<span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4" />RTG Creator Duos</span>} title="Two creators. One experience." description="Joint sessions and experiences where two creators combine their expertise — booked in a single request." />
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">{PAIRINGS.map((x) => <Chip key={x} active={p === x} onClick={() => setP(x)}>{x === "All" ? "All pairings" : x}</Chip>)}</div>
        <div className="flex gap-2">{(["All", "Online", "In person · Hyderabad"] as const).map((f) => <Chip key={f} active={format === f} onClick={() => setFormat(f)}>{f === "All" ? "Any format" : f}</Chip>)}</div>
      </div>
      {list.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DuoCard key={d.id} duo={d} />)}</div>
      ) : (
        <Card className="mt-6"><EmptyState icon={<Users className="h-5 w-5" />} title="No duos match these filters" body="More creator pairings are being added during the pilot." action={<button onClick={() => { setP("All"); setFormat("All"); }} className="text-sm font-medium text-brand-600">Show all duos</button>} /></Card>
      )}
      <div className="mt-10 grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-3">
        {[
          ["One request, two creators", "Pick a time when both creators are available and send a single booking request."],
          ["Shared earnings", `Creators split their earnings 50/50 after the proposed ${pct(COMMISSION.marketplace)} marketplace fee.`],
          ["Same protections", "Declined or cancelled requests receive a full (simulated) refund, just like 1:1 sessions."],
        ].map(([t, d]) => <div key={t}><p className="text-sm font-semibold text-ink">{t}</p><p className="mt-1 text-[13px] text-ink-muted">{d}</p></div>)}
      </div>
    </Container>
  );
}
