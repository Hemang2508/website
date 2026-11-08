import type { Booking, BookingSource, BookingStatus, DemoUser, Notification, Pitch, PitchRequest, Review } from "../types";
import { seedCreators } from "./creators";
import { bookingRate, COMMISSION, splitAmount } from "../pricing";
import { addDays, toISODate } from "../utils";

export const DEMO_USER: DemoUser = {
  name: "Aarav Mehta",
  email: "aarav@koshanaturals.in",
  phone: "+91 98480 22117",
  title: "Founder, Kosha Naturals",
};

const reviewPool: { author: string; role: string; text: string; rating: number }[] = [
  { author: "Rhea S.", role: "Founder, early-stage D2C", rating: 5, text: "Incredibly practical. In 30 minutes we rewrote our positioning and I left with three experiments to run this week." },
  { author: "Mohit A.", role: "Product Manager", rating: 5, text: "Came prepared, asked sharp questions and was honest about what wasn't working. Worth every rupee." },
  { author: "Kavya P.", role: "MBA student", rating: 5, text: "Generous with time and examples. The follow-up notes were a great touch." },
  { author: "Sameer J.", role: "Co-founder, SaaS start-up", rating: 4, text: "Very useful perspective on pricing. Would have liked a little more time on distribution, so I've booked again." },
  { author: "Divya R.", role: "Brand Manager", rating: 5, text: "Clear frameworks and real stories from experience — not generic advice you can find online." },
  { author: "Imran K.", role: "Founder, F&B brand", rating: 5, text: "Helped me see my product the way a customer would. Changed our packaging decision completely." },
  { author: "Neha G.", role: "Marketing Lead", rating: 4, text: "Solid, structured session. The written summary afterwards made it easy to share with my team." },
  { author: "Ankit V.", role: "Software Engineer", rating: 5, text: "Exactly the candid feedback I needed before my interviews. Landed the offer two weeks later." },
];

function seedReviews(): Review[] {
  const out: Review[] = [];
  seedCreators.forEach((c, ci) => {
    for (let i = 0; i < 4; i++) {
      const r = reviewPool[(ci * 3 + i) % reviewPool.length];
      out.push({
        id: `r_${c.id}_${i}`,
        creatorId: c.id,
        author: r.author,
        role: r.role,
        rating: r.rating,
        text: r.text,
        date: toISODate(addDays(new Date(), -(i * 9 + ci + 3))),
      });
    }
  });
  return out;
}

const otherUsers = [
  { name: "Riya Sharma", email: "riya.sharma@gmail.com", phone: "+91 98110 44321" },
  { name: "Kunal Bose", email: "kunal@brewbox.co", phone: "+91 90040 11872" },
  { name: "Sneha Pillai", email: "sneha.pillai@outlook.com", phone: "+91 99620 55310" },
  { name: "Aditya Joshi", email: "aditya@finlyapp.in", phone: "+91 97300 67214" },
  { name: "Pooja Reddy", email: "pooja.reddy@gmail.com", phone: "+91 98490 33102" },
  { name: "Harsh Vardhan", email: "harsh@loomcraft.in", phone: "+91 88800 12093" },
];

let bookingCounter = 1000;
function mkBooking(opts: {
  creatorId: string;
  serviceId: string;
  dayOffset: number;
  time: string;
  status: BookingStatus;
  source?: BookingSource;
  user?: { name: string; email: string; phone: string };
  demo?: boolean;
  topic: string;
  reviewed?: boolean;
}): Booking {
  const c = seedCreators.find((x) => x.id === opts.creatorId)!;
  const s = c.services.find((x) => x.id === opts.serviceId)!;
  const source = opts.source ?? "marketplace";
  const rate = bookingRate(source);
  const { platformFee, creatorEarning } = splitAmount(s.price, rate);
  const user = opts.demo ? DEMO_USER : opts.user ?? otherUsers[0];
  const date = toISODate(addDays(new Date(), opts.dayOffset));
  bookingCounter++;
  return {
    id: `BK-${bookingCounter}`,
    creatorId: c.id,
    serviceId: s.id,
    serviceTitle: s.title,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    topic: opts.topic,
    notes: "",
    date,
    time: opts.time,
    durationMins: s.durationMins,
    amount: s.price,
    source,
    commissionRate: rate,
    platformFee,
    creatorEarning,
    status: opts.status,
    paymentId: `sim_pay_seed${bookingCounter}`,
    paymentStatus: opts.status === "declined" || opts.status === "cancelled" ? "refunded_simulated" : "paid_simulated",
    createdAt: addDays(new Date(), Math.min(opts.dayOffset, 0) - 3).toISOString(),
    reviewed: opts.reviewed,
    isDemoUser: opts.demo,
  };
}

function seedBookings(): Booking[] {
  bookingCounter = 1000;
  const u = otherUsers;
  return [
    // Demo user's own bookings
    mkBooking({ creatorId: "c1", serviceId: "s2", dayOffset: 3, time: "11:00", status: "confirmed", demo: true, topic: "Launch plan for our new face oil range" }),
    mkBooking({ creatorId: "c2", serviceId: "s2", dayOffset: -6, time: "19:00", status: "completed", demo: true, topic: "Seed round pitch deck review" }),
    mkBooking({ creatorId: "c9", serviceId: "s1", dayOffset: 5, time: "12:00", status: "pending", demo: true, topic: "Hiring a marketing lead — JD and interview loop" }),
    mkBooking({ creatorId: "c4", serviceId: "s1", dayOffset: -18, time: "13:00", status: "completed", demo: true, topic: "Meta ads audit", reviewed: true }),

    // Ananya (c1) — the default creator account
    mkBooking({ creatorId: "c1", serviceId: "s1", dayOffset: 1, time: "16:00", status: "pending", user: u[0], topic: "Should we launch on quick-commerce first?" }),
    mkBooking({ creatorId: "c1", serviceId: "s3", dayOffset: 2, time: "10:00", status: "pending", user: u[5], source: "creator", topic: "Monthly mentorship for handloom brand" }),
    mkBooking({ creatorId: "c1", serviceId: "s2", dayOffset: 6, time: "17:00", status: "confirmed", user: u[2], topic: "Positioning for a premium tea brand" }),
    mkBooking({ creatorId: "c1", serviceId: "s1", dayOffset: -2, time: "10:00", status: "completed", user: u[3], topic: "Pricing tiers for subscription box" }),
    mkBooking({ creatorId: "c1", serviceId: "s2", dayOffset: -9, time: "11:00", status: "completed", user: u[4], source: "creator", topic: "Retail distribution strategy" }),
    mkBooking({ creatorId: "c1", serviceId: "s3", dayOffset: -15, time: "16:00", status: "completed", user: u[1], topic: "Founder mentorship – October" }),
    mkBooking({ creatorId: "c1", serviceId: "s1", dayOffset: -21, time: "11:00", status: "completed", user: u[0], source: "creator", topic: "Influencer vs performance budget split" }),
    mkBooking({ creatorId: "c1", serviceId: "s2", dayOffset: -27, time: "17:00", status: "completed", user: u[2], topic: "GTM for skincare launch" }),
    mkBooking({ creatorId: "c1", serviceId: "s1", dayOffset: -4, time: "16:00", status: "declined", user: u[1], topic: "Franchise model question" }),

    // Others (platform-level activity for admin)
    mkBooking({ creatorId: "c2", serviceId: "s1", dayOffset: -3, time: "20:00", status: "completed", user: u[3], topic: "Roadmap prioritisation" }),
    mkBooking({ creatorId: "c3", serviceId: "s1", dayOffset: -5, time: "15:00", status: "completed", user: u[0], source: "creator", topic: "Creator campaign brief" }),
    mkBooking({ creatorId: "c4", serviceId: "s2", dayOffset: -1, time: "09:00", status: "completed", user: u[4], topic: "Google ads budget" }),
    mkBooking({ creatorId: "c5", serviceId: "s1", dayOffset: 4, time: "18:00", status: "confirmed", user: u[3], topic: "Model review before seed round" }),
    mkBooking({ creatorId: "c7", serviceId: "s1", dayOffset: -7, time: "12:00", status: "completed", user: u[5], topic: "Onboarding flow teardown" }),
    mkBooking({ creatorId: "c8", serviceId: "s1", dayOffset: -12, time: "20:00", status: "completed", user: u[1], topic: "Hiring first engineers" }),
    mkBooking({ creatorId: "c9", serviceId: "s2", dayOffset: -2, time: "19:00", status: "completed", user: u[2], source: "creator", topic: "PM mock interview" }),
    mkBooking({ creatorId: "c9", serviceId: "s3", dayOffset: -10, time: "08:00", status: "completed", user: u[4], topic: "Offer negotiation" }),
    mkBooking({ creatorId: "c12", serviceId: "s2", dayOffset: -8, time: "17:00", status: "completed", user: u[0], topic: "Protein bar claims review" }),
    mkBooking({ creatorId: "c6", serviceId: "s1", dayOffset: 2, time: "14:00", status: "confirmed", user: u[5], topic: "Earbuds launch feedback" }),
  ];
}

function mkRequest(id: string, pitchId: string, creatorId: string, status: PitchRequest["status"], daysAgo: number, extra: Partial<PitchRequest> = {}): PitchRequest {
  const c = seedCreators.find((x) => x.id === creatorId)!;
  const fee = c.services.find((s) => s.type === "pitch")?.price ?? 0;
  const { platformFee, creatorEarning } = splitAmount(fee, COMMISSION.pitch);
  return {
    id,
    pitchId,
    creatorId,
    fee,
    commissionRate: COMMISSION.pitch,
    platformFee,
    creatorEarning,
    status,
    sentAt: addDays(new Date(), -daysAgo).toISOString(),
    paymentId: `sim_pay_${id}`,
    ...extra,
  };
}

function seedPitches(): { pitches: Pitch[]; requests: PitchRequest[] } {
  const pitches: Pitch[] = [
    {
      id: "PT-201",
      productName: "Kosha Botanical Face Oil",
      company: "Kosha Naturals",
      tagline: "Cold-pressed kumkumadi face oil in a 15 ml travel format",
      description: "An Ayurvedic face oil built on a 16-herb kumkumadi formula, cold-pressed in small batches in Kerala. We are launching a 15 ml travel size at ₹649 for first-time buyers and want feedback on pricing, packaging and whether the story resonates with urban 25–35 year olds.",
      category: "Beauty & Personal Care",
      stage: "Launched",
      priceRange: "₹649 – ₹1,299",
      website: "koshanaturals.in",
      targetAudience: ["Young professionals", "Premium buyers"],
      goals: ["Product feedback", "Pricing validation", "Packaging & design review"],
      images: [],
      submittedBy: DEMO_USER.name,
      createdAt: addDays(new Date(), -12).toISOString(),
      isDemoUser: true,
    },
    {
      id: "PT-202",
      productName: "BrewBox Cold Brew Cans",
      company: "BrewBox Coffee Co.",
      tagline: "Single-origin cold brew in 200 ml cans, sugar-free",
      description: "Ready-to-drink cold brew made from Chikmagalur estate beans. Sold through quick-commerce in Bengaluru and Hyderabad at ₹120 per can. Looking for honest feedback on taste positioning versus energy drinks and potential creator collaborations.",
      category: "Food & Beverage",
      stage: "Launched",
      priceRange: "₹120 per can",
      website: "brewbox.co",
      targetAudience: ["Gen Z (18–24)", "Young professionals"],
      goals: ["Audience fit check", "Future collaboration"],
      images: [],
      submittedBy: "Kunal Bose",
      createdAt: addDays(new Date(), -3).toISOString(),
    },
    {
      id: "PT-203",
      productName: "Finly – Expense Splitting for Flatmates",
      company: "Finly Technologies",
      tagline: "Split rent, bills and groceries with UPI auto-settlement",
      description: "A mobile app that tracks shared expenses for flatmates and settles balances via UPI. 4,000 beta users in Pune. We want feedback on onboarding, trust signals and pricing for a premium tier.",
      category: "Fintech",
      stage: "Prototype",
      priceRange: "Free / ₹49 per month premium",
      website: "finlyapp.in",
      targetAudience: ["Students", "Young professionals"],
      goals: ["Product feedback", "Pricing validation"],
      images: [],
      submittedBy: "Aditya Joshi",
      createdAt: addDays(new Date(), -8).toISOString(),
    },
  ];

  const requests: PitchRequest[] = [
    mkRequest("PR-301", "PT-201", "c1", "feedback_submitted", 11, {
      respondedAt: addDays(new Date(), -10).toISOString(),
      feedback: {
        scores: { problemClarity: 4, valueProposition: 4, productDesign: 5, pricing: 3, marketFit: 4 },
        strengths: "Beautiful, credible packaging. The Kerala small-batch story is distinctive and the 15 ml trial size lowers the barrier for first-time buyers.",
        improvements: "₹649 for 15 ml reads expensive without a clear ‘visible results in 14 days’ promise. Consider a ₹399 intro price or a bundle with a cleanser. Lead with one hero benefit instead of listing all 16 herbs.",
        audienceFit: "Strong fit for urban women 25–35 already using serums. Weaker for first-time Ayurveda buyers who need more education.",
        recommendation: "iterate",
        collaborationInterest: true,
        submittedAt: addDays(new Date(), -7).toISOString(),
      },
    }),
    mkRequest("PR-302", "PT-201", "c3", "pending", 2),
    mkRequest("PR-303", "PT-201", "c11", "declined", 9, {
      respondedAt: addDays(new Date(), -8).toISOString(),
      declineReason: "Skincare sits outside my current content focus. Meera Krishnan or Ananya Rao would be a better fit.",
    }),
    mkRequest("PR-304", "PT-202", "c1", "pending", 1),
    mkRequest("PR-305", "PT-202", "c10", "accepted", 3, { respondedAt: addDays(new Date(), -2).toISOString() }),
    mkRequest("PR-306", "PT-203", "c2", "feedback_submitted", 8, {
      respondedAt: addDays(new Date(), -7).toISOString(),
      feedback: {
        scores: { problemClarity: 5, valueProposition: 4, productDesign: 3, pricing: 3, marketFit: 4 },
        strengths: "Real, frequent pain point with a clear wedge (UPI settlement).",
        improvements: "Onboarding asks for too much before showing value. Premium tier needs one killer feature.",
        audienceFit: "Strong among students and first-jobbers in metros.",
        recommendation: "iterate",
        collaborationInterest: false,
        submittedAt: addDays(new Date(), -5).toISOString(),
      },
    }),
    mkRequest("PR-307", "PT-203", "c6", "accepted", 6, { respondedAt: addDays(new Date(), -5).toISOString() }),
  ];

  return { pitches, requests };
}

function seedNotifications(): Notification[] {
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600_000).toISOString();
  return [
    { id: "n1", role: "user", title: "Booking confirmed", body: "Ananya Rao confirmed your Go-to-market deep dive.", href: "/dashboard", createdAt: ago(5), read: false, kind: "booking" },
    { id: "n2", role: "user", title: "Pitch feedback received", body: "Ananya Rao submitted feedback on Kosha Botanical Face Oil.", href: "/pitch/PT-201", createdAt: ago(30), read: false, kind: "pitch" },
    { id: "n3", role: "user", title: "Rate your session", body: "How was your pitch deck teardown with Vikram Sethi?", href: "/dashboard", createdAt: ago(60), read: true, kind: "review" },
    { id: "n4", role: "creator", creatorId: "c1", title: "New booking request", body: "Riya Sharma requested a Quick strategy call.", href: "/creator?tab=bookings", createdAt: ago(2), read: false, kind: "booking" },
    { id: "n5", role: "creator", creatorId: "c1", title: "New pitch request", body: "BrewBox Coffee Co. sent you a product pitch.", href: "/creator?tab=pitches", createdAt: ago(20), read: false, kind: "pitch" },
    { id: "n6", role: "creator", creatorId: "c1", title: "Payout processed (simulated)", body: "₹14,218 was marked as paid out to your bank account.", href: "/creator?tab=earnings", createdAt: ago(72), read: true, kind: "payment" },
    { id: "n7", role: "admin", title: "Creator awaiting verification", body: "Siddharth Rao submitted a creator application.", href: "/admin?tab=creators", createdAt: ago(10), read: false, kind: "system" },
    { id: "n8", role: "admin", title: "Refund issued (simulated)", body: "BK-1013 was declined and refunded automatically.", href: "/admin?tab=transactions", createdAt: ago(96), read: true, kind: "payment" },
  ];
}

export function createSeed() {
  const { pitches, requests } = seedPitches();
  return {
    creators: structuredClone(seedCreators),
    bookings: seedBookings(),
    reviews: seedReviews(),
    pitches,
    pitchRequests: requests,
    notifications: seedNotifications(),
  };
}
