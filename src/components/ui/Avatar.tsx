import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

const sizes = { xs: "h-7 w-7 text-[11px]", sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-lg", xl: "h-28 w-28 text-3xl" };

/**
 * Generated monogram avatar. In production this renders the creator's uploaded photo from storage;
 * the demo uses tinted monograms so no third-party image hosts are required.
 */
export function Avatar({
  initials, hue = 250, size = "md", photo, verified, className, ring,
}: { initials: string; hue?: number; size?: keyof typeof sizes; photo?: string; verified?: boolean; className?: string; ring?: boolean }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn("flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-tight", sizes[size], ring && "ring-4 ring-white")}
        style={{ background: `hsl(${hue} 55% 92%)`, color: `hsl(${hue} 45% 32%)` }}
      >
        {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials}
      </div>
      {verified && (
        <BadgeCheck
          className={cn("absolute -bottom-0.5 -right-0.5 rounded-full bg-white text-brand-500", size === "xl" ? "h-7 w-7" : size === "lg" ? "h-5 w-5" : "h-4 w-4")}
          aria-label="Verified"
        />
      )}
    </div>
  );
}
