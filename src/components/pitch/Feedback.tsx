"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import type { PitchFeedback } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Textarea, Toggle } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";

export const SCORE_LABELS: Record<keyof PitchFeedback["scores"], string> = {
  problemClarity: "Problem clarity",
  valueProposition: "Value proposition",
  productDesign: "Product & packaging design",
  pricing: "Pricing",
  marketFit: "Fit with my audience",
};

const RECS: Record<PitchFeedback["recommendation"], { label: string; desc: string; tone: "teal" | "brand" | "red" }> = {
  promote: { label: "Ready to promote", desc: "I would feature this today", tone: "teal" },
  iterate: { label: "Iterate first", desc: "Promising — needs changes", tone: "brand" },
  not_ready: { label: "Not ready", desc: "Significant gaps to address", tone: "red" },
};

export function avgScore(f: PitchFeedback) {
  const v = Object.values(f.scores);
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
}

export function FeedbackView({ f }: { f: PitchFeedback }) {
  const r = RECS[f.recommendation];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl bg-canvas px-3 py-2">
          <p className="text-[11px] text-ink-subtle">Overall</p>
          <p className="text-lg font-semibold text-ink">{avgScore(f)}<span className="text-sm text-ink-subtle">/5</span></p>
        </div>
        <Badge tone={r.tone}>{r.label}</Badge>
        {f.collaborationInterest && <Badge tone="teal"><Handshake className="h-3 w-3" />Open to future collaboration</Badge>}
        <span className="ml-auto text-xs text-ink-subtle">Submitted {formatDate(f.submittedAt)}</span>
      </div>
      <div className="space-y-2.5">
        {(Object.keys(SCORE_LABELS) as (keyof PitchFeedback["scores"])[]).map((k) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-44 shrink-0 text-[13px] text-ink-muted">{SCORE_LABELS[k]}</span>
            <div className="h-2 flex-1 rounded-full bg-canvas">
              <div className={cn("h-2 rounded-full", f.scores[k] >= 4 ? "bg-teal-500" : f.scores[k] === 3 ? "bg-brand-400" : "bg-amber-400")} style={{ width: `${(f.scores[k] / 5) * 100}%` }} />
            </div>
            <span className="w-8 text-right text-[13px] font-semibold text-ink">{f.scores[k]}/5</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FeedbackBlock title="What works" body={f.strengths} />
        <FeedbackBlock title="What to improve" body={f.improvements} />
        <FeedbackBlock title="Audience fit" body={f.audienceFit} />
      </div>
    </div>
  );
}

function FeedbackBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{body}</p>
    </div>
  );
}

export function FeedbackFormModal({
  open, onClose, productName, onSubmit,
}: { open: boolean; onClose: () => void; productName: string; onSubmit: (f: Omit<PitchFeedback, "submittedAt">) => void }) {
  const [scores, setScores] = useState<PitchFeedback["scores"]>({ problemClarity: 0, valueProposition: 0, productDesign: 0, pricing: 0, marketFit: 0 });
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [audienceFit, setAudienceFit] = useState("");
  const [recommendation, setRec] = useState<PitchFeedback["recommendation"] | "">("");
  const [collab, setCollab] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (Object.values(scores).some((v) => v === 0)) e.scores = "Score every criterion from 1 to 5";
    if (strengths.trim().length < 20) e.strengths = "Add at least 20 characters";
    if (improvements.trim().length < 20) e.improvements = "Add at least 20 characters";
    if (audienceFit.trim().length < 10) e.audienceFit = "Add at least 10 characters";
    if (!recommendation) e.recommendation = "Choose a recommendation";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ scores, strengths: strengths.trim(), improvements: improvements.trim(), audienceFit: audienceFit.trim(), recommendation: recommendation as PitchFeedback["recommendation"], collaborationInterest: collab });
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" title="Submit structured feedback" description={productName} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="teal" onClick={submit}>Submit feedback</Button></>}>
      <div className="space-y-6">
        <div>
          <p className="text-[13px] font-medium text-ink">Scorecard <span className="text-red-500">*</span></p>
          <p className="text-xs text-ink-subtle">1 = weak, 5 = excellent</p>
          <div className="mt-3 space-y-2.5">
            {(Object.keys(SCORE_LABELS) as (keyof PitchFeedback["scores"])[]).map((k) => (
              <div key={k} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[13px] text-ink">{SCORE_LABELS[k]}</span>
                <div className="flex gap-1.5" role="radiogroup" aria-label={SCORE_LABELS[k]}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={scores[k] === n} onClick={() => setScores((s) => ({ ...s, [k]: n }))}
                      className={cn("h-9 w-9 rounded-lg border text-sm font-semibold transition", scores[k] === n ? "border-teal-500 bg-teal-600 text-white" : "border-line text-ink-muted hover:border-teal-300")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.scores && <p className="mt-2 text-xs font-medium text-red-600">{errors.scores}</p>}
        </div>
        <Field label="What works well" required error={errors.strengths} htmlFor="fb-s"><Textarea id="fb-s" value={strengths} onChange={(e) => setStrengths(e.target.value)} invalid={!!errors.strengths} placeholder="Strengths of the product, story or packaging" /></Field>
        <Field label="What should be improved" required error={errors.improvements} htmlFor="fb-i"><Textarea id="fb-i" value={improvements} onChange={(e) => setImprovements(e.target.value)} invalid={!!errors.improvements} placeholder="Specific, actionable suggestions" /></Field>
        <Field label="How well does it fit your audience?" required error={errors.audienceFit} htmlFor="fb-a"><Textarea id="fb-a" value={audienceFit} onChange={(e) => setAudienceFit(e.target.value)} invalid={!!errors.audienceFit} className="min-h-[72px]" /></Field>
        <div>
          <p className="mb-2 text-[13px] font-medium text-ink">Recommendation <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(RECS) as PitchFeedback["recommendation"][]).map((k) => (
              <button key={k} type="button" onClick={() => setRec(k)} aria-pressed={recommendation === k}
                className={cn("rounded-xl border p-3 text-left transition", recommendation === k ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-100" : "border-line hover:border-[#D5D9E4]")}>
                <p className="text-sm font-semibold text-ink">{RECS[k].label}</p>
                <p className="text-xs text-ink-muted">{RECS[k].desc}</p>
              </button>
            ))}
          </div>
          {errors.recommendation && <p className="mt-2 text-xs font-medium text-red-600">{errors.recommendation}</p>}
        </div>
        <label className="flex items-center justify-between gap-4 rounded-xl bg-canvas p-4">
          <span>
            <span className="block text-sm font-medium text-ink">Interested in a future collaboration</span>
            <span className="block text-xs text-ink-muted">Signals interest for RTG Collaborate (coming later). Not a commitment.</span>
          </span>
          <Toggle checked={collab} onChange={setCollab} label="Interested in collaboration" />
        </label>
      </div>
    </Modal>
  );
}
