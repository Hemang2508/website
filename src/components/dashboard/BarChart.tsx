import { cn, formatINR } from "@/lib/utils";

export function BarChart({ data, color = "brand", height = 180 }: { data: { label: string; value: number; future?: boolean }[]; color?: "brand" | "teal"; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = Math.ceil(max / 1000) * 1000 || 1000;
  return (
    <div>
      <div className="relative flex items-end gap-2 sm:gap-3" style={{ height }}>
        {[0.5, 1].map((g) => (
          <div key={g} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${g * 100}%` }}>
            <span className="absolute -top-2.5 right-0 bg-white pl-1 text-[10px] text-ink-subtle">{formatINR(nice * g)}</span>
          </div>
        ))}
        {data.map((d, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end">
            <div
              className={cn(
                "w-full rounded-t-md transition-all",
                d.future ? "bg-[repeating-linear-gradient(45deg,#E4E7EF,#E4E7EF_4px,#F5F6FA_4px,#F5F6FA_8px)]" : color === "teal" ? "bg-teal-500 group-hover:bg-teal-600" : "bg-brand-500 group-hover:bg-brand-600",
              )}
              style={{ height: `${Math.max(d.value ? 3 : 0, (d.value / nice) * 100)}%` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[11px] font-medium text-white group-hover:block">{formatINR(d.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d, i) => <span key={i} className="flex-1 truncate text-center text-[10.5px] text-ink-subtle">{d.label}</span>)}
      </div>
    </div>
  );
}
