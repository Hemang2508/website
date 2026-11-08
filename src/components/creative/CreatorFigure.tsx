import type { Creator, CreatorAppearance } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Original illustrated creator figure (no photography of real people).
 * Personal attributes (hair, headwear, accessory, tone) come ONLY from the creator's chosen
 * `appearance`; anything unset renders a neutral default. Only non-personal composition
 * (which side the lens sits, shoulder angle) varies by ID so galleries are not identical.
 * A creator-uploaded `photo` always takes precedence.
 */

export const HAIR_OPTIONS: { id: NonNullable<CreatorAppearance["hair"]>; label: string }[] = [
  { id: "none", label: "No hair shown" }, { id: "short", label: "Short" }, { id: "swept", label: "Side-swept" },
  { id: "curly", label: "Curly" }, { id: "long", label: "Long" }, { id: "bun", label: "Bun" },
];
export const HEADWEAR_OPTIONS: { id: NonNullable<CreatorAppearance["headwear"]>; label: string }[] = [
  { id: "none", label: "None" }, { id: "scarf", label: "Head scarf" }, { id: "cap", label: "Cap" },
];
export const ACCESSORY_OPTIONS: { id: NonNullable<CreatorAppearance["accessory"]>; label: string }[] = [
  { id: "none", label: "None" }, { id: "glasses", label: "Glasses" }, { id: "headphones", label: "Headphones" },
];
/** Neutral, non-realistic figure tones (lightness steps on the creator's hue). */
export const TONES = [0, 1, 2, 3, 4] as const;
export const BACKDROPS = [252, 200, 170, 140, 45, 20, 340, 285] as const;

const HAIR: Record<string, string> = {
  short: "M70 106c-2-26 13-42 31-42s34 14 32 40c-6-11-16-16-31-16s-26 6-32 18z",
  long: "M64 112c-4-32 14-52 37-52s40 20 36 52c3 18 6 34 14 48-14 4-24-2-30-14 4-16 4-30-2-42-6-8-14-10-19-10s-14 2-20 10c-6 12-6 26-2 42-6 12-16 18-30 14 8-14 12-30 16-48z",
  bun: "M70 106c-2-25 13-40 31-40s33 13 31 38c-6-11-16-16-31-16s-25 6-31 18zM101 36a14 14 0 1 1 0 28 14 14 0 0 1 0-28z",
  curly: "M62 108c-10-14-4-34 10-40 4-14 20-20 32-14 12-8 30-2 34 12 14 6 18 24 10 38-6-12-18-20-36-20s-34 8-40 24z",
  swept: "M68 108c-4-30 14-46 34-46 19 0 34 13 32 38-13-4-28-13-37-24-4 13-15 24-29 32z",
};
const SCARF = "M64 116c-2-34 16-56 37-56s39 22 37 56c0 20-6 36-14 46 16 6 30 14 36 26H42c6-12 20-20 36-26-8-10-14-26-14-46zm37-34c-15 0-26 13-26 33s11 33 26 33 26-13 26-33-11-33-26-33z";
const CAP = "M70 104c0-24 14-38 31-38s31 14 31 38zM128 100h22c4 0 4 6 0 7h-22z";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

type FigureCreator = Pick<Creator, "id" | "name" | "avatarHue"> & { photo?: string; appearance?: CreatorAppearance };

export function CreatorFigure({
  creator, className, framed = true, label, crop = "full",
}: { creator: FigureCreator; className?: string; framed?: boolean; label?: string; crop?: "full" | "head" }) {
  const decorative = label === "";
  const aria = label || (creator.photo ? `${creator.name}` : `Illustration of ${creator.name}, demo creator`);
  if (creator.photo) {
    return <img src={creator.photo} alt={decorative ? "" : aria} className={cn("h-full w-full object-cover", className)} loading="lazy" decoding="async" />;
  }
  const ap = creator.appearance ?? {};
  const hue = ap.backdrop ?? creator.avatarHue;
  const tone = ap.tone ?? 2;
  const h = hash(creator.id);
  const lensLeft = h % 2 === 1;
  const tilt = [0, -5, 5][(h >> 3) % 3];

  const bg = `hsl(${hue} 48% 88%)`;
  const lens = `hsl(${(hue + 40) % 360} 70% 62%)`;
  const ink = `hsl(${hue} 30% 20%)`;
  const skin = `hsl(${hue} ${14 + tone * 3}% ${22 + tone * 8}%)`;
  const hairC = `hsl(${hue} 28% 11%)`;
  const id = `fig-${creator.id}-${crop}`;
  const headwear = ap.headwear ?? "none";
  const hair = headwear === "scarf" ? "none" : ap.hair ?? "none";

  return (
    <svg viewBox={crop === "head" ? "22 62 156 104" : "0 0 200 240"} className={cn("block h-full w-full", className)} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : aria} aria-hidden={decorative || undefined} preserveAspectRatio={crop === "head" ? "xMidYMid slice" : "xMidYMax slice"}>
      <defs>
        <clipPath id={`${id}-arch`}><path d="M0 240V100a100 100 0 0 1 200 0v140z" /></clipPath>
        <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill={ink} opacity="0.12" /></pattern>
      </defs>
      <g clipPath={framed && crop === "full" ? `url(#${id}-arch)` : undefined}>
        {framed && <rect x="0" y="0" width="200" height="240" fill={bg} />}
        {framed && <rect x="0" y="0" width="200" height="240" fill={`url(#${id}-dots)`} />}
        <circle cx={lensLeft ? 52 : 150} cy="78" r="46" fill={lens} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
        <g transform={`rotate(${tilt} 100 240)`}>
          <path d="M26 246c0-52 34-80 74-80s74 28 74 80z" fill={ink} />
          <rect x="89" y="138" width="22" height="34" rx="9" fill={skin} />
          <ellipse cx="101" cy="112" rx="29" ry="34" fill={skin} />
          {hair !== "none" && HAIR[hair] && <path d={HAIR[hair]} fill={hairC} />}
          {headwear === "scarf" && <path d={SCARF} fill={lens} opacity="0.95" />}
          {headwear === "cap" && <path d={CAP} fill={lens} />}
          {ap.accessory === "glasses" && <g fill="none" stroke={bg} strokeWidth="2.6" opacity="0.9"><circle cx="89" cy="114" r="8" /><circle cx="113" cy="114" r="8" /><path d="M97 114h8" /></g>}
          {ap.accessory === "headphones" && <g fill="none" stroke={lens} strokeWidth="5" strokeLinecap="round"><path d="M70 116c0-24 14-40 31-40s31 16 31 40" /><rect x="64" y="108" width="10" height="18" rx="4" fill={lens} /><rect x="128" y="108" width="10" height="18" rx="4" fill={lens} /></g>}
        </g>
      </g>
    </svg>
  );
}
