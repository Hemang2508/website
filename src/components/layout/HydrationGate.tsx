"use client";

import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { PageSkeleton } from "@/components/ui/Visual";

/**
 * All RTG Live demo data lives in the browser (localStorage) and is generated relative to
 * "today". The server therefore renders the navigation, footer and a skeleton, and page
 * content renders once the store has loaded. This avoids server/client hydration mismatches
 * (time zones, dates) and avoids flashing seed data before the visitor's saved demo state.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const { hydrated } = useStore();
  if (!hydrated) return <PageSkeleton />;
  return <>{children}</>;
}
