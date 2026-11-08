import type { Creator } from "./types";

const AUDIENCE_HINTS: Record<string, string[]> = {
  "Gen Z (18–24)": ["Content & Creator Economy", "Technology", "Lifestyle & Wellness"],
  "Young professionals": ["Business & Startups", "Finance & Investing", "Career & Education", "Content & Creator Economy"],
  Students: ["Career & Education", "Finance & Investing", "Technology"],
  "Small businesses": ["Business & Startups", "Marketing & Growth", "Finance & Investing"],
  Enterprises: ["Technology", "Design & Product"],
  "Fitness enthusiasts": ["Lifestyle & Wellness"],
  Parents: ["Lifestyle & Wellness"],
  "Premium buyers": ["Content & Creator Economy", "Business & Startups"],
  "Value seekers": ["Technology", "Marketing & Growth"],
  "Tier 2 & 3 cities": ["Marketing & Growth", "Business & Startups"],
};

/** Simple, explainable match score (0–100) between a pitch and a creator. */
export function matchCreator(c: Creator, category: string, audiences: string[]) {
  let score = 35;
  const reasons: string[] = [];
  if (c.pitchCategories.includes(category)) {
    score += 40;
    reasons.push(`Reviews ${category}`);
  }
  const aud = audiences.filter((a) => AUDIENCE_HINTS[a]?.includes(c.category));
  if (aud.length) {
    score += Math.min(15, aud.length * 8);
    reasons.push(`Audience overlap: ${aud.slice(0, 2).join(", ")}`);
  }
  score += Math.round((c.rating - 4.5) * 20);
  if (c.followers > 300000) {
    score += 5;
    reasons.push("Large audience reach");
  }
  if (c.verified) reasons.push("Verified");
  return { score: Math.max(10, Math.min(99, score)), reasons };
}
