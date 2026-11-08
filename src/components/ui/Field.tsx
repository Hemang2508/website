import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-subtle shadow-[0_1px_1px_rgba(17,28,48,0.03)] transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-canvas";

export function Field({
  label, htmlFor, error, hint, required, children, className,
}: { label: string; htmlFor?: string; error?: string; hint?: ReactNode; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(function Input(
  { className, invalid, ...rest }, ref,
) {
  return <input ref={ref} className={cn(control, "h-10", invalid && "border-red-400 focus:border-red-400 focus:ring-red-100", className)} aria-invalid={invalid || undefined} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(function Textarea(
  { className, invalid, ...rest }, ref,
) {
  return <textarea ref={ref} className={cn(control, "min-h-[96px] py-2.5 leading-relaxed", invalid && "border-red-400 focus:border-red-400 focus:ring-red-100", className)} aria-invalid={invalid || undefined} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(function Select(
  { className, invalid, children, ...rest }, ref,
) {
  return (
    <select ref={ref} className={cn(control, "h-10 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%235B6478%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_12px_center] bg-no-repeat pr-9", invalid && "border-red-400", className)} {...rest}>
      {children}
    </select>
  );
});

export function Chip({ active, onClick, children, className }: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition",
        active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-ink-muted hover:border-[#D5D9E4] hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition", checked ? "bg-teal-500" : "bg-[#D5D9E4]")}
    >
      <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}
