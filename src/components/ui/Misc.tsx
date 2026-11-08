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
  const accents = { brand: "bg-brand-50 text-brand-600", teal: "bg-teal-50 text-teal-700", navy: "bg-navy text-white", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-shadow duration-base hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {icon && <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accents[accent])}>{icon}</span>}
      </div>
      <p className="mt-3 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-ink">{value}</p>
      {sub && <p className="mt-2 text-xs text-ink-subtle">{sub}</p>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cn("-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0", className)}>
      <div className="inline-flex gap-1 rounded-2xl border border-line bg-white p-1 shadow-card" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[13px] font-semibold transition-[background-color,color] duration-fast ease-out",
              value === t.id ? "bg-navy text-white shadow-sm" : "text-ink-muted hover:bg-canvas hover:text-ink",
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("rounded-full px-1.5 text-[11px] font-semibold", value === t.id ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700")}>{t.count}</span>
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
        {eyebrow && <div className="eyebrow mb-2 text-brand-600">{eyebrow}</div>}
        <h1 className="font-display text-display-md text-ink">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/**
 * Dark premium page hero used at the top of module pages (Explore, Community, Regional,
 * Duos, Collaborate, Pitch, dashboards). Renders full-bleed; place it outside <Container>.
 */
export function PageHero({
  eyebrow, title, description, actions, children, className, compact,
}: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string; compact?: boolean }) {
  return (
    <section className={cn("surface-dark relative overflow-hidden text-white", className)}>
      <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden />
      <div className={cn("relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", compact ? "py-10 sm:py-12" : "py-12 sm:py-16")}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl animate-fade-up">
            {eyebrow && <div className="eyebrow mb-3 flex items-center gap-2 text-teal-400">{eyebrow}</div>}
            <h1 className="font-display text-display-lg text-white">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2 animate-fade-up [animation-delay:120ms]">{actions}</div>}
        </div>
        {children && <div className="mt-8 animate-fade-up [animation-delay:180ms]">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, action, align = "left", dark }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode; align?: "left" | "center"; dark?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", dark ? "text-teal-400" : "text-brand-600")}>{eyebrow}</p>}
        <h2 className={cn("mt-3 font-display text-display-lg", dark ? "text-white" : "text-ink")}>{title}</h2>
        {description && <p className={cn("mt-4 text-[16px] leading-relaxed", dark ? "text-white/70" : "text-ink-muted")}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
