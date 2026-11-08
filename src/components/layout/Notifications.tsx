"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarCheck, CreditCard, Handshake, Info, MapPin, Megaphone, Star, UsersRound } from "lucide-react";
import { useMyNotifications, useStore } from "@/lib/store";
import type { Notification } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";

const icons: Record<Notification["kind"], typeof Bell> = {
  booking: CalendarCheck, pitch: Megaphone, payment: CreditCard, review: Star, system: Info, community: UsersRound, event: MapPin, collab: Handshake,
};

export function NotificationBell() {
  const { hydrated, markAllRead, markRead } = useStore();
  const items = useMyNotifications();
  const unread = items.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-canvas hover:text-ink" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
        <Bell className="h-5 w-5" />
        {hydrated && unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">{unread}</span>
        )}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-16 z-50 rounded-xl border border-line bg-white shadow-pop animate-fade-in sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            {unread > 0 && <button onClick={markAllRead} className="text-xs font-medium text-brand-600 hover:text-brand-700">Mark all as read</button>}
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {items.length === 0 && <p className="px-4 py-10 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>}
            {items.slice(0, 15).map((n) => {
              const Icon = icons[n.kind];
              return (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); if (n.href) router.push(n.href); }}
                  className={cn("flex w-full gap-3 border-b border-line/70 px-4 py-3 text-left last:border-0 hover:bg-canvas", !n.read && "bg-brand-50/40")}
                >
                  <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", n.kind === "payment" ? "bg-teal-50 text-teal-600" : "bg-brand-50 text-brand-600")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-ink">{n.title}</span>
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-ink-subtle">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
