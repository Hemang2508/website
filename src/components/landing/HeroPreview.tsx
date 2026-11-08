import { BadgeCheck, CalendarDays, Check, Star } from "lucide-react";

/** Product-UI composition used in the hero: real interface fragments, not illustrations. */
export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Creator card */}
      <div className="relative z-10 rounded-2xl border border-line bg-white p-5 shadow-lift">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full text-base font-semibold" style={{ background: "hsl(252 55% 92%)", color: "hsl(252 45% 32%)" }}>AR</div>
            <BadgeCheck className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white text-brand-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink">Ananya Rao</p>
            <p className="truncate text-[13px] text-ink-muted">D2C brand strategist · Bengaluru</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><b className="text-ink">4.9</b> · 486 sessions</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[
            ["Quick strategy call", "20 min", "₹1,499"],
            ["Go-to-market deep dive", "45 min", "₹3,999"],
          ].map(([t, d, p], i) => (
            <div key={t} className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${i === 1 ? "border-brand-500 bg-brand-50/60" : "border-line"}`}>
              <div>
                <p className="text-[13px] font-medium text-ink">{t}</p>
                <p className="text-xs text-ink-subtle">{d} · video call</p>
              </div>
              <p className="text-sm font-semibold text-ink">{p}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-muted"><CalendarDays className="h-3.5 w-3.5" />Thu, 12 Nov</p>
          <div className="grid grid-cols-4 gap-2">
            {["10:00", "11:00", "16:00", "17:00"].map((t, i) => (
              <span key={t} className={`rounded-lg border py-1.5 text-center text-xs font-medium ${i === 1 ? "border-brand-500 bg-brand-500 text-white" : i === 2 ? "border-line bg-canvas text-ink-subtle line-through" : "border-line text-ink"}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Pitch feedback card */}
      <div className="relative z-20 -mt-6 ml-auto w-[78%] rounded-2xl border border-line bg-white p-4 shadow-pop sm:-mr-8">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-ink">Pitch feedback · Kosha Face Oil</p>
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">Delivered</span>
        </div>
        <div className="mt-3 space-y-2">
          {[["Value proposition", 4], ["Product design", 5], ["Pricing", 3]].map(([l, v]) => (
            <div key={l as string} className="flex items-center gap-3">
              <span className="w-32 text-xs text-ink-muted">{l}</span>
              <div className="h-1.5 flex-1 rounded-full bg-canvas">
                <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${(Number(v) / 5) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-xs font-semibold text-ink">{v}/5</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation chip */}
      <div className="absolute -left-4 top-[46%] z-30 hidden items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-lift sm:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white"><Check className="h-3.5 w-3.5" /></span>
        <span className="text-xs font-medium text-ink">Booking confirmed</span>
      </div>
    </div>
  );
}
