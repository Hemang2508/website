"use client";

import Link from "next/link";
import { CalendarClock, Check, MapPin, Users, X } from "lucide-react";
import type { ApplicationStatus, Collaboration, Creator } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Visual } from "@/components/ui/Visual";
import { cardInteractive } from "@/components/ui/Card";
import { cn, compact, formatDate, formatINR, toISODate } from "@/lib/utils";

export const APP_STATUS: Record<ApplicationStatus, [string, Tone]> = {
  submitted: ["Submitted", "amber"],
  shortlisted: ["Shortlisted", "brand"],
  accepted: ["Accepted", "teal"],
  declined: ["Not selected", "red"],
  withdrawn: ["Withdrawn", "neutral"],
};

export const COLLAB_STATUS: Record<Collaboration["status"], [string, Tone]> = {
  open: ["Open for applications", "teal"],
  in_progress: ["In progress", "brand"],
  closed: ["Closed", "neutral"],
};

export function budgetLabel(c: Collaboration) {
  if (c.compensation === "Product only" || c.budgetMax === 0) return "Product only";
  return `${formatINR(c.budgetMin)} – ${formatINR(c.budgetMax)}`;
}

export function isPastDeadline(c: Collaboration) {
  return c.deadline < toISODate(new Date());
}

/** Simple eligibility rules shown to creators before applying. */
export function eligibility(c: Collaboration, creator: Creator) {
  const followers = creator.followers >= c.minFollowers;
  const city = c.cities.includes("All India") || c.cities.includes(creator.location);
  return { followers, city, ok: followers && city };
}

export function daysLeft(c: Collaboration) {
  const ms = new Date(c.deadline + "T23:59:59").getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

/** Campaign brief "poster": brand monogram inside a lens, budget as the headline number, deadline bar. */
export function CollabCard({ collab: c }: { collab: Collaboration }) {
  const { applications } = useStore();
  const count = c.baseApplicants + applications.filter((a) => a.collabId === c.id && !["withdrawn"].includes(a.status)).length;
  const [label, tone] = COLLAB_STATUS[c.status];
  const left = daysLeft(c);
  const span = Math.max(1, Math.round((new Date(c.deadline).getTime() - new Date(c.createdAt).getTime()) / 86400000));
  const pctLeft = Math.max(0, Math.min(100, (left / span) * 100));
  return (
    <Link href={`/collaborate/${c.id}`} className={cn("group flex h-full flex-col overflow-hidden", cardInteractive)}>
      <div className="relative flex items-start justify-between p-5 pb-0">
        <span className="relative flex h-16 w-24 items-center" aria-hidden>
          <span className="absolute left-0 h-16 w-16 rounded-full transition-transform duration-base ease-out group-hover:-translate-x-1" style={{ background: `hsl(${c.brandHue} 60% 86%)` }} />
          <span className="absolute left-8 h-16 w-16 rounded-full mix-blend-multiply transition-transform duration-base ease-out group-hover:translate-x-1" style={{ background: `hsl(${(c.brandHue + 35) % 360} 60% 78%)` }} />
          <span className="relative ml-[1.15rem] font-serif text-[42px] italic leading-none text-ink">{c.brand.slice(0, 1)}</span>
        </span>
        <Badge tone={tone} dot>{label}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{c.brand} · {c.campaignType}</p>
        <p className="mt-1.5 font-display text-[19px] font-bold leading-snug tracking-[-0.02em] text-ink group-hover:text-brand-600">{c.title}</p>
        <p className="mt-1.5 line-clamp-2 text-[13px] text-ink-muted">{c.summary}</p>
        <div className="flex-1" />
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-subtle">Budget · {c.compensation}</p>
            <p className="font-display text-lg font-bold tracking-[-0.02em] text-ink">{budgetLabel(c)}</p>
          </div>
          <p className="text-right text-[12px] text-ink-muted"><Users className="mb-0.5 inline h-3.5 w-3.5" /> {compact(c.minFollowers)}+<br />{count} applied · {c.slots} slot{c.slots > 1 ? "s" : ""}</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11.5px] text-ink-muted">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.cities.join(", ")}</span>
            <span className="flex items-center gap-1 font-semibold text-ink"><CalendarClock className="h-3.5 w-3.5" />{isPastDeadline(c) ? "Closed" : left <= 1 ? "Last day" : `${left} days left`}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-canvas" aria-hidden><div className="h-full rounded-full bg-ink transition-[width] duration-slow" style={{ width: `${isPastDeadline(c) ? 0 : pctLeft}%` }} /></div>
          <p className="sr-only">Apply by {formatDate(c.deadline)}</p>
        </div>
      </div>
    </Link>
  );
}

const STEPS: ApplicationStatus[] = ["submitted", "shortlisted", "accepted"];

export function ApplicationTracker({ status }: { status: ApplicationStatus }) {
  const failed = status === "declined" || status === "withdrawn";
  const idx = failed ? -1 : STEPS.indexOf(status);
  return (
    <ol className="flex items-center gap-2" aria-label={`Application status: ${APP_STATUS[status][0]}`}>
      {STEPS.map((s, i) => {
        const done = !failed && i <= idx;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", done ? "bg-teal-600 text-white" : "bg-canvas text-ink-subtle ring-1 ring-line")}>
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs sm:inline", done ? "font-medium text-ink" : "text-ink-subtle")}>{APP_STATUS[s][0]}</span>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", done && i < idx ? "bg-teal-500" : "bg-line")} />}
          </li>
        );
      })}
      {failed && <li className="flex items-center gap-1.5 text-xs font-medium text-red-600"><X className="h-4 w-4" />{APP_STATUS[status][0]}</li>}
    </ol>
  );
}
