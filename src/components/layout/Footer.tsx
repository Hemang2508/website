import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">Where Ideas Meet Influence. A marketplace connecting founders, professionals and brands with creators and experts.</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-subtle">
            RTG Live is a proposed product concept prepared for discussion with Voyager Partners, Hyderabad. It is not an existing or approved Voyager Partners product.
          </p>
        </div>
        <FooterCol title="Discover & connect" links={[["Explore creators", "/explore"], ["Creator Duos", "/duos"], ["Regional events", "/regional"], ["RTG Pitch", "/pitch/new"]]} />
        <FooterCol title="Ecosystem" links={[["Community", "/community"], ["Collaborate (beta)", "/collaborate"], ["Coming later: RTG Market", "/#ecosystem"], ["Coming later: video sessions", "/#ecosystem"]]} />
        <FooterCol title="Dashboards" links={[["User dashboard", "/dashboard"], ["Creator dashboard", "/creator"], ["Pricing & fees", "/#fees"], ["Admin console", "/admin"]]} />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} RTG Live (concept). Demo build — no real transactions are processed.</p>
          <p>Commission rates shown are proposed assumptions, not confirmed commercial terms.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([l, h]) => (
          <li key={l}><Link href={h} className="text-sm text-ink-muted hover:text-ink">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
