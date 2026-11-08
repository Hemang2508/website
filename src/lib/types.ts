export type Role = "user" | "creator" | "admin";

export type CreatorCategory =
  | "Business & Startups"
  | "Marketing & Growth"
  | "Technology"
  | "Design & Product"
  | "Finance & Investing"
  | "Content & Creator Economy"
  | "Career & Education"
  | "Lifestyle & Wellness"
  | "Food & Travel"
  | "Gaming & Entertainment";

export type ServiceType = "call" | "review" | "mentorship" | "pitch";

export interface Service {
  id: string;
  type: ServiceType;
  title: string;
  description: string;
  durationMins: number; // 0 for async (e.g. pitch review)
  price: number; // INR
  active: boolean;
}

/** Weekly availability: weekday index (0 = Sun) → list of "HH:MM" start times */
export type WeeklyAvailability = Record<number, string[]>;

export interface Creator {
  id: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  category: CreatorCategory;
  tags: string[];
  location: string;
  languages: string[];
  followers: number; // social audience
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  responseTime: string;
  verified: boolean;
  status: "active" | "suspended" | "pending";
  avatarHue: number; // used to tint generated avatar
  initials: string;
  photo?: string; // optional real photo URL (Supabase storage in production)
  joined: string; // ISO date
  services: Service[];
  availability: WeeklyAvailability;
  acceptsPitches: boolean;
  pitchCategories: string[];
  socials: { platform: "LinkedIn" | "Instagram" | "YouTube" | "X"; handle: string }[];
  featured?: boolean;
  /** Creator Passport extras (demo data) */
  portfolio?: PortfolioItem[];
  collaborationsCompleted?: number;
}

export interface PortfolioItem {
  title: string;
  kind: "Campaign" | "Video" | "Article" | "Workshop" | "Venture" | "Talk";
  org: string;
  year: number;
  metric?: string;
}

export type BookingSource = "marketplace" | "creator";

export type BookingStatus = "pending" | "confirmed" | "completed" | "declined" | "cancelled";

export interface Booking {
  id: string;
  creatorId: string;
  serviceId: string;
  serviceTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  topic: string;
  notes: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMins: number;
  amount: number;
  source: BookingSource;
  commissionRate: number;
  platformFee: number;
  creatorEarning: number;
  status: BookingStatus;
  paymentId: string;
  paymentStatus: "paid_simulated" | "refunded_simulated";
  createdAt: string;
  reviewed?: boolean;
  isDemoUser?: boolean; // true if the booking belongs to the demo "user" account
  /** Creator Duo bookings: lead creator is creatorId, partner shares the session and earnings 50/50 */
  duoId?: string;
  partnerCreatorId?: string;
}

export interface Review {
  id: string;
  creatorId: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  bookingId?: string;
}

export type PitchRequestStatus = "pending" | "accepted" | "declined" | "feedback_submitted";

export interface PitchFeedback {
  scores: {
    problemClarity: number;
    valueProposition: number;
    productDesign: number;
    pricing: number;
    marketFit: number;
  };
  strengths: string;
  improvements: string;
  audienceFit: string;
  recommendation: "promote" | "iterate" | "not_ready";
  collaborationInterest: boolean;
  submittedAt: string;
}

export interface PitchRequest {
  id: string;
  pitchId: string;
  creatorId: string;
  fee: number;
  commissionRate: number;
  platformFee: number;
  creatorEarning: number;
  status: PitchRequestStatus;
  sentAt: string;
  respondedAt?: string;
  declineReason?: string;
  feedback?: PitchFeedback;
  paymentId: string;
}

export interface Pitch {
  id: string;
  productName: string;
  company: string;
  tagline: string;
  description: string;
  category: string;
  stage: "Idea" | "Prototype" | "Launched" | "Scaling";
  priceRange: string;
  website: string;
  targetAudience: string[];
  goals: string[];
  images: string[]; // data URLs (demo) / storage URLs (production)
  submittedBy: string;
  createdAt: string;
  isDemoUser?: boolean;
}

export interface Notification {
  id: string;
  role: Role;
  creatorId?: string; // for creator-role notifications
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
  kind: "booking" | "pitch" | "payment" | "review" | "system" | "community" | "event" | "collab";
}

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
  title: string;
}

/* ───────────── Ecosystem modules ───────────── */

export interface Community {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "Food" | "Career" | "Travel" | "Gaming" | "Startups";
  city: string; // "All India" or a city
  hue: number;
  icon: "food" | "career" | "travel" | "gaming" | "startup";
  baseMembers: number; // demo figure
  hostCreatorIds: string[];
  tags: string[];
  guidelines: string[];
  posts: { author: string; role: string; text: string; ago: string; replies: number }[];
  createdAt: string;
}

export type EventType = "Creator meetup" | "Coffee with Creators" | "Food walk" | "Startup networking" | "Creator workshop";

export interface RegionalEvent {
  id: string;
  title: string;
  type: EventType;
  city: string;
  area: string; // neighbourhood only — exact venue shared after registration
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMins: number;
  price: number; // 0 = free
  capacity: number;
  baseRegistered: number; // demo figure
  creatorIds: string[];
  communityId?: string;
  description: string;
  agenda: string[];
  hue: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  viewer: string; // viewer key: "user" | "admin" | creatorId
  name: string;
  paymentId?: string;
  createdAt: string;
}

export interface CreatorDuo {
  id: string;
  slug: string;
  title: string;
  pairing: "Food + Travel" | "Finance + Career" | "Fitness + Lifestyle" | "Gaming + Entertainment";
  creatorIds: [string, string];
  description: string;
  includes: string[];
  format: "Online" | "In person · Hyderabad";
  durationMins: number;
  price: number;
  maxGuests: number;
  availability: WeeklyAvailability;
  hue: number;
}

export type CollabStatus = "open" | "in_progress" | "closed";
export type ApplicationStatus = "submitted" | "shortlisted" | "accepted" | "declined" | "withdrawn";

export interface Collaboration {
  id: string;
  brand: string;
  brandHue: number;
  ownedByDemoUser?: boolean;
  title: string;
  summary: string;
  description: string;
  category: string;
  campaignType: "Product launch" | "Brand awareness" | "Event partnership" | "Content series" | "Store launch";
  compensation: "Paid" | "Paid + product" | "Product only";
  budgetMin: number;
  budgetMax: number;
  cities: string[];
  minFollowers: number;
  slots: number;
  requirements: string[];
  deliverables: string[];
  deadline: string; // YYYY-MM-DD application deadline
  status: CollabStatus;
  baseApplicants: number; // demo figure
  createdAt: string;
}

export interface CollabApplication {
  id: string;
  collabId: string;
  creatorId: string;
  message: string;
  proposedFee: number;
  portfolioLink: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  brandNote?: string;
}
