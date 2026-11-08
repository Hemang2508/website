import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two overlapping circles: ideas (purple) meeting influence (teal). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#10172A" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" />
      <circle cx="12.5" cy="16" r="6.5" fill="#6558E8" />
      <circle cx="19.5" cy="16" r="6.5" fill="#19B8A6" fillOpacity="0.9" />
      <path d="M16 10.6a6.5 6.5 0 0 1 0 10.8a6.5 6.5 0 0 1 0-10.8Z" fill="#FFFFFF" fillOpacity="0.92" />
    </svg>
  );
}

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="RTG Live home">
      <LogoMark />
      <span className={cn("font-display text-[18px] font-extrabold tracking-[-0.03em]", dark ? "text-white" : "text-ink")}>
        RTG <span className={dark ? "text-teal-400" : "text-brand-500"}>Live</span>
      </span>
    </Link>
  );
}
