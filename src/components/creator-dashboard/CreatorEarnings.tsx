"use client";

import { useState } from "react";
import { Banknote, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { summarise, toCSV, toTransactions, weeklySeries } from "@/lib/metrics";
import { pct } from "@/lib/pricing";
import { Card, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { Badge, SimulatedTag } from "@/components/ui/Badge";
import { BarChart } from "@/components/dashboard/BarChart";
import { formatDate, formatINR } from "@/lib/utils";

export function useCreatorTx(creatorId: string) {
  const { bookings, pitchRequests, pitches, creators } = useStore();
  const tx = toTransactions(bookings.filter((b) => b.creatorId === creatorId), pitchRequests.filter((r) => r.creatorId === creatorId), pitches, creators);
  return { tx, summary: summarise(tx) };
}

export function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function CreatorEarnings({ creatorId }: { creatorId: string }) {
  const { toast } = useStore();
  const { tx, summary } = useCreatorTx(creatorId);
  const [requested, setRequested] = useState(false);
  const series = weeklySeries(tx, (t) => t.creatorEarning);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Gross bookings" value={formatINR(summary.gmv)} sub={`${summary.count} paid transactions`} />
        <Stat label="Platform fees" value={formatINR(summary.platformFees)} sub="8% / 15% proposed rates" accent="navy" />
        <Stat label="Available for payout" value={formatINR(requested ? 0 : summary.earnedNet)} sub="Completed sessions & delivered pitches" accent="teal" />
        <Stat label="Upcoming earnings" value={formatINR(summary.pendingNet)} sub="Released once delivered" accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Net earnings by week" description="Based on session dates. Hatched bar = upcoming week." />
          <div className="p-5"><BarChart data={series} color="teal" /></div>
        </Card>
        <Card>
          <CardHeader title="Earnings by source" action={<Badge tone="amber">Proposed rates</Badge>} />
          <div className="space-y-4 p-5">
            {summary.byType.map((t) => (
              <div key={t.type}>
                <div className="flex justify-between text-[13px]"><span className="font-medium text-ink">{t.type}</span><span className="font-semibold text-ink">{formatINR(t.net)}</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-canvas"><div className="h-2 rounded-full bg-teal-500" style={{ width: `${summary.creatorEarnings ? (t.net / summary.creatorEarnings) * 100 : 0}%` }} /></div>
                <p className="mt-1 text-[11px] text-ink-subtle">{t.count} transactions · {formatINR(t.gmv)} gross · {formatINR(t.fees)} fees</p>
              </div>
            ))}
            <div className="rounded-xl bg-canvas p-3 text-xs text-ink-muted">
              Share your personal booking link to move more bookings to the lower creator-originated fee.
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Transactions"
          description="All amounts are simulated demo transactions."
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => download(`rtg-earnings-${creatorId}.csv`, toCSV(tx))}><Download className="h-4 w-4" /><span className="hidden sm:inline">Export CSV</span></Button>
              <Button size="sm" variant="teal" disabled={requested || summary.earnedNet === 0} onClick={() => { setRequested(true); toast({ title: "Payout requested (simulated)", body: `${formatINR(summary.earnedNet)} would be transferred to your linked bank account.` }); }}>
                <Banknote className="h-4 w-4" />{requested ? "Payout requested" : "Request payout"}
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="border-b border-line bg-canvas/60 text-[11px] uppercase tracking-wide text-ink-subtle">
              <tr><th className="px-5 py-2.5 font-semibold">Date</th><th className="px-3 py-2.5 font-semibold">Description</th><th className="px-3 py-2.5 font-semibold">Type</th><th className="px-3 py-2.5 text-right font-semibold">Gross</th><th className="px-3 py-2.5 text-right font-semibold">Fee</th><th className="px-3 py-2.5 text-right font-semibold">Net</th><th className="px-5 py-2.5 font-semibold">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tx.map((t) => (
                <tr key={t.id} className={t.status === "refunded" ? "text-ink-subtle" : ""}>
                  <td className="whitespace-nowrap px-5 py-3 text-ink-muted">{formatDate(t.date, { day: "numeric", month: "short" })}</td>
                  <td className="px-3 py-3"><p className="font-medium text-ink">{t.description}</p><p className="text-xs text-ink-subtle">{t.payer} · {t.ref}</p></td>
                  <td className="px-3 py-3 text-ink-muted">{t.type.replace(" booking", "")} · {pct(t.rate)}</td>
                  <td className="px-3 py-3 text-right">{formatINR(t.amount)}</td>
                  <td className="px-3 py-3 text-right text-ink-muted">−{formatINR(t.platformFee)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-ink">{t.status === "refunded" ? "—" : formatINR(t.creatorEarning)}</td>
                  <td className="px-5 py-3">{t.status === "earned" ? <Badge tone="teal">Earned</Badge> : t.status === "paid" ? <Badge tone="amber">Upcoming</Badge> : <Badge>Refunded</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-ink-subtle">
          <SimulatedTag /> Payouts and refunds are simulated. No escrow arrangement is implemented in this demo.
        </div>
      </Card>
    </div>
  );
}
