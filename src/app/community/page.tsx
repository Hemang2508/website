"use client";

import Link from "next/link";
import { useState } from "react";
import { Info, UsersRound } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Community } from "@/lib/types";
import { Container, EmptyState, PageHeader } from "@/components/ui/Misc";
import { Chip } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Visual } from "@/components/ui/Visual";
import { ButtonLink } from "@/components/ui/Button";
import { JoinButton } from "@/components/ecosystem/JoinButton";

const CATS: ("All" | Community["category"])[] = ["All", "Food", "Career", "Travel", "Gaming", "Startups"];

export default function CommunityPage() {
  const { communities, creators, memberCount, isMember, events, hydrated } = useStore();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [mine, setMine] = useState(false);
  const list = communities.filter((c) => (cat === "All" || c.category === cat) && (!mine || isMember(c.id)));
  const joinedCount = hydrated ? communities.filter((c) => isMember(c.id)).length : 0;

  return (
    <Container className="py-10">
      <PageHeader eyebrow="RTG Community" title="Find your people" description="Join creator-hosted communities to learn, share recommendations and meet in person at regional events." actions={<ButtonLink href="/regional" variant="secondary">Browse regional events</ButtonLink>} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c === "All" ? "All communities" : c}</Chip>)}
        </div>
        <Chip active={mine} onClick={() => setMine((m) => !m)}>My communities{joinedCount > 0 && ` (${joinedCount})`}</Chip>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white">
          <EmptyState icon={<UsersRound className="h-5 w-5" />} title={mine ? "You haven't joined any communities yet" : "No communities in this category"} body="Join a community to see its discussions and upcoming events." action={<button onClick={() => { setMine(false); setCat("All"); }} className="text-sm font-medium text-brand-600">Show all communities</button>} />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const hosts = c.hostCreatorIds.map((id) => creators.find((x) => x.id === id)).filter(Boolean);
            const upcoming = events.filter((e) => e.communityId === c.id).length;
            return (
              <div key={c.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
                <Visual hue={c.hue} icon={c.icon} className="h-32">
                  <div className="flex gap-2 p-3.5">
                    <Badge tone="neutral" className="bg-white">{c.category}</Badge>
                    <Badge tone="neutral" className="bg-white">{c.city}</Badge>
                  </div>
                </Visual>
                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/community/${c.slug}`} className="text-lg font-semibold text-ink after:absolute after:inset-0 after:content-[''] group-hover:text-brand-600">{c.name}</Link>
                  <p className="mt-1 text-[13px] leading-snug text-ink-muted">{c.tagline}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
                    <div className="flex -space-x-2">{hosts.map((h) => <div key={h!.id} className="rounded-full ring-2 ring-white"><Avatar initials={h!.initials} hue={h!.avatarHue} size="xs" /></div>)}</div>
                    <span>Hosted by {hosts.map((h) => h!.name.split(" ")[0]).join(" & ")}</span>
                  </div>
                  <div className="flex-1" />
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{memberCount(c).toLocaleString("en-IN")} members</p>
                      <p className="text-[11px] text-ink-subtle">{upcoming} upcoming event{upcoming === 1 ? "" : "s"} · demo figures</p>
                    </div>
                    <div className="relative z-10"><JoinButton community={c} size="sm" /></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 flex items-center gap-2 text-xs text-ink-subtle"><Info className="h-3.5 w-3.5" />Member counts, discussions and posts are sample data for this demo. Membership is saved in this browser only.</p>
    </Container>
  );
}
