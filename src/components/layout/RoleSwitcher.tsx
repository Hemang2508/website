"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Shield, Sparkles, User } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const roleMeta: Record<Role, { label: string; desc: string; icon: typeof User; home: string }> = {
  user: { label: "User", desc: "Book creators & pitch products", icon: User, home: "/dashboard" },
  creator: { label: "Creator", desc: "Manage services & requests", icon: Sparkles, home: "/creator" },
  admin: { label: "Admin", desc: "Platform oversight", icon: Shield, home: "/admin" },
};

export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const { role, setRole, activeCreatorId, setActiveCreator, creators, demoUser, toast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const creator = creators.find((c) => c.id === activeCreatorId);
  const switchable = creators.filter((c) => c.status !== "suspended").slice(0, 8);

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const choose = (r: Role, creatorId?: string) => {
    setRole(r);
    if (creatorId) setActiveCreator(creatorId);
    setOpen(false);
    const name = r === "creator" ? creators.find((c) => c.id === (creatorId ?? activeCreatorId))?.name : r === "user" ? demoUser.name : "RTG Admin";
    toast({ title: `Switched to ${roleMeta[r].label} view`, body: `Signed in as ${name} (demo account)`, tone: "info" });
    router.push(roleMeta[r].home);
  };

  const current =
    role === "creator" && creator ? (
      <Avatar initials={creator.initials} hue={creator.avatarHue} size="xs" />
    ) : (
      <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold", role === "admin" ? "bg-navy text-white" : "bg-teal-50 text-teal-700")}>
        {role === "admin" ? "AD" : "AM"}
      </span>
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn("flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-2.5 text-sm shadow-sm transition hover:border-[#D5D9E4]", compact && "w-full rounded-xl")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {current}
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">Demo role</span>
          <span className="text-[13px] font-semibold text-ink">{roleMeta[role].label}</span>
        </span>
        <ChevronDown className={cn("ml-auto h-4 w-4 text-ink-subtle transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className={cn("absolute z-50 mt-2 w-72 rounded-xl border border-line bg-white p-1.5 shadow-pop animate-fade-in", compact ? "left-0 right-0 w-auto" : "right-0")} role="menu">
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Switch demo account</p>
          {(["user", "admin"] as Role[]).map((r) => {
            const M = roleMeta[r];
            return (
              <button key={r} onClick={() => choose(r)} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-canvas" role="menuitem">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-ink-muted"><M.icon className="h-4 w-4" /></span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{M.label} · {r === "user" ? demoUser.name : "RTG Ops"}</span>
                  <span className="block text-xs text-ink-subtle">{M.desc}</span>
                </span>
                {role === r && <Check className="h-4 w-4 text-brand-500" />}
              </button>
            );
          })}
          <div className="my-1 border-t border-line" />
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Creator accounts</p>
          <div className="max-h-56 overflow-y-auto">
            {switchable.map((c) => (
              <button key={c.id} onClick={() => choose("creator", c.id)} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left hover:bg-canvas" role="menuitem">
                <Avatar initials={c.initials} hue={c.avatarHue} size="xs" />
                <span className="flex-1 truncate text-sm text-ink">{c.name}</span>
                {role === "creator" && activeCreatorId === c.id && <Check className="h-4 w-4 text-brand-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
