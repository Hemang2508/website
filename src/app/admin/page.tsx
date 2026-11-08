"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Ban, CalendarDays, CheckCircle2, Download, Handshake, IdCard, IndianRupee, Megaphone, RotateCcw, Search, Sparkles, Users, UsersRound, Wallet } from "lucide-react";
import { pitchOverallStatus, useStore } from "@/lib/store";
import { summarise, toCSV, toTransactions, weeklySeries, type TxType } from "@/lib/metrics";
import { COMMISSION, pct } from "@/lib/pricing";
import { Card, CardHeader } from "@/components/ui/Card";
import { Container, PageHero, Stat, Tabs } from "@/components/ui/Misc";
import { Badge, SimulatedTag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Input, Select } from "@/components/ui/Field";
import { BarChart } from "@/components/dashboard/BarChart";
import { RoleNotice } from "@/components/dashboard/RoleNotice";
import { download } from "@/components/creator-dashboard/CreatorEarnings";
import { PitchListItem } from "@/components/pitch/PitchListItem";
import { cn, compact, formatDate, formatINR } from "@/lib/utils";
import { APP_STATUS, COLLAB_STATUS } from "@/components/ecosystem/collab";

type Tab = "overview" | "creators" | "transactions" | "pitches" | "ecosystem";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Admin />
    </Suspense>
  );
}

function Admin() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = (params.get("tab") as Tab) || "overview";
  const setTab = (t: Tab) => router.replace(`${pathname}?tab=${t}`, { scroll: false });
  const { bookings, pitchRequests, pitches, creators, setCreatorStatus, toggleVerified, toast, communities, memberCount, events, registeredCount, registrations, collaborations, applications } = useStore();
  const tx = useMemo(() => toTransactions(bookings, pitchRequests, pitches, creators), [bookings, pitchRequests, pitches, creators]);
  const s = summarise(tx);
  const pendingCreators = creators.filter((c) => c.status === "pending");

  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | TxType>("all");
  const [status, setStatus] = useState<"all" | "paid" | "earned" | "refunded">("all");
  const filteredTx = tx.filter((t) => (type === "all" || t.type === type) && (status === "all" || t.status === status) && (!q || `${t.ref} ${t.creatorName} ${t.payer} ${t.description}`.toLowerCase().includes(q.toLowerCase())));

  const creatorRank = creators.map((c) => {
    const xs = tx.filter((t) => t.creatorId === c.id && t.status !== "refunded");
    return { c, gmv: xs.reduce((a, t) => a + t.amount, 0), fees: xs.reduce((a, t) => a + t.platformFee, 0), count: xs.length };
  }).sort((a, b) => b.gmv - a.gmv);

  const statusCounts = (["pending", "confirmed", "completed", "declined", "cancelled"] as const).map((k) => ({ k, n: bookings.filter((b) => b.status === k).length }));
  const statusColors: Record<string, string> = { pending: "bg-amber-400", confirmed: "bg-brand-500", completed: "bg-teal-500", declined: "bg-red-400", cancelled: "bg-[#C9CEDA]" };

  return (
    <>
    <PageHero tone="light" compact eyebrow="Admin console" title={<>Platform <em className="font-serif font-normal italic text-brand-600">overview</em></>} description="Marketplace health, creator management and transaction oversight." actions={<SimulatedTag label="Simulated financials" />} />
    <Container className="py-10">
      <RoleNotice expected="admin" home="/admin" />

      <Tabs value={tab} onChange={setTab} tabs={[
        { id: "overview", label: "Overview" },
        { id: "creators", label: "Creators", count: pendingCreators.length },
        { id: "transactions", label: "Transactions" },
        { id: "pitches", label: "Pitches" },
        { id: "ecosystem", label: "Ecosystem" },
      ]} />

      <div className="mt-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Gross transaction value" value={formatINR(s.gmv)} icon={<IndianRupee className="h-4 w-4" />} sub={`${s.count} paid transactions`} />
              <Stat label="Platform revenue" value={formatINR(s.platformFees)} icon={<Wallet className="h-4 w-4" />} accent="navy" sub={`${s.gmv ? ((s.platformFees / s.gmv) * 100).toFixed(1) : 0}% blended take rate`} />
              <Stat label="Creator earnings" value={formatINR(s.creatorEarnings)} icon={<Users className="h-4 w-4" />} accent="teal" sub={`${formatINR(s.earnedNet)} earned · ${formatINR(s.pendingNet)} upcoming`} />
              <Stat label="Refunded" value={formatINR(s.refunded)} icon={<RotateCcw className="h-4 w-4" />} accent="amber" sub="Declined & cancelled" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader title="Platform revenue by week" description="Commission earned, by session / request date" />
                <div className="p-5"><BarChart data={weeklySeries(tx, (t) => t.platformFee)} /></div>
              </Card>
              <Card>
                <CardHeader title="Revenue streams" action={<Badge tone="amber">Proposed rates</Badge>} />
                <div className="divide-y divide-line">
                  {s.byType.map((t) => (
                    <div key={t.type} className="px-5 py-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-ink">{t.type}</p>
                        <Badge tone="brand">{pct(t.type === "Creator-originated booking" ? COMMISSION.creatorOriginated : t.type === "Product pitch" ? COMMISSION.pitch : COMMISSION.marketplace)}</Badge>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-canvas"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${s.platformFees ? (t.fees / s.platformFees) * 100 : 0}%` }} /></div>
                      <p className="mt-1.5 text-xs text-ink-muted"><b className="text-ink">{formatINR(t.fees)}</b> revenue · {formatINR(t.gmv)} GTV · {t.count} txns</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
              <Card>
                <CardHeader title="Booking pipeline" description={`${bookings.length} bookings`} />
                <div className="p-5">
                  <div className="flex h-3 overflow-hidden rounded-full">
                    {statusCounts.map(({ k, n }) => <div key={k} className={statusColors[k]} style={{ width: `${(n / Math.max(1, bookings.length)) * 100}%` }} />)}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
                    {statusCounts.map(({ k, n }) => <li key={k} className="flex items-center gap-2 capitalize text-ink-muted"><span className={cn("h-2.5 w-2.5 rounded-full", statusColors[k])} />{k}<span className="ml-auto font-semibold text-ink">{n}</span></li>)}
                  </ul>
                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                    <div><p className="text-lg font-semibold text-ink">{creators.filter((c) => c.status === "active").length}</p><p className="text-[11px] text-ink-subtle">Active creators</p></div>
                    <div><p className="text-lg font-semibold text-ink">{pitches.length}</p><p className="text-[11px] text-ink-subtle">Pitches</p></div>
                    <div><p className="text-lg font-semibold text-ink">{pitchRequests.length ? Math.round((pitchRequests.filter((r) => r.status !== "pending" && r.status !== "declined").length / pitchRequests.length) * 100) : 0}%</p><p className="text-[11px] text-ink-subtle">Pitch acceptance</p></div>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader title="Top creators by GTV" action={<button onClick={() => setTab("creators")} className="text-[13px] font-medium text-brand-600">Manage</button>} />
                <ul className="divide-y divide-line">
                  {creatorRank.slice(0, 5).map(({ c, gmv, fees, count }, i) => (
                    <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="w-4 text-xs font-semibold text-ink-subtle">{i + 1}</span>
                      <Avatar creator={c} size="sm" />
                      <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-ink">{c.name}</p><p className="text-xs text-ink-subtle">{count} transactions</p></div>
                      <div className="text-right"><p className="text-[13px] font-semibold text-ink">{formatINR(gmv)}</p><p className="text-[11px] text-ink-subtle">{formatINR(fees)} fees</p></div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {tab === "creators" && (
          <Card>
            <CardHeader title="Creators" description={`${creators.length} total · ${pendingCreators.length} awaiting verification`} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-[13px]">
                <thead className="border-b border-line bg-canvas/60 text-[11px] uppercase tracking-wide text-ink-subtle">
                  <tr><th className="px-5 py-2.5 font-semibold">Creator</th><th className="px-3 py-2.5 font-semibold">Category</th><th className="px-3 py-2.5 font-semibold">Audience</th><th className="px-3 py-2.5 font-semibold">Rating</th><th className="px-3 py-2.5 text-right font-semibold">GTV</th><th className="px-3 py-2.5 font-semibold">Status</th><th className="px-5 py-2.5 text-right font-semibold">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {creatorRank.sort((a, b) => Number(b.c.status === "pending") - Number(a.c.status === "pending")).map(({ c, gmv }) => (
                    <tr key={c.id} className={c.status === "suspended" ? "bg-canvas/50" : ""}>
                      <td className="px-5 py-3">
                        <Link href={`/creators/${c.slug}`} className="flex items-center gap-3">
                          <Avatar creator={c} size="sm" verified={c.verified} />
                          <span><span className="block font-medium text-ink hover:text-brand-600">{c.name}</span><span className="text-xs text-ink-subtle">{c.location} · joined {formatDate(c.joined, { month: "short", year: "numeric" })}</span></span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-ink-muted">{c.category}</td>
                      <td className="px-3 py-3 text-ink-muted">{compact(c.followers)}</td>
                      <td className="px-3 py-3 text-ink-muted">{c.rating.toFixed(1)} ({c.reviewCount})</td>
                      <td className="px-3 py-3 text-right font-medium text-ink">{formatINR(gmv)}</td>
                      <td className="px-3 py-3">
                        {c.status === "active" ? <Badge tone="teal" dot>Active</Badge> : c.status === "pending" ? <Badge tone="amber" dot>Pending review</Badge> : <Badge tone="red" dot>Suspended</Badge>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          {c.status === "pending" && <Button size="sm" variant="teal" onClick={() => { setCreatorStatus(c.id, "active"); toast({ title: `${c.name} approved`, body: "Profile is now live and verified." }); }}><CheckCircle2 className="h-4 w-4" />Approve</Button>}
                          <Link href={`/creators/${c.slug}/passport`} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-ink-muted hover:bg-canvas hover:text-ink" title="View Creator Passport"><IdCard className="h-4 w-4" />Passport</Link>
                          {c.status !== "pending" && (
                            <Button size="sm" variant="ghost" onClick={() => { toggleVerified(c.id); toast({ title: c.verified ? "Verification removed" : "Creator verified", tone: "info" }); }} title={c.verified ? "Remove verified badge" : "Mark as verified"}>
                              <BadgeCheck className={cn("h-4 w-4", c.verified && "text-brand-500")} />{c.verified ? "Verified" : "Verify"}
                            </Button>
                          )}
                          {c.status === "active" && <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Suspend ${c.name}? Their profile will be hidden from Explore.`)) { setCreatorStatus(c.id, "suspended"); toast({ title: `${c.name} suspended`, tone: "info" }); } }}><Ban className="h-4 w-4" />Suspend</Button>}
                          {c.status === "suspended" && <Button size="sm" variant="secondary" onClick={() => { setCreatorStatus(c.id, "active"); toast({ title: `${c.name} reactivated` }); }}>Reactivate</Button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "transactions" && (
          <Card>
            <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by reference, creator or payer" className="pl-9" aria-label="Search transactions" />
              </label>
              <div className="grid grid-cols-2 gap-3 sm:flex">
                <Select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="sm:w-56" aria-label="Type">
                  <option value="all">All types</option>
                  <option>Marketplace booking</option>
                  <option>Creator-originated booking</option>
                  <option>Product pitch</option>
                </Select>
                <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="sm:w-40" aria-label="Status">
                  <option value="all">All statuses</option>
                  <option value="paid">Paid · upcoming</option>
                  <option value="earned">Earned</option>
                  <option value="refunded">Refunded</option>
                </Select>
                <Button variant="secondary" className="col-span-2 sm:col-span-1" onClick={() => download("rtg-transactions.csv", toCSV(filteredTx))}><Download className="h-4 w-4" />Export CSV</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-[13px]">
                <thead className="border-b border-line bg-canvas/60 text-[11px] uppercase tracking-wide text-ink-subtle">
                  <tr><th className="px-5 py-2.5 font-semibold">Reference</th><th className="px-3 py-2.5 font-semibold">Date</th><th className="px-3 py-2.5 font-semibold">Creator / payer</th><th className="px-3 py-2.5 font-semibold">Type</th><th className="px-3 py-2.5 text-right font-semibold">Amount</th><th className="px-3 py-2.5 text-right font-semibold">Platform fee</th><th className="px-3 py-2.5 text-right font-semibold">Creator</th><th className="px-5 py-2.5 font-semibold">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredTx.map((t) => (
                    <tr key={t.id}>
                      <td className="px-5 py-3"><p className="font-medium text-ink">{t.ref}</p><p className="font-mono text-[11px] text-ink-subtle">{t.paymentId}</p></td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-muted">{formatDate(t.date)}</td>
                      <td className="px-3 py-3"><p className="text-ink">{t.creatorName}</p><p className="text-xs text-ink-subtle">{t.payer}</p></td>
                      <td className="px-3 py-3 text-ink-muted">{t.type}<span className="ml-1 text-ink-subtle">· {pct(t.rate)}</span></td>
                      <td className="px-3 py-3 text-right font-medium text-ink">{formatINR(t.amount)}</td>
                      <td className="px-3 py-3 text-right text-brand-700">{t.status === "refunded" ? "—" : formatINR(t.platformFee)}</td>
                      <td className="px-3 py-3 text-right text-teal-700">{t.status === "refunded" ? "—" : formatINR(t.creatorEarning)}</td>
                      <td className="px-5 py-3">{t.status === "earned" ? <Badge tone="teal">Earned</Badge> : t.status === "paid" ? <Badge tone="amber">Paid · upcoming</Badge> : <Badge>Refunded</Badge>}</td>
                    </tr>
                  ))}
                  {filteredTx.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-ink-muted">No transactions match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-ink-subtle"><SimulatedTag />{filteredTx.length} of {tx.length} transactions · all payments are simulated; no funds are held in escrow.</div>
          </Card>
        )}

        {tab === "pitches" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Pitches" value={pitches.length} icon={<Megaphone className="h-4 w-4" />} />
              <Stat label="Creator requests" value={pitchRequests.length} />
              <Stat label="Feedback delivered" value={pitchRequests.filter((r) => r.status === "feedback_submitted").length} accent="teal" />
              <Stat label="Collaboration interest" value={pitchRequests.filter((r) => r.feedback?.collaborationInterest).length} accent="navy" sub="Leads for RTG Collaborate" />
            </div>
            <div className="space-y-3 pt-3">
              {pitches.map((p) => {
                const reqs = pitchRequests.filter((r) => r.pitchId === p.id);
                return <div key={p.id}><PitchListItem pitch={p} requests={reqs} creators={creators} /><span className="sr-only">{pitchOverallStatus(reqs).label}</span></div>;
              })}
            </div>
          </div>
        )}

        {tab === "ecosystem" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Community members" value={communities.reduce((a, c) => a + memberCount(c), 0).toLocaleString("en-IN")} icon={<UsersRound className="h-4 w-4" />} sub={`${communities.length} communities · demo figures`} />
              <Stat label="Event registrations" value={events.reduce((a, e) => a + registeredCount(e), 0)} icon={<CalendarDays className="h-4 w-4" />} accent="teal" sub={`${registrations.length} made in this demo session`} />
              <Stat label="Collaboration applications" value={applications.length} icon={<Handshake className="h-4 w-4" />} accent="navy" sub={`${collaborations.filter((c) => c.status === "open").length} open briefs`} />
              <Stat label="Creator Duo bookings" value={bookings.filter((b) => b.duoId).length} icon={<Sparkles className="h-4 w-4" />} accent="amber" sub={formatINR(bookings.filter((b) => b.duoId && b.paymentStatus === "paid_simulated").reduce((a, b) => a + b.amount, 0)) + " GTV (simulated)"} />
            </div>

            <Card>
              <CardHeader title="Brand collaborations" description="Applications by status" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-[13px]">
                  <thead className="border-b border-line bg-canvas/60 text-[11px] uppercase tracking-wide text-ink-subtle">
                    <tr><th className="px-5 py-2.5 font-semibold">Brief</th><th className="px-3 py-2.5 font-semibold">Status</th><th className="px-3 py-2.5 font-semibold">Applications</th><th className="px-3 py-2.5 font-semibold">Slots</th><th className="px-5 py-2.5 font-semibold">Deadline</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {collaborations.map((c) => {
                      const apps = applications.filter((a) => a.collabId === c.id);
                      return (
                        <tr key={c.id}>
                          <td className="px-5 py-3"><Link href={`/collaborate/${c.id}`} className="font-medium text-ink hover:text-brand-600">{c.title}</Link><p className="text-xs text-ink-subtle">{c.brand} · {c.compensation}</p></td>
                          <td className="px-3 py-3"><Badge tone={COLLAB_STATUS[c.status][1]} dot>{COLLAB_STATUS[c.status][0]}</Badge></td>
                          <td className="px-3 py-3"><div className="flex flex-wrap gap-1">{apps.length === 0 ? <span className="text-ink-subtle">—</span> : (Object.keys(APP_STATUS) as (keyof typeof APP_STATUS)[]).map((k) => { const n = apps.filter((a) => a.status === k).length; return n ? <Badge key={k} tone={APP_STATUS[k][1]}>{n} {APP_STATUS[k][0].toLowerCase()}</Badge> : null; })}</div></td>
                          <td className="px-3 py-3 text-ink-muted">{apps.filter((a) => a.status === "accepted").length}/{c.slots}</td>
                          <td className="px-5 py-3 text-ink-muted">{formatDate(c.deadline)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader title="Regional events" description="Registrations include demo figures" />
                <ul className="divide-y divide-line">
                  {[...events].sort((a, b) => a.date.localeCompare(b.date)).map((e) => {
                    const n = registeredCount(e);
                    return (
                      <li key={e.id}><Link href={`/regional/events/${e.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-canvas">
                        <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-ink">{e.title}</p><p className="text-xs text-ink-subtle">{e.city} · {formatDate(e.date, { day: "numeric", month: "short" })} · {e.price ? formatINR(e.price) : "Free"}</p></div>
                        <div className="w-28"><div className="h-1.5 rounded-full bg-canvas"><div className={cn("h-1.5 rounded-full", n >= e.capacity ? "bg-red-400" : "bg-teal-500")} style={{ width: `${Math.min(100, (n / e.capacity) * 100)}%` }} /></div><p className="mt-1 text-right text-[11px] text-ink-subtle">{n}/{e.capacity}</p></div>
                      </Link></li>
                    );
                  })}
                </ul>
              </Card>
              <Card>
                <CardHeader title="Communities" />
                <ul className="divide-y divide-line">
                  {communities.map((c) => (
                    <li key={c.id}><Link href={`/community/${c.slug}`} className="flex items-center justify-between px-5 py-3 hover:bg-canvas"><span><span className="block text-[13px] font-medium text-ink">{c.name}</span><span className="text-xs text-ink-subtle">{c.category} · {c.city}</span></span><span className="text-[13px] font-semibold text-ink">{memberCount(c).toLocaleString("en-IN")}</span></Link></li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Container>
    </>
  );
}
