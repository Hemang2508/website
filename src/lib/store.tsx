"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  ApplicationStatus, Booking, BookingSource, BookingStatus, CollabApplication, Collaboration, CollabStatus, Community, Creator, CreatorDuo,
  EventRegistration, Notification, Pitch, PitchFeedback, PitchRequest, RegionalEvent, Review, Role, Service,
} from "./types";
import { createSeed, DEMO_USER } from "./data/seed";
import { bookingRate, COMMISSION, splitAmount } from "./pricing";
import { toISODate, uid } from "./utils";

// v2 adds the ecosystem modules (Passport, Community, Regional, Duos, Collaborate)
const STORAGE_KEY = "rtg-live-demo-v2";

interface DataState {
  role: Role;
  activeCreatorId: string;
  creators: Creator[];
  bookings: Booking[];
  reviews: Review[];
  pitches: Pitch[];
  pitchRequests: PitchRequest[];
  notifications: Notification[];
  city: string;
  communities: Community[];
  events: RegionalEvent[];
  duos: CreatorDuo[];
  collaborations: Collaboration[];
  applications: CollabApplication[];
  memberships: Record<string, string[]>; // viewer key → community ids
  registrations: EventRegistration[];
}

export interface Toast {
  id: string;
  title: string;
  body?: string;
  tone?: "success" | "info" | "error";
}

export interface NewBookingInput {
  creatorId: string;
  serviceId: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  source: BookingSource;
  paymentId: string;
}

export interface NewDuoBookingInput {
  duoId: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  paymentId: string;
}

export type NewCollabInput = Omit<Collaboration, "id" | "createdAt" | "status" | "baseApplicants" | "ownedByDemoUser" | "brandHue">;

export type NewPitchInput = Omit<Pitch, "id" | "createdAt" | "submittedBy" | "isDemoUser">;

function initialState(): DataState {
  return { role: "user", activeCreatorId: "c1", ...createSeed() };
}

interface StoreValue extends DataState {
  hydrated: boolean;
  demoUser: typeof DEMO_USER;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  setRole: (r: Role) => void;
  setActiveCreator: (id: string) => void;
  getCreator: (idOrSlug: string) => Creator | undefined;
  isSlotTaken: (creatorId: string, date: string, time: string) => boolean;
  createBooking: (input: NewBookingInput) => Booking;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  addReview: (bookingId: string, rating: number, text: string) => void;
  updateCreator: (id: string, patch: Partial<Creator>) => void;
  updateService: (creatorId: string, serviceId: string, patch: Partial<Service>) => void;
  addService: (creatorId: string, service: Omit<Service, "id">) => void;
  createPitch: (input: NewPitchInput) => Pitch;
  sendPitchRequests: (pitchId: string, creatorIds: string[], paymentId: string) => PitchRequest[];
  respondToPitch: (requestId: string, accept: boolean, reason?: string) => void;
  submitPitchFeedback: (requestId: string, feedback: Omit<PitchFeedback, "submittedAt">) => void;
  setCreatorStatus: (id: string, status: Creator["status"]) => void;
  toggleVerified: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  resetDemo: () => void;
  /* ecosystem */
  viewer: string;
  setCity: (city: string) => void;
  isMember: (communityId: string) => boolean;
  memberCount: (c: Community) => number;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  registeredCount: (e: RegionalEvent) => number;
  myRegistration: (eventId: string) => EventRegistration | undefined;
  registerForEvent: (eventId: string, name: string, paymentId?: string) => EventRegistration;
  cancelRegistration: (eventId: string) => void;
  isDuoSlotTaken: (duo: CreatorDuo, date: string, time: string) => boolean;
  createDuoBooking: (input: NewDuoBookingInput) => Booking;
  applyToCollab: (input: Pick<CollabApplication, "collabId" | "creatorId" | "message" | "proposedFee" | "portfolioLink">) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus, note?: string) => void;
  createCollaboration: (input: NewCollabInput) => Collaboration;
  setCollabStatus: (id: string, status: CollabStatus) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load persisted demo data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {
      /* ignore corrupted / blocked storage */
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — demo keeps working in memory */
    }
  }, [state, hydrated]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("t");
    setToasts((xs) => [...xs, { id, tone: "success", ...t }]);
    setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== id)), 4200);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((xs) => xs.filter((x) => x.id !== id)), []);

  const notify = (n: Omit<Notification, "id" | "createdAt" | "read">): Notification => ({
    ...n, id: uid("n"), createdAt: new Date().toISOString(), read: false,
  });

  const getCreator = useCallback(
    (idOrSlug: string) => state.creators.find((c) => c.id === idOrSlug || c.slug === idOrSlug),
    [state.creators],
  );

  const isSlotTaken = useCallback(
    (creatorId: string, date: string, time: string) =>
      state.bookings.some(
        (b) => (b.creatorId === creatorId || b.partnerCreatorId === creatorId) && b.date === date && b.time === time && (b.status === "pending" || b.status === "confirmed"),
      ),
    [state.bookings],
  );

  const createBooking = useCallback((input: NewBookingInput) => {
    const s = stateRef.current;
    const creator = s.creators.find((c) => c.id === input.creatorId)!;
    const service = creator.services.find((x) => x.id === input.serviceId)!;
    const rate = bookingRate(input.source);
    const { platformFee, creatorEarning } = splitAmount(service.price, rate);
    const booking: Booking = {
      id: `BK-${Math.floor(2000 + Math.random() * 7999)}`,
      creatorId: creator.id,
      serviceId: service.id,
      serviceTitle: service.title,
      userName: input.userName,
      userEmail: input.userEmail,
      userPhone: input.userPhone,
      topic: input.topic,
      notes: input.notes,
      date: input.date,
      time: input.time,
      durationMins: service.durationMins,
      amount: service.price,
      source: input.source,
      commissionRate: rate,
      platformFee,
      creatorEarning,
      status: "pending",
      paymentId: input.paymentId,
      paymentStatus: "paid_simulated",
      createdAt: new Date().toISOString(),
      isDemoUser: true,
    };
    setState((st) => ({
      ...st,
      bookings: [booking, ...st.bookings],
      notifications: [
        notify({ role: "user", title: "Payment successful (simulated)", body: `${booking.id} · ${service.title} with ${creator.name} is awaiting confirmation.`, href: `/bookings/${booking.id}`, kind: "payment" }),
        notify({ role: "creator", creatorId: creator.id, title: "New booking request", body: `${input.userName} requested ${service.title}.`, href: "/creator?tab=bookings", kind: "booking" }),
        notify({ role: "admin", title: "New booking", body: `${booking.id} · ₹${service.price.toLocaleString("en-IN")} · ${creator.name}`, href: "/admin?tab=transactions", kind: "payment" }),
        ...st.notifications,
      ],
    }));
    return booking;
  }, []);

  const setBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setState((st) => {
      const b = st.bookings.find((x) => x.id === id);
      if (!b) return st;
      const creator = st.creators.find((c) => c.id === b.creatorId);
      const refunded = status === "declined" || status === "cancelled";
      const msgs: Record<BookingStatus, string> = {
        pending: "is pending",
        confirmed: "was confirmed",
        completed: "was marked as completed",
        declined: "was declined — a simulated refund has been issued",
        cancelled: "was cancelled — a simulated refund has been issued",
      };
      const extra: Notification[] = [];
      if (b.partnerCreatorId && status !== "cancelled") {
        extra.push(notify({ role: "creator", creatorId: b.partnerCreatorId, title: `Duo booking ${status}`, body: `${b.serviceTitle} with ${b.userName} ${msgs[status]}.`, href: "/creator?tab=bookings", kind: "booking" }));
      }
      if (status === "cancelled") {
        extra.push(notify({ role: "creator", creatorId: b.creatorId, title: "Booking cancelled", body: `${b.userName} cancelled ${b.serviceTitle} (${b.id}).`, href: "/creator?tab=bookings", kind: "booking" }));
      } else {
        extra.push(notify({ role: "user", title: `Booking ${status}`, body: `${b.serviceTitle} with ${creator?.name} ${msgs[status]}.`, href: "/dashboard", kind: "booking" }));
      }
      return {
        ...st,
        bookings: st.bookings.map((x) =>
          x.id === id ? { ...x, status, paymentStatus: refunded ? "refunded_simulated" : x.paymentStatus } : x,
        ),
        creators:
          status === "completed"
            ? st.creators.map((c) => (c.id === b.creatorId ? { ...c, sessionsCompleted: c.sessionsCompleted + 1 } : c))
            : st.creators,
        notifications: [...extra, ...st.notifications],
      };
    });
  }, []);

  const addReview = useCallback((bookingId: string, rating: number, text: string) => {
    setState((st) => {
      const b = st.bookings.find((x) => x.id === bookingId);
      if (!b) return st;
      const review: Review = {
        id: uid("r"), creatorId: b.creatorId, author: b.userName, role: DEMO_USER.title, rating, text, date: toISODate(new Date()), bookingId,
      };
      return {
        ...st,
        reviews: [review, ...st.reviews],
        bookings: st.bookings.map((x) => (x.id === bookingId ? { ...x, reviewed: true } : x)),
        creators: st.creators.map((c) => {
          if (c.id !== b.creatorId) return c;
          const count = c.reviewCount + 1;
          return { ...c, reviewCount: count, rating: Math.round(((c.rating * c.reviewCount + rating) / count) * 10) / 10 };
        }).map((c) => {
          if (c.id !== b.partnerCreatorId) return c;
          const count = c.reviewCount + 1;
          return { ...c, reviewCount: count, rating: Math.round(((c.rating * c.reviewCount + rating) / count) * 10) / 10 };
        }),
        notifications: [
          notify({ role: "creator", creatorId: b.creatorId, title: `New ${rating}★ review`, body: `${b.userName}: “${text.slice(0, 70)}${text.length > 70 ? "…" : ""}”`, href: "/creator?tab=overview", kind: "review" }),
          ...st.notifications,
        ],
      };
    });
  }, []);

  const updateCreator = useCallback((id: string, patch: Partial<Creator>) => {
    setState((st) => ({ ...st, creators: st.creators.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }, []);

  const updateService = useCallback((creatorId: string, serviceId: string, patch: Partial<Service>) => {
    setState((st) => ({
      ...st,
      creators: st.creators.map((c) =>
        c.id === creatorId ? { ...c, services: c.services.map((s) => (s.id === serviceId ? { ...s, ...patch } : s)) } : c,
      ),
    }));
  }, []);

  const addService = useCallback((creatorId: string, service: Omit<Service, "id">) => {
    setState((st) => ({
      ...st,
      creators: st.creators.map((c) => (c.id === creatorId ? { ...c, services: [...c.services, { ...service, id: uid("s") }] } : c)),
    }));
  }, []);

  const createPitch = useCallback((input: NewPitchInput) => {
    const pitch: Pitch = {
      ...input,
      id: `PT-${Math.floor(300 + Math.random() * 699)}`,
      createdAt: new Date().toISOString(),
      submittedBy: DEMO_USER.name,
      isDemoUser: true,
    };
    setState((st) => ({ ...st, pitches: [pitch, ...st.pitches] }));
    return pitch;
  }, []);

  const sendPitchRequests = useCallback((pitchId: string, creatorIds: string[], paymentId: string) => {
    const s = stateRef.current;
    const pitch = s.pitches.find((p) => p.id === pitchId);
    const reqs: PitchRequest[] = creatorIds.map((cid) => {
      const c = s.creators.find((x) => x.id === cid)!;
      const fee = c.services.find((x) => x.type === "pitch" && x.active)?.price ?? 0;
      const { platformFee, creatorEarning } = splitAmount(fee, COMMISSION.pitch);
      return {
        id: `PR-${Math.floor(400 + Math.random() * 9599)}`, pitchId, creatorId: cid, fee, commissionRate: COMMISSION.pitch,
        platformFee, creatorEarning, status: "pending", sentAt: new Date().toISOString(), paymentId,
      };
    });
    setState((st) => ({
      ...st,
      pitchRequests: [...reqs, ...st.pitchRequests],
      notifications: [
        ...reqs.map((r) => notify({ role: "creator", creatorId: r.creatorId, title: "New pitch request", body: `${pitch?.company ?? "A brand"} sent you “${pitch?.productName}”.`, href: "/creator?tab=pitches", kind: "pitch" })),
        notify({ role: "user", title: "Pitch sent", body: `“${pitch?.productName}” was sent to ${reqs.length} creator${reqs.length > 1 ? "s" : ""}.`, href: `/pitch/${pitchId}`, kind: "pitch" }),
        ...st.notifications,
      ],
    }));
    return reqs;
  }, []);

  const respondToPitch = useCallback((requestId: string, accept: boolean, reason?: string) => {
    setState((st) => {
      const r = st.pitchRequests.find((x) => x.id === requestId);
      if (!r) return st;
      const c = st.creators.find((x) => x.id === r.creatorId);
      const p = st.pitches.find((x) => x.id === r.pitchId);
      return {
        ...st,
        pitchRequests: st.pitchRequests.map((x) =>
          x.id === requestId
            ? { ...x, status: accept ? "accepted" : "declined", respondedAt: new Date().toISOString(), declineReason: accept ? undefined : reason }
            : x,
        ),
        notifications: [
          notify({
            role: "user",
            title: accept ? "Pitch accepted" : "Pitch declined",
            body: accept ? `${c?.name} accepted “${p?.productName}” and will share feedback.` : `${c?.name} declined “${p?.productName}”. A simulated refund was issued.`,
            href: `/pitch/${r.pitchId}`,
            kind: "pitch",
          }),
          ...st.notifications,
        ],
      };
    });
  }, []);

  const submitPitchFeedback = useCallback((requestId: string, feedback: Omit<PitchFeedback, "submittedAt">) => {
    setState((st) => {
      const r = st.pitchRequests.find((x) => x.id === requestId);
      if (!r) return st;
      const c = st.creators.find((x) => x.id === r.creatorId);
      const p = st.pitches.find((x) => x.id === r.pitchId);
      return {
        ...st,
        pitchRequests: st.pitchRequests.map((x) =>
          x.id === requestId ? { ...x, status: "feedback_submitted", feedback: { ...feedback, submittedAt: new Date().toISOString() } } : x,
        ),
        notifications: [
          notify({ role: "user", title: "Feedback received", body: `${c?.name} submitted structured feedback on “${p?.productName}”.`, href: `/pitch/${r.pitchId}`, kind: "pitch" }),
          ...st.notifications,
        ],
      };
    });
  }, []);

  const setCreatorStatus = useCallback((id: string, status: Creator["status"]) => {
    setState((st) => ({
      ...st,
      creators: st.creators.map((c) => (c.id === id ? { ...c, status, verified: status === "active" && c.status === "pending" ? true : c.verified } : c)),
    }));
  }, []);

  const toggleVerified = useCallback((id: string) => {
    setState((st) => ({ ...st, creators: st.creators.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)) }));
  }, []);

  const belongsToViewer = (n: Notification, st: DataState) =>
    n.role === st.role && (n.role !== "creator" || n.creatorId === st.activeCreatorId);

  const markAllRead = useCallback(() => {
    setState((st) => ({ ...st, notifications: st.notifications.map((n) => (belongsToViewer(n, st) ? { ...n, read: true } : n)) }));
  }, []);
  const markRead = useCallback((id: string) => {
    setState((st) => ({ ...st, notifications: st.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  }, []);

  /* ───────────── Ecosystem actions ───────────── */
  const viewer = state.role === "creator" ? state.activeCreatorId : state.role;
  const viewerOf = (st: DataState) => (st.role === "creator" ? st.activeCreatorId : st.role);

  const isMember = useCallback((id: string) => (state.memberships[viewer] ?? []).includes(id), [state.memberships, viewer]);
  const memberCount = useCallback(
    (c: Community) => c.baseMembers + Object.values(state.memberships).filter((ids) => ids.includes(c.id)).length,
    [state.memberships],
  );
  const joinCommunity = useCallback((id: string) => {
    setState((st) => {
      const key = viewerOf(st);
      const cur = st.memberships[key] ?? [];
      if (cur.includes(id)) return st;
      const c = st.communities.find((x) => x.id === id);
      return {
        ...st,
        memberships: { ...st.memberships, [key]: [...cur, id] },
        notifications: [
          notify({ role: st.role, creatorId: st.role === "creator" ? st.activeCreatorId : undefined, title: `Welcome to ${c?.name}`, body: "You'll see its upcoming events on your dashboard.", href: `/community/${c?.slug}`, kind: "community" }),
          ...st.notifications,
        ],
      };
    });
  }, []);
  const leaveCommunity = useCallback((id: string) => {
    setState((st) => {
      const key = viewerOf(st);
      return { ...st, memberships: { ...st.memberships, [key]: (st.memberships[key] ?? []).filter((x) => x !== id) } };
    });
  }, []);

  const registeredCount = useCallback((e: RegionalEvent) => e.baseRegistered + state.registrations.filter((r) => r.eventId === e.id).length, [state.registrations]);
  const myRegistration = useCallback((eventId: string) => state.registrations.find((r) => r.eventId === eventId && r.viewer === viewer), [state.registrations, viewer]);
  const registerForEvent = useCallback((eventId: string, name: string, paymentId?: string) => {
    const s = stateRef.current;
    const reg: EventRegistration = { id: `RG-${Math.floor(1000 + Math.random() * 8999)}`, eventId, viewer: viewerOf(s), name, paymentId, createdAt: new Date().toISOString() };
    const e = s.events.find((x) => x.id === eventId);
    setState((st) => ({
      ...st,
      registrations: [reg, ...st.registrations],
      notifications: [
        notify({ role: st.role, creatorId: st.role === "creator" ? st.activeCreatorId : undefined, title: "You're registered", body: `${e?.title} · ${reg.id}${paymentId ? " · paid (simulated)" : ""}`, href: `/regional/events/${eventId}`, kind: "event" }),
        ...(e?.creatorIds ?? []).map((cid) => notify({ role: "creator", creatorId: cid, title: "New event registration", body: `${name} registered for ${e?.title}.`, href: `/regional/events/${eventId}`, kind: "event" })),
        ...st.notifications,
      ],
    }));
    return reg;
  }, []);
  const cancelRegistration = useCallback((eventId: string) => {
    setState((st) => ({ ...st, registrations: st.registrations.filter((r) => !(r.eventId === eventId && r.viewer === viewerOf(st))) }));
  }, []);

  const isDuoSlotTaken = useCallback(
    (duo: CreatorDuo, date: string, time: string) => isSlotTaken(duo.creatorIds[0], date, time) || isSlotTaken(duo.creatorIds[1], date, time),
    [isSlotTaken],
  );
  const createDuoBooking = useCallback((input: NewDuoBookingInput) => {
    const s = stateRef.current;
    const duo = s.duos.find((x) => x.id === input.duoId)!;
    const rate = bookingRate("marketplace");
    const { platformFee, creatorEarning } = splitAmount(duo.price, rate);
    const [a, b] = duo.creatorIds.map((id) => s.creators.find((c) => c.id === id)!);
    const booking: Booking = {
      id: `BK-${Math.floor(2000 + Math.random() * 7999)}`, creatorId: a.id, partnerCreatorId: b.id, duoId: duo.id, serviceId: duo.id,
      serviceTitle: `Creator Duo · ${duo.title}`, userName: input.userName, userEmail: input.userEmail, userPhone: input.userPhone,
      topic: input.topic, notes: input.notes, date: input.date, time: input.time, durationMins: duo.durationMins, amount: duo.price,
      source: "marketplace", commissionRate: rate, platformFee, creatorEarning, status: "pending", paymentId: input.paymentId,
      paymentStatus: "paid_simulated", createdAt: new Date().toISOString(), isDemoUser: true,
    };
    setState((st) => ({
      ...st,
      bookings: [booking, ...st.bookings],
      notifications: [
        notify({ role: "user", title: "Duo booking requested (simulated payment)", body: `${duo.title} with ${a.name} & ${b.name} is awaiting confirmation.`, href: `/bookings/${booking.id}`, kind: "payment" }),
        ...[a, b].map((c) => notify({ role: "creator", creatorId: c.id, title: "New Creator Duo request", body: `${input.userName} requested ${duo.title}.`, href: "/creator?tab=bookings", kind: "booking" })),
        notify({ role: "admin", title: "New duo booking", body: `${booking.id} · ₹${duo.price.toLocaleString("en-IN")} · ${duo.title}`, href: "/admin?tab=transactions", kind: "payment" }),
        ...st.notifications,
      ],
    }));
    return booking;
  }, []);

  const applyToCollab = useCallback((input: Pick<CollabApplication, "collabId" | "creatorId" | "message" | "proposedFee" | "portfolioLink">) => {
    setState((st) => {
      const col = st.collaborations.find((x) => x.id === input.collabId);
      const c = st.creators.find((x) => x.id === input.creatorId);
      const now = new Date().toISOString();
      const app: CollabApplication = { ...input, id: `AP-${Math.floor(100 + Math.random() * 899)}`, status: "submitted", createdAt: now, updatedAt: now };
      return {
        ...st,
        applications: [app, ...st.applications.filter((a) => !(a.collabId === input.collabId && a.creatorId === input.creatorId))],
        notifications: [
          ...(col?.ownedByDemoUser ? [notify({ role: "user", title: "New collaboration application", body: `${c?.name} applied to “${col.title}”.`, href: `/collaborate/${col.id}`, kind: "collab" })] : []),
          notify({ role: "admin", title: "Collaboration application", body: `${c?.name} → ${col?.brand}`, href: "/admin?tab=ecosystem", kind: "collab" }),
          ...st.notifications,
        ],
      };
    });
  }, []);
  const setApplicationStatus = useCallback((id: string, status: ApplicationStatus, note?: string) => {
    setState((st) => {
      const app = st.applications.find((a) => a.id === id);
      if (!app) return st;
      const col = st.collaborations.find((x) => x.id === app.collabId);
      const labels: Record<ApplicationStatus, string> = { submitted: "submitted", shortlisted: "shortlisted", accepted: "accepted", declined: "not selected", withdrawn: "withdrawn" };
      const extra: Notification[] = status === "withdrawn"
        ? []
        : [notify({ role: "creator", creatorId: app.creatorId, title: `Application ${labels[status]}`, body: `${col?.brand}: “${col?.title}”${note ? ` — ${note}` : ""}`, href: `/collaborate/${app.collabId}`, kind: "collab" })];
      return {
        ...st,
        applications: st.applications.map((a) => (a.id === id ? { ...a, status, brandNote: note ?? a.brandNote, updatedAt: new Date().toISOString() } : a)),
        notifications: [...extra, ...st.notifications],
      };
    });
  }, []);
  const createCollaboration = useCallback((input: NewCollabInput) => {
    const col: Collaboration = { ...input, id: `cb${Math.floor(100 + Math.random() * 899)}`, brandHue: 140, ownedByDemoUser: true, status: "open", baseApplicants: 0, createdAt: new Date().toISOString() };
    setState((st) => ({
      ...st,
      collaborations: [col, ...st.collaborations],
      notifications: [notify({ role: "admin", title: "New collaboration brief", body: `${col.brand} posted “${col.title}”.`, href: "/admin?tab=ecosystem", kind: "collab" }), ...st.notifications],
    }));
    return col;
  }, []);
  const setCollabStatus = useCallback((id: string, status: CollabStatus) => {
    setState((st) => ({ ...st, collaborations: st.collaborations.map((c) => (c.id === id ? { ...c, status } : c)) }));
  }, []);

  const resetDemo = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setState((st) => ({ ...initialState(), role: st.role }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
      demoUser: DEMO_USER,
      toasts,
      toast,
      dismissToast,
      setRole: (role) => setState((st) => ({ ...st, role })),
      setActiveCreator: (id) => setState((st) => ({ ...st, activeCreatorId: id })),
      getCreator,
      isSlotTaken,
      createBooking,
      setBookingStatus,
      addReview,
      updateCreator,
      updateService,
      addService,
      createPitch,
      sendPitchRequests,
      respondToPitch,
      submitPitchFeedback,
      setCreatorStatus,
      toggleVerified,
      markAllRead,
      markRead,
      resetDemo,
      viewer,
      setCity: (city) => setState((st) => ({ ...st, city })),
      isMember, memberCount, joinCommunity, leaveCommunity,
      registeredCount, myRegistration, registerForEvent, cancelRegistration,
      isDuoSlotTaken, createDuoBooking,
      applyToCollab, setApplicationStatus, createCollaboration, setCollabStatus,
    }),
    [viewer, isMember, memberCount, joinCommunity, leaveCommunity, registeredCount, myRegistration, registerForEvent, cancelRegistration, isDuoSlotTaken, createDuoBooking, applyToCollab, setApplicationStatus, createCollaboration, setCollabStatus,
      state, hydrated, toasts, toast, dismissToast, getCreator, isSlotTaken, createBooking, setBookingStatus, addReview, updateCreator, updateService, addService, createPitch, sendPitchRequests, respondToPitch, submitPitchFeedback, setCreatorStatus, toggleVerified, markAllRead, markRead, resetDemo],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/** Notifications visible to the current role (and creator account). */
export function useMyNotifications() {
  const { notifications, role, activeCreatorId } = useStore();
  return notifications.filter((n) => n.role === role && (role !== "creator" || n.creatorId === activeCreatorId));
}

export function pitchOverallStatus(reqs: PitchRequest[]): { label: string; tone: "neutral" | "brand" | "teal" | "amber" | "red" } {
  if (reqs.length === 0) return { label: "Draft", tone: "neutral" };
  const done = reqs.filter((r) => r.status === "feedback_submitted").length;
  const open = reqs.filter((r) => r.status === "pending" || r.status === "accepted").length;
  if (done > 0 && open === 0) return { label: "Feedback complete", tone: "teal" };
  if (done > 0) return { label: `Feedback ${done}/${reqs.length - reqs.filter((r) => r.status === "declined").length}`, tone: "brand" };
  if (reqs.some((r) => r.status === "accepted")) return { label: "In review", tone: "brand" };
  if (open > 0) return { label: "Awaiting creators", tone: "amber" };
  return { label: "Closed", tone: "red" };
}
