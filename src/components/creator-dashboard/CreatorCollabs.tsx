"use client";

import Link from "next/link";
import { CalendarDays, Handshake, Inbox, UsersRound } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Creator } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { APP_STATUS, ApplicationTracker, CollabCard, eligibility } from "@/components/ecosystem/collab";
import { formatDate, formatINR, timeAgo, toISODate } from "@/lib/utils";

/** Creator-side view of RTG Collaborate, plus their community and event footprint. */
export function CreatorCollabs({ creator }: { creator: Creator }) {
  const { applications, collaborations, communities, events, registeredCount } = useStore();
  const mine = applications.filter((a) => a.creatorId === creator.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const appliedIds = new Set(mine.map((a) => a.collabId));
  const recommended = collaborations
    .filter((c) => c.status === "open" && !appliedIds.has(c.id) && eligibility(c, creator).ok)
    .slice(0, 3);
  const hosted = communities.filter((c) => c.hostCreatorIds.includes(creator.id));
  const today = toISODate(new Date());
  const myEvents = events.filter((e) => e.creatorIds.includes(creator.id) && e.date >= today);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title={<span className="inline-flex items-center gap-2"><Handshake className="h-4 w-4" />My collaboration applications</span>} action={<ButtonLink href="/collaborate" size="sm" variant="secondary">Browse briefs</ButtonLink>} />
        {mine.length === 0 ? (
          <EmptyState icon={<Inbox className="h-5 w-5" />} title="No applications yet" body="Apply to brand briefs that match your audience — eligible ones are suggested below." />
        ) : (
          <ul className="divide-y divide-line">
            {mine.map((a) => {
              const c = collaborations.find((x) => x.id === a.collabId);
              if (!c) return null;
              return (
                <li key={a.id} className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_320px] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><Link href={`/collaborate/${c.id}`} className="font-semibold text-ink hover:text-brand-600">{c.title}</Link><Badge tone={APP_STATUS[a.status][1]} dot>{APP_STATUS[a.status][0]}</Badge></div>
                    <p className="text-xs text-ink-subtle">{c.brand} · proposed {formatINR(a.proposedFee)} · updated {timeAgo(a.updatedAt)}</p>
                    {a.brandNote && <p className="mt-1 text-xs text-ink-muted">Brand note: {a.brandNote}</p>}
                  </div>
                  <ApplicationTracker status={a.status} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div>
        <h3 className="mb-3 text-[15px] font-semibold text-ink">Recommended for you</h3>
        {recommended.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{recommended.map((c) => <CollabCard key={c.id} collab={c} />)}</div>
          : <Card><EmptyState icon={<Handshake className="h-5 w-5" />} title="No new eligible briefs right now" body="We match briefs on audience size and target cities." /></Card>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={<span className="inline-flex items-center gap-2"><UsersRound className="h-4 w-4" />Communities you host</span>} />
          {hosted.length ? (
            <ul className="divide-y divide-line">{hosted.map((h) => <li key={h.id}><Link href={`/community/${h.slug}`} className="flex items-center justify-between px-5 py-3 hover:bg-canvas"><span className="text-[13px] font-medium text-ink">{h.name}</span><span className="text-xs text-ink-subtle">{h.category}</span></Link></li>)}</ul>
          ) : <p className="px-5 py-6 text-[13px] text-ink-muted">You don&apos;t host a community yet. Hosting is invite-only during the pilot.</p>}
        </Card>
        <Card>
          <CardHeader title={<span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Your upcoming events</span>} />
          {myEvents.length ? (
            <ul className="divide-y divide-line">{myEvents.map((e) => <li key={e.id}><Link href={`/regional/events/${e.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-canvas"><span className="min-w-0"><span className="block truncate text-[13px] font-medium text-ink">{e.title}</span><span className="text-xs text-ink-subtle">{formatDate(e.date, { day: "numeric", month: "short" })} · {e.area}</span></span><span className="shrink-0 text-xs text-ink-muted">{registeredCount(e)}/{e.capacity}</span></Link></li>)}</ul>
          ) : <p className="px-5 py-6 text-[13px] text-ink-muted">No upcoming regional events. <Link href="/regional" className="text-brand-600">See what&apos;s on</Link>.</p>}
        </Card>
      </div>
    </div>
  );
}
