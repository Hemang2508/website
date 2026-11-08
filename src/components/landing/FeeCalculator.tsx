"use client";

import { useState } from "react";
import { COMMISSION, pct, splitAmount } from "@/lib/pricing";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const modes = [
  { id: "creator", label: "Creator-originated booking", rate: COMMISSION.creatorOriginated, note: "Client arrives through the creator’s own RTG link." },
  { id: "marketplace", label: "Marketplace booking", rate: COMMISSION.marketplace, note: "Client discovers the creator on RTG Live." },
  { id: "pitch", label: "Product pitch review", rate: COMMISSION.pitch, note: "Brand pays for structured product feedback." },
] as const;

export function FeeCalculator() {
  const [price, setPrice] = useState(3000);
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("marketplace");
  const m = modes.find((x) => x.id === mode)!;
  const { platformFee, creatorEarning } = splitAmount(price, m.rate);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-3">
        {modes.map((x) => (
          <button
            key={x.id}
            onClick={() => setMode(x.id)}
            className={cn("flex w-full items-start justify-between gap-4 rounded-xl border bg-white p-4 text-left transition", mode === x.id ? "border-brand-500 ring-4 ring-brand-100" : "border-line hover:border-[#D5D9E4]")}
          >
            <div>
              <p className="text-sm font-semibold text-ink">{x.label}</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">{x.note}</p>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-ink">{pct(x.rate)}</span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Earnings calculator</p>
          <Badge tone="amber">Proposed rates</Badge>
        </div>
        <label htmlFor="price" className="mt-5 block text-[13px] text-ink-muted">Session price</label>
        <p className="text-3xl font-semibold tracking-tight text-ink">{formatINR(price)}</p>
        <input id="price" type="range" min={500} max={20000} step={100} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-3 w-full accent-[#6657CE]" />
        <div className="mt-1 flex justify-between text-xs text-ink-subtle"><span>₹500</span><span>₹20,000</span></div>
        <div className="mt-6 overflow-hidden rounded-full bg-canvas">
          <div className="flex h-3">
            <div className="bg-teal-500 transition-all" style={{ width: `${(creatorEarning / price) * 100}%` }} />
            <div className="bg-brand-500 transition-all" style={{ width: `${(platformFee / price) * 100}%` }} />
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-teal-50 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-teal-700"><span className="h-2 w-2 rounded-full bg-teal-500" />Creator earns</dt>
            <dd className="mt-1 text-xl font-semibold text-ink">{formatINR(creatorEarning)}</dd>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-brand-700"><span className="h-2 w-2 rounded-full bg-brand-500" />Platform fee ({pct(m.rate)})</dt>
            <dd className="mt-1 text-xl font-semibold text-ink">{formatINR(platformFee)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-ink-subtle">Excludes GST and payment-gateway charges. Commission percentages are business assumptions for discussion and are not confirmed commercial rates.</p>
      </div>
    </div>
  );
}
