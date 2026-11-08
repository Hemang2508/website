"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FILES = 4;
const MAX_MB = 5;

/** Downscale to keep demo storage small. In production files go to Supabase Storage. */
export function resize(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const add = async (files: FileList | null) => {
    if (!files) return;
    setError("");
    const list = Array.from(files);
    const room = MAX_FILES - value.length;
    if (list.length > room) setError(`You can upload up to ${MAX_FILES} images.`);
    const accepted: string[] = [];
    for (const f of list.slice(0, Math.max(0, room))) {
      if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) { setError("Only PNG, JPG or WebP images are supported."); continue; }
      if (f.size > MAX_MB * 1024 * 1024) { setError(`Each image must be under ${MAX_MB} MB.`); continue; }
      try { accepted.push(await resize(f)); } catch { setError("One image could not be read."); }
    }
    onChange([...value, ...accepted]);
    if (input.current) input.current.value = "";
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={cn("flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition", drag ? "border-brand-400 bg-brand-50" : "border-line bg-canvas/50")}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-500 shadow-card"><ImagePlus className="h-5 w-5" /></span>
        <p className="mt-3 text-sm font-medium text-ink">Drag images here or <button type="button" onClick={() => input.current?.click()} className="text-brand-600 underline-offset-2 hover:underline">browse</button></p>
        <p className="mt-1 text-xs text-ink-subtle">PNG, JPG or WebP · up to {MAX_FILES} images · {MAX_MB} MB each</p>
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" onChange={(e) => add(e.target.files)} aria-label="Upload product images" />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600" role="alert">{error}</p>}
      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {value.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-canvas">
              <img src={src} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 rounded-full bg-navy/70 p-1 text-white opacity-90 hover:bg-navy" aria-label={`Remove image ${i + 1}`}>
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-ink">Cover</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
