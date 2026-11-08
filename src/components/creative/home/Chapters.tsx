"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Clock, Handshake, MapPin, Megaphone, MessagesSquare, Plus, Sparkles, UsersRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { Container } from "@/components/ui/Misc";
import { CreatorFigure } from "../CreatorFigure";
import { SCORE_LABELS, avgScore } from "@/components/pitch/Feedback";
import { cn, formatINR, formatTime } from "@/lib/utils";
import type { PitchFeedback } from "@/lib/types";

type Chapter = { id: string; n: string; label: string; icon: typeof MessagesSquare; title: ReactNode; body: string; href: string; cta: string };

const CHAPTERS: Chapter[] = [
  { id: "connect", n: "01", label: "RTG Connect", icon: MessagesSquare, title: <>Book a <em className="font-serif font-normal italic">real</em> conversation.</>, body: "Pick a service, choose an open slot on a creator's calendar and pay in one flow. Declined requests are refunded in full.", href: "/explore", cta: "Find a creator" },
  { id: "pitch", n: "02", label: "RTG Pitch", icon: Megaphone, title: <>Put your product in <em className="font-serif font-normal italic">front</em> of the right people.</>, body: "Submit once, match with creators who review your category and compare structured scorecards before spending on campaigns.", href: "/pitch/new", cta: "Pitch a product" },
  { id: "community", n: "03", label: "Community & Regional", icon: UsersRound, title: <>Find your people — <em className="font-serif font-normal italic">online</em> and in your city.</>, body: "Creator-hosted communities and in-person food walks, Coffee with Creators and founder mixers, starting in Hyderabad.", href: "/community", cta: "Join a community" },
  { id: "duos", n: "04", label: "Creator Duos", icon: Sparkles, title: <>Two creators. <em className="font-serif font-normal italic">One</em> experience.</>, body: "Food + Travel, Finance + Career, Fitness + Lifestyle. Book both in a single request — they share the session and the earnings.", href: "/duos", cta: "Explore duos" },
  { id: "collaborate", n: "05", label: "RTG Collaborate", icon: Handshake, title: <>Brand briefs, <em className="font-serif font-normal italic">organised</em>.</>, body: "Brands post campaign briefs with clear deliverables; creators apply and both sides follow every application to acceptance.", href: "/collaborate", cta: "View briefs" },
];

function useActiveChapter(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("ch-", "")));
    }, { rootMargin: "-45% 0px -45% 0px" });
    ids.forEach((id) => { const el = document.getElementById(`ch-${id}`); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function Chapters() {
  const active = useActiveChapter(CHAPTERS.map((c) => c.id));
  const idx = CHAPTERS.findIndex((c) => c.id === active);
  return (
    <section id="how-it-works" className="relative scroll-mt-20 bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]" aria-hidden />
      <Container className="relative grid grid-cols-1 gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:self-start">
          <p className="eyebrow text-teal-400">How RTG Live works</p>
          <h2 className="mt-4 font-display text-display-lg text-white">Five ways to <em className="font-serif font-normal italic text-teal-400">meet</em>.</h2>
          <ol className="mt-10 hidden space-y-1 lg:block" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#ch-${c.id}`} className={cn("group flex items-center gap-4 rounded-xl py-2.5 transition-colors duration-base", i === idx ? "text-white" : "text-white/35 hover:text-white/70")} aria-current={i === idx ? "step" : undefined}>
                  <span className="w-7 font-mono text-xs">{c.n}</span>
                  <span className={cn("h-px bg-current transition-[width] duration-slow ease-out", i === idx ? "w-14" : "w-6")} />
                  <span className="font-display text-lg font-bold tracking-[-0.01em]">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-10 hidden h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10 lg:block" aria-hidden>
            <div className="h-full rounded-full bg-teal-400 transition-[width] duration-slow ease-out" style={{ width: `${((idx + 1) / CHAPTERS.length) * 100}%` }} />
          </div>
        </div>
        <div className="space-y-6 lg:space-y-[18vh] lg:py-[8vh]">
          {CHAPTERS.map((c) => (
            <article key={c.id} id={`ch-${c.id}`} className="scroll-mt-24">
              <div className={cn("transition-[opacity,transform] duration-slow ease-out", active === c.id ? "lg:opacity-100" : "lg:opacity-40")}>
                <p className="flex items-center gap-2 font-mono text-xs text-white/50"><c.icon className="h-4 w-4 text-teal-400" />{c.n} · {c.label}</p>
                <h3 className="mt-3 max-w-xl font-display text-display-md text-white">{c.title}</h3>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/65">{c.body}</p>
                <div className="mt-7"><Preview id={c.id} active={active === c.id} /></div>
                <Link href={c.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline">{c.cta}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Real, data-driven product previews — each module keeps its own visual language. */
function Preview({ id, active }: { id: string; active: boolean }) {
  const { creators, pitchRequests, pitches, communities, events, duos, collaborations, memberCount } = useStore();

  if (id === "connect") {
    const c = creators.find((x) => x.id === "c1")!;
    const svcs = c.services.filter((s) => s.type !== "pitch");
    const slots = c.availability[1] ?? ["10:00", "11:00", "16:00", "17:00"];
    return (
      <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-[#FBF7F1] text-ink sm:grid-cols-[0.8fr_1.2fr]">
        <div className="relative min-h-[200px]"><CreatorFigure creator={c} /></div>
        <div className="p-6">
          <p className="font-display text-lg font-bold">{c.name}</p>
          <p className="text-[13px] text-ink-muted">{c.headline}</p>
          <div className="mt-4 space-y-2">
            {svcs.slice(0, 2).map((s, i) => (
              <div key={s.id} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3", i === 1 ? "border-ink bg-white" : "border-ink/10")}>
                <span><span className="block text-sm font-semibold">{s.title}</span><span className="flex items-center gap-1 text-xs text-ink-muted"><Clock className="h-3 w-3" />{s.durationMins} min</span></span>
                <span className="font-display font-bold">{formatINR(s.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5">{slots.slice(0, 4).map((t, i) => <span key={t} className={cn("rounded-xl py-2 text-center text-xs font-semibold transition-colors duration-slow", i === 1 && active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10")}>{formatTime(t)}</span>)}</div>
          <p className={cn("mt-4 flex items-center gap-2 text-[13px] font-semibold text-teal-700 transition-[opacity,transform] duration-slow", active ? "opacity-100" : "translate-y-2 opacity-0")}><Check className="h-4 w-4" />Request sent · simulated payment</p>
        </div>
      </div>
    );
  }

  if (id === "pitch") {
    const r = pitchRequests.find((x) => x.feedback && pitches.find((p) => p.id === x.pitchId)?.isDemoUser);
    const p = r && pitches.find((x) => x.id === r.pitchId);
    if (!r?.feedback || !p) return null;
    return (
      <div className="overflow-hidden rounded-3xl bg-white text-ink">
        <div className="flex flex-col gap-4 border-b border-line p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{p.category} · {p.stage}</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{p.productName}</p>
            <p className="text-[13px] text-ink-muted">{p.tagline}</p>
          </div>
          <p className="font-display text-5xl font-bold leading-none tracking-[-0.04em]">{avgScore(r.feedback)}<span className="text-lg text-ink-subtle">/5</span></p>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-5">
          {(Object.keys(SCORE_LABELS) as (keyof PitchFeedback["scores"])[]).map((k, i) => (
            <div key={k} className="rounded-2xl bg-canvas p-3">
              <div className="flex h-16 items-end gap-1" aria-hidden>{[1, 2, 3, 4, 5].map((n) => <span key={n} className={cn("w-full origin-bottom rounded-sm transition-transform duration-slow ease-out", n <= r.feedback!.scores[k] ? "bg-ink" : "bg-ink/10", active ? "scale-y-100" : "scale-y-0")} style={{ height: `${n * 20}%`, transitionDelay: `${i * 60 + n * 30}ms` }} />)}</div>
              <p className="mt-2 text-[11px] leading-tight text-ink-muted">{SCORE_LABELS[k]}</p>
              <p className="text-sm font-bold">{r.feedback!.scores[k]}/5</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "community") {
    const ev = events.find((e) => e.id === "ev1");
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {communities.map((c, i) => (
          <Link key={c.id} href={`/community/${c.slug}`} className={cn("group rounded-3xl p-4 text-ink transition-transform duration-base hover:-rotate-1 hover:scale-[1.02]", i === 0 && "sm:row-span-2")} style={{ background: `hsl(${c.hue} 70% 88%)` }}>
            <p className="font-display text-[15px] font-bold leading-tight">{c.name}</p>
            <p className="mt-1 text-[11.5px] text-ink/60">{memberCount(c).toLocaleString("en-IN")} members · demo</p>
            {i === 0 && <p className="mt-6 hidden text-[13px] leading-snug text-ink/75 sm:block">“{c.posts[0].text}”</p>}
          </Link>
        ))}
        {ev && (
          <Link href={`/regional/events/${ev.id}`} className="col-span-2 flex items-center gap-3 rounded-3xl bg-white p-4 text-ink sm:col-span-1">
            <MapPin className="h-5 w-5 shrink-0 text-teal-600" />
            <span className="min-w-0"><span className="block truncate text-[13px] font-bold">{ev.title}</span><span className="text-[11.5px] text-ink-muted">{ev.area}</span></span>
          </Link>
        )}
      </div>
    );
  }

  if (id === "duos") {
    const d = duos[0];
    const [a, b] = d.creatorIds.map((x) => creators.find((c) => c.id === x)!);
    return (
      <Link href={`/duos/${d.slug}`} className="group relative grid grid-cols-2 overflow-hidden rounded-3xl">
        <div className={cn("aspect-[4/5] transition-transform duration-slow ease-out", active ? "translate-x-0" : "-translate-x-6")}><CreatorFigure creator={a} /></div>
        <div className={cn("aspect-[4/5] transition-transform duration-slow ease-out", active ? "translate-x-0" : "translate-x-6")}><CreatorFigure creator={b} /></div>
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-pop transition-transform duration-base group-hover:rotate-90"><Plus className="h-6 w-6" /></span>
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
          <span><span className="block font-display text-xl font-bold text-white">{d.title}</span><span className="text-[13px] text-white/75">{a.name} & {b.name}</span></span>
          <span className="font-display text-lg font-bold text-white">{formatINR(d.price)}</span>
        </span>
      </Link>
    );
  }

  const col = collaborations.find((c) => c.id === "cb2") ?? collaborations[0];
  const steps = ["Submitted", "Shortlisted", "Accepted"];
  return (
    <div className="rounded-3xl bg-white p-6 text-ink">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{col.brand} · {col.campaignType}</p>
          <p className="mt-1 font-display text-xl font-bold tracking-[-0.015em]">{col.title}</p>
        </div>
        <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold">{col.compensation}</span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">{col.deliverables.map((d) => <span key={d} className="rounded-xl bg-canvas px-3 py-2 text-[12.5px]">{d}</span>)}</div>
      <ol className="mt-6 flex items-center gap-2" aria-label="Example application status">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-slow", active ? "bg-ink text-white" : "bg-canvas text-ink-subtle")} style={{ transitionDelay: `${i * 300}ms` }}>{i + 1}</span>
            <span className="text-xs font-semibold">{s}</span>
            {i < 2 && <span className="h-px flex-1 bg-ink/10"><span className={cn("block h-full origin-left bg-ink transition-transform duration-slow", active ? "scale-x-100" : "scale-x-0")} style={{ transitionDelay: `${i * 300 + 150}ms` }} /></span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
