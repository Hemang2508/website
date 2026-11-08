export type Role = "user" | "creator" | "admin";

export type CreatorCategory =
  | "Business & Startups"
  | "Marketing & Growth"
  | "Technology"
  | "Design & Product"
  | "Finance & Investing"
  | "Content & Creator Economy"
  | "Career & Education"
  | "Lifestyle & Wellness";

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
  kind: "booking" | "pitch" | "payment" | "review" | "system";
}

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
  title: string;
}
