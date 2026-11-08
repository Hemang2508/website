import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Live "slide" preview of a product pitch — updates as the brand fills the form. */
export function PitchSlide({ name, company, tagline, category, stage, price, image, audience, goals, slide, total, className }: {
  name: string; company: string; tagline: string; category: string; stage: string; price: string; image?: string; audience: string[]; goals: string[]; slide: number; total: number; className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-[1.5rem] bg-ink text-white shadow-pop", className)} aria-label="Live preview of your pitch">
      <div className="flex items-center justify-between px-5 pt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/70">
        <span>{company || "Your brand"}</span><span>Slide {slide}/{total}</span>
      </div>
      <div className="relative mx-5 mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-white/[0.06]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/70">
            <svg viewBox="0 0 120 60" className="h-12 w-24" aria-hidden><circle cx="48" cy="30" r="24" fill="#6558E8" opacity="0.7" /><circle cx="72" cy="30" r="24" fill="#19B8A6" opacity="0.7" style={{ mixBlendMode: "screen" }} /></svg>
            <span className="flex items-center gap-1 text-[11px]"><ImageIcon className="h-3.5 w-3.5" />Cover image</span>
          </div>
        )}
        {stage && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink">{stage}</span>}
      </div>
      <figcaption className="px-5 pb-5 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-400">{category || "Category"}</p>
        <p className={cn("mt-1 font-display text-2xl font-bold leading-tight tracking-[-0.03em]", !name && "text-white/60")}>{name || "Product name"}</p>
        <p className={cn("mt-1 text-[13px] leading-snug", tagline ? "text-white/70" : "text-white/60")}>{tagline || "A one-line summary of what it is and who it's for."}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {price && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px]">{price}</span>}
          {audience.slice(0, 3).map((a) => <span key={a} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/80">{a}</span>)}
          {goals.slice(0, 2).map((g) => <span key={g} className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[11px] text-teal-200">{g}</span>)}
        </div>
      </figcaption>
    </figure>
  );
}
