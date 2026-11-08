"use client";

import { useState } from "react";
import { Building2, CheckCircle2, CreditCard, Lock, Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SimulatedTag } from "@/components/ui/Badge";
import { simulatePayment, type PaymentResult } from "@/lib/integrations/payments";
import { cn, formatINR } from "@/lib/utils";

const methods = [
  { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Netbanking", desc: "All major Indian banks", icon: Building2 },
];

/**
 * Simulated, Razorpay-style checkout. No payment details are collected and no money moves.
 */
export function PaymentModal({
  open, onClose, amount, description, onSuccess,
}: { open: boolean; onClose: () => void; amount: number; description: string; onSuccess: (r: PaymentResult) => void }) {
  const [method, setMethod] = useState("upi");
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");

  const pay = async () => {
    setState("processing");
    const r = await simulatePayment(amount, method);
    if (r.ok) {
      setState("done");
      setTimeout(() => { onSuccess(r); setState("idle"); }, 700);
    } else setState("idle");
  };

  return (
    <Modal
      open={open}
      onClose={() => state === "idle" && onClose()}
      title="Secure checkout"
      description={description}
      footer={
        state === "idle" ? (
          <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={pay}><Lock className="h-4 w-4" />Pay {formatINR(amount)} (simulated)</Button>
          </>
        ) : undefined
      }
    >
      {state === "done" ? (
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-teal-500" />
          <p className="mt-3 text-lg font-semibold text-ink">Payment successful</p>
          <p className="text-sm text-ink-muted">Simulated transaction — no money was charged.</p>
        </div>
      ) : state === "processing" ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500" />
          <p className="mt-4 text-sm font-medium text-ink">Processing simulated payment…</p>
          <p className="text-xs text-ink-subtle">Do not close this window</p>
        </div>
      ) : (
        <div>
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3">
            <SimulatedTag />
            <p className="text-[13px] leading-snug text-amber-800">Demo payment. Razorpay is not connected, no card or UPI details are collected and no money is charged.</p>
          </div>
          <div className="flex items-baseline justify-between rounded-xl bg-canvas px-4 py-3">
            <span className="text-sm text-ink-muted">Amount payable</span>
            <span className="text-2xl font-semibold tracking-tight text-ink">{formatINR(amount)}</span>
          </div>
          <p className="mb-2 mt-5 text-[13px] font-medium text-ink">Payment method</p>
          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn("flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition", method === m.id ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-100" : "border-line hover:border-[#D5D9E4]")}
                aria-pressed={method === m.id}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-muted ring-1 ring-line"><m.icon className="h-4 w-4" /></span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{m.label}</span>
                  <span className="block text-xs text-ink-subtle">{m.desc}</span>
                </span>
                <span className={cn("h-4 w-4 rounded-full border-2", method === m.id ? "border-brand-500 bg-brand-500 shadow-[inset_0_0_0_2px_white]" : "border-[#C9CEDA]")} />
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
