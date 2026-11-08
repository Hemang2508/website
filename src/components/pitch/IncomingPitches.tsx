"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Inbox, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { PitchRequest } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, Tabs } from "@/components/ui/Misc";
import { PitchStatusBadge } from "@/components/ui/StatusBadge";
import { FeedbackFormModal, FeedbackView } from "./Feedback";
import { cn, formatINR, timeAgo } from "@/lib/utils";
import { pct } from "@/lib/pricing";

type Filter = "pending" | "accepted" | "done" | "declined";

/** Creator-side pitch request management: accept, decline and submit structured feedback. */
export function IncomingPitches({ creatorId }: { creatorId: string }) {
  const { pitchRequests, pitches, respondToPitch, submitPitchFeedback, toast } = useStore();
  const mine = pitchRequests.filter((r) => r.creatorId === creatorId);
  const [filter, setFilter] = useState<Filter>("pending");
  const [declining, setDeclining] = useState<PitchRequest | null>(null);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");
  const [feedbackFor, setFeedbackFor] = useState<PitchRequest | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const groups: Record<Filter, PitchRequest[]> = {
    pending: mine.filter((r) => r.status === "pending"),
    accepted: mine.filter((r) => r.status === "accepted"),
    done: mine.filter((r) => r.status === "feedback_submitted"),
    declined: mine.filter((r) => r.status === "declined"),
  };
  const list = groups[filter];

  return (
    <div>
      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { id: "pending", label: "New requests", count: groups.pending.length },
          { id: "accepted", label: "Feedback due", count: groups.accepted.length },
          { id: "done", label: "Completed", count: groups.done.length },
          { id: "declined", label: "Declined", count: groups.declined.length },
        ]}
      />
      <div className="mt-4 space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl border border-line bg-white">
            <EmptyState icon={<Inbox className="h-5 w-5" />} title="Nothing here yet" body={filter === "pending" ? "New product pitches from brands will appear here." : "Pitches will move here as you act on them."} />
          </div>
        )}
        {list.map((r) => {
          const p = pitches.find((x) => x.id === r.pitchId);
          if (!p) return null;
          const open = expanded === r.id || r.status === "pending";
          return (
            <div key={r.id} className="rounded-2xl border border-line bg-white shadow-card">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-canvas text-lg font-semibold text-ink-muted">
                  {p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : p.productName.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{p.productName}</p>
                    <PitchStatusBadge status={r.status} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-ink-muted">{p.company} · {p.category} · {p.stage} · received {timeAgo(r.sentAt)}</p>
                  <p className="mt-2 text-sm text-ink">{p.tagline}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-[11px] text-ink-subtle">You earn</p>
                  <p className="text-lg font-semibold text-ink">{formatINR(r.creatorEarning)}</p>
                  <p className="text-[11px] text-ink-subtle">{formatINR(r.fee)} − {pct(r.commissionRate)} fee</p>
                </div>
              </div>

              {open && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-[13px] leading-relaxed text-ink-muted">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.targetAudience.map((a) => <Badge key={a}>{a}</Badge>)}
                    {p.goals.map((g) => <Badge key={g} tone="brand">{g}</Badge>)}
                    <Badge tone="neutral">Price: {p.priceRange}</Badge>
                  </div>
                  {p.images.length > 1 && (
                    <div className="mt-3 flex gap-2">
                      {p.images.map((src, i) => <img key={i} src={src} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />)}
                    </div>
                  )}
                  {r.status === "feedback_submitted" && r.feedback && <div className="mt-5 border-t border-line pt-5"><FeedbackView f={r.feedback} /></div>}
                  {r.status === "declined" && r.declineReason && <p className="mt-4 rounded-lg bg-canvas p-3 text-[13px] text-ink-muted">Your note: {r.declineReason}</p>}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
                {r.status === "pending" && (
                  <>
                    <Button size="sm" variant="teal" onClick={() => { respondToPitch(r.id, true); toast({ title: "Pitch accepted", body: `Submit feedback on ${p.productName} within 5 days.` }); setFilter("accepted"); }}><Check className="h-4 w-4" />Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => { setDeclining(r); setReason(""); setReasonErr(""); }}><X className="h-4 w-4" />Decline</Button>
                  </>
                )}
                {r.status === "accepted" && <Button size="sm" variant="teal" onClick={() => setFeedbackFor(r)}>Submit feedback</Button>}
                {r.status !== "pending" && (
                  <button onClick={() => setExpanded(open ? null : r.id)} className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-ink-muted hover:text-ink">
                    {open ? "Hide details" : "View details"} <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
                  </button>
                )}
                {r.status === "pending" && <span className="ml-auto text-xs text-ink-subtle">Respond within 48 hours</span>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={!!declining}
        onClose={() => setDeclining(null)}
        title="Decline pitch"
        description="The brand receives a full simulated refund. A short note helps them improve."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeclining(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              if (reason.trim().length < 10) { setReasonErr("Please add a short reason (at least 10 characters)"); return; }
              respondToPitch(declining!.id, false, reason.trim());
              toast({ title: "Pitch declined", body: "The brand has been notified and refunded (simulated)." });
              setDeclining(null);
            }}>Decline pitch</Button>
          </>
        }
      >
        <Field label="Reason for declining" required error={reasonErr} htmlFor="decline-reason">
          <Textarea id="decline-reason" value={reason} onChange={(e) => setReason(e.target.value)} invalid={!!reasonErr} placeholder="e.g. This category is outside my content focus." />
        </Field>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Outside my content focus", "Not the right audience fit", "Fully booked this month"].map((s) => (
            <button key={s} type="button" onClick={() => setReason(s + ".")} className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted hover:text-ink">{s}</button>
          ))}
        </div>
      </Modal>

      {feedbackFor && (
        <FeedbackFormModal
          open
          onClose={() => setFeedbackFor(null)}
          productName={pitches.find((p) => p.id === feedbackFor.pitchId)?.productName ?? ""}
          onSubmit={(f) => {
            submitPitchFeedback(feedbackFor.id, f);
            toast({ title: "Feedback submitted", body: `${formatINR(feedbackFor.creatorEarning)} added to your earnings.` });
            setFeedbackFor(null);
            setFilter("done");
          }}
        />
      )}
      <p className="mt-6 text-xs text-ink-subtle">Tip: brands see your feedback in their <Link href="/pitch" className="underline">pitch tracker</Link> as soon as you submit it.</p>
    </div>
  );
}
