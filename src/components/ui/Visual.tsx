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
 * Brand-consistent cover visual: a tinted surface, a subtle dot grid and a large line icon.
 * Used for communities, events, duos and brand briefs so the demo needs no external imagery.
 */
export function Visual({ hue, icon, className, children, size = "md" }: { hue: number; icon: string; className?: string; children?: ReactNode; size?: "sm" | "md" | "lg" }) {
  const Icon = VISUAL_ICONS[icon] ?? Users;
  const iconSize = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-8 w-8" : "h-14 w-14";
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: `hsl(${hue} 42% 94%)` }} aria-hidden={!children}>
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(hsl(${hue} 30% 80%) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
      <div className="absolute -bottom-8 -right-6 h-40 w-40 rounded-full" style={{ background: `hsl(${hue} 45% 88%)` }} />
      <Icon className={cn("absolute bottom-4 right-5", iconSize)} style={{ color: `hsl(${hue} 40% 38%)` }} strokeWidth={1.25} />
      {children && <div className="relative">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[#E9ECF2]", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-8 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-[28rem] max-w-full" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
      </div>
    </div>
  );
}
