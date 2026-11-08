"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Check, Clock, Link2, ShieldCheck, Video } from "lucide-react";
import { useStore } from "@/lib/store";
import { bookingRate, splitAmount } from "@/lib/pricing";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Container } from "@/components/ui/Misc";
import { SimulatedTag } from "@/components/ui/Badge";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { FeeBreakdown } from "@/components/booking/FeeBreakdown";
import { JourneySteps } from "@/components/booking/JourneySteps";
import { CreatorFigure } from "@/components/creative/CreatorFigure";
import { Ticket } from "@/components/creative/Ticket";
import { cn, formatDate, formatINR, formatTime, isEmail, isIndianPhone } from "@/lib/utils";

const STEPS = ["Service & time", "Your details", "Payment"];

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Booking />
    </Suspense>
  );
}

function Booking() {
  const { slug } = useParams<{ slug: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { getCreator, isSlotTaken, createBooking, demoUser, role, toast, hydrated } = useStore();
  const c = getCreator(slug);
  const source = params.get("ref") === "creator" ? "creator" : "marketplace";

  const services = c?.services.filter((s) => s.active && s.type !== "pitch") ?? [];
  const [serviceId, setServiceId] = useState(params.get("service") ?? services[0]?.id ?? "");
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: role === "user" ? demoUser.name : "",
    email: role === "user" ? demoUser.email : "",
    phone: role === "user" ? demoUser.phone : "",
    topic: "",
    notes: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payOpen, setPayOpen] = useState(false);

  if (!c) {
    if (!hydrated) return <div className="min-h-[70vh]" />;
    notFound();
  }
  const service = services.find((s) => s.id === serviceId) ?? services[0];
  if (!service) {
    return <Container className="py-24 text-center text-ink-muted">This creator has no bookable services right now.</Container>;
  }
  const rate = bookingRate(source);
  const { platformFee, creatorEarning } = splitAmount(service.price, rate);

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!isEmail(form.email)) e.email = "Enter a valid email address";
    if (!isIndianPhone(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (form.topic.trim().length < 10) e.topic = "Describe what you'd like to discuss (at least 10 characters)";
    if (!form.agree) e.agree = "Please accept the booking terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0) {
      if (!date || !time) { setErrors({ slot: "Select a date and time to continue" }); return; }
      setErrors({});
      setStep(1);
    } else if (step === 1) {
      if (validateDetails()) setStep(2);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPaid = (paymentId: string) => {
    if (date && time && isSlotTaken(c.id, date, time)) {
      toast({ title: "That slot was just taken", body: "Please choose another time.", tone: "error" });
      setPayOpen(false); setStep(0); setTime(null);
      return;
    }
    const b = createBooking({
      creatorId: c.id, serviceId: service.id, date: date!, time: time!, topic: form.topic.trim(), notes: form.notes.trim(),
      userName: form.name.trim(), userEmail: form.email.trim(), userPhone: form.phone.trim(), source, paymentId,
    });
    setPayOpen(false);
    router.push(`/bookings/${b.id}?new=1`);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <Container className="py-8 sm:py-10">
      <Link href={`/creators/${c.slug}${source === "creator" ? "?ref=creator" : ""}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to {c.name}
      </Link>
      <div className="mt-5 flex items-center gap-4">
        <span className="h-16 w-14 shrink-0 overflow-hidden rounded-t-full rounded-b-xl ring-1 ring-black/5"><CreatorFigure creator={c} label="" /></span>
        <h1 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-bold leading-[1] tracking-[-0.04em] text-ink">Your session with <em className="font-serif font-normal italic text-brand-600">{c.name.split(" ")[0]}</em></h1>
      </div>

      {/* Journey: profile → service & time → details → simulated payment → confirmation */}
      <div className="mt-6"><JourneySteps label="Booking progress" current={step + 1} steps={["Creator", ...STEPS, "Confirmation"]} /></div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          {step === 0 && (
            <>
              <Card className="p-5 sm:p-6">
                <h2 className="text-base font-semibold text-ink">1. Choose a service</h2>
                <div className="mt-4 space-y-2.5">
                  {services.map((s) => (
                    <label key={s.id} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition", s.id === service.id ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-100" : "border-line hover:border-[#D5D9E4]")}>
                      <input type="radio" name="service" className="mt-1 accent-[#6558E8]" checked={s.id === service.id} onChange={() => { setServiceId(s.id); }} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium text-ink">{s.title}</span>
                          <span className="font-semibold text-ink">{formatINR(s.price)}</span>
                        </span>
                        <span className="mt-0.5 block text-[13px] text-ink-muted">{s.description}</span>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-subtle"><Clock className="h-3.5 w-3.5" />{s.durationMins} minutes · video call</span>
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <h2 className="mb-4 text-base font-semibold text-ink">2. Pick a date and time</h2>
                <SlotPicker creator={c} date={date} time={time} isTaken={(d, t) => isSlotTaken(c.id, d, t)} onChange={(d, t) => { setDate(d); setTime(t); setErrors({}); }} />
                {errors.slot && <p className="mt-3 text-xs font-medium text-red-600" role="alert">{errors.slot}</p>}
              </Card>
            </>
          )}

          {step === 1 && (
            <Card className="p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink">Your details</h2>
              <p className="mt-0.5 text-[13px] text-ink-muted">{c.name.split(" ")[0]} will see this information when reviewing your request.</p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name" required error={errors.name}><Input id="name" value={form.name} onChange={set("name")} invalid={!!errors.name} autoComplete="name" /></Field>
                <Field label="Email" htmlFor="email" required error={errors.email}><Input id="email" type="email" value={form.email} onChange={set("email")} invalid={!!errors.email} autoComplete="email" /></Field>
                <Field label="Mobile number" htmlFor="phone" required error={errors.phone} hint="For session reminders" className="sm:col-span-2"><Input id="phone" value={form.phone} onChange={set("phone")} invalid={!!errors.phone} placeholder="+91 98765 43210" autoComplete="tel" /></Field>
                <Field label="What would you like to discuss?" htmlFor="topic" required error={errors.topic} className="sm:col-span-2">
                  <Input id="topic" value={form.topic} onChange={set("topic")} invalid={!!errors.topic} placeholder="e.g. Pricing strategy for our launch on quick-commerce" maxLength={120} />
                </Field>
                <Field label="Context for the creator" htmlFor="notes" hint="Optional — links, stage, what you've tried so far" className="sm:col-span-2">
                  <Textarea id="notes" value={form.notes} onChange={set("notes")} maxLength={1000} />
                </Field>
              </div>
              <label className="mt-5 flex items-start gap-2.5 text-[13px] text-ink-muted">
                <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-0.5 h-4 w-4 accent-[#6558E8]" />
                <span>I agree to the booking terms: the creator may accept or decline; declined requests are refunded in full, and sessions can be cancelled free of charge up to 24 hours before.</span>
              </label>
              {errors.agree && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.agree}</p>}
            </Card>
          )}

          {step === 2 && (
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-ink">Review & pay</h2>
                <SimulatedTag label="Simulated payment" />
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <Info label="Creator" value={c.name} />
                <Info label="Service" value={`${service.title} · ${service.durationMins} min`} />
                <Info label="Date & time" value={`${formatDate(date!, { weekday: "long", day: "numeric", month: "long" })}, ${formatTime(time!)} IST`} />
                <Info label="Booked by" value={`${form.name} · ${form.email}`} />
                <Info label="Topic" value={form.topic} className="sm:col-span-2" />
              </dl>
              <div className="mt-6 rounded-xl border border-line p-4 text-[13px] text-ink-muted">
                <p className="flex items-center gap-2 font-medium text-ink"><ShieldCheck className="h-4 w-4 text-teal-500" />What happens next</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Your payment is recorded and the request is sent to {c.name.split(" ")[0]}.</li>
                  <li>The creator confirms or declines (declines are refunded in full).</li>
                  <li>You receive a video-call link once confirmed. <span className="text-ink-subtle">(Video SDK — later phase)</span></li>
                </ol>
              </div>
            </Card>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button> : <span />}
            {step < 2 ? (
              <Button size="lg" onClick={next}>Continue</Button>
            ) : (
              <Button size="lg" onClick={() => setPayOpen(true)}>Proceed to pay {formatINR(service.price)}</Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-24 space-y-4">
            <Ticket top={
              <div className="flex items-center gap-3">
                <span className="h-14 w-12 shrink-0 overflow-hidden rounded-t-full rounded-b-lg"><CreatorFigure creator={c} label="" /></span>
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-subtle">RTG Connect · session</p>
                  <p className="font-display text-lg font-bold text-ink">{service.title}</p>
                  <p className="truncate text-xs text-ink-muted">with {c.name} · {service.durationMins} min · video call</p>
                </div>
              </div>
            }>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div><p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle">Date</p><p className="mt-0.5 font-semibold text-ink">{date ? formatDate(date, { weekday: "short", day: "numeric", month: "short" }) : "—"}</p></div>
                <div><p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle">Time (IST)</p><p className="mt-0.5 font-semibold text-ink">{time ? formatTime(time) : "—"}</p></div>
              </div>
              {source === "creator" && <p className="mt-3 flex items-center gap-2 text-[13px] text-teal-700"><Link2 className="h-4 w-4" />Booked via creator&apos;s personal link</p>}
              <div className="mt-4 border-t border-line pt-4">
                <FeeBreakdown amount={service.price} rate={rate} platformFee={platformFee} creatorEarning={creatorEarning} label={source === "creator" ? "Creator-originated booking" : "Marketplace booking"} />
              </div>
            </Ticket>
          </div>
        </aside>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={service.price}
        description={`${service.title} with ${c.name}`}
        onSuccess={(r) => onPaid(r.paymentId)}
      />
    </Container>
  );
}

function Info({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
