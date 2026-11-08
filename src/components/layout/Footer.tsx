import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

const COLS: { title: string; links: [string, string][] }[] = [
  { title: "Discover & connect", links: [["Explore creators", "/explore"], ["Creator Duos", "/duos"], ["Regional events", "/regional"], ["RTG Pitch", "/pitch/new"]] },
  { title: "Ecosystem", links: [["Community", "/community"], ["Collaborate (beta)", "/collaborate"], ["Coming later: RTG Market", "/#ecosystem"], ["Coming later: video sessions", "/#ecosystem"]] },
  { title: "Dashboards", links: [["User dashboard", "/dashboard"], ["Creator dashboard", "/creator"], ["Pricing & fees", "/#fees"], ["Admin console", "/admin"]] },
];

export function Footer() {
  return (
    <footer className="surface-dark relative mt-24 overflow-hidden text-white">
      <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-display-md text-white">Where Ideas Meet <span className="text-gradient">Influence.</span></p>
            <p className="mt-3 max-w-lg text-[15px] text-white/60">A creator ecosystem for discovery, paid conversations, product feedback, communities, regional experiences and brand collaborations.</p>
          </div>
          <Link href="/explore" className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy transition hover:bg-white/90 md:self-auto">
            Explore creators <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">RTG Live is a proposed product concept prepared for discussion with Voyager Partners, Hyderabad. It is not an existing or approved Voyager Partners product.</p>
            <p className="mt-4 text-xs text-white/40">Hyderabad, India · Pilot city</p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="eyebrow text-white/45">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([l, h]) => (
                  <li key={l}><Link href={h} className="text-sm text-white/75 transition-colors duration-fast hover:text-white">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} RTG Live (concept). Demo build — no real transactions are processed.</p>
          <p>Commission rates shown are proposed assumptions, not confirmed commercial terms.</p>
        </div>
      </div>
    </footer>
  );
}
