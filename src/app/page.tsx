"use client";

import { Hero } from "@/components/creative/home/Hero";
import { Manifesto } from "@/components/creative/home/Manifesto";
import { CreatorUniverse } from "@/components/creative/home/CreatorUniverse";
import { Chapters } from "@/components/creative/home/Chapters";
import { CityMap } from "@/components/creative/home/CityMap";
import { Fees, FinalCta, ForCreators } from "@/components/creative/home/Closing";

/** Homepage — "The Meeting Point" storytelling sequence (see docs/creative/CREATIVE_DIRECTION.md). */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <CreatorUniverse />
      <Chapters />
      <CityMap />
      <Fees />
      <ForCreators />
      <FinalCta />
    </>
  );
}
