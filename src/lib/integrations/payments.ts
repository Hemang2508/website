/**
 * Payment adapter.
 *
 * DEMO MODE (default): no money moves. We simulate a Razorpay-style checkout and return a
 * fake payment id prefixed with `sim_pay_`. Every simulated transaction is labelled in the UI.
 *
 * PRODUCTION (later phase): create an order server-side with the Razorpay Orders API using
 * RAZORPAY_KEY_SECRET, open Razorpay Checkout with NEXT_PUBLIC_RAZORPAY_KEY_ID, then verify the
 * signature server-side before marking a booking as paid. Holding funds until a session is
 * delivered (escrow-like behaviour) must only be implemented through a compliant,
 * provider-supported mechanism (e.g. Razorpay Route with on-hold transfers) after legal and
 * provider verification. It is intentionally NOT implemented here.
 */

export const PAYMENTS_MODE: "simulated" | "razorpay" =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "razorpay" : "simulated";

export interface PaymentResult {
  ok: boolean;
  paymentId: string;
  method: string;
  error?: string;
}

export async function simulatePayment(amount: number, method: string): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 1400));
  if (amount <= 0) return { ok: false, paymentId: "", method, error: "Invalid amount" };
  return {
    ok: true,
    method,
    paymentId: `sim_pay_${Math.random().toString(36).slice(2, 12)}`,
  };
}
