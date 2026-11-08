"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const labels: Record<Role, string> = { user: "User", creator: "Creator", admin: "Admin" };

/** Shown when a dashboard is opened from a different demo role. */
export function RoleNotice({ expected, home }: { expected: Role; home: string }) {
  const { role, setRole, toast } = useStore();
  const router = useRouter();
  if (role === expected) return null;
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
      <Info className="h-5 w-5 shrink-0 text-amber-600" />
      <p className="flex-1 text-[13px] text-amber-800">You&apos;re previewing the {labels[expected]} dashboard while signed in as <b>{labels[role]}</b>.</p>
      <Button size="sm" variant="secondary" onClick={() => { setRole(expected); toast({ title: `Switched to ${labels[expected]} view`, tone: "info" }); router.push(home); }}>Switch to {labels[expected]}</Button>
    </div>
  );
}
