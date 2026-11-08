"use client";

import { Check, Sparkles, Star } from "lucide-react";
import type { Creator } from "@/lib/types";
import { matchCreator } from "@/lib/matching";
import { Avatar } from "@/components/ui/Avatar";
import { cn, compact, formatINR } from "@/lib/utils";

export const MAX_CREATORS = 5;

export function pitchFee(c: Creator) {
  return c.services.find((s) => s.type === "pitch" && s.active)?.price ?? 0;
}

export function CreatorMatcher({
  creators, category, audiences, selected, onToggle, exclude = [],
}: { creators: Creator[]; category: string; audiences: string[]; selected: string[]; onToggle: (id: string) => void; exclude?: string[] }) {
  const ranked = creators
    .filter((c) => c.status === "active" && c.acceptsPitches && pitchFee(c) > 0 && !exclude.includes(c.id))
    .map((c) => ({ c, ...matchCreator(c, category, audiences) }))
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return <p className="py-6 text-center text-sm text-ink-muted">No additional creators are available for this pitch.</p>;

  return (
    <div className="space-y-2.5">
      {ranked.map(({ c, score, reasons }) => {
        const on = selected.includes(c.id);
        const full = !on && selected.length >= MAX_CREATORS;
        return (
          <button
            key={c.id}
            type="button"
            disabled={full}
            onClick={() => onToggle(c.id)}
            aria-pressed={on}
            className={cn(
              "flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition sm:items-center",
              on ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-100" : full ? "cursor-not-allowed border-line opacity-50" : "border-line bg-white hover:border-[#D5D9E4]",
            )}
          >
            <span className={cn("mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border sm:mt-0", on ? "border-brand-500 bg-brand-500 text-white" : "border-[#C9CEDA] bg-white")}>
              {on && <Check className="h-3.5 w-3.5" />}
            </span>
            <Avatar creator={c} size="md" verified={c.verified} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="inline-flex items-center gap-1 text-xs text-ink-muted"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{c.rating} · {compact(c.followers)} audience</span>
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-ink-muted">{c.headline}</span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {reasons.slice(0, 3).map((r) => <span key={r} className="rounded-md bg-canvas px-1.5 py-0.5 text-[11px] text-ink-muted">{r}</span>)}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", score >= 75 ? "bg-teal-50 text-teal-700" : score >= 55 ? "bg-brand-50 text-brand-700" : "bg-canvas text-ink-muted")}>
                <Sparkles className="h-3 w-3" />{score}% match
              </span>
              <span className="text-sm font-semibold text-ink">{formatINR(pitchFee(c))}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
