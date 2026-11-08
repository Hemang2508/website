import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, size = "sm", className }: { value: number; size?: "sm" | "md"; className?: string }) {
  const s = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(s, i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-line text-line")} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label?: string }) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label={label ?? "Rating"}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => onChange(i)} className="rounded p-0.5 transition hover:scale-110">
          <Star className={cn("h-6 w-6", i <= value ? "fill-amber-400 text-amber-400" : "fill-transparent text-[#C9CEDA]")} />
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-canvas text-ink-subtle">{icon}</div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] text-ink-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, sub, icon, accent = "brand" }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; accent?: "brand" | "teal" | "navy" | "amber" }) {
  const accents = { brand: "bg-brand-50 text-brand-600", teal: "bg-teal-50 text-teal-600", navy: "bg-[#E8EAF0] text-navy", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {icon && <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accents[accent])}>{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-subtle">{sub}</p>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cn("-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      <div className="inline-flex min-w-full gap-1 border-b border-line sm:min-w-0" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative -mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition",
              value === t.id ? "border-brand-500 text-ink" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("rounded-full px-1.5 text-[11px] font-semibold", value === t.id ? "bg-brand-500 text-white" : "bg-canvas text-ink-muted")}>{t.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-[13px] font-medium text-brand-600">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
