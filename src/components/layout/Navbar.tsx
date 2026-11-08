"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, RotateCcw, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { RoleSwitcher } from "./RoleSwitcher";
import { NotificationBell } from "./Notifications";
import { ButtonLink } from "@/components/ui/Button";

function useLinks() {
  const { role } = useStore();
  const common = [
    { href: "/explore", label: "Explore creators" },
    { href: "/pitch/new", label: "RTG Pitch" },
  ];
  if (role === "creator") return [{ href: "/creator", label: "Creator dashboard" }, ...common.slice(0, 1)];
  if (role === "admin") return [{ href: "/admin", label: "Admin console" }, ...common];
  return [...common, { href: "/pitch", label: "My pitches" }, { href: "/dashboard", label: "Dashboard" }];
}

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

export function Navbar() {
  const links = useLinks();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { role } = useStore();
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/pitch" ? pathname === "/pitch" || /^\/pitch\/PT-/.test(pathname) : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", isActive(l.href) ? "text-ink bg-canvas" : "text-ink-muted hover:text-ink")}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {role === "user" && <ButtonLink href="/pitch/new" size="sm" className="hidden md:inline-flex">Pitch a product</ButtonLink>}
          <NotificationBell />
          <div className="hidden lg:block"><RoleSwitcher /></div>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-4 pb-5 pt-3 lg:hidden animate-fade-in">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-3 text-[15px] font-medium", isActive(l.href) ? "bg-canvas text-ink" : "text-ink-muted")}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-line pt-4"><RoleSwitcher compact /></div>
        </div>
      )}
    </header>
  );
}
