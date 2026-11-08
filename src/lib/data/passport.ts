import type { Creator, PortfolioItem } from "../types";

/**
 * Creator Passport demo data. Portfolio items and collaboration counts are illustrative sample
 * data for the concept demo — not real campaigns or verified records.
 */
export const PORTFOLIO: Record<string, { items: PortfolioItem[]; collaborations: number }> = {
  c1: { collaborations: 14, items: [
    { title: "Scaled a skincare D2C brand to national retail", kind: "Venture", org: "Personal care start-up", year: 2023, metric: "₹50 Cr+ revenue" },
    { title: "Positioning workshop for women-led brands", kind: "Workshop", org: "Founder cohort", year: 2025, metric: "120 founders" },
    { title: "How to price your first D2C product", kind: "Video", org: "Instagram series", year: 2026, metric: "1.4M views" },
  ] },
  c2: { collaborations: 9, items: [
    { title: "Led checkout redesign for an e-commerce platform", kind: "Venture", org: "E-commerce", year: 2021, metric: "+11% conversion" },
    { title: "What seed investors look for in 2026", kind: "Talk", org: "Hyderabad founder meetup", year: 2026 },
    { title: "Angel portfolio of 22 start-ups", kind: "Venture", org: "Angel investing", year: 2025 },
  ] },
  c3: { collaborations: 41, items: [
    { title: "Sunscreen myth-busting series", kind: "Video", org: "YouTube", year: 2026, metric: "2.1M views" },
    { title: "Monsoon skincare launch campaign", kind: "Campaign", org: "Beauty brand", year: 2025, metric: "6 deliverables" },
  ] },
  c10: { collaborations: 11, items: [
    { title: "Built a 40-outlet cloud kitchen brand", kind: "Venture", org: "Cloud kitchen", year: 2024 },
    { title: "Menu engineering masterclass", kind: "Workshop", org: "Restaurant owners", year: 2025, metric: "80 attendees" },
  ] },
  c14: { collaborations: 37, items: [
    { title: "Old City biryani trail", kind: "Video", org: "YouTube", year: 2026, metric: "3.2M views" },
    { title: "Café launch campaign, Jubilee Hills", kind: "Campaign", org: "Specialty café", year: 2025, metric: "4 reels + 1 event" },
    { title: "Ramzan night food walks", kind: "Workshop", org: "RTG Regional pilot", year: 2026, metric: "6 walks" },
  ] },
  c15: { collaborations: 26, items: [
    { title: "Hidden Telangana: 10 weekend escapes", kind: "Video", org: "YouTube series", year: 2026, metric: "1.8M views" },
    { title: "Homestay storytelling campaign", kind: "Campaign", org: "Kerala homestay network", year: 2025 },
  ] },
  c16: { collaborations: 22, items: [
    { title: "Community esports night series", kind: "Workshop", org: "Hyderabad gaming cafés", year: 2026, metric: "1,200 players" },
    { title: "Indie game launch stream", kind: "Campaign", org: "Indian indie studio", year: 2025, metric: "180K live viewers" },
  ] },
  c17: { collaborations: 18, items: [
    { title: "Desk-to-deadlift 8-week programme", kind: "Video", org: "YouTube", year: 2026, metric: "900K views" },
    { title: "Corporate wellness sessions", kind: "Workshop", org: "Hyderabad tech parks", year: 2025, metric: "14 companies" },
  ] },
};

export function portfolioFor(c: Creator) {
  const p = PORTFOLIO[c.id];
  if (p) return p;
  return {
    collaborations: Math.round(c.sessionsCompleted / 30),
    items: [
      { title: `${c.tags[0]} masterclass`, kind: "Workshop" as const, org: "RTG Live community", year: 2026 },
      { title: `${c.tags[1] ?? c.category} explainer series`, kind: "Video" as const, org: c.socials[0]?.platform ?? "Social", year: 2025 },
    ],
  };
}
