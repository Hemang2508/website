import type { BookingStatus, PitchRequestStatus } from "@/lib/types";
import { Badge, type Tone } from "./Badge";

const booking: Record<BookingStatus, [string, Tone]> = {
  pending: ["Awaiting creator", "amber"],
  confirmed: ["Confirmed", "brand"],
  completed: ["Completed", "teal"],
  declined: ["Declined · refunded", "red"],
  cancelled: ["Cancelled · refunded", "neutral"],
};
const pitch: Record<PitchRequestStatus, [string, Tone]> = {
  pending: ["Awaiting response", "amber"],
  accepted: ["Accepted · in review", "brand"],
  declined: ["Declined · refunded", "red"],
  feedback_submitted: ["Feedback delivered", "teal"],
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const [l, t] = booking[status];
  return <Badge tone={t} dot>{l}</Badge>;
}
export function PitchStatusBadge({ status }: { status: PitchRequestStatus }) {
  const [l, t] = pitch[status];
  return <Badge tone={t} dot>{l}</Badge>;
}
