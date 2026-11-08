import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Masked word-by-word reveal. Each word sits in an overflow-hidden mask and rises into place.
 * Pass strings for plain words or nodes (e.g. an italic serif emphasis) as items.
 * The full sentence is exposed to assistive tech once via `label`.
 */
export function SplitWords({ items, label, delay = 0, stagger = 70, className, wordClassName }: { items: (string | ReactNode)[]; label: string; delay?: number; stagger?: number; className?: string; wordClassName?: string }) {
  let i = 0;
  return (
    <span className={className}>
      {label && <span className="sr-only">{label}</span>}
      <span aria-hidden>
      {items.map((item, idx) => {
        const words = typeof item === "string" ? item.split(" ").filter(Boolean) : [item];
        return (
          <Fragment key={idx}>
            {words.map((w, j) => {
              const d = delay + i++ * stagger;
              return (
                <Fragment key={j}>
                  <span className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]" aria-hidden>
                    <span className={cn("inline-block animate-word-up", wordClassName)} style={{ animationDelay: `${d}ms` }}>{w}</span>
                  </span>{" "}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
      </span>
    </span>
  );
}
