"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator, Service, ServiceType } from "@/lib/types";
import { COMMISSION, pct, splitAmount } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

const MIN = 299, MAX = 100000;

function validate(s: Pick<Service, "title" | "price" | "durationMins" | "type">) {
  const e: Record<string, string> = {};
  if (s.title.trim().length < 4) e.title = "At least 4 characters";
  if (!Number.isFinite(s.price) || s.price < MIN || s.price > MAX) e.price = `Between ${formatINR(MIN)} and ${formatINR(MAX)}`;
  if (s.type !== "pitch" && (s.durationMins < 10 || s.durationMins > 180)) e.durationMins = "10–180 minutes";
  return e;
}

function ServiceRow({ creatorId, s }: { creatorId: string; s: Service }) {
  const { updateService, toast } = useStore();
  const [draft, setDraft] = useState({ title: s.title, price: String(s.price), durationMins: String(s.durationMins), description: s.description });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const price = Number(draft.price) || 0;
  const dirty = draft.title !== s.title || price !== s.price || Number(draft.durationMins) !== s.durationMins || draft.description !== s.description;
  const mkt = splitAmount(price, s.type === "pitch" ? COMMISSION.pitch : COMMISSION.marketplace);
  const own = splitAmount(price, COMMISSION.creatorOriginated);

  const save = () => {
    const next = { title: draft.title, price, durationMins: Number(draft.durationMins), type: s.type };
    const e = validate(next);
    setErrors(e);
    if (Object.keys(e).length) return;
    updateService(creatorId, s.id, { title: draft.title.trim(), price, durationMins: next.durationMins, description: draft.description.trim() });
    toast({ title: "Service updated", body: `${draft.title} is now ${formatINR(price)} on your public profile.` });
  };

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone={s.type === "pitch" ? "teal" : "brand"}>{s.type === "pitch" ? "RTG Pitch" : s.type === "mentorship" ? "Mentorship" : "1:1 call"}</Badge>
          {!s.active && <Badge>Hidden</Badge>}
        </div>
        <label className="flex items-center gap-2 text-[13px] text-ink-muted">Visible on profile <Toggle checked={s.active} onChange={(v) => { updateService(creatorId, s.id, { active: v }); toast({ title: v ? "Service is now visible" : "Service hidden", tone: "info" }); }} label="Visible on profile" /></label>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px_120px]">
        <Field label="Service name" error={errors.title}><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} invalid={!!errors.title} /></Field>
        <Field label="Price (₹)" error={errors.price}><Input type="number" inputMode="numeric" min={MIN} max={MAX} step={100} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} invalid={!!errors.price} /></Field>
        {s.type !== "pitch" ? (
          <Field label="Minutes" error={errors.durationMins}><Input type="number" min={10} max={180} step={5} value={draft.durationMins} onChange={(e) => setDraft({ ...draft, durationMins: e.target.value })} invalid={!!errors.durationMins} /></Field>
        ) : (
          <Field label="Delivery"><Input value="Async · 5 days" disabled /></Field>
        )}
        <Field label="Description" className="sm:col-span-3"><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="min-h-[64px]" /></Field>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-muted">
          {s.type === "pitch" ? (
            <span>You earn <b className="text-ink">{formatINR(mkt.creatorEarning)}</b> per pitch ({pct(COMMISSION.pitch)} fee)</span>
          ) : (
            <>
              <span>Marketplace: <b className="text-ink">{formatINR(mkt.creatorEarning)}</b> ({pct(COMMISSION.marketplace)})</span>
              <span>Your link: <b className="text-teal-700">{formatINR(own.creatorEarning)}</b> ({pct(COMMISSION.creatorOriginated)})</span>
            </>
          )}
        </div>
        <Button size="sm" onClick={save} disabled={!dirty}><Save className="h-4 w-4" />Save changes</Button>
      </div>
    </Card>
  );
}

export function CreatorServices({ creator }: { creator: Creator }) {
  const { addService, toast } = useStore();
  const [adding, setAdding] = useState(false);
  const [n, setN] = useState({ title: "", price: "1999", durationMins: "30", type: "call" as ServiceType, description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasPitch = creator.services.some((s) => s.type === "pitch");

  const create = () => {
    const next = { title: n.title, price: Number(n.price), durationMins: n.type === "pitch" ? 0 : Number(n.durationMins), type: n.type };
    const e = validate(next);
    if (n.description.trim().length < 10) e.description = "At least 10 characters";
    setErrors(e);
    if (Object.keys(e).length) return;
    addService(creator.id, { ...next, title: n.title.trim(), description: n.description.trim(), active: true });
    toast({ title: "Service added", body: `${n.title} is live on your profile.` });
    setAdding(false);
    setN({ title: "", price: "1999", durationMins: "30", type: "call", description: "" });
  };

  return (
    <div className="space-y-4">
      {creator.services.map((s) => <ServiceRow key={s.id + s.price + s.title} creatorId={creator.id} s={s} />)}
      {adding ? (
        <Card className="p-5">
          <p className="text-sm font-semibold text-ink">New service</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Type">
              <Select value={n.type} onChange={(e) => setN({ ...n, type: e.target.value as ServiceType })}>
                <option value="call">1:1 video call</option>
                <option value="mentorship">Mentorship</option>
                {!hasPitch && <option value="pitch">Product pitch review</option>}
              </Select>
            </Field>
            <Field label="Service name" required error={errors.title}><Input value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} invalid={!!errors.title} placeholder="e.g. Brand audit" /></Field>
            <Field label="Price (₹)" required error={errors.price}><Input type="number" value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} invalid={!!errors.price} /></Field>
            {n.type !== "pitch" && <Field label="Duration (minutes)" required error={errors.durationMins}><Input type="number" value={n.durationMins} onChange={(e) => setN({ ...n, durationMins: e.target.value })} invalid={!!errors.durationMins} /></Field>}
            <Field label="Description" required error={errors.description} className="sm:col-span-2"><Textarea value={n.description} onChange={(e) => setN({ ...n, description: e.target.value })} invalid={!!errors.description} className="min-h-[64px]" /></Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={create}>Add service</Button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line py-5 text-sm font-medium text-ink-muted transition hover:border-brand-300 hover:text-brand-600">
          <Plus className="h-4 w-4" />Add a service
        </button>
      )}
    </div>
  );
}
