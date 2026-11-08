import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two overlapping circles: ideas (purple) meeting influence (teal). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#111C30" />
      <circle cx="12.5" cy="16" r="6.5" fill="#6657CE" />
      <circle cx="19.5" cy="16" r="6.5" fill="#13A69A" fillOpacity="0.9" />
      <path d="M16 10.6a6.5 6.5 0 0 1 0 10.8a6.5 6.5 0 0 1 0-10.8Z" fill="#FFFFFF" fillOpacity="0.92" />
    </svg>
  );
}

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="RTG Live home">
      <LogoMark />
      <span className={cn("text-[17px] font-semibold tracking-tight", dark ? "text-white" : "text-ink")}>
        RTG <span className={dark ? "text-teal-400" : "text-brand-500"}>Live</span>
      </span>
    </Link>
  );
}
