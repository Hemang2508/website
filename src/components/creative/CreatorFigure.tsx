import type { Creator } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Original illustrated creator figure (no photography of real people).
 * A faceless editorial silhouette inside an arch, with deterministic hair/accessory variations
 * and RTG's overlapping "lens" accent in the creator's hue. A licensed `photo` overrides it.
 */

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const HAIR: Record<number, string> = {
  // short crop
  0: "M68 104c-2-26 14-44 33-44s36 15 33 42c-6-12-17-17-32-17s-27 6-34 19z",
  // long, falls to shoulders
  1: "M64 112c-4-32 14-52 37-52s40 20 36 52c3 18 6 34 14 48-14 4-24-2-30-14 4-16 4-30-2-42-6-8-14-10-19-10s-14 2-20 10c-6 12-6 26-2 42-6 12-16 18-30 14 8-14 12-30 16-48z",
  // bun
  2: "M68 106c-2-26 14-42 33-42s35 14 33 40c-6-12-17-17-32-17s-27 6-34 19zM101 30a15 15 0 1 1 0 30 15 15 0 0 1 0-30z",
  // curly volume
  3: "M62 108c-10-14-4-34 10-40 4-14 20-20 32-14 12-8 30-2 34 12 14 6 18 24 10 38-6-12-18-20-36-20s-34 8-40 24z",
  // headscarf (covers head and neck)
  4: "M64 116c-2-34 16-56 37-56s39 22 37 56c0 20-6 36-14 46 16 6 30 14 36 26H42c6-12 20-20 36-26-8-10-14-26-14-46zm37-34c-15 0-26 13-26 33s11 33 26 33 26-13 26-33-11-33-26-33z",
  // side-swept
  5: "M66 108c-4-30 14-48 36-48 20 0 36 14 34 40-14-4-30-14-40-26-4 14-16 26-30 34z",
};

export function figureFor(c: Pick<Creator, "id" | "category" | "avatarHue">) {
  const h = hash(c.id);
  return { hair: h % 6, pose: (h >> 3) % 3, hue: c.avatarHue };
}

export function CreatorFigure({
  creator, className, framed = true, label, crop = "full",
}: { creator: Pick<Creator, "id" | "name" | "category" | "avatarHue" | "photo">; className?: string; framed?: boolean; label?: string; crop?: "full" | "head" }) {
  const { hair, pose, hue } = figureFor(creator);
  const aria = label ?? `Illustration of ${creator.name}, demo creator`;
  if (creator.photo) {
    return <img src={creator.photo} alt={aria} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  }
  const bg = `hsl(${hue} 48% 88%)`;
  const lens = `hsl(${(hue + 40) % 360} 70% 62%)`;
  const ink = `hsl(${hue} 32% 20%)`;
  const skin = `hsl(${hue} 22% 34%)`;
  const hairC = `hsl(${hue} 30% 12%)`;
  const tech = creator.category === "Technology";
  const gaming = creator.category === "Gaming & Entertainment";
  const career = creator.category === "Career & Education" || creator.category === "Finance & Investing";
  const shoulderTilt = pose === 0 ? 0 : pose === 1 ? -6 : 6;
  const id = `fig-${creator.id}`;

  return (
    <svg viewBox={crop === "head" ? "22 62 156 104" : "0 0 200 240"} className={cn("block h-full w-full", className)} role="img" aria-label={aria} preserveAspectRatio={crop === "head" ? "xMidYMid slice" : "xMidYMax slice"}>
      <title>{aria}</title>
      <defs>
        <clipPath id={`${id}-arch`}><path d="M0 240V100a100 100 0 0 1 200 0v140z" /></clipPath>
        <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill={ink} opacity="0.12" /></pattern>
      </defs>
      <g clipPath={framed && crop === "full" ? `url(#${id}-arch)` : undefined}>
        {framed && <rect width="200" height="240" fill={bg} />}
        {framed && <rect width="200" height="240" fill={`url(#${id}-dots)`} />}
        {/* lens accent: the second circle that overlaps the figure */}
        <circle cx={pose === 2 ? 52 : 150} cy="78" r="46" fill={lens} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
        <g transform={`rotate(${shoulderTilt} 100 240)`}>
          {/* shoulders */}
          <path d="M26 246c0-52 34-80 74-80s74 28 74 80z" fill={ink} />
          {career && <path d="M100 168l-14 0 14 30 14-30z" fill={bg} opacity="0.9" />}
          {creator.category === "Business & Startups" && <path d="M80 172l20 40 20-40" fill="none" stroke={bg} strokeWidth="3" opacity="0.7" />}
          {/* neck + head */}
          <rect x="89" y="138" width="22" height="34" rx="9" fill={skin} />
          <ellipse cx="101" cy="112" rx="29" ry="34" fill={skin} />
          <path d={HAIR[hair]} fill={hairC} />
          {tech && <g fill="none" stroke={bg} strokeWidth="2.6" opacity="0.9"><circle cx="89" cy="114" r="8" /><circle cx="113" cy="114" r="8" /><path d="M97 114h8" /></g>}
          {gaming && <g fill="none" stroke={lens} strokeWidth="5" strokeLinecap="round"><path d="M70 116c0-24 14-40 31-40s31 16 31 40" /><rect x="64" y="108" width="10" height="18" rx="4" fill={lens} /><rect x="128" y="108" width="10" height="18" rx="4" fill={lens} /></g>}
        </g>
      </g>
    </svg>
  );
}
