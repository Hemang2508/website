import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Progress indicator for multi-step flows (booking, duo booking, pitch submission). */
export function JourneySteps({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  const pct = Math.round((current / (steps.length - 1)) * 100);
  return (
    <nav aria-label={label} className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between text-[12px] font-semibold text-ink-muted sm:hidden">
        <span>Step {current + 1} of {steps.length}</span><span className="text-ink">{steps[current]}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas sm:hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500 transition-[width] duration-slow ease-out" style={{ width: `${Math.max(6, pct)}%` }} />
      </div>
      <ol className="hidden items-center sm:flex">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none" aria-current={i === current ? "step" : undefined}>
            <span className="flex items-center gap-2.5">
              <span className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-base",
                i < current ? "bg-teal-600 text-white" : i === current ? "bg-navy text-white ring-4 ring-brand-100" : "bg-canvas text-ink-subtle",
              )}>
                {i < current ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("whitespace-nowrap text-[13px] font-semibold", i === current ? "text-ink" : i < current ? "text-ink-muted" : "text-ink-subtle")}>{s}</span>
            </span>
            {i < steps.length - 1 && (
              <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-canvas">
                <span className={cn("block h-full origin-left rounded-full bg-teal-500 transition-transform duration-slow ease-out", i < current ? "scale-x-100" : "scale-x-0")} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
