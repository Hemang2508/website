"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator, WeeklyAvailability } from "@/lib/types";
import { WEEKDAYS } from "@/lib/availability";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, formatTime } from "@/lib/utils";

const HOURS = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function CreatorAvailability({ creator }: { creator: Creator }) {
  const { updateCreator, toast } = useStore();
  const [draft, setDraft] = useState<WeeklyAvailability>(() => structuredClone(creator.availability));
  const total = Object.values(draft).reduce((s, x) => s + (x?.length ?? 0), 0);
  const dirty = JSON.stringify(normalize(draft)) !== JSON.stringify(normalize(creator.availability));

  const toggle = (d: number, h: string) =>
    setDraft((a) => {
      const cur = a[d] ?? [];
      const next = cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h].sort();
      return { ...a, [d]: next };
    });

  return (
    <Card className="p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-ink">Weekly schedule</p>
          <p className="text-[13px] text-ink-muted">Click a cell to open or close a one-hour start slot (IST). {total} slots per week.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDraft(structuredClone(creator.availability))} disabled={!dirty}>Discard</Button>
          <Button size="sm" disabled={!dirty} onClick={() => { updateCreator(creator.id, { availability: normalize(draft) }); toast({ title: "Availability saved", body: "Users now see your updated open slots." }); }}><Save className="h-4 w-4" />Save schedule</Button>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th className="w-16" />
              {ORDER.map((d) => (
                <th key={d} className="pb-1 text-xs font-semibold text-ink">
                  {WEEKDAYS[d]}
                  <button onClick={() => setDraft((a) => ({ ...a, [d]: (a[d]?.length ?? 0) ? [] : ["10:00", "11:00", "16:00", "17:00"] }))} className="block w-full text-[10px] font-medium text-brand-600 hover:underline">
                    {(draft[d]?.length ?? 0) ? "Clear" : "Quick fill"}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h}>
                <td className="pr-2 text-right text-[11px] text-ink-subtle">{formatTime(h)}</td>
                {ORDER.map((d) => {
                  const on = draft[d]?.includes(h);
                  return (
                    <td key={d}>
                      <button onClick={() => toggle(d, h)} aria-pressed={!!on} aria-label={`${WEEKDAYS[d]} ${formatTime(h)}`} className={cn("h-7 w-full rounded-md border transition", on ? "border-teal-500 bg-teal-500" : "border-line bg-white hover:border-teal-300 hover:bg-teal-50")} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function normalize(a: WeeklyAvailability): WeeklyAvailability {
  const out: WeeklyAvailability = {};
  for (const d of [0, 1, 2, 3, 4, 5, 6]) if (a[d]?.length) out[d] = [...a[d]].sort();
  return out;
}
