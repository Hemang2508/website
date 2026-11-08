"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, IdCard, ShoppingBag, Wallet, CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { FeeCalculator } from "@/components/landing/FeeCalculator";
import { Magnetic } from "../Magnetic";

export function Fees() {
  return (
    <section id="fees" className="scroll-mt-20 border-t border-line bg-white py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2">
            <h2 className="font-display text-display-lg text-ink">Creators keep <em className="font-serif font-normal italic">most</em> of every booking.</h2>
            <p className="max-w-lg text-[16px] leading-relaxed text-ink-muted lg:justify-self-end">The platform fee and the creator&apos;s earnings are shown on every checkout, receipt and payout. Rates below are proposed assumptions for discussion.</p>
          </div>
        </Reveal>
        <Reveal delay={80}><div className="mt-12"><FeeCalculator /></div></Reveal>
      </Container>
    </section>
  );
}

export function ForCreators() {
  const steps = [
    [IdCard, "Build your Creator Passport", "Expertise, portfolio, badges and services in one shareable record."],
    [CalendarCheck, "Accept what fits", "Bookings, product pitches and brand briefs — you decide on every request."],
    [Wallet, "Track every rupee", "Earnings, platform fees and simulated payouts in your dashboard."],
  ] as const;
  return (
    <section id="for-creators" className="scroll-mt-20 bg-canvas py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-brand-600">For creators</p>
            <h2 className="mt-4 font-display text-display-lg text-ink">Your expertise, <em className="font-serif font-normal italic">bookable</em>.</h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-muted">Set your own prices and availability. Bring clients through your personal link for a lower proposed fee (8% instead of 15%).</p>
            <Magnetic className="mt-8 inline-flex"><Link href="/creator" className={buttonClass("dark", "lg", "h-14 px-7 text-base")}>Preview the creator dashboard <ArrowRight className="h-4 w-4" /></Link></Magnetic>
          </Reveal>
          <ol className="grid grid-cols-1 gap-4">
            {steps.map(([I, t, d], i) => (
              <Reveal key={t} delay={i * 90} as="li">
                <div className="group flex gap-5 rounded-3xl border border-ink/10 bg-white p-6 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-1 hover:shadow-lift">
                  <span className="font-serif text-4xl italic leading-none text-brand-600" aria-hidden>0{i + 1}</span>
                  <span>
                    <span className="flex items-center gap-2 font-display text-lg font-bold text-ink"><I className="h-4 w-4 text-brand-600" />{t}</span>
                    <span className="mt-1 block text-[14px] text-ink-muted">{d}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-canvas pb-8">
      <Container>
        <div id="ecosystem" className="mb-8 flex scroll-mt-24 flex-col gap-4 rounded-3xl border border-dashed border-ink/20 p-6 sm:flex-row sm:items-center">
          <div className="flex gap-2 text-ink-muted"><ShoppingBag className="h-5 w-5" /><FlaskConical className="h-5 w-5" /></div>
          <p className="flex-1 text-[14px] text-ink-muted"><b className="text-ink">Coming later:</b> RTG Market, built-in video sessions and creator-owned products. None of these are operational in this demo.</p>
        </div>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-center text-white sm:px-12 sm:py-28">
            <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-white/10" aria-hidden />
            <div className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-white/10" aria-hidden />
            <h2 className="relative font-display text-[clamp(2.6rem,7.5vw,7rem)] font-bold leading-[0.95] tracking-[-0.05em]">Your idea.<br /><em className="font-serif font-normal italic text-teal-400">Their</em> influence.</h2>
            <p className="relative mx-auto mt-6 max-w-md text-white/65">Try the full demo — switch between user, creator and admin from the header.</p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-3">
              <Magnetic><Link href="/explore" className={buttonClass("light", "lg", "h-14 px-7 text-base")}>Book a creator</Link></Magnetic>
              <Magnetic><Link href="/pitch/new" className={buttonClass("outline", "lg", "h-14 border-white/30 px-7 text-base text-white hover:border-white hover:bg-white/5")}>Pitch a product</Link></Magnetic>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
