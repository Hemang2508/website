"use client";

import Link from "next/link";
import { CalendarClock, Check, MapPin, Users, X } from "lucide-react";
import type { ApplicationStatus, Collaboration, Creator } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Visual } from "@/components/ui/Visual";
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

export function CollabCard({ collab: c }: { collab: Collaboration }) {
  const { applications } = useStore();
  const count = c.baseApplicants + applications.filter((a) => a.collabId === c.id && !["withdrawn"].includes(a.status)).length;
  const [label, tone] = COLLAB_STATUS[c.status];
  return (
    <Link href={`/collaborate/${c.id}`} className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Visual hue={c.brandHue} icon="brand" size="sm" className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">{c.brand}</p>
            <p className="text-xs text-ink-subtle">{c.category}</p>
          </div>
        </div>
        <Badge tone={tone} dot>{label}</Badge>
      </div>
      <p className="mt-4 font-semibold leading-snug text-ink group-hover:text-brand-600">{c.title}</p>
      <p className="mt-1.5 line-clamp-2 text-[13px] text-ink-muted">{c.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{c.campaignType}</Badge>
        <Badge tone="brand">{c.compensation}</Badge>
      </div>
      <div className="flex-1" />
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.cities.join(", ")}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{compact(c.minFollowers)}+ followers</span>
        <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" />{isPastDeadline(c) ? "Deadline passed" : `Apply by ${formatDate(c.deadline, { day: "numeric", month: "short" })}`}</span>
        <span className="text-right font-semibold text-ink">{budgetLabel(c)}</span>
      </div>
      <p className="mt-2 text-[11px] text-ink-subtle">{count} applicants · {c.slots} creator slot{c.slots > 1 ? "s" : ""}</p>
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
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", done ? "bg-teal-500 text-white" : "bg-canvas text-ink-subtle ring-1 ring-line")}>
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
