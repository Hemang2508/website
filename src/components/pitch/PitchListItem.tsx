import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Creator, Pitch, PitchRequest } from "@/lib/types";
import { pitchOverallStatus } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatDate } from "@/lib/utils";

const ring: Record<PitchRequest["status"], string> = {
  pending: "ring-amber-300", accepted: "ring-brand-400", declined: "ring-red-300 opacity-50", feedback_submitted: "ring-teal-500",
};

export function PitchListItem({ pitch, requests, creators }: { pitch: Pitch; requests: PitchRequest[]; creators: Creator[] }) {
  const status = pitchOverallStatus(requests);
  return (
    <Link href={`/pitch/${pitch.id}`} className="group flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-[#D5D9E4] hover:shadow-lift sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-canvas text-lg font-semibold text-ink-muted">
          {pitch.images[0] ? <img src={pitch.images[0]} alt="" className="h-full w-full object-cover" /> : pitch.productName.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-ink group-hover:text-brand-600">{pitch.productName}</p>
            <Badge tone={status.tone} dot>{status.label}</Badge>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-ink-muted">{pitch.company} · {pitch.category} · {pitch.id} · {formatDate(pitch.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {requests.map((r) => {
            const c = creators.find((x) => x.id === r.creatorId);
            return c ? <div key={r.id} className={cn("rounded-full ring-2", ring[r.status])} title={`${c.name}: ${r.status.replace("_", " ")}`}><Avatar initials={c.initials} hue={c.avatarHue} size="sm" /></div> : null;
          })}
        </div>
        <span className="text-[13px] text-ink-muted">{requests.filter((r) => r.status === "feedback_submitted").length}/{requests.length} reviewed</span>
        <ChevronRight className="h-5 w-5 text-ink-subtle" />
      </div>
    </Link>
  );
}
