"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Home, LayoutDashboard, MapPin, Megaphone, Menu, PackageSearch, RotateCcw, Sparkles, UsersRound, Video, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { RoleSwitcher } from "./RoleSwitcher";
import { NotificationBell } from "./Notifications";
import { ButtonLink } from "@/components/ui/Button";

export function DemoBar() {
  const { resetDemo, toast } = useStore();
  return (
    <div className="bg-navy text-[12.5px] text-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <p className="truncate">
          <span className="mr-2 rounded bg-amber-400/90 px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide text-navy">Demo</span>
          Concept prototype · payments are simulated · data is stored in this browser only
        </p>
        <button
          onClick={() => { if (confirm("Reset all demo data to the original sample state?")) { resetDemo(); toast({ title: "Demo data reset", tone: "info" }); } }}
          className="inline-flex shrink-0 items-center gap-1 font-medium text-white/90 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reset demo</span>
        </button>
      </div>
    </div>
  );
}

type NavItem = { href: string; label: string; desc?: string; icon?: typeof Home };
type NavEntry = { label: string; href?: string; items?: NavItem[]; match: (p: string) => boolean };

function useNav(): NavEntry[] {
  const { role } = useStore();
  return [
    { label: "Home", href: "/", match: (p) => p === "/" },
    { label: "Explore Creators", href: "/explore", match: (p) => p.startsWith("/explore") || p.startsWith("/creators") },
    {
      label: "Connect", match: (p) => p.startsWith("/duos") || p.startsWith("/regional") || p.startsWith("/book"),
      items: [
        { href: "/explore", label: "1:1 sessions", desc: "Book paid conversations with creators", icon: Video },
        { href: "/duos", label: "Creator Duos", desc: "Joint experiences with two creators", icon: Sparkles },
        { href: "/regional", label: "Regional Connect", desc: "Creators and events in your city", icon: MapPin },
      ],
    },
    {
      label: "Pitch", match: (p) => p.startsWith("/pitch"),
      items: [
        { href: "/pitch/new", label: "Pitch a product", desc: "Get structured creator feedback", icon: PackageSearch },
        { href: "/pitch", label: role === "creator" ? "Pitch requests" : role === "admin" ? "All pitches" : "My pitches", desc: "Track responses and feedback", icon: Megaphone },
      ],
    },
    {
      label: "Community", match: (p) => p.startsWith("/community"),
      items: [
        { href: "/community", label: "Communities", desc: "Creator-hosted interest groups", icon: UsersRound },
        { href: "/regional#events", label: "Regional Events", desc: "Meetups, food walks, workshops", icon: CalendarDays },
      ],
    },
    { label: "Collaborate", href: "/collaborate", match: (p) => p.startsWith("/collaborate") },
  ];
}

const DASH: Record<string, { href: string; label: string }> = {
  user: { href: "/dashboard", label: "Dashboard" },
  creator: { href: "/creator", label: "Creator dashboard" },
  admin: { href: "/admin", label: "Admin console" },
};

function Dropdown({ entry, active }: { entry: NavEntry; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, []);
  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn("inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition", active || open ? "bg-canvas text-ink" : "text-ink-muted hover:text-ink")}
      >
        {entry.label}<ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="w-72 rounded-xl border border-line bg-white p-1.5 shadow-pop animate-fade-in">
            {entry.items!.map((it) => {
              const I = it.icon ?? Home;
              return (
                <Link key={it.href} href={it.href} className="flex items-start gap-3 rounded-lg px-2.5 py-2 hover:bg-canvas">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-muted"><I className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-medium text-ink">{it.label}</span>{it.desc && <span className="block text-xs text-ink-subtle">{it.desc}</span>}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const nav = useNav();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { role } = useStore();
  const dash = DASH[role];
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {nav.map((n) =>
            n.items ? (
              <Dropdown key={n.label} entry={n} active={n.match(pathname)} />
            ) : (
              <Link key={n.label} href={n.href!} className={cn("rounded-lg px-2.5 py-2 text-sm font-medium transition", n.match(pathname) ? "bg-canvas text-ink" : "text-ink-muted hover:text-ink")}>
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href={dash.href} size="sm" variant={pathname.startsWith(dash.href) ? "dark" : "secondary"} className="hidden xl:inline-flex"><LayoutDashboard className="h-4 w-4" />{dash.label}</ButtonLink>
          <NotificationBell />
          <div className="hidden lg:block"><RoleSwitcher /></div>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-line bg-white px-4 pb-5 pt-3 lg:hidden animate-fade-in">
          <nav className="flex flex-col" aria-label="Mobile">
            <Link href={dash.href} className="mb-2 flex items-center gap-2 rounded-lg bg-navy px-3 py-3 text-[15px] font-medium text-white"><LayoutDashboard className="h-4 w-4" />{dash.label}</Link>
            {nav.map((n) =>
              n.items ? (
                <div key={n.label} className="mt-2">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{n.label}</p>
                  {n.items.map((it) => (
                    <Link key={it.href} href={it.href} className={cn("block rounded-lg px-3 py-2.5 text-[15px] font-medium", pathname === it.href.split("#")[0] ? "bg-canvas text-ink" : "text-ink-muted")}>{it.label}</Link>
                  ))}
                </div>
              ) : (
                <Link key={n.label} href={n.href!} className={cn("rounded-lg px-3 py-2.5 text-[15px] font-medium", n.match(pathname) ? "bg-canvas text-ink" : "text-ink-muted")}>{n.label}</Link>
              ),
            )}
          </nav>
          <div className="mt-3 border-t border-line pt-4"><RoleSwitcher compact /></div>
        </div>
      )}
    </header>
  );
}
