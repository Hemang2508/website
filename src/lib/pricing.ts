import type { BookingSource } from "./types";

/**
 * PROPOSED commission assumptions for the RTG Live concept.
 * These are planning assumptions for discussion only — not confirmed commercial rates.
 */
export const COMMISSION = {
  creatorOriginated: 0.08, // creator brings the client via their own RTG link
  marketplace: 0.15, // client discovered the creator on RTG Live
  pitch: 0.15, // product pitch reviews
} as const;

export function bookingRate(source: BookingSource) {
  return source === "creator" ? COMMISSION.creatorOriginated : COMMISSION.marketplace;
}

export function splitAmount(amount: number, rate: number) {
  const platformFee = Math.round(amount * rate);
  return { platformFee, creatorEarning: amount - platformFee };
}

export function pct(rate: number) {
  return `${Math.round(rate * 100)}%`;
}
