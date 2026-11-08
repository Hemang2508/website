"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const Icon = t.tone === "error" ? XCircle : t.tone === "info" ? Info : CheckCircle2;
        return (
          <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-pop animate-fade-in">
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", t.tone === "error" ? "text-red-500" : t.tone === "info" ? "text-brand-500" : "text-teal-500")} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[13px] text-ink-muted">{t.body}</p>}
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-ink-subtle hover:text-ink" aria-label="Dismiss"><X className="h-4 w-4" /></button>
          </div>
        );
      })}
    </div>
  );
}
