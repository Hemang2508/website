"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { Container } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatDate, formatINR, formatTime, toISODate } from "@/lib/utils";

// Illustrative (not to scale) positions on a 600×440 canvas.
const AREAS: [string, number, number][] = [
  ["Charminar", 322, 300], ["Jubilee Hills", 232, 182], ["HITEC City", 150, 150], ["Gachibowli", 108, 205], ["Madhapur", 186, 128],
  ["Banjara Hills", 270, 206], ["KBR Park", 248, 160], ["Ameerpet", 300, 146], ["Ananthagiri", 34, 92],
];
const pos = (area: string) => AREAS.find(([k]) => area.includes(k)) ?? ["", 300, 220];

export function CityMap() {
  const { events, creators, registeredCount } = useStore();
  const today = toISODate(new Date());
  const list = events.filter((e) => e.city === "Hyderabad" && e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const [sel, setSel] = useState(list[0]?.id);
  const e = list.find((x) => x.id === sel) ?? list[0];
  if (!e) return null;
  const hosts = e.creatorIds.map((id) => creators.find((c) => c.id === id)!).filter(Boolean);

  return (
    <section className="overflow-hidden bg-canvas py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2">
          <h2 className="font-display text-display-lg text-ink">Hyderabad, <em className="font-serif font-normal italic">first</em>.</h2>
          <p className="max-w-lg text-[16px] leading-relaxed text-ink-muted lg:justify-self-end">Regional Connect starts in one city: food walks in the Old City, founder mixers in HITEC City, Coffee with Creators in Jubilee Hills. Tap a pin to see what&apos;s coming up.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[600/440] w-full">
              <svg viewBox="0 0 600 440" className="absolute inset-0 h-full w-full" aria-hidden>
                <defs><pattern id="city-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#172033" opacity="0.13" /></pattern></defs>
                <ellipse cx="300" cy="220" rx="268" ry="196" fill="url(#city-dots)" />
                <ellipse cx="300" cy="220" rx="268" ry="196" fill="none" stroke="#172033" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="2 7" />
                <ellipse cx="300" cy="215" rx="150" ry="112" fill="none" stroke="#172033" strokeOpacity="0.14" strokeWidth="1" />
                {/* Musi river */}
                <path d="M40 262 C 140 240, 210 286, 300 262 S 470 240, 570 286" fill="none" stroke="#19B8A6" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" className="animate-draw [--len:640] [stroke-dasharray:640] motion-reduce:[stroke-dasharray:none]" />
                {/* Hussain Sagar */}
                <path d="M318 168c14-12 40-10 46 6 6 16-8 34-28 34s-32-26-18-40z" fill="#19B8A6" fillOpacity="0.22" stroke="#19B8A6" strokeOpacity="0.5" />
                <text x="370" y="180" fontSize="10" fill="#697386" fontFamily="Inter Variable, sans-serif">Hussain Sagar</text>
                <text x="470" y="300" fontSize="10" fill="#697386" fontFamily="Inter Variable, sans-serif">Musi</text>
                {/* the lens: two rings meeting over the city */}
                <circle cx="240" cy="190" r="70" fill="#6558E8" fillOpacity="0.06" />
                <circle cx="300" cy="230" r="70" fill="#19B8A6" fillOpacity="0.06" />
              </svg>
              {list.map((ev, i) => {
                const [, x, y] = pos(ev.area);
                const on = ev.id === e.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSel(ev.id)}
                    onMouseEnter={() => setSel(ev.id)}
                    onFocus={() => setSel(ev.id)}
                    aria-pressed={on}
                    aria-label={`${ev.title}, ${ev.area}, ${formatDate(ev.date, { day: "numeric", month: "short" })}`}
                    className="group absolute -translate-x-1/2 -translate-y-full animate-pin-drop p-1.5 focus:outline-none"
                    style={{ left: `${(x / 600) * 100 + (i % 2 ? 1.2 : -1.2)}%`, top: `${(y / 440) * 100}%`, animationDelay: `${300 + i * 90}ms` }}
                  >
                    {on && <span className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-500/40 animate-ring" aria-hidden />}
                    <MapPin className={cn("h-8 w-8 drop-shadow transition-transform duration-base ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1", on ? "fill-ink text-white" : "fill-white text-ink")} strokeWidth={1.5} />
                  </button>
                );
              })}
              <p className="absolute bottom-0 left-0 text-[11px] text-ink-subtle">Illustrative map, not to scale</p>
            </div>
          </Reveal>
          <div key={e.id} className="animate-fade-up rounded-[2rem] bg-white p-6 shadow-lift ring-1 ring-black/5 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">{e.type}</p>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink">{e.title}</h3>
            <div className="mt-4 space-y-1.5 text-[14px] text-ink-muted">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDate(e.date, { weekday: "long", day: "numeric", month: "long" })} · {formatTime(e.time)}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{e.area}</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4" />{Math.max(0, e.capacity - registeredCount(e))} of {e.capacity} spots left</p>
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <div className="flex -space-x-2">{hosts.map((h) => <div key={h.id} className="rounded-full ring-2 ring-white"><Avatar initials={h.initials} hue={h.avatarHue} size="sm" /></div>)}</div>
              <p className="text-[13px] text-ink-muted">Hosted by {hosts.map((h) => h.name).join(" & ")}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="font-display text-2xl font-bold text-ink">{e.price ? formatINR(e.price) : "Free"}</p>
              <Link href={`/regional/events/${e.id}`} className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800">View event <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center lg:justify-start"><Link href="/regional" className="text-sm font-semibold text-ink underline underline-offset-4">All Hyderabad events & creators</Link></div>
      </Container>
    </section>
  );
}
