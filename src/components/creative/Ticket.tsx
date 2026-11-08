import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Ticket surface with a perforated tear line — used for booking summaries and confirmations. */
export function Ticket({ top, children, className }: { top: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[1.75rem] bg-white shadow-lift ring-1 ring-black/5", className)}>
      <div className="p-5">{top}</div>
      <div className="relative h-0 border-t-2 border-dashed border-line" aria-hidden>
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-canvas" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-canvas" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/**
 * Two circles (you + creator) that slide together; a check appears in the overlap.
 * Purely decorative — the accompanying heading carries the meaning.
 */
export function MeetingMark({ className, leftColor = "#6558E8", rightColor = "#19B8A6" }: { className?: string; leftColor?: string; rightColor?: string }) {
  return (
    <div className={cn("relative h-20 w-32", className)} aria-hidden>
      <span className="absolute left-0 top-0 h-20 w-20 rounded-full mix-blend-multiply animate-[meet-l_700ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ background: leftColor, opacity: 0.85 }} />
      <span className="absolute right-0 top-0 h-20 w-20 rounded-full mix-blend-multiply animate-[meet-r_700ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ background: rightColor, opacity: 0.85 }} />
      <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lift animate-scale-in [animation-delay:600ms]"><Check className="h-4 w-4" strokeWidth={3} /></span>
    </div>
  );
}
