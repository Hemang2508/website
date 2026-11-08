import type { Booking, Creator, Pitch, PitchRequest } from "./types";
import { addDays, parseISODate, toISODate } from "./utils";

export type TxType = "Marketplace booking" | "Creator-originated booking" | "Product pitch";

export interface Transaction {
  id: string;
  ref: string; // booking or pitch request id
  type: TxType;
  creatorId: string;
  creatorName: string;
  payer: string;
  description: string;
  date: string; // ISO date (session date / request date)
  amount: number;
  rate: number;
  platformFee: number;
  creatorEarning: number;
  status: "paid" | "earned" | "refunded";
  rawStatus: string;
  paymentId: string;
}

export function toTransactions(bookings: Booking[], requests: PitchRequest[], pitches: Pitch[], creators: Creator[]): Transaction[] {
  const name = (id: string) => creators.find((c) => c.id === id)?.name ?? "—";
  const tx: Transaction[] = bookings.map((b) => ({
    id: `tx_${b.id}`,
    ref: b.id,
    type: b.source === "creator" ? "Creator-originated booking" : "Marketplace booking",
    creatorId: b.creatorId,
    creatorName: b.partnerCreatorId ? `${name(b.creatorId)} & ${name(b.partnerCreatorId)}` : name(b.creatorId),
    payer: b.userName,
    description: b.serviceTitle,
    date: b.date,
    amount: b.amount,
    rate: b.commissionRate,
    platformFee: b.platformFee,
    creatorEarning: b.creatorEarning,
    status: b.status === "declined" || b.status === "cancelled" ? "refunded" : b.status === "completed" ? "earned" : "paid",
    rawStatus: b.status,
    paymentId: b.paymentId,
  }));
  for (const r of requests) {
    const p = pitches.find((x) => x.id === r.pitchId);
    tx.push({
      id: `tx_${r.id}`,
      ref: r.id,
      type: "Product pitch",
      creatorId: r.creatorId,
      creatorName: name(r.creatorId),
      payer: p?.company ?? "—",
      description: `Pitch review · ${p?.productName ?? ""}`,
      date: toISODate(new Date(r.sentAt)),
      amount: r.fee,
      rate: r.commissionRate,
      platformFee: r.platformFee,
      creatorEarning: r.creatorEarning,
      status: r.status === "declined" ? "refunded" : r.status === "feedback_submitted" ? "earned" : "paid",
      rawStatus: r.status,
      paymentId: r.paymentId,
    });
  }
  return tx.sort((a, b) => b.date.localeCompare(a.date));
}

export function summarise(tx: Transaction[]) {
  const live = tx.filter((t) => t.status !== "refunded");
  const earned = live.filter((t) => t.status === "earned");
  const sum = (xs: Transaction[], k: "amount" | "platformFee" | "creatorEarning") => xs.reduce((s, t) => s + t[k], 0);
  return {
    gmv: sum(live, "amount"),
    platformFees: sum(live, "platformFee"),
    creatorEarnings: sum(live, "creatorEarning"),
    earnedNet: sum(earned, "creatorEarning"),
    earnedFees: sum(earned, "platformFee"),
    pendingNet: sum(live.filter((t) => t.status === "paid"), "creatorEarning"),
    refunded: sum(tx.filter((t) => t.status === "refunded"), "amount"),
    count: live.length,
    byType: (["Marketplace booking", "Creator-originated booking", "Product pitch"] as TxType[]).map((type) => {
      const xs = live.filter((t) => t.type === type);
      return { type, count: xs.length, gmv: sum(xs, "amount"), fees: sum(xs, "platformFee"), net: sum(xs, "creatorEarning") };
    }),
  };
}

/** Weekly buckets (Mon-start) for the last `weeks` weeks plus the coming week. */
export function weeklySeries(tx: Transaction[], value: (t: Transaction) => number, weeks = 8) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const start = addDays(monday, -(weeks - 2 - i) * 7);
    return { start, label: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), value: 0, future: start > today };
  });
  for (const t of tx) {
    if (t.status === "refunded") continue;
    const d = parseISODate(t.date);
    const b = buckets.find((x) => d >= x.start && d < addDays(x.start, 7));
    if (b) b.value += value(t);
  }
  return buckets;
}

export function toCSV(rows: Transaction[]) {
  const head = ["Reference", "Type", "Date", "Creator", "Payer", "Description", "Amount (INR)", "Commission", "Platform fee", "Creator earning", "Status", "Payment ID"];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [head.map(esc).join(","), ...rows.map((t) => [t.ref, t.type, t.date, t.creatorName, t.payer, t.description, t.amount, `${Math.round(t.rate * 100)}%`, t.platformFee, t.creatorEarning, `${t.status} (simulated)`, t.paymentId].map(esc).join(","))].join("\n");
}
