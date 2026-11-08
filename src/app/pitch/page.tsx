"use client";

import { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Container, EmptyState, PageHero, Stat, Tabs } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { PitchListItem } from "@/components/pitch/PitchListItem";
import { IncomingPitches } from "@/components/pitch/IncomingPitches";

export default function PitchManagementPage() {
  const { role, pitches, pitchRequests, creators, activeCreatorId } = useStore();
  const [tab, setTab] = useState<"all" | "active" | "complete">("all");

  if (role === "creator") {
    const c = creators.find((x) => x.id === activeCreatorId);
    return (
      <>
      <PageHero eyebrow="RTG Pitch" title="Pitch requests" description={`Product pitches sent to ${c?.name}. Accept or decline, then submit structured feedback.`} />
      <Container className="py-10">
        <div className="mt-8"><IncomingPitches creatorId={activeCreatorId} /></div>
      </Container>
      </>
    );
  }

  const visible = role === "admin" ? pitches : pitches.filter((p) => p.isDemoUser);
  const withReqs = visible.map((p) => ({ p, reqs: pitchRequests.filter((r) => r.pitchId === p.id) }));
  const isComplete = (reqs: typeof pitchRequests) => reqs.length > 0 && reqs.every((r) => r.status === "feedback_submitted" || r.status === "declined");
  const filtered = withReqs.filter(({ reqs }) => (tab === "all" ? true : tab === "complete" ? isComplete(reqs) : !isComplete(reqs)));
  const allReqs = withReqs.flatMap((x) => x.reqs);

  return (
    <>
    <PageHero
        eyebrow="RTG Pitch"
        title={role === "admin" ? "All product pitches" : "My product pitches"}
        description="Track each creator's response and compare structured feedback."
        actions={role === "user" && <ButtonLink href="/pitch/new"><Plus className="h-4 w-4" />New pitch</ButtonLink>}
      />
    <Container className="py-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Pitches" value={visible.length} />
        <Stat label="Awaiting response" value={allReqs.filter((r) => r.status === "pending").length} />
        <Stat label="In review" value={allReqs.filter((r) => r.status === "accepted").length} />
        <Stat label="Feedback received" value={allReqs.filter((r) => r.status === "feedback_submitted").length} />
      </div>
      <Tabs className="mt-8" value={tab} onChange={setTab} tabs={[{ id: "all", label: "All" }, { id: "active", label: "In progress" }, { id: "complete", label: "Completed" }]} />
      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white">
            <EmptyState icon={<Megaphone className="h-5 w-5" />} title="No pitches here" body="Submit your product to get structured feedback from relevant creators." action={role === "user" && <ButtonLink href="/pitch/new">Pitch a product</ButtonLink>} />
          </div>
        ) : (
          filtered.map(({ p, reqs }) => <PitchListItem key={p.id} pitch={p} requests={reqs} creators={creators} />)
        )}
      </div>
    </Container>
    </>
  );
}
