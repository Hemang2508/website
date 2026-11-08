"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Creator } from "@/lib/types";
import { slotsForDate, upcomingDays, WEEKDAYS } from "@/lib/availability";
import { cn, formatTime, toISODate } from "@/lib/utils";

export function SlotPicker({
  creator, date, time, onChange, isTaken,
}: {
  creator: Pick<Creator, "availability">;
  date: string | null;
  time: string | null;
  onChange: (date: string, time: string | null) => void;
  isTaken: (date: string, time: string) => boolean;
}) {
  const days = useMemo(() => upcomingDays(14), []);
  const scroller = useRef<HTMLDivElement>(null);
  const dayInfo = days.map((d) => {
    const iso = toISODate(d);
    const slots = slotsForDate(creator, d);
    const free = slots.filter((t) => !isTaken(iso, t));
    return { d, iso, slots, free };
  });

  // Auto-select first day with availability
  useEffect(() => {
    if (!date) {
      const first = dayInfo.find((x) => x.free.length);
      if (first) onChange(first.iso, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = dayInfo.find((x) => x.iso === date);
  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-display text-[15px] font-bold text-ink">
          {selected ? selected.d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Choose a date"}
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => scroll(-1)} className="rounded-xl border border-line p-2 text-ink-muted transition hover:bg-canvas" aria-label="Earlier dates"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => scroll(1)} className="rounded-xl border border-line p-2 text-ink-muted transition hover:bg-canvas" aria-label="Later dates"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={scroller} className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dayInfo.map(({ d, iso, free }) => {
          const disabled = free.length === 0;
          const active = iso === date;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso, null)}
              className={cn(
                "flex w-[70px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-[background-color,border-color,transform] duration-fast active:scale-[0.97]",
                active ? "border-navy bg-navy text-white shadow-lift" : disabled ? "cursor-not-allowed border-dashed border-line text-ink-subtle/60" : "border-line bg-white text-ink hover:border-brand-300",
              )}
              aria-pressed={active}
              aria-label={`${d.toDateString()}${disabled ? ", unavailable" : `, ${free.length} slots`}`}
            >
              <span className={cn("text-[11px] font-medium uppercase", active ? "text-white/80" : "text-ink-subtle")}>{WEEKDAYS[d.getDay()]}</span>
              <span className="text-lg font-semibold leading-tight">{d.getDate()}</span>
              <span className={cn("text-[10.5px]", active ? "text-white/80" : disabled ? "" : "text-teal-600")}>{disabled ? "—" : `${free.length} open`}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-[13px] font-medium text-ink-muted">Available times (IST)</p>
        {selected && selected.slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selected.slots.map((t) => {
              const taken = isTaken(selected.iso, t);
              const active = t === time;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={taken}
                  onClick={() => onChange(selected.iso, t)}
                  className={cn(
                    "h-12 rounded-xl border text-sm font-semibold transition-[background-color,border-color,transform] duration-fast active:scale-[0.97]",
                    active ? "border-brand-500 bg-brand-500 text-white shadow-glow" : taken ? "cursor-not-allowed border-line bg-canvas text-ink-subtle line-through" : "border-line bg-white text-ink hover:border-brand-300",
                  )}
                  aria-pressed={active}
                >
                  {formatTime(t)}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-muted">No open slots on this day. Pick another date.</p>
        )}
      </div>
    </div>
  );
}
