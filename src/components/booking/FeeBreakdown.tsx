import { pct } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

export function FeeBreakdown({ amount, rate, platformFee, creatorEarning, label }: { amount: number; rate: number; platformFee: number; creatorEarning: number; label: string }) {
  return (
    <div className="text-[13px]">
    <dl className="space-y-2">
      <div className="flex justify-between"><dt className="text-ink-muted">Session price</dt><dd className="font-medium text-ink">{formatINR(amount)}</dd></div>
      <div className="flex justify-between"><dt className="text-ink-muted">Taxes</dt><dd className="text-ink-subtle">Included</dd></div>
      <div className="flex justify-between border-t border-line pt-2.5 text-[15px]"><dt className="font-semibold text-ink">You pay</dt><dd className="font-semibold text-ink">{formatINR(amount)}</dd></div>
    </dl>
      <div className="mt-3 rounded-xl bg-canvas p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">How this payment is split</p>
        <dl className="space-y-1.5">
        <div className="flex justify-between"><dt className="flex items-center gap-1.5 text-ink-muted"><span className="h-2 w-2 rounded-full bg-teal-500" />Creator receives</dt><dd className="font-medium text-ink">{formatINR(creatorEarning)}</dd></div>
        <div className="flex justify-between"><dt className="flex items-center gap-1.5 text-ink-muted"><span className="h-2 w-2 rounded-full bg-brand-500" />RTG platform fee · {pct(rate)}</dt><dd className="font-medium text-ink">{formatINR(platformFee)}</dd></div>
        </dl>
        <p className="mt-2 text-[11px] leading-snug text-ink-subtle">{label}. Proposed rate, for demonstration only.</p>
      </div>
    </div>
  );
}
