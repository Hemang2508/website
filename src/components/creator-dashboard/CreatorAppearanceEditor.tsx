"use client";

import { useRef, useState } from "react";
import { ImagePlus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator, CreatorAppearance } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CreatorFigure, ACCESSORY_OPTIONS, BACKDROPS, HAIR_OPTIONS, HEADWEAR_OPTIONS, TONES } from "@/components/creative/CreatorFigure";
import { resize } from "@/components/pitch/ImageUploader";
import { cn } from "@/lib/utils";

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
            className={cn("h-10 rounded-full border px-4 text-[13px] font-medium transition-colors duration-fast", value === o.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-muted hover:border-ink/40 hover:text-ink")}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Creators choose how their illustrated figure looks, or upload a photo (figure is the fallback). */
export function CreatorAppearanceEditor({ creator }: { creator: Creator }) {
  const { updateCreator, toast } = useStore();
  const [ap, setAp] = useState<CreatorAppearance>(() => ({ hair: "none", headwear: "none", accessory: "none", tone: 2, backdrop: creator.avatarHue, ...creator.appearance }));
  const [photo, setPhoto] = useState<string | undefined>(creator.photo);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const preview = { ...creator, appearance: ap, photo };
  const dirty = JSON.stringify(ap) !== JSON.stringify({ hair: "none", headwear: "none", accessory: "none", tone: 2, backdrop: creator.avatarHue, ...creator.appearance }) || photo !== creator.photo;
  const set = (patch: Partial<CreatorAppearance>) => setAp((a) => ({ ...a, ...patch }));

  const onFile = async (f?: File) => {
    setErr("");
    if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) return setErr("Use a PNG, JPG or WebP image.");
    if (f.size > 5 * 1024 * 1024) return setErr("Images must be under 5 MB.");
    try { setPhoto(await resize(f, 480)); } catch { setErr("That image could not be read."); }
    if (input.current) input.current.value = "";
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <div className="flex flex-col items-center gap-4 border-b border-line bg-canvas p-6 md:border-b-0 md:border-r">
          <div className="aspect-[5/6] w-40 overflow-hidden rounded-t-full rounded-b-3xl shadow-lift ring-1 ring-black/5">
            <CreatorFigure creator={preview} label={`Preview of ${creator.name}'s profile image`} />
          </div>
          <p className="text-center text-xs text-ink-muted">{photo ? "Your photo is shown on your profile." : "Illustrated figure — shown until you upload a photo."}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => input.current?.click()}><ImagePlus className="h-4 w-4" />{photo ? "Replace photo" : "Upload photo"}</Button>
            {photo && <Button size="sm" variant="ghost" onClick={() => setPhoto(undefined)}><Trash2 className="h-4 w-4" />Use figure</Button>}
          </div>
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label="Upload profile photo" onChange={(e) => onFile(e.target.files?.[0])} />
          {err && <p className="text-xs font-medium text-red-600" role="alert">{err}</p>}
        </div>
        <div className="space-y-6 p-6">
          <div>
            <p className="font-display text-[15px] font-bold text-ink">How you appear</p>
            <p className="mt-0.5 text-[13px] text-ink-muted">Choose your illustrated figure. Nothing here is guessed from your name or profile — you decide.</p>
          </div>
          <Segmented label="Hair" value={ap.hair ?? "none"} options={HAIR_OPTIONS} onChange={(v) => set({ hair: v })} />
          <Segmented label="Headwear" value={ap.headwear ?? "none"} options={HEADWEAR_OPTIONS} onChange={(v) => set({ headwear: v })} />
          <Segmented label="Accessory" value={ap.accessory ?? "none"} options={ACCESSORY_OPTIONS} onChange={(v) => set({ accessory: v })} />
          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-ink">Figure tone</legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Figure tone">
              {TONES.map((t) => {
                const hue = ap.backdrop ?? creator.avatarHue;
                return <button key={t} type="button" role="radio" aria-checked={ap.tone === t} aria-label={`Tone ${t + 1}`} onClick={() => set({ tone: t })}
                  className={cn("h-10 w-10 rounded-full ring-offset-2 transition-shadow", ap.tone === t ? "ring-2 ring-ink" : "ring-1 ring-line")} style={{ background: `hsl(${hue} ${14 + t * 3}% ${22 + t * 8}%)` }} />;
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-ink">Backdrop</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Backdrop colour">
              {BACKDROPS.map((b) => <button key={b} type="button" role="radio" aria-checked={ap.backdrop === b} aria-label={`Backdrop hue ${b}`} onClick={() => set({ backdrop: b })}
                className={cn("h-10 w-10 rounded-full ring-offset-2 transition-shadow", ap.backdrop === b ? "ring-2 ring-ink" : "ring-1 ring-line")} style={{ background: `hsl(${b} 48% 88%)` }} />)}
            </div>
          </fieldset>
          <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-5">
            <Button variant="ghost" size="sm" disabled={!dirty} onClick={() => { setAp({ hair: "none", headwear: "none", accessory: "none", tone: 2, backdrop: creator.avatarHue, ...creator.appearance }); setPhoto(creator.photo); }}><RotateCcw className="h-4 w-4" />Discard</Button>
            <Button size="sm" disabled={!dirty} onClick={() => { updateCreator(creator.id, { appearance: ap, photo }); toast({ title: "Appearance saved", body: photo ? "Your photo now appears across RTG Live." : "Your illustrated figure is updated everywhere." }); }}><Save className="h-4 w-4" />Save appearance</Button>
          </div>
          <p className="text-[11.5px] text-ink-subtle">Demo: photos are resized and stored in this browser only. In production they would be stored with consent in Supabase Storage.</p>
        </div>
      </div>
    </Card>
  );
}
