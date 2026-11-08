"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Globe, Lightbulb, Plus, Users } from "lucide-react";
import { pitchOverallStatus, useStore } from "@/lib/store";
import { COMMISSION, pct, splitAmount } from "@/lib/pricing";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { PitchStatusBadge } from "@/components/ui/StatusBadge";
import { FeedbackView, SCORE_LABELS, avgScore } from "@/components/pitch/Feedback";
import { CreatorMatcher, MAX_CREATORS, pitchFee } from "@/components/pitch/CreatorMatcher";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { formatDate, formatINR, timeAgo } from "@/lib/utils";
import type { PitchFeedback } from "@/lib/types";

export default function PitchDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PitchDetail />
    </Suspense>
  );
}

function PitchDetail() {
  const { id } = useParams<{ id: string }>();
  const isNew = useSearchParams().get("new") === "1";
  const router = useRouter();
  const { pitches, pitchRequests, creators, hydrated, role, sendPitchRequests, setRole, setActiveCreator, toast } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState<string[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const p = pitches.find((x) => x.id === id);
  if (!p) {
    if (!hydrated) return <div className="min-h-[70vh]" />;
    notFound();
  }
  const reqs = pitchRequests.filter((r) => r.pitchId === p.id);
  const status = pitchOverallStatus(reqs);
  const withFeedback = reqs.filter((r) => r.feedback);
  const room = MAX_CREATORS - reqs.filter((r) => r.status !== "declined").length;
  const addTotal = creators.filter((c) => adding.includes(c.id)).reduce((s, c) => s + pitchFee(c), 0);
  const firstPending = reqs.find((r) => r.status === "pending" || r.status === "accepted");
  const pendingCreator = firstPending && creators.find((c) => c.id === firstPending.creatorId);

  const averages = withFeedback.length
    ? (Object.keys(SCORE_LABELS) as (keyof PitchFeedback["scores"])[]).map((k) => ({
        k, label: SCORE_LABELS[k], v: Math.round((withFeedback.reduce((s, r) => s + r.feedback!.scores[k], 0) / withFeedback.length) * 10) / 10,
      }))
    : [];

  return (
    <Container className="max-w-6xl py-10">
      <Link href="/pitch" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />All pitches</Link>

      {isNew && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div className="text-[13px] text-teal-800">
            <p className="font-semibold">Pitch submitted and sent</p>
            <p>Creators typically respond within 48 hours. Simulated payment recorded for {reqs.length} creator{reqs.length > 1 ? "s" : ""}.</p>
          </div>
        </div>
      )}

      {role === "user" && pendingCreator && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center">
          <Lightbulb className="h-5 w-5 shrink-0 text-brand-600" />
          <p className="flex-1 text-[13px] text-brand-800"><b>Demo tip:</b> switch to {pendingCreator.name}&apos;s creator account to accept this pitch and submit feedback.</p>
          <Button size="sm" onClick={() => { setRole("creator"); setActiveCreator(pendingCreator.id); toast({ title: `Signed in as ${pendingCreator.name}`, tone: "info" }); router.push("/creator?tab=pitches"); }}>Open as creator</Button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white text-3xl font-semibold text-ink-muted">
          {p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : p.productName.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{p.productName}</h1>
            <Badge tone={status.tone} dot>{status.label}</Badge>
          </div>
          <p className="mt-1 text-[15px] text-ink-muted">{p.tagline}</p>
          <p className="mt-2 text-[13px] text-ink-subtle">{p.company} · {p.id} · submitted {formatDate(p.createdAt)} by {p.submittedBy}</p>
        </div>
        {role === "user" && p.isDemoUser && room > 0 && <Button variant="secondary" onClick={() => { setAdding([]); setAddOpen(true); }}><Plus className="h-4 w-4" />Add creators</Button>}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {averages.length > 0 && (
            <Card>
              <CardHeader title="Feedback summary" description={`Average across ${withFeedback.length} creator${withFeedback.length > 1 ? "s" : ""}`} action={<span className="text-2xl font-semibold text-ink">{(averages.reduce((s, a) => s + a.v, 0) / averages.length).toFixed(1)}<span className="text-sm text-ink-subtle">/5</span></span>} />
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-5">
                {averages.map((a) => (
                  <div key={a.k} className="rounded-xl bg-canvas p-3">
                    <p className="text-[11px] leading-tight text-ink-muted">{a.label}</p>
                    <p className="mt-1 text-xl font-semibold text-ink">{a.v}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div>
            <h2 className="mb-3 text-base font-semibold text-ink">Creator responses</h2>
            <div className="space-y-4">
              {reqs.map((r) => {
                const c = creators.find((x) => x.id === r.creatorId)!;
                return (
                  <Card key={r.id}>
                    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                      <Link href={`/creators/${c.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar creator={c} size="md" verified={c.verified} />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink hover:text-brand-600">{c.name}</p>
                          <p className="truncate text-xs text-ink-muted">Sent {timeAgo(r.sentAt)}{r.respondedAt ? ` · responded ${timeAgo(r.respondedAt)}` : ""} · {formatINR(r.fee)}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3">
                        {r.feedback && <span className="text-sm font-semibold text-ink">{avgScore(r.feedback)}/5</span>}
                        <PitchStatusBadge status={r.status} />
                      </div>
                    </div>
                    {r.feedback && <div className="border-t border-line p-5"><FeedbackView f={r.feedback} /></div>}
                    {r.status === "accepted" && <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">{c.name.split(" ")[0]} accepted your pitch and is preparing feedback.</p>}
                    {r.status === "pending" && <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">Waiting for {c.name.split(" ")[0]} to accept or decline.</p>}
                    {r.status === "declined" && <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">“{r.declineReason}” — {formatINR(r.fee)} refunded (simulated).</p>}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-ink">Product details</p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{p.description}</p>
            <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[13px]">
              <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Category</dt><dd className="text-right font-medium text-ink">{p.category}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Stage</dt><dd className="font-medium text-ink">{p.stage}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Price</dt><dd className="font-medium text-ink">{p.priceRange}</dd></div>
              {p.website && <div className="flex justify-between gap-3"><dt className="text-ink-subtle">Website</dt><dd className="flex items-center gap-1 font-medium text-ink"><Globe className="h-3.5 w-3.5" />{p.website}</dd></div>}
            </dl>
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-subtle"><Users className="h-3.5 w-3.5" />Audience & goals</p>
              <div className="flex flex-wrap gap-1.5">
                {p.targetAudience.map((a) => <Badge key={a}>{a}</Badge>)}
                {p.goals.map((g) => <Badge key={g} tone="brand">{g}</Badge>)}
              </div>
            </div>
            {p.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-4">
                {p.images.map((src, i) => <img key={i} src={src} alt={`${p.productName} ${i + 1}`} className="aspect-square rounded-lg border border-line object-cover" />)}
              </div>
            )}
          </Card>
          <Card className="p-5 text-[13px]">
            <p className="text-sm font-semibold text-ink">Payments</p>
            {(() => {
              const paid = reqs.filter((r) => r.status !== "declined");
              const total = paid.reduce((s, r) => s + r.fee, 0);
              const refunded = reqs.filter((r) => r.status === "declined").reduce((s, r) => s + r.fee, 0);
              const split = splitAmount(total, COMMISSION.pitch);
              return (
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between"><dt className="text-ink-muted">Active pitch fees</dt><dd className="font-medium text-ink">{formatINR(total)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-muted">Creators receive</dt><dd className="text-ink">{formatINR(split.creatorEarning)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-muted">Platform fee ({pct(COMMISSION.pitch)})</dt><dd className="text-ink">{formatINR(split.platformFee)}</dd></div>
                  {refunded > 0 && <div className="flex justify-between"><dt className="text-ink-muted">Refunded (simulated)</dt><dd className="text-ink">{formatINR(refunded)}</dd></div>}
                </dl>
              );
            })()}
          </Card>
        </aside>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        size="lg"
        title="Send to more creators"
        description={`You can add ${room} more creator${room === 1 ? "" : "s"} to this pitch.`}
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button variant="teal" disabled={!adding.length} onClick={() => { setAddOpen(false); setPayOpen(true); }}>Continue · {formatINR(addTotal)}</Button></>}
      >
        <CreatorMatcher
          creators={creators}
          category={p.category}
          audiences={p.targetAudience}
          exclude={reqs.map((r) => r.creatorId)}
          selected={[...reqs.filter((r) => r.status !== "declined").map((r) => r.creatorId), ...adding]}
          onToggle={(cid) => setAdding((s) => (s.includes(cid) ? s.filter((x) => x !== cid) : [...s, cid]))}
        />
      </Modal>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} amount={addTotal} description={`Pitch review · ${adding.length} more creator${adding.length > 1 ? "s" : ""}`}
        onSuccess={(r) => { sendPitchRequests(p.id, adding, r.paymentId); setPayOpen(false); setAdding([]); toast({ title: "Pitch sent to more creators" }); }} />
    </Container>
  );
}
