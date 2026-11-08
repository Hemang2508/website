import {
  Briefcase, Coffee, Gamepad2, GraduationCap, Handshake, Mic, Plane, Presentation, Rocket, Users, UtensilsCrossed, type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const VISUAL_ICONS: Record<string, LucideIcon> = {
  food: UtensilsCrossed, career: GraduationCap, travel: Plane, gaming: Gamepad2, startup: Rocket,
  "Food walk": UtensilsCrossed, "Coffee with Creators": Coffee, "Startup networking": Handshake, "Creator workshop": Presentation, "Creator meetup": Users,
  mic: Mic, brand: Briefcase,
};

/**
 * Brand-consistent cover visual: a hue-tinted gradient surface, soft light, a dot texture and a
 * large line icon. Used for communities, events, duos and brand briefs so the demo needs no
 * external imagery. `tone="dark"` produces the deep variant used for detail-page covers.
 */
export function Visual({ hue, icon, className, children, size = "md", tone = "light" }: { hue: number; icon: string; className?: string; children?: ReactNode; size?: "sm" | "md" | "lg"; tone?: "light" | "dark" }) {
  const Icon = VISUAL_ICONS[icon] ?? Users;
  const iconSize = size === "lg" ? "h-28 w-28" : size === "sm" ? "h-7 w-7" : "h-16 w-16";
  const dark = tone === "dark";
  const bg = dark
    ? `radial-gradient(40rem 20rem at 85% 0%, hsl(${hue} 70% 55% / 0.55), transparent 60%), linear-gradient(135deg, hsl(${hue} 45% 22%), #10172A 75%)`
    : `radial-gradient(18rem 12rem at 90% 10%, hsl(${hue} 80% 88%), transparent 70%), linear-gradient(135deg, hsl(${hue} 60% 95%), hsl(${(hue + 25) % 360} 45% 89%))`;
  return (
    <div className={cn("group/visual relative overflow-hidden", className)} style={{ background: bg }} aria-hidden={!children}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.12)" : `hsl(${hue} 35% 72% / 0.55)`} 1px, transparent 1px)`, backgroundSize: "16px 16px", maskImage: "linear-gradient(115deg, transparent 20%, black 85%)" }} />
      <div className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full transition-transform duration-slow ease-out group-hover:scale-110 group-hover/visual:scale-110" style={{ background: dark ? "rgba(255,255,255,0.06)" : `hsl(${hue} 55% 84% / 0.8)` }} />
      <Icon className={cn("absolute bottom-4 right-5 transition-transform duration-slow ease-out group-hover:-translate-y-1 group-hover:scale-105", iconSize)} style={{ color: dark ? "rgba(255,255,255,0.75)" : `hsl(${hue} 42% 34%)` }} strokeWidth={1.25} />
      {children && <div className="relative">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-sand", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="surface-dark h-56" />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
      </div>
      </div>
    </div>
  );
}
