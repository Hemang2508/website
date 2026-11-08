"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator } from "@/lib/types";
import { PITCH_CATEGORIES } from "@/lib/data/creators";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip, Field, Input, Textarea, Toggle } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";

export function CreatorProfileEditor({ creator }: { creator: Creator }) {
  const { updateCreator, toast } = useStore();
  const [d, setD] = useState({
    headline: creator.headline, bio: creator.bio, location: creator.location, tags: creator.tags.join(", "), languages: creator.languages.join(", "),
    acceptsPitches: creator.acceptsPitches, pitchCategories: creator.pitchCategories, responseTime: creator.responseTime,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = () => {
    const e: Record<string, string> = {};
    if (d.headline.trim().length < 10) e.headline = "At least 10 characters";
    if (d.bio.trim().length < 60) e.bio = `At least 60 characters (${d.bio.trim().length}/60)`;
    if (!d.location.trim()) e.location = "Required";
    const tags = d.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length < 2) e.tags = "Add at least 2 comma-separated expertise tags";
    const languages = d.languages.split(",").map((t) => t.trim()).filter(Boolean);
    if (!languages.length) e.languages = "Add at least one language";
    if (d.acceptsPitches && !d.pitchCategories.length) e.pitchCategories = "Choose at least one category or turn off pitch reviews";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateCreator(creator.id, { headline: d.headline.trim(), bio: d.bio.trim(), location: d.location.trim(), tags, languages, acceptsPitches: d.acceptsPitches, pitchCategories: d.pitchCategories, responseTime: d.responseTime });
    toast({ title: "Profile updated", body: "Changes are live on your public profile." });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <Avatar creator={creator} size="lg" verified={creator.verified} />
        <div>
          <p className="font-semibold text-ink">{creator.name}</p>
          <p className="text-xs text-ink-subtle">Profile photo upload uses Supabase Storage in production (not enabled in demo).</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Headline" required error={errors.headline} className="sm:col-span-2"><Input value={d.headline} onChange={(e) => setD({ ...d, headline: e.target.value })} invalid={!!errors.headline} maxLength={100} /></Field>
        <Field label="About" required error={errors.bio} className="sm:col-span-2"><Textarea value={d.bio} onChange={(e) => setD({ ...d, bio: e.target.value })} invalid={!!errors.bio} className="min-h-[120px]" maxLength={800} /></Field>
        <Field label="City" required error={errors.location}><Input value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} invalid={!!errors.location} /></Field>
        <Field label="Response time"><Input value={d.responseTime} onChange={(e) => setD({ ...d, responseTime: e.target.value })} /></Field>
        <Field label="Expertise tags" required error={errors.tags} hint="Comma-separated"><Input value={d.tags} onChange={(e) => setD({ ...d, tags: e.target.value })} invalid={!!errors.tags} /></Field>
        <Field label="Languages" required error={errors.languages} hint="Comma-separated"><Input value={d.languages} onChange={(e) => setD({ ...d, languages: e.target.value })} invalid={!!errors.languages} /></Field>
      </div>
      <div className="mt-6 rounded-xl border border-line p-4">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-medium text-ink">Accept product pitches (RTG Pitch)</span>
            <span className="block text-xs text-ink-muted">Brands can send you products for structured, paid feedback.</span>
          </span>
          <Toggle checked={d.acceptsPitches} onChange={(v) => setD({ ...d, acceptsPitches: v })} label="Accept product pitches" />
        </label>
        {d.acceptsPitches && (
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-medium text-ink">Categories you review</p>
            <div className="flex flex-wrap gap-2">
              {PITCH_CATEGORIES.map((c) => (
                <Chip key={c} active={d.pitchCategories.includes(c)} onClick={() => setD({ ...d, pitchCategories: d.pitchCategories.includes(c) ? d.pitchCategories.filter((x) => x !== c) : [...d.pitchCategories, c] })}>{c}</Chip>
              ))}
            </div>
            {errors.pitchCategories && <p className="mt-2 text-xs font-medium text-red-600">{errors.pitchCategories}</p>}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={save}><Save className="h-4 w-4" />Save profile</Button></div>
    </Card>
  );
}
