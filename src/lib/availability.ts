import type { Creator } from "./types";
import { addDays, toISODate } from "./utils";

export function slotsForDate(c: Pick<Creator, "availability">, date: Date): string[] {
  const slots = c.availability[date.getDay()] ?? [];
  const now = new Date();
  if (toISODate(date) !== toISODate(now)) return slots;
  // Same-day: require at least 2 hours' notice
  return slots.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m > now.getHours() * 60 + now.getMinutes() + 120;
  });
}

export function upcomingDays(n = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: n }, (_, i) => addDays(today, i));
}

export function nextAvailable(c: Pick<Creator, "availability">, isTaken: (date: string, time: string) => boolean) {
  for (const d of upcomingDays(21)) {
    const iso = toISODate(d);
    const free = slotsForDate(c, d).find((t) => !isTaken(iso, t));
    if (free) return { date: iso, time: free };
  }
  return null;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
