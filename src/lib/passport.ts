import type { Booking, CollabApplication, Community, Creator, CreatorDuo, PitchRequest, RegionalEvent } from "./types";
import { portfolioFor } from "./data/passport";
import { cityInfo } from "./data/cities";

export interface PassportBadge {
  id: string;
  label: string;
  description: string;
  tone: "brand" | "teal" | "amber" | "navy";
}

export function passportId(c: Creator) {
  const city = c.location.slice(0, 3).toUpperCase();
  return `RTG-${city}-${c.id.replace("c", "").padStart(4, "0")}`;
}

/** Aggregates everything RTG Live knows about a creator into a Passport view (demo data). */
export function buildPassport(
  c: Creator,
  ctx: { bookings: Booking[]; pitchRequests: PitchRequest[]; applications: CollabApplication[]; communities: Community[]; events: RegionalEvent[]; duos: CreatorDuo[] },
) {
  const mine = ctx.bookings.filter((b) => b.creatorId === c.id || b.partnerCreatorId === c.id);
  const platformCompleted = mine.filter((b) => b.status === "completed").length;
  const pitchesDelivered = ctx.pitchRequests.filter((r) => r.creatorId === c.id && r.status === "feedback_submitted").length;
  const collabsAccepted = ctx.applications.filter((a) => a.creatorId === c.id && a.status === "accepted").length;
  const port = portfolioFor(c);
  const hosted = ctx.communities.filter((x) => x.hostCreatorIds.includes(c.id));
  const events = ctx.events.filter((e) => e.creatorIds.includes(c.id));
  const duos = ctx.duos.filter((d) => d.creatorIds.includes(c.id));
  const monthsOnPlatform = Math.max(0, Math.round((Date.now() - new Date(c.joined).getTime()) / (30 * 86400_000)));

  const badges: PassportBadge[] = [];
  if (c.rating >= 4.8 && c.reviewCount >= 50) badges.push({ id: "top", label: "Top Rated", description: "4.8+ average across 50+ reviews", tone: "amber" });
  if (c.sessionsCompleted >= 300) badges.push({ id: "300", label: "300+ Sessions", description: "Completed more than 300 paid sessions", tone: "brand" });
  else if (c.sessionsCompleted >= 100) badges.push({ id: "100", label: "100+ Sessions", description: "Completed more than 100 paid sessions", tone: "brand" });
  if (/(hour|hours)/.test(c.responseTime) && !/1 day/.test(c.responseTime)) badges.push({ id: "fast", label: "Fast Responder", description: "Typically replies within hours", tone: "teal" });
  if (c.acceptsPitches) badges.push({ id: "pitch", label: "Pitch Reviewer", description: "Gives structured feedback on products", tone: "teal" });
  if (hosted.length) badges.push({ id: "host", label: "Community Host", description: `Hosts ${hosted.map((h) => h.name).join(", ")}`, tone: "navy" });
  if (duos.length) badges.push({ id: "duo", label: "Duo Partner", description: "Offers joint Creator Duo experiences", tone: "brand" });
  if (events.length) badges.push({ id: "events", label: "Regional Host", description: "Hosts in-person RTG events", tone: "navy" });
  if (cityInfo(c.location).pilot) badges.push({ id: "pilot", label: "Hyderabad Pilot Creator", description: "Part of the Regional Connect pilot city", tone: "teal" });
  if (monthsOnPlatform <= 6) badges.push({ id: "rising", label: "Rising Creator", description: "Joined in the last 6 months", tone: "amber" });

  return {
    id: passportId(c),
    region: cityInfo(c.location),
    portfolio: port.items,
    stats: {
      sessions: c.sessionsCompleted,
      platformCompleted,
      upcoming: mine.filter((b) => b.status === "confirmed").length,
      pitchesDelivered,
      collaborations: (c.collaborationsCompleted ?? port.collaborations) + collabsAccepted,
      eventsHosted: events.length,
    },
    hosted,
    events,
    duos,
    badges,
    monthsOnPlatform,
    // Demo verification checklist — illustrative only, no KYC provider is integrated.
    verification: [
      { label: "Identity check", status: c.verified ? "Demo verified" : "Pending", ok: c.verified },
      { label: "Social accounts linked", status: c.socials.length ? `${c.socials.length} linked (demo)` : "None", ok: c.socials.length > 0 },
      { label: "Payout details", status: c.status === "active" ? "Added (demo)" : "Not added", ok: c.status === "active" },
      { label: "Platform conduct", status: c.status === "suspended" ? "Under review" : "Good standing", ok: c.status !== "suspended" },
    ],
  };
}
