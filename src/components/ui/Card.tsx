import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Base surface. `interactive` adds the shared hover lift used by creator/community/event/campaign cards. */
export function Card({ className, interactive, ...rest }: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-card",
        interactive && "transition-[transform,box-shadow,border-color] duration-base ease-out hover:-translate-y-1 hover:border-[#D9D3C8] hover:shadow-lift",
        className,
      )}
      {...rest}
    />
  );
}

export const cardInteractive =
  "rounded-2xl border border-line bg-white shadow-card transition-[transform,box-shadow,border-color] duration-base ease-out hover:-translate-y-1 hover:border-[#D9D3C8] hover:shadow-lift focus-within:ring-2 focus-within:ring-brand-400";

export function CardHeader({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-line/80 px-5 py-4", className)}>
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-bold tracking-[-0.01em] text-ink">{title}</h3>
        {description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
