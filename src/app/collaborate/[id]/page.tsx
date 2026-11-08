"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Check, CheckCircle2, Info, MapPin, Users, X, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CollabApplication } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Container, EmptyState } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { PageSkeleton, Visual } from "@/components/ui/Visual";
import { APP_STATUS, ApplicationTracker, COLLAB_STATUS, budgetLabel, eligibility, isPastDeadline } from "@/components/ecosystem/collab";
import { compact, formatDate, formatINR, timeAgo } from "@/lib/utils";

export default function CollabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { collaborations, applications, creators, role, activeCreatorId, applyToCollab, setApplicationStatus, setCollabStatus, setRole, setActiveCreator, toast, hydrated } = useStore();
  const [form, setForm] = useState({ message: "", fee: "", link: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [declining, setDeclining] = useState<CollabApplication | null>(null);
  const [note, setNote] = useState("");
  const c = collaborations.find((x) => x.id === id);
  if (!c) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const apps = applications.filter((a) => a.collabId === c.id);
  const me = role === "creator" ? creators.find((x) => x.id === activeCreatorId) : undefined;
  const myApp = me ? apps.find((a) => a.creatorId === me.id) : undefined;
  const isOwner = role === "user" && c.ownedByDemoUser;
  const canManage = isOwner || role === "admin";
  const [statusLabel, statusTone] = COLLAB_STATUS[c.status];
  const closed = c.status !== "open" || isPastDeadline(c);
  const accepted = apps.filter((a) => a.status === "accepted").length;

  const submit = () => {
    if (!me) return;
    const e: Record<string, string> = {};
    if (form.message.trim().length < 40) e.message = `Write at least 40 characters about why you're a fit (${form.message.trim().length}/40)`;
    const fee = Number(form.fee);
    if (!Number.isFinite(fee) || fee < 1000) e.fee = "Enter your proposed fee (minimum ₹1,000)";
    if (form.link.trim().length < 6 || !form.link.includes(".")) e.link = "Add a link to your portfolio or channel";
    setErrors(e);
    if (Object.keys(e).length) return;
    applyToCollab({ collabId: c.id, creatorId: me.id, message: form.message.trim(), proposedFee: fee, portfolioLink: form.link.trim() });
    toast({ title: "Application submitted", body: `${c.brand} will review your proposal.` });
  };

  const act = (a: CollabApplication, status: CollabApplication["status"], msg: string, n?: string) => {
    setApplicationStatus(a.id, status, n);
    toast({ title: msg, body: creators.find((x) => x.id === a.creatorId)?.name });
  };

  return (
    <Container className="max-w-6xl py-8 sm:py-10">
      <Link href="/collaborate" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />All collaborations</Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="relative h-32 overflow-hidden bg-ink" aria-hidden>
          <span className="absolute -left-6 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-90" style={{ background: `hsl(${c.brandHue} 55% 55%)` }} />
          <span className="absolute left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-80 mix-blend-screen" style={{ background: `hsl(${(c.brandHue + 35) % 360} 55% 45%)` }} />
          <span className="absolute bottom-3 right-6 max-w-[80%] truncate font-serif text-[clamp(2.25rem,7vw,4.5rem)] italic leading-none text-white/90">{c.brand}</span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2"><Badge tone={statusTone} dot>{statusLabel}</Badge><Badge>{c.campaignType}</Badge><Badge tone="brand">{c.compensation}</Badge>{c.ownedByDemoUser && <Badge tone="teal">Your brief</Badge>}</div>
          <h1 className="mt-3 font-display text-display-md text-ink">{c.title}</h1>
          <p className="mt-1 text-[15px] text-ink-muted">{c.brand} · {c.category}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-4">
            <div><p className="text-ink-subtle">Budget per creator</p><p className="font-semibold text-ink">{budgetLabel(c)}</p></div>
            <div><p className="text-ink-subtle">Cities</p><p className="flex items-center gap-1 font-medium text-ink"><MapPin className="h-3.5 w-3.5" />{c.cities.join(", ")}</p></div>
            <div><p className="text-ink-subtle">Minimum audience</p><p className="flex items-center gap-1 font-medium text-ink"><Users className="h-3.5 w-3.5" />{compact(c.minFollowers)}+</p></div>
            <div><p className="text-ink-subtle">Apply by</p><p className="flex items-center gap-1 font-medium text-ink"><CalendarClock className="h-3.5 w-3.5" />{formatDate(c.deadline)}</p></div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-5">
            <h2 className="text-[15px] font-semibold text-ink"><span className="mr-2 font-mono text-[12px] text-ink-subtle">01</span>About the campaign</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{c.description}</p>
          </Card>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-[15px] font-semibold text-ink"><span className="mr-2 font-mono text-[12px] text-ink-subtle">02</span>Requirements</h2>
              <ul className="mt-3 space-y-2">{c.requirements.map((r) => <li key={r} className="flex items-start gap-2 text-[13.5px] text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />{r}</li>)}</ul>
            </Card>
            <Card className="p-5">
              <h2 className="text-[15px] font-semibold text-ink"><span className="mr-2 font-mono text-[12px] text-ink-subtle">03</span>Deliverables</h2>
              <ul className="mt-3 space-y-2">{c.deliverables.map((r, i) => <li key={r} className="flex items-start gap-2 text-[13.5px] text-ink"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] font-semibold text-ink-muted">{i + 1}</span>{r}</li>)}</ul>
            </Card>
          </div>

          {canManage && (
            <Card>
              <CardHeader title={`Applications (${apps.length})`} description={`${accepted} of ${c.slots} slots filled${role === "admin" ? " · viewing as admin" : ""}`}
                action={isOwner && (c.status === "closed"
                  ? <Button size="sm" variant="secondary" onClick={() => { setCollabStatus(c.id, "open"); toast({ title: "Brief reopened" }); }}>Reopen brief</Button>
                  : <Button size="sm" variant="secondary" onClick={() => { if (confirm("Close this brief to new applications?")) { setCollabStatus(c.id, "closed"); toast({ title: "Brief closed", tone: "info" }); } }}>Close brief</Button>)} />
              {apps.length === 0 ? <EmptyState icon={<Users className="h-5 w-5" />} title="No applications yet" body="Creators who match your requirements will apply here." /> : (
                <ul className="divide-y divide-line">
                  {apps.map((a) => {
                    const cr = creators.find((x) => x.id === a.creatorId)!;
                    return (
                      <li key={a.id} className="p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                          <Avatar creator={cr} size="md" verified={cr.verified} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2"><Link href={`/creators/${cr.slug}/passport`} className="font-semibold text-ink hover:text-brand-600">{cr.name}</Link><Badge tone={APP_STATUS[a.status][1]} dot>{APP_STATUS[a.status][0]}</Badge></div>
                            <p className="text-xs text-ink-subtle">{cr.category} · {cr.location} · {compact(cr.followers)} audience · ★ {cr.rating.toFixed(1)} · applied {timeAgo(a.createdAt)}</p>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">“{a.message}”</p>
                            <p className="mt-1.5 text-xs text-ink-muted">Proposed fee <b className="text-ink">{formatINR(a.proposedFee)}</b> · {a.portfolioLink}</p>
                            {a.brandNote && <p className="mt-1.5 text-xs text-ink-subtle">Note sent: {a.brandNote}</p>}
                          </div>
                        </div>
                        {isOwner && (a.status === "submitted" || a.status === "shortlisted") && (
                          <div className="mt-3 flex flex-wrap gap-2 sm:pl-[60px]">
                            {a.status === "submitted" && <Button size="sm" variant="secondary" onClick={() => act(a, "shortlisted", "Creator shortlisted")}>Shortlist</Button>}
                            <Button size="sm" variant="teal" disabled={accepted >= c.slots} onClick={() => { act(a, "accepted", "Creator accepted"); if (accepted + 1 >= c.slots) setCollabStatus(c.id, "in_progress"); }}><Check className="h-4 w-4" />Accept</Button>
                            <Button size="sm" variant="danger" onClick={() => { setDeclining(a); setNote(""); }}><X className="h-4 w-4" />Decline</Button>
                            <Link href={`/creators/${cr.slug}`} className="inline-flex items-center px-2 text-xs font-medium text-brand-600">View profile</Link>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          )}
        </div>

        <aside>
          <div className="sticky top-24 space-y-4">
            {role === "creator" && me && (
              myApp && myApp.status !== "withdrawn" ? (
                <Card className="p-5">
                  <p className="text-sm font-semibold text-ink">Your application</p>
                  <p className="text-xs text-ink-subtle">{myApp.id} · updated {timeAgo(myApp.updatedAt)}</p>
                  <div className="mt-4"><ApplicationTracker status={myApp.status} /></div>
                  <dl className="mt-4 space-y-1.5 rounded-xl bg-canvas p-3 text-[13px]">
                    <div className="flex justify-between"><dt className="text-ink-muted">Proposed fee</dt><dd className="font-medium text-ink">{formatINR(myApp.proposedFee)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-ink-muted">Portfolio</dt><dd className="truncate text-ink">{myApp.portfolioLink}</dd></div>
                  </dl>
                  {myApp.brandNote && <p className="mt-3 rounded-xl border border-line p-3 text-[13px] text-ink-muted">Message from {c.brand}: “{myApp.brandNote}”</p>}
                  {myApp.status === "accepted" && <p className="mt-3 flex items-start gap-2 text-[13px] text-teal-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />You&apos;re on this campaign. Deliverables and payment terms are agreed directly with the brand in this MVP.</p>}
                  {(myApp.status === "submitted" || myApp.status === "shortlisted") && (
                    <Button size="sm" variant="ghost" className="mt-3" onClick={() => { if (confirm("Withdraw your application?")) { setApplicationStatus(myApp.id, "withdrawn"); toast({ title: "Application withdrawn", tone: "info" }); } }}>Withdraw application</Button>
                  )}
                </Card>
              ) : (
                <Card className="p-5">
                  <p className="text-sm font-semibold text-ink">Apply as {me.name}</p>
                  {(() => {
                    const el = eligibility(c, me);
                    return (
                      <ul className="mt-3 space-y-1.5 text-[13px]">
                        <li className="flex items-center gap-2">{el.followers ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : <XCircle className="h-4 w-4 text-red-500" />}Audience {compact(me.followers)} (min {compact(c.minFollowers)})</li>
                        <li className="flex items-center gap-2">{el.city ? <CheckCircle2 className="h-4 w-4 text-teal-500" /> : <XCircle className="h-4 w-4 text-amber-500" />}Based in {me.location}{el.city ? "" : " — outside target cities"}</li>
                      </ul>
                    );
                  })()}
                  {closed ? (
                    <p className="mt-4 rounded-xl bg-canvas p-3 text-[13px] text-ink-muted">This brief is no longer accepting applications.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <Field label="Why are you a good fit?" htmlFor="am" required error={errors.message}><Textarea id="am" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} invalid={!!errors.message} placeholder="Your audience, relevant past work and content idea" /></Field>
                      <Field label="Proposed fee (₹)" htmlFor="af" required error={errors.fee} hint={c.budgetMax ? `Brand budget: ${budgetLabel(c)}` : undefined}><Input id="af" type="number" inputMode="numeric" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} invalid={!!errors.fee} /></Field>
                      <Field label="Portfolio or channel link" htmlFor="al" required error={errors.link}><Input id="al" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} invalid={!!errors.link} placeholder={me.socials[0] ? `${me.socials[0].platform.toLowerCase()}.com/${me.socials[0].handle.replace("@", "")}` : ""} /></Field>
                      <Button className="w-full" onClick={submit}>Submit application</Button>
                      {myApp?.status === "withdrawn" && <p className="text-xs text-ink-subtle">You withdrew an earlier application — submitting again replaces it.</p>}
                    </div>
                  )}
                </Card>
              )
            )}
            {role === "user" && !isOwner && (
              <Card className="p-5">
                <p className="text-sm font-semibold text-ink">Are you a creator?</p>
                <p className="mt-1 text-[13px] text-ink-muted">Creators apply to briefs from their creator account. Switch to a demo creator to try it.</p>
                <Button size="sm" className="mt-3" onClick={() => { setRole("creator"); setActiveCreator(c.category === "Food & Beverage" ? "c14" : c.category === "Gaming" ? "c16" : "c3"); toast({ title: "Switched to a creator account", tone: "info" }); }}>Apply as a demo creator</Button>
              </Card>
            )}
            {isOwner && (
              <Card className="p-5 text-[13px] text-ink-muted">
                <p className="text-sm font-semibold text-ink">Managing your brief</p>
                <p className="mt-1">Shortlist promising creators, then accept up to {c.slots}. The brief moves to <b>In progress</b> once all slots are filled. Creators are notified at each step (in-app demo notifications).</p>
              </Card>
            )}
            <Card className="flex gap-2 p-4 text-[12px] text-ink-muted"><Info className="h-4 w-4 shrink-0" />Brands, budgets and applicant numbers are sample data. No collaboration payments are processed or held in escrow.</Card>
          </div>
        </aside>
      </div>

      <Modal open={!!declining} onClose={() => setDeclining(null)} title="Decline application" description="Optionally add a short note for the creator."
        footer={<><Button variant="secondary" onClick={() => setDeclining(null)}>Cancel</Button><Button variant="danger" onClick={() => { act(declining!, "declined", "Application declined", note.trim() || undefined); setDeclining(null); }}>Decline</Button></>}>
        <Field label="Note to creator" htmlFor="dnote"><Textarea id="dnote" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. We're prioritising creators with a larger Hyderabad audience this time." /></Field>
      </Modal>
      {role === "admin" && <div className="mt-6"><Button variant="ghost" size="sm" onClick={() => router.push("/admin?tab=ecosystem")}>Back to admin ecosystem view</Button></div>}
    </Container>
  );
}
