"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Info, PackageSearch } from "lucide-react";
import { useStore, type NewPitchInput } from "@/lib/store";
import { AUDIENCES, PITCH_CATEGORIES, PITCH_GOALS } from "@/lib/data/creators";
import { COMMISSION, pct, splitAmount } from "@/lib/pricing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Container, PageHeader } from "@/components/ui/Misc";
import { Badge, SimulatedTag } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ImageUploader } from "@/components/pitch/ImageUploader";
import { CreatorMatcher, MAX_CREATORS, pitchFee } from "@/components/pitch/CreatorMatcher";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { cn, formatINR } from "@/lib/utils";

const STEPS = ["Product", "Audience & goals", "Match creators", "Review & send"];
const STAGES: NewPitchInput["stage"][] = ["Idea", "Prototype", "Launched", "Scaling"];

export default function NewPitchPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <NewPitch />
    </Suspense>
  );
}

function NewPitch() {
  const params = useSearchParams();
  const router = useRouter();
  const { creators, createPitch, sendPitchRequests, demoUser, toast } = useStore();
  const preselect = params.get("creator");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    productName: "", company: demoUser.title.replace("Founder, ", ""), tagline: "", description: "", category: "", stage: "" as NewPitchInput["stage"] | "",
    priceRange: "", website: "", images: [] as string[], targetAudience: [] as string[], goals: [] as string[],
  });
  const [selected, setSelected] = useState<string[]>(preselect ? [preselect] : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payOpen, setPayOpen] = useState(false);

  const preCreator = preselect ? creators.find((c) => c.id === preselect) : undefined;
  const chosen = useMemo(() => creators.filter((c) => selected.includes(c.id)), [creators, selected]);
  const total = chosen.reduce((s, c) => s + pitchFee(c), 0);
  const { platformFee, creatorEarning } = splitAmount(total, COMMISSION.pitch);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: "targetAudience" | "goals", v: string) => set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v]);

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (form.productName.trim().length < 2) e.productName = "Enter the product name";
      if (form.company.trim().length < 2) e.company = "Enter your company or brand name";
      if (form.tagline.trim().length < 10) e.tagline = "Add a one-line summary (at least 10 characters)";
      if (form.description.trim().length < 50) e.description = `Describe the product in at least 50 characters (${form.description.trim().length}/50)`;
      if (!form.category) e.category = "Choose a category";
      if (!form.stage) e.stage = "Choose a stage";
      if (!form.priceRange.trim()) e.priceRange = "Enter a price or price range";
      if (form.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(form.website.trim())) e.website = "Enter a valid website, e.g. yourbrand.in";
    }
    if (s === 1) {
      if (!form.targetAudience.length) e.targetAudience = "Select at least one audience";
      if (!form.goals.length) e.goals = "Select at least one goal";
    }
    if (s === 2 && !selected.length) e.creators = "Select at least one creator";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPaid = (paymentId: string) => {
    const { stage, ...rest } = form;
    const pitch = createPitch({ ...rest, stage: stage as NewPitchInput["stage"], productName: form.productName.trim(), company: form.company.trim(), tagline: form.tagline.trim(), description: form.description.trim(), website: form.website.trim() });
    sendPitchRequests(pitch.id, selected, paymentId);
    setPayOpen(false);
    toast({ title: "Pitch sent", body: `Sent to ${selected.length} creator${selected.length > 1 ? "s" : ""}.` });
    router.push(`/pitch/${pitch.id}?new=1`);
  };

  return (
    <Container className="max-w-5xl py-10">
      <PageHeader eyebrow={<span className="inline-flex items-center gap-1.5"><PackageSearch className="h-4 w-4" />RTG Pitch</span>} title="Pitch your product to creators" description="Submit once, match with relevant creators and receive structured, comparable feedback." />

      {preCreator && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-ink-muted">
          <Avatar initials={preCreator.initials} hue={preCreator.avatarHue} size="sm" />
          <p><b className="text-ink">{preCreator.name}</b> is pre-selected. You can add up to {MAX_CREATORS - 1} more creators in step 3.</p>
        </div>
      )}

      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Pitch progress">
        {STEPS.map((s, i) => (
          <li key={s}>
            <div className={cn("h-1.5 rounded-full", i < step ? "bg-teal-500" : i === step ? "bg-brand-500" : "bg-line")} />
            <p className={cn("mt-2 hidden text-[13px] font-medium sm:block", i === step ? "text-ink" : "text-ink-subtle")}>{i + 1}. {s}</p>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[13px] font-medium text-ink sm:hidden">Step {step + 1} of 4 · {STEPS[step]}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {step === 0 && (
            <Card className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product name" required htmlFor="pn" error={errors.productName}><Input id="pn" value={form.productName} onChange={(e) => set("productName", e.target.value)} invalid={!!errors.productName} placeholder="e.g. Kosha Rose Hydrating Mist" /></Field>
                <Field label="Company / brand" required htmlFor="co" error={errors.company}><Input id="co" value={form.company} onChange={(e) => set("company", e.target.value)} invalid={!!errors.company} /></Field>
                <Field label="One-line summary" required htmlFor="tl" error={errors.tagline} className="sm:col-span-2"><Input id="tl" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} invalid={!!errors.tagline} maxLength={100} placeholder="What it is and who it's for, in one sentence" /></Field>
                <Field label="Product description" required htmlFor="desc" error={errors.description} hint={`${form.description.length}/800 · Include what makes it different and what feedback you need`} className="sm:col-span-2">
                  <Textarea id="desc" value={form.description} onChange={(e) => set("description", e.target.value)} invalid={!!errors.description} maxLength={800} className="min-h-[120px]" />
                </Field>
                <Field label="Category" required htmlFor="cat" error={errors.category}>
                  <Select id="cat" value={form.category} onChange={(e) => set("category", e.target.value)} invalid={!!errors.category}>
                    <option value="">Select a category</option>
                    {PITCH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Price or price range" required htmlFor="pr" error={errors.priceRange}><Input id="pr" value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} invalid={!!errors.priceRange} placeholder="e.g. ₹499 – ₹899" /></Field>
                <Field label="Product stage" required error={errors.stage} className="sm:col-span-2">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {STAGES.map((s) => (
                      <button key={s} type="button" onClick={() => set("stage", s)} aria-pressed={form.stage === s} className={cn("h-10 rounded-lg border text-sm font-medium transition", form.stage === s ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line text-ink-muted hover:text-ink")}>{s}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Website" htmlFor="web" error={errors.website} hint="Optional" className="sm:col-span-2"><Input id="web" value={form.website} onChange={(e) => set("website", e.target.value)} invalid={!!errors.website} placeholder="yourbrand.in" /></Field>
                <Field label="Product images" hint="Optional, but pitches with images get more acceptances" className="sm:col-span-2">
                  <ImageUploader value={form.images} onChange={(v) => set("images", v)} />
                </Field>
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card className="space-y-7 p-5 sm:p-6">
              <div>
                <p className="text-sm font-semibold text-ink">Target audience <span className="text-red-500">*</span></p>
                <p className="text-[13px] text-ink-muted">Who is this product for? We use this to match creators.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {AUDIENCES.map((a) => <Chip key={a} active={form.targetAudience.includes(a)} onClick={() => toggle("targetAudience", a)}>{form.targetAudience.includes(a) && <Check className="h-3.5 w-3.5" />}{a}</Chip>)}
                </div>
                {errors.targetAudience && <p className="mt-2 text-xs font-medium text-red-600">{errors.targetAudience}</p>}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">What do you want from creators? <span className="text-red-500">*</span></p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PITCH_GOALS.map((g) => <Chip key={g} active={form.goals.includes(g)} onClick={() => toggle("goals", g)}>{form.goals.includes(g) && <Check className="h-3.5 w-3.5" />}{g}</Chip>)}
                </div>
                {errors.goals && <p className="mt-2 text-xs font-medium text-red-600">{errors.goals}</p>}
              </div>
              <div className="flex gap-3 rounded-xl bg-canvas p-4 text-[13px] text-ink-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Every creator answers the same structured scorecard — problem clarity, value proposition, design, pricing and audience fit — so you can compare responses side by side.
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">Recommended creators for {form.category}</p>
                  <p className="text-[13px] text-ink-muted">Ranked by category, audience overlap and rating. Select up to {MAX_CREATORS}.</p>
                </div>
                <Badge tone="brand">{selected.length}/{MAX_CREATORS} selected</Badge>
              </div>
              <div className="mt-5">
                <CreatorMatcher creators={creators} category={form.category} audiences={form.targetAudience} selected={selected} onToggle={(id) => { setErrors({}); setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])); }} />
              </div>
              {errors.creators && <p className="mt-3 text-xs font-medium text-red-600">{errors.creators}</p>}
            </Card>
          )}

          {step === 3 && (
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">Review your pitch</p>
                <SimulatedTag label="Simulated payment" />
              </div>
              <div className="mt-5 flex gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-canvas text-2xl font-semibold text-ink-muted">
                  {form.images[0] ? <img src={form.images[0]} alt="" className="h-full w-full object-cover" /> : form.productName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-ink">{form.productName}</p>
                  <p className="text-[13px] text-ink-muted">{form.company} · {form.category} · {form.stage} · {form.priceRange}</p>
                  <p className="mt-1 text-sm text-ink">{form.tagline}</p>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{form.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {form.targetAudience.map((a) => <Badge key={a}>{a}</Badge>)}
                {form.goals.map((g) => <Badge key={g} tone="brand">{g}</Badge>)}
              </div>
              <p className="mb-2 mt-6 text-[13px] font-semibold text-ink">Sending to</p>
              <ul className="divide-y divide-line rounded-xl border border-line">
                {chosen.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar initials={c.initials} hue={c.avatarHue} size="sm" />
                    <span className="flex-1 text-sm font-medium text-ink">{c.name}</span>
                    <span className="text-sm text-ink">{formatINR(pitchFee(c))}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-subtle">If a creator declines, their fee is refunded in full (simulated). Fees are charged per creator.</p>
            </Card>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button> : <span />}
            {step < 3 ? <Button size="lg" onClick={next}>Continue</Button> : <Button size="lg" variant="teal" onClick={() => setPayOpen(true)}>Pay {formatINR(total)} & send pitch</Button>}
          </div>
        </div>

        <aside>
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">Pitch summary</p>
            <dl className="mt-4 space-y-2 text-[13px]">
              <div className="flex justify-between"><dt className="text-ink-muted">Creators selected</dt><dd className="font-medium text-ink">{selected.length}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-[15px]"><dt className="font-semibold text-ink">Total</dt><dd className="font-semibold text-ink">{formatINR(total)}</dd></div>
            </dl>
            <div className="mt-3 rounded-xl bg-canvas p-3 text-[13px]">
              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-ink-muted"><span className="h-2 w-2 rounded-full bg-teal-500" />Creators receive</span><span className="font-medium text-ink">{formatINR(creatorEarning)}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="flex items-center gap-1.5 text-ink-muted"><span className="h-2 w-2 rounded-full bg-brand-500" />Platform fee · {pct(COMMISSION.pitch)}</span><span className="font-medium text-ink">{formatINR(platformFee)}</span></div>
            </div>
            <p className="mt-3 text-[11px] leading-snug text-ink-subtle">Proposed pitch commission of {pct(COMMISSION.pitch)} — a business assumption, not a confirmed rate.</p>
          </div>
        </aside>
      </div>

      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} amount={total} description={`Pitch review · ${selected.length} creator${selected.length > 1 ? "s" : ""}`} onSuccess={(r) => onPaid(r.paymentId)} />
    </Container>
  );
}
