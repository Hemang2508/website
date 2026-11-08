"use client";

import { useRef } from "react";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { Container } from "@/components/ui/Misc";

const TEXT = "Every creator carries knowledge worth paying for. Every idea deserves the right audience. RTG Live is where the two meet — one conversation, one pitch, one collaboration at a time.";
const EMPHASIS = new Set(["knowledge", "audience.", "meet", "conversation,", "pitch,", "collaboration"]);

/** One sentence that brightens word by word as it scrolls through the viewport. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useScrollProgress(ref, "through", !reduced);
  const words = TEXT.split(" ");
  return (
    <section ref={ref} className="border-y border-line bg-white py-24 sm:py-32" style={{ ["--p" as string]: reduced ? 1 : 0, ["--n" as string]: words.length }}>
      <Container>
        <p className="eyebrow text-ink-muted">Why RTG Live</p>
        <p className="mt-6 max-w-5xl font-display text-[clamp(1.9rem,4.4vw,3.9rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink">
          {words.map((w, i) => (
            <span key={i} className={EMPHASIS.has(w) ? "font-serif font-normal italic tracking-[-0.01em]" : undefined}
              style={{ opacity: `clamp(0.14, calc(var(--p) * var(--n) * 1.5 - ${i} + 1), 1)`, transition: "opacity 120ms linear" }}>
              {w}{" "}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
