"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { bookingRate, splitAmount } from "@/lib/pricing";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Container } from "@/components/ui/Misc";
import { SimulatedTag } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Visual";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { FeeBreakdown } from "@/components/booking/FeeBreakdown";
import { JourneySteps } from "@/components/booking/JourneySteps";
import { formatDate, formatINR, formatTime, isEmail, isIndianPhone } from "@/lib/utils";

export default function DuoBookPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { duos, creators, isDuoSlotTaken, createDuoBooking, demoUser, role, toast, hydrated } = useStore();
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: role === "user" ? demoUser.name : "", email: role === "user" ? demoUser.email : "", phone: role === "user" ? demoUser.phone : "", topic: "", notes: "", agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payOpen, setPayOpen] = useState(false);
  const duo = duos.find((d) => d.slug === slug);
  if (!duo) {
    if (!hydrated) return <PageSkeleton />;
    notFound();
  }
  const [a, b] = duo.creatorIds.map((id) => creators.find((c) => c.id === id)!);
  const rate = bookingRate("marketplace");
  const { platformFee, creatorEarning } = splitAmount(duo.price, rate);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!date || !time) e.slot = "Select a date and time";
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!isEmail(form.email)) e.email = "Enter a valid email address";
    if (!isIndianPhone(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (form.topic.trim().length < 10) e.topic = "Tell the creators what you'd like (at least 10 characters)";
    if (!form.agree) e.agree = "Please accept the booking terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const set = (k: keyof typeof form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: ev.target.type === "checkbox" ? (ev.target as HTMLInputElement).checked : ev.target.value }));

  return (
    <Container className="py-8 sm:py-10">
      <Link href={`/duos/${duo.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to {duo.title}</Link>
      <h1 className="mt-3 font-display text-display-md text-ink">Request a Creator Duo booking</h1>
      <div className="mt-6"><JourneySteps label="Duo booking progress" current={date && time ? 2 : 1} steps={["Duo", "Joint time slot", "Your details", "Payment", "Confirmation"]} /></div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">1. Pick a joint time slot</h2>
            <SlotPicker creator={duo} date={date} time={time} isTaken={(d, t) => isDuoSlotTaken(duo, d, t)} onChange={(d, t) => { setDate(d); setTime(t); setErrors((e) => ({ ...e, slot: "" })); }} />
            {errors.slot && <p className="mt-3 text-xs font-medium text-red-600">{errors.slot}</p>}
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink">2. Your details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="dn" required error={errors.name}><Input id="dn" value={form.name} onChange={set("name")} invalid={!!errors.name} /></Field>
              <Field label="Email" htmlFor="de" required error={errors.email}><Input id="de" type="email" value={form.email} onChange={set("email")} invalid={!!errors.email} /></Field>
              <Field label="Mobile number" htmlFor="dp" required error={errors.phone} className="sm:col-span-2"><Input id="dp" value={form.phone} onChange={set("phone")} invalid={!!errors.phone} /></Field>
              <Field label="What would you like from this experience?" htmlFor="dt" required error={errors.topic} className="sm:col-span-2"><Input id="dt" value={form.topic} onChange={set("topic")} invalid={!!errors.topic} placeholder={`e.g. ${duo.pairing === "Food + Travel" ? "Food trail for visiting parents, 3 guests" : "Planning my first salary and savings"}`} /></Field>
              <Field label="Notes for both creators" htmlFor="dno" hint={`Optional · up to ${duo.maxGuests} guest${duo.maxGuests > 1 ? "s" : ""}`} className="sm:col-span-2"><Textarea id="dno" value={form.notes} onChange={set("notes")} /></Field>
            </div>
            <label className="mt-5 flex items-start gap-2.5 text-[13px] text-ink-muted">
              <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-0.5 h-4 w-4 accent-[#6558E8]" />
              <span>I understand either creator may confirm or decline this request, and declined requests are refunded in full (simulated).</span>
            </label>
            {errors.agree && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.agree}</p>}
          </Card>
          <div className="flex justify-end">
            <Button size="lg" onClick={() => validate() && setPayOpen(true)}>Continue to pay {formatINR(duo.price)}</Button>
          </div>
        </div>
        <aside>
          <Card className="sticky top-24 p-5">
            <div className="flex items-center gap-3">
              <div className="flex"><Avatar creator={a} size="md" ring /><Avatar creator={b} size="md" ring className="-ml-3" /></div>
              <div className="min-w-0"><p className="font-semibold text-ink">{duo.title}</p><p className="truncate text-xs text-ink-muted">{a.name} & {b.name}</p></div>
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink-muted">
              <p className="flex items-center gap-2"><Users className="h-4 w-4" />{duo.format} · {duo.durationMins} min</p>
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{date && time ? `${formatDate(date, { weekday: "short", day: "numeric", month: "short" })}, ${formatTime(time)}` : "Select a time"}</p>
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <FeeBreakdown amount={duo.price} rate={rate} platformFee={platformFee} creatorEarning={creatorEarning} label="Creator Duo booking · creators split earnings 50/50" />
            </div>
            <p className="mt-3 flex items-center gap-2 text-[11px] text-ink-subtle"><SimulatedTag />No real payment is taken</p>
          </Card>
        </aside>
      </div>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} amount={duo.price} description={`${duo.title} · ${a.name} & ${b.name}`}
        onSuccess={(r) => {
          if (date && time && isDuoSlotTaken(duo, date, time)) { setPayOpen(false); toast({ title: "That slot was just taken", tone: "error" }); setTime(null); return; }
          const bk = createDuoBooking({ duoId: duo.id, date: date!, time: time!, topic: form.topic.trim(), notes: form.notes.trim(), userName: form.name.trim(), userEmail: form.email.trim(), userPhone: form.phone.trim(), paymentId: r.paymentId });
          setPayOpen(false);
          router.push(`/bookings/${bk.id}?new=1`);
        }} />
    </Container>
  );
}
