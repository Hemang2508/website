"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * RTG's signature "lens": two soft light circles (idea + influence) whose overlap glows.
 * They drift up to ~24px toward the cursor on fine-pointer devices; static otherwise.
 */
export function LensField({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!fine || reduced) return;
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--mx", tx.toFixed(3));
        el.style.setProperty("--my", ty.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [fine, reduced]);

  return (
    <div ref={root} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}>
      <div
        className="absolute left-[46%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-brand-400/25 blur-3xl transition-transform duration-slow ease-out animate-fade-in"
        style={{ transform: "translate(calc(var(--mx) * -22px), calc(var(--my) * -18px))" }}
      />
      <div
        className="absolute left-[62%] top-[22%] h-[30rem] w-[30rem] rounded-full bg-teal-400/25 blur-3xl transition-transform duration-slow ease-out animate-fade-in [animation-delay:200ms]"
        style={{ transform: "translate(calc(var(--mx) * 24px), calc(var(--my) * 20px))" }}
      />
    </div>
  );
}
