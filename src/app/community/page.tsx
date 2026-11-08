"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { cardInteractive } from "@/components/ui/Card";
import { useState } from "react";
import { Info, UsersRound } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Community } from "@/lib/types";
import { Container, EmptyState } from "@/components/ui/Misc";
import { SplitWords } from "@/components/creative/SplitWords";
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
    <>
    <section className="relative overflow-hidden border-b border-line bg-white">
      <Container className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:py-16">
        <div>
          <p className="eyebrow text-brand-600">RTG Community</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink">
            <SplitWords items={["Find", "your", <em key="p" className="font-serif font-normal italic text-brand-600">people.</em>]} label="Find your people." />
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-muted">Join creator-hosted communities to learn, share recommendations and meet in person at regional events.</p>
          <ButtonLink href="/regional" variant="secondary" className="mt-7">Browse regional events</ButtonLink>
        </div>
        {/* Venn of communities — every circle is a way in */}
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]" aria-label="Communities">
          {communities.slice(0, 5).map((c, i) => {
            const pos = [["4%", "8%", "44%"], ["38%", "0%", "42%"], ["60%", "30%", "38%"], ["10%", "46%", "40%"], ["40%", "52%", "36%"]][i];
            return (
              <Link key={c.id} href={`/community/${c.slug}`} className="group absolute flex animate-scale-in items-center justify-center rounded-full p-4 text-center mix-blend-multiply transition-transform duration-base ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:scale-105"
                style={{ left: pos[0], top: pos[1], width: pos[2], aspectRatio: "1", background: `hsl(${c.hue} 75% 82%)`, animationDelay: `${i * 90}ms` }}>
                <span className="font-display text-[clamp(0.8rem,1.6vw,1.05rem)] font-bold leading-tight text-ink mix-blend-normal">{c.name}<span className="mt-0.5 block text-[11px] font-medium text-ink/75">{memberCount(c).toLocaleString("en-IN")} members</span></span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
    <Container className="py-10">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <section aria-label="Community list" className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => {
            const hosts = c.hostCreatorIds.map((id) => creators.find((x) => x.id === id)).filter(Boolean);
            const upcoming = events.filter((e) => e.communityId === c.id).length;
            return (
              <div key={c.id} className={cn("group relative flex flex-col overflow-hidden rounded-[1.75rem] p-6 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-1 hover:shadow-lift focus-within:ring-2 focus-within:ring-ink", i === 0 && list.length > 2 && "lg:col-span-2")} style={{ background: `hsl(${c.hue} 70% 91%)` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-ink"><Visual hue={c.hue} icon={c.icon} size="sm" className="h-12 w-12 rounded-full" /></span>
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11.5px] font-semibold text-ink">{c.category} · {c.city}</span>
                </div>
                <Link href={`/community/${c.slug}`} className="mt-6 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink after:absolute after:inset-0 after:content-['']">{c.name}</Link>
                <p className="mt-2 text-[14px] leading-snug text-ink/80">{c.tagline}</p>
                {c.posts[0] && (
                  <blockquote className={cn("mt-5 rounded-2xl rounded-tl-sm bg-white/75 p-4 text-[13px] leading-relaxed text-ink", i !== 0 && "line-clamp-3")}>
                    “{c.posts[0].text}”<footer className="mt-2 text-[11.5px] font-semibold text-ink/75">— {c.posts[0].author}, {c.posts[0].role}</footer>
                  </blockquote>
                )}
                <div className="mt-5 flex items-center gap-3 text-xs text-ink/80">
                  <div className="flex -space-x-2">{hosts.map((h) => <div key={h!.id} className="rounded-full ring-2 ring-white/80"><Avatar creator={h!} size="xs" /></div>)}</div>
                  <span>Hosted by {hosts.map((h) => h!.name.split(" ")[0]).join(" & ")}</span>
                </div>
                <div className="flex-1" />
                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                  <div>
                    <p className="font-display text-lg font-bold text-ink">{memberCount(c).toLocaleString("en-IN")} members</p>
                    <p className="text-[11px] text-ink/75">{upcoming} upcoming event{upcoming === 1 ? "" : "s"} · demo figures</p>
                  </div>
                  <div className="relative z-10"><JoinButton community={c} size="sm" /></div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <p className="mt-8 flex items-center gap-2 text-xs text-ink-subtle"><Info className="h-3.5 w-3.5" />Member counts, discussions and posts are sample data for this demo. Membership is saved in this browser only.</p>
    </Container>
    </>
  );
}
