import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "text" | "teal" | "danger" | "dark" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-[-0.005em] whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-out active:scale-[0.97] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_6px_16px_-6px_rgba(101,88,232,0.7)] hover:bg-brand-600 hover:shadow-glow",
  secondary: "bg-white text-ink border border-line shadow-card hover:border-[#D6D1C7] hover:bg-[#FBFAF8]",
  outline: "border border-ink/20 text-ink hover:border-ink/50 hover:bg-ink/[0.03]",
  ghost: "text-ink-muted hover:text-ink hover:bg-ink/[0.05]",
  text: "px-0 text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline active:scale-100",
  teal: "bg-teal-600 text-white shadow-[0_6px_16px_-8px_rgba(17,144,127,0.8)] hover:bg-teal-700",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300",
  dark: "bg-navy text-white hover:bg-navy-800 shadow-[0_6px_16px_-8px_rgba(16,23,42,0.6)]",
  light: "bg-white text-navy hover:bg-white/90 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)]",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], variant === "text" ? "h-auto" : sizes[size], className);
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export function ButtonLink({
  href, variant = "primary", size = "md", className, children,
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
