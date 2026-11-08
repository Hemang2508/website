"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, FlaskConical, Handshake, Inbox, Lightbulb, Plus, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { Container, EmptyState, PageHero, Tabs } from "@/components/ui/Misc";
import { Chip, Select, Toggle } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { APP_STATUS, CollabCard } from "@/components/ecosystem/collab";

type Tab = "all" | "mine";

export default function CollaboratePage() {
  const { collaborations, applications, role, activeCreatorId, creators, pitchRequests, pitches } = useStore();
  const [tab, setTab] = useState<Tab>("all");
  const [cat, setCat] = useState("All");
  const [comp, setComp] = useState("All");
  const [city, setCity] = useState("All");
  const [openOnly, setOpenOnly] = useState(true);

  const cats = ["All", ...Array.from(new Set(collaborations.map((c) => c.category)))];
  const cities = ["All", ...Array.from(new Set(collaborations.flatMap((c) => c.cities)))];
  const filtered = collaborations.filter((c) =>
    (cat === "All" || c.category === cat) && (comp === "All" || c.compensation === comp) &&
    (city === "All" || c.cities.includes(city) || c.cities.includes("All India")) && (!openOnly || c.status === "open"));

  const myBriefs = collaborations.filter((c) => c.ownedByDemoUser);
  const myApps = applications.filter((a) => a.creatorId === activeCreatorId);
  // Leads from RTG Pitch: creators who signalled collaboration interest on the user's pitches
  const leads = useMemo(() => pitchRequests.filter((r) => r.feedback?.collaborationInterest && pitches.find((p) => p.id === r.pitchId)?.isDemoUser), [pitchRequests, pitches]);

  const mineTab = role === "user" ? { id: "mine" as Tab, label: "My briefs", count: myBriefs.length } : role === "creator" ? { id: "mine" as Tab, label: "My applications", count: myApps.length } : null;

  return (
    <>
    <PageHero
        eyebrow={<span className="inline-flex items-center gap-1.5"><Handshake className="h-4 w-4" />RTG Collaborate · Beta</span>}
        title={<>Brand briefs, <em className="font-serif font-normal italic text-teal-400">organised</em>.</>}
        description="Brands post campaign briefs, creators apply with a proposal, and both sides track every application from submitted to accepted."
        actions={role === "user" ? <ButtonLink href="/collaborate/new"><Plus className="h-4 w-4" />Post a brief</ButtonLink> : role === "creator" ? <ButtonLink href="/creator?tab=collabs" variant="secondary">Track my applications</ButtonLink> : undefined}
      />
    <Container className="py-10">

      {mineTab && <Tabs className="mb-2" value={tab} onChange={setTab} tabs={[{ id: "all", label: "Opportunities", count: collaborations.filter((c) => c.status === "open").length }, mineTab]} />}

      {tab === "all" && (
        <>
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c === "All" ? "All categories" : c}</Chip>)}</div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <Select value={comp} onChange={(e) => setComp(e.target.value)} aria-label="Compensation" className="sm:w-52"><option value="All">Any compensation</option><option>Paid</option><option>Paid + product</option><option>Product only</option></Select>
              <Select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className="sm:w-40">{cities.map((c) => <option key={c} value={c}>{c === "All" ? "Any city" : c}</option>)}</Select>
              <label className="col-span-2 flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-ink">Open only <Toggle checked={openOnly} onChange={setOpenOnly} label="Open only" /></label>
            </div>
          </div>
          {filtered.length ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((c) => <CollabCard key={c.id} collab={c} />)}</div>
          ) : (
            <Card className="mt-6"><EmptyState icon={<Briefcase className="h-5 w-5" />} title="No collaborations match these filters" action={<button className="text-sm font-medium text-brand-600" onClick={() => { setCat("All"); setComp("All"); setCity("All"); setOpenOnly(false); }}>Show all briefs</button>} /></Card>
          )}
        </>
      )}

      {tab === "mine" && role === "user" && (
        <div className="mt-6 space-y-6">
          {myBriefs.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{myBriefs.map((c) => <CollabCard key={c.id} collab={c} />)}</div>
            : <Card><EmptyState icon={<Briefcase className="h-5 w-5" />} title="You haven't posted a brief yet" action={<ButtonLink href="/collaborate/new" size="sm">Post a brief</ButtonLink>} /></Card>}
          {leads.length > 0 && (
            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Lightbulb className="h-4 w-4 text-brand-500" />Creators open to collaborating with you</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">These creators said they&apos;re interested in a future collaboration when reviewing your RTG Pitch.</p>
              <ul className="mt-4 divide-y divide-line">
                {leads.map((r) => {
                  const c = creators.find((x) => x.id === r.creatorId)!;
                  const p = pitches.find((x) => x.id === r.pitchId);
                  return (
                    <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                      <div className="flex flex-1 items-center gap-3"><Avatar creator={c} size="sm" /><div><p className="text-[13px] font-semibold text-ink">{c.name}</p><p className="text-xs text-ink-subtle">Reviewed {p?.productName}</p></div></div>
                      <div className="flex gap-2"><Link href={`/creators/${c.slug}/passport`} className="text-xs font-medium text-brand-600">View Passport</Link><span className="text-ink-subtle">·</span><Link href="/collaborate/new" className="text-xs font-medium text-brand-600">Post a brief</Link></div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </div>
      )}

      {tab === "mine" && role === "creator" && (
        <Card className="mt-6">
          {myApps.length === 0 ? <EmptyState icon={<Inbox className="h-5 w-5" />} title="No applications yet" body="Browse opportunities and apply with a short proposal." action={<button className="text-sm font-medium text-brand-600" onClick={() => setTab("all")}>Browse opportunities</button>} /> : (
            <ul className="divide-y divide-line">
              {myApps.map((a) => {
                const c = collaborations.find((x) => x.id === a.collabId);
                return (
                  <li key={a.id}><Link href={`/collaborate/${a.collabId}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-canvas">
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{c?.title}</p><p className="text-xs text-ink-subtle">{c?.brand} · {a.id}</p></div>
                    <Badge tone={APP_STATUS[a.status][1]} dot>{APP_STATUS[a.status][0]}</Badge>
                  </Link></li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">How RTG Collaborate works</p>
          <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[["Brands post a brief", "Requirements, deliverables, budget and timeline in one place."], ["Creators apply", "A short proposal with fee and portfolio. Eligibility is shown upfront."], ["Track to acceptance", "Submitted → shortlisted → accepted, with notifications at each step."]].map(([t, d], i) => (
              <li key={t}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{i + 1}</span><p className="mt-2 text-sm font-semibold text-ink">{t}</p><p className="mt-0.5 text-[13px] text-ink-muted">{d}</p></li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-ink-subtle">In this MVP, campaign fees are agreed between brand and creator; no collaboration payments are processed or held on the platform.</p>
        </Card>
        <div className="rounded-2xl border border-dashed border-[#CCD2DE] bg-white/60 p-6">
          <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-ink-muted"><FlaskConical className="h-5 w-5" /></span><Badge>Future opportunity</Badge></div>
          <p className="mt-4 text-lg font-semibold text-ink">Creator-owned products</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">A later phase could help creators co-develop and launch their own products with manufacturing and brand partners. This is a concept only — it is not an operational service in this demo.</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-subtle"><Sparkles className="h-3.5 w-3.5" />Not available yet</p>
        </div>
      </div>
    </Container>
    </>
  );
}
