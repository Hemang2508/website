import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-line bg-white px-3.5 text-[14px] text-ink placeholder:text-ink-subtle/80 shadow-[0_1px_2px_rgba(16,23,42,0.04)] " +
  "transition-[border-color,box-shadow] duration-fast ease-out hover:border-[#D6D1C7] focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-canvas disabled:text-ink-muted";
const invalidCls = "border-red-400 hover:border-red-400 focus:border-red-400 focus:ring-red-100";

export function Field({
  label, htmlFor, error, hint, required, children, className,
}: { label: string; htmlFor?: string; error?: string; hint?: ReactNode; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 animate-fade-in" role="alert"><AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(function Input(
  { className, invalid, ...rest }, ref,
) {
  return <input ref={ref} className={cn(control, "h-11", invalid && invalidCls, className)} aria-invalid={invalid || undefined} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(function Textarea(
  { className, invalid, ...rest }, ref,
) {
  return <textarea ref={ref} className={cn(control, "min-h-[104px] py-3 leading-relaxed", invalid && invalidCls, className)} aria-invalid={invalid || undefined} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(function Select(
  { className, invalid, children, ...rest }, ref,
) {
  return (
    <select ref={ref} className={cn(control, "h-11 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23697386%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_14px_center] bg-no-repeat pr-10", invalid && invalidCls, className)} {...rest}>
      {children}
    </select>
  );
});

export function Chip({ active, onClick, children, className, dark }: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color,color] duration-fast ease-out active:scale-[0.97]",
        dark
          ? active ? "border-white bg-white text-navy" : "border-white/15 bg-white/[0.06] text-white/80 hover:border-white/35 hover:text-white"
          : active ? "border-navy bg-navy text-white" : "border-line bg-white text-ink-muted hover:border-[#D6D1C7] hover:text-ink",
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
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-fast", checked ? "bg-teal-600" : "bg-[#D6D1C7]")}
    >
      <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-base ease-out", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}
