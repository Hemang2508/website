"use client";

import { useRef, type ReactNode } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/motion";

/** Pulls its child gently toward the cursor (max `strength` px). Pointer-only; inert on touch and reduced motion. */
export function Magnetic({ children, strength = 8, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;
  return (
    <span
      ref={ref}
      className={className ?? "inline-flex"}
      style={{ transition: "transform 260ms cubic-bezier(0.22,1,0.36,1)", willChange: active ? "transform" : undefined }}
      onPointerMove={(e) => {
        if (!active || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
    >
      {children}
    </span>
  );
}
