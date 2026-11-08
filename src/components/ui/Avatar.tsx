import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

const sizes = { xs: "h-7 w-7 text-[11px]", sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-lg", xl: "h-28 w-28 text-3xl" };

/**
 * Creator avatar. Renders the creator's photo when one exists (Supabase Storage in production);
 * the demo uses a tinted monogram so no third-party or unlicensed imagery is required.
 */
export function Avatar({
  initials, hue = 250, size = "md", photo, verified, className, ring,
}: { initials: string; hue?: number; size?: keyof typeof sizes; photo?: string; verified?: boolean; className?: string; ring?: boolean }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn("flex items-center justify-center overflow-hidden rounded-full font-display font-bold tracking-tight", sizes[size], ring && "ring-4 ring-white")}
        style={{ background: `linear-gradient(145deg, hsl(${hue} 70% 93%), hsl(${(hue + 28) % 360} 55% 84%))`, color: `hsl(${hue} 45% 28%)` }}
      >
        {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials}
      </div>
      {verified && (
        <BadgeCheck
          className={cn("absolute -bottom-0.5 -right-0.5 rounded-full bg-white fill-brand-500 text-white", size === "xl" ? "h-8 w-8" : size === "lg" ? "h-5 w-5" : "h-4 w-4")}
          aria-label="Verified (demo)"
        />
      )}
    </div>
  );
}

/**
 * Editorial portrait tile for creator cards and covers. Shows the creator photo (with a
 * hover zoom) when available; otherwise a duotone monogram composition in the creator's hue.
 */
export function Portrait({ initials, hue, photo, className, children, monogram = true }: { initials: string; hue: number; photo?: string; className?: string; children?: React.ReactNode; monogram?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: `linear-gradient(150deg, hsl(${hue} 62% 62%) 0%, hsl(${(hue + 35) % 360} 48% 34%) 70%, hsl(${(hue + 50) % 360} 45% 22%) 100%)` }}>
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.04]" />
      ) : (
        <div className="absolute inset-0 transition-transform duration-slow ease-out group-hover:scale-[1.06]" aria-hidden>
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border-[28px] border-white/[0.07]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
          {monogram && <span className="absolute bottom-3 left-4 font-display text-[64px] font-extrabold leading-none tracking-[-0.06em] text-white/90 drop-shadow-sm">{initials}</span>}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}
