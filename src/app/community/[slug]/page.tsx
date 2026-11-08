"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CalendarX2, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container, EmptyState } from "@/components/ui/Misc";
import { PageSkeleton, Visual } from "@/components/ui/Visual";
import { ButtonLink } from "@/components/ui/Button";
import { JoinButton } from "@/components/ecosystem/JoinButton";
import { EventCard } from "@/components/ecosystem/EventCard";
import { toISODate } from "@/lib/utils";

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { communities, creators, events, memberCount, isMember, hydrated } = useStore();
  const c = communities.find((x) => x.slug === slug);
  if (!c) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const hosts = c.hostCreatorIds.map((id) => creators.find((x) => x.id === id)!).filter(Boolean);
  const today = toISODate(new Date());
  const upcoming = events.filter((e) => e.communityId === c.id && e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const member = hydrated && isMember(c.id);

  return (
    <>
      <Visual hue={c.hue} icon={c.icon} size="lg" tone="dark" className="h-48 sm:h-64">
        <Container className="pt-5">
          <Link href="/community" className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-[13px] font-semibold text-ink shadow-sm backdrop-blur transition hover:bg-white"><ArrowLeft className="h-4 w-4" />All communities</Link>
        </Container>
      </Visual>
      <Container className="pb-10">
        <div className="relative -mt-12 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap gap-2"><Badge tone="brand">{c.category}</Badge><Badge>{c.city}</Badge></div>
              <h1 className="mt-3 font-display text-display-md text-ink">{c.name}</h1>
              <p className="mt-1 text-[15px] text-ink-muted">{c.tagline}</p>
              <p className="mt-3 text-[13px] text-ink-subtle"><b className="text-ink">{memberCount(c).toLocaleString("en-IN")}</b> members (demo figure) · {upcoming.length} upcoming events</p>
            </div>
            <JoinButton community={c} size="lg" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-6">
            <Card className="p-5">
              <h2 className="text-[15px] font-semibold text-ink">About</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{c.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">{c.tags.map((t) => <span key={t} className="rounded-lg bg-canvas px-2.5 py-1 text-[13px] text-ink-muted">{t}</span>)}</div>
            </Card>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-ink">Upcoming events</h2>
                <Link href="/regional" className="text-[13px] font-medium text-brand-600">All regional events</Link>
              </div>
              {upcoming.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{upcoming.map((e) => <EventCard key={e.id} event={e} compact />)}</div>
              ) : (
                <Card><EmptyState icon={<CalendarX2 className="h-5 w-5" />} title="No upcoming events yet" body="Hosts announce new events here first." /></Card>
              )}
            </div>

            <Card>
              <CardHeader title={<span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" />Recent discussions</span>} action={<Badge>Sample posts</Badge>} />
              <ul className="divide-y divide-line">
                {c.posts.map((p, i) => (
                  <li key={i} className={member || i === 0 ? "px-5 py-4" : "px-5 py-4 blur-[3px] select-none"} aria-hidden={!member && i > 0}>
                    <div className="flex items-center gap-2 text-[13px]"><span className="font-semibold text-ink">{p.author}</span><span className="text-ink-subtle">· {p.role} · {p.ago} ago</span></div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{p.text}</p>
                    <p className="mt-2 text-xs text-ink-subtle">{p.replies} replies</p>
                  </li>
                ))}
              </ul>
              {!member && (
                <div className="flex flex-col items-center gap-3 border-t border-line px-5 py-5 text-center sm:flex-row sm:text-left">
                  <Lock className="h-5 w-5 text-ink-subtle" />
                  <p className="flex-1 text-[13px] text-ink-muted">Join {c.name} to read all discussions. Posting and replies are planned for a later phase.</p>
                  <JoinButton community={c} size="sm" />
                </div>
              )}
              {member && <p className="border-t border-line px-5 py-3 text-xs text-ink-subtle">Posting and replies are planned for a later phase — discussions shown are read-only sample content.</p>}
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader title="Hosts" />
              <ul className="divide-y divide-line">
                {hosts.map((h) => (
                  <li key={h.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar initials={h.initials} hue={h.avatarHue} size="sm" verified={h.verified} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/creators/${h.slug}`} className="block truncate text-[13px] font-semibold text-ink hover:text-brand-600">{h.name}</Link>
                      <p className="truncate text-xs text-ink-subtle">{h.category}</p>
                    </div>
                    <Link href={`/creators/${h.slug}/passport`} className="text-xs font-medium text-brand-600">Passport</Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line p-4">
                <ButtonLink href={`/creators/${hosts[0]?.slug}`} variant="secondary" size="sm" className="w-full">Book a session with a host</ButtonLink>
              </div>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-teal-500" />Community guidelines</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] text-ink-muted">{c.guidelines.map((g) => <li key={g}>{g}</li>)}</ul>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
