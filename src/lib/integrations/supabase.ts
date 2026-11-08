/**
 * Supabase adapter (stub).
 *
 * The MVP demo persists all data in the browser (localStorage) so management can explore it
 * without credentials. When NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * the store actions in `src/lib/store.tsx` map 1:1 to tables described in docs/ARCHITECTURE.md
 * (profiles, creators, services, availability, bookings, pitches, pitch_requests, reviews,
 * notifications) and product images move to a Supabase Storage bucket.
 */
export const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const DATA_MODE: "local-demo" | "supabase" = SUPABASE_CONFIGURED ? "supabase" : "local-demo";
