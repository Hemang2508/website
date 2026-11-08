import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "teal" | "danger" | "dark" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
  secondary: "bg-white text-ink border border-line hover:bg-canvas hover:border-[#D5D9E4] shadow-sm",
  ghost: "text-ink-muted hover:text-ink hover:bg-canvas",
  teal: "bg-teal-500 text-white hover:bg-teal-600 shadow-sm",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  dark: "bg-navy text-white hover:bg-navy-800",
  light: "bg-white text-navy hover:bg-white/90 shadow-sm",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
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
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} {...rest}>
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
