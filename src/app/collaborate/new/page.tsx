"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Handshake, Plus, X } from "lucide-react";
import { useStore, type NewCollabInput } from "@/lib/store";
import { CITIES } from "@/lib/data/cities";
import { PITCH_CATEGORIES } from "@/lib/data/creators";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Container, PageHeader } from "@/components/ui/Misc";
import { RoleNotice } from "@/components/dashboard/RoleNotice";
import { addDays, toISODate } from "@/lib/utils";

const TYPES: NewCollabInput["campaignType"][] = ["Product launch", "Brand awareness", "Event partnership", "Content series", "Store launch"];
const COMP: NewCollabInput["compensation"][] = ["Paid", "Paid + product", "Product only"];

function ListInput({ label, items, onChange, placeholder, error }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string; error?: string }) {
  const [v, setV] = useState("");
  const add = () => { if (v.trim()) { onChange([...items, v.trim()]); setV(""); } };
  return (
    <Field label={label} required error={error}>
      <div className="flex gap-2">
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button variant="secondary" onClick={add} aria-label={`Add ${label}`}><Plus className="h-4 w-4" /></Button>
      </div>
      {items.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-canvas px-3 py-2 text-[13px] text-ink">
              {it}<button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${it}`} className="text-ink-subtle hover:text-ink"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

export default function NewBriefPage() {
  const router = useRouter();
  const { createCollaboration, demoUser, toast } = useStore();
  const [f, setF] = useState({
    brand: demoUser.title.replace("Founder, ", ""), title: "", summary: "", description: "", category: "", campaignType: "" as NewCollabInput["campaignType"] | "",
    compensation: "Paid" as NewCollabInput["compensation"], budgetMin: "10000", budgetMax: "30000", cities: ["Hyderabad"] as string[], minFollowers: "25000", slots: "2",
    requirements: [] as string[], deliverables: [] as string[], deadline: toISODate(addDays(new Date(), 14)),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const submit = () => {
    const e: Record<string, string> = {};
    if (f.brand.trim().length < 2) e.brand = "Enter your brand name";
    if (f.title.trim().length < 8) e.title = "At least 8 characters";
    if (f.summary.trim().length < 15) e.summary = "At least 15 characters";
    if (f.description.trim().length < 40) e.description = `At least 40 characters (${f.description.trim().length}/40)`;
    if (!f.category) e.category = "Choose a category";
    if (!f.campaignType) e.campaignType = "Choose a campaign type";
    const min = Number(f.budgetMin), max = Number(f.budgetMax);
    if (f.compensation !== "Product only" && (!(min >= 1000) || !(max >= min))) e.budget = "Enter a valid range (minimum ₹1,000, max ≥ min)";
    if (!f.cities.length) e.cities = "Choose at least one city";
    if (!(Number(f.slots) >= 1 && Number(f.slots) <= 20)) e.slots = "1–20 creators";
    if (!(Number(f.minFollowers) >= 0)) e.minFollowers = "Enter a number";
    if (!f.requirements.length) e.requirements = "Add at least one requirement";
    if (!f.deliverables.length) e.deliverables = "Add at least one deliverable";
    if (f.deadline <= toISODate(new Date())) e.deadline = "Choose a future date";
    setErrors(e);
    if (Object.keys(e).length) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const col = createCollaboration({
      brand: f.brand.trim(), title: f.title.trim(), summary: f.summary.trim(), description: f.description.trim(), category: f.category, campaignType: f.campaignType as NewCollabInput["campaignType"],
      compensation: f.compensation, budgetMin: f.compensation === "Product only" ? 0 : min, budgetMax: f.compensation === "Product only" ? 0 : max, cities: f.cities,
      minFollowers: Number(f.minFollowers), slots: Number(f.slots), requirements: f.requirements, deliverables: f.deliverables, deadline: f.deadline,
    });
    toast({ title: "Brief published", body: "Creators can now apply." });
    router.push(`/collaborate/${col.id}`);
  };

  return (
    <Container className="max-w-3xl py-10">
      <RoleNotice expected="user" home="/collaborate/new" />
      <PageHeader eyebrow={<span className="inline-flex items-center gap-1.5"><Handshake className="h-4 w-4" />RTG Collaborate</span>} title="Post a collaboration brief" description="Describe your campaign — creators who fit will apply with a proposal." />
      <Card className="mt-8 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand" required error={errors.brand} htmlFor="b-brand"><Input id="b-brand" value={f.brand} onChange={(e) => set("brand", e.target.value)} invalid={!!errors.brand} /></Field>
          <Field label="Category" required error={errors.category} htmlFor="b-cat"><Select id="b-cat" value={f.category} onChange={(e) => set("category", e.target.value)} invalid={!!errors.category}><option value="">Select a category</option>{PITCH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}<option>Travel</option></Select></Field>
          <Field label="Campaign title" required error={errors.title} htmlFor="b-title" className="sm:col-span-2"><Input id="b-title" value={f.title} onChange={(e) => set("title", e.target.value)} invalid={!!errors.title} placeholder="e.g. Rose mist launch — creator partners" /></Field>
          <Field label="One-line summary" required error={errors.summary} htmlFor="b-sum" className="sm:col-span-2"><Input id="b-sum" value={f.summary} onChange={(e) => set("summary", e.target.value)} invalid={!!errors.summary} maxLength={140} /></Field>
          <Field label="Campaign description" required error={errors.description} htmlFor="b-desc" className="sm:col-span-2"><Textarea id="b-desc" value={f.description} onChange={(e) => set("description", e.target.value)} invalid={!!errors.description} /></Field>
          <Field label="Campaign type" required error={errors.campaignType} className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">{TYPES.map((t) => <Chip key={t} active={f.campaignType === t} onClick={() => set("campaignType", t)}>{t}</Chip>)}</div>
          </Field>
          <Field label="Compensation" required className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">{COMP.map((t) => <Chip key={t} active={f.compensation === t} onClick={() => set("compensation", t)}>{t}</Chip>)}</div>
          </Field>
          {f.compensation !== "Product only" && (
            <Field label="Budget per creator (₹)" required error={errors.budget} className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-3"><Input type="number" aria-label="Minimum budget" value={f.budgetMin} onChange={(e) => set("budgetMin", e.target.value)} /><Input type="number" aria-label="Maximum budget" value={f.budgetMax} onChange={(e) => set("budgetMax", e.target.value)} /></div>
            </Field>
          )}
          <Field label="Target cities" required error={errors.cities} className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">{["All India", ...CITIES.map((c) => c.name)].map((c) => <Chip key={c} active={f.cities.includes(c)} onClick={() => set("cities", f.cities.includes(c) ? f.cities.filter((x) => x !== c) : [...f.cities, c])}>{c}</Chip>)}</div>
          </Field>
          <Field label="Minimum followers" error={errors.minFollowers} htmlFor="b-mf"><Input id="b-mf" type="number" value={f.minFollowers} onChange={(e) => set("minFollowers", e.target.value)} /></Field>
          <Field label="Creator slots" required error={errors.slots} htmlFor="b-slots"><Input id="b-slots" type="number" value={f.slots} onChange={(e) => set("slots", e.target.value)} /></Field>
          <div className="sm:col-span-2"><ListInput label="Requirements" items={f.requirements} onChange={(v) => set("requirements", v)} placeholder="e.g. Skincare content focus" error={errors.requirements} /></div>
          <div className="sm:col-span-2"><ListInput label="Deliverables" items={f.deliverables} onChange={(v) => set("deliverables", v)} placeholder="e.g. 1 reel + 3 stories" error={errors.deliverables} /></div>
          <Field label="Application deadline" required error={errors.deadline} htmlFor="b-dl"><Input id="b-dl" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
        </div>
        <p className="mt-6 text-xs text-ink-subtle">Collaboration fees are agreed directly between brand and creator in this MVP. RTG Live does not process or hold collaboration payments.</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => router.back()}>Cancel</Button><Button onClick={submit}>Publish brief</Button></div>
      </Card>
    </Container>
  );
}
