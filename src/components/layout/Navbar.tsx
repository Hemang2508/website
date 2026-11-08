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
    <div className="border-b border-white/5 bg-navy-950 text-[12.5px] text-white/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <p className="truncate">
          <span className="mr-2 rounded-md bg-amber-300 px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide text-navy">Demo</span>
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

function Dropdown({ entry, active, dark }: { entry: NavEntry; active: boolean; dark: boolean }) {
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
        className={cn(navItem(dark, active || open), "inline-flex items-center gap-1")}
      >
        {entry.label}<ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-fast", open && "rotate-180")} />
      </button>
      <div className={cn("absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-base ease-out", open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0")}>
        <div className="w-80 rounded-2xl border border-line bg-white p-2 shadow-pop">
          {entry.items!.map((it) => {
            const I = it.icon ?? Home;
            return (
              <Link key={it.href} href={it.href} tabIndex={open ? 0 : -1} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-fast hover:bg-canvas">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-fast group-hover:bg-brand-500 group-hover:text-white"><I className="h-4 w-4" /></span>
                <span><span className="block text-sm font-semibold text-ink">{it.label}</span>{it.desc && <span className="block text-xs text-ink-muted">{it.desc}</span>}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function navItem(dark: boolean, active: boolean) {
  return cn(
    "relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors duration-fast",
    dark ? (active ? "bg-white/10 text-white" : "text-white/70 hover:text-white") : active ? "bg-navy text-white" : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink",
  );
}

export function Navbar() {
  const nav = useNav();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { role } = useStore();
  const dash = DASH[role];
  const dark = pathname === "/";
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-base",
        dark
          ? cn("border-b", scrolled ? "border-white/10 bg-navy/85 backdrop-blur-xl" : "border-transparent bg-navy")
          : cn("border-b border-line/80 bg-canvas/80 backdrop-blur-xl", scrolled && "shadow-[0_8px_24px_-18px_rgba(16,23,42,0.35)]"),
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo dark={dark} />
        <nav className="ml-3 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {nav.map((n) =>
            n.items ? (
              <Dropdown key={n.label} entry={n} active={n.match(pathname)} dark={dark} />
            ) : (
              <Link key={n.label} href={n.href!} className={navItem(dark, n.match(pathname))} aria-current={n.match(pathname) ? "page" : undefined}>
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href={dash.href} size="sm" variant={dark ? "light" : pathname.startsWith(dash.href) ? "dark" : "secondary"} className="hidden xl:inline-flex"><LayoutDashboard className="h-4 w-4" />{dash.label}</ButtonLink>
          <NotificationBell dark={dark} />
          <div className="hidden lg:block"><RoleSwitcher dark={dark} /></div>
          <button className={cn("flex h-11 w-11 items-center justify-center rounded-xl lg:hidden", dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/[0.05]")} onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-6rem)] overflow-y-auto border-t border-line bg-canvas px-4 pb-10 pt-4 animate-fade-in lg:hidden">
          <nav className="mx-auto flex max-w-lg flex-col" aria-label="Mobile">
            <Link href={dash.href} className="mb-3 flex items-center justify-between rounded-2xl bg-navy px-4 py-4 text-[15px] font-semibold text-white">
              <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />{dash.label}</span><ChevronDown className="h-4 w-4 -rotate-90 opacity-60" />
            </Link>
            {nav.map((n, i) =>
              n.items ? (
                <div key={n.label} className="mt-3 rounded-2xl border border-line bg-white p-2 shadow-card animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <p className="eyebrow px-3 pb-1 pt-2 text-ink-subtle">{n.label}</p>
                  {n.items.map((it) => {
                    const I = it.icon ?? Home;
                    return (
                      <Link key={it.href} href={it.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium", pathname === it.href.split("#")[0] ? "bg-canvas text-ink" : "text-ink")}>
                        <I className="h-4 w-4 text-brand-600" />{it.label}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link key={n.label} href={n.href!} className={cn("rounded-xl px-4 py-3 text-[15px] font-semibold", n.match(pathname) ? "bg-white text-ink shadow-card" : "text-ink")}>{n.label}</Link>
              ),
            )}
          </nav>
          <div className="mx-auto mt-5 max-w-lg"><RoleSwitcher compact /></div>
        </div>
      )}
    </header>
  );
}
