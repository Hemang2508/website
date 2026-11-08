"use client";

import { Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Community } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function JoinButton({ community, size = "md", className }: { community: Community; size?: "sm" | "md" | "lg"; className?: string }) {
  const { isMember, joinCommunity, leaveCommunity, toast, hydrated } = useStore();
  const member = hydrated && isMember(community.id);
  if (member) {
    return (
      <Button
        size={size}
        variant="secondary"
        className={className}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (confirm(`Leave ${community.name}?`)) { leaveCommunity(community.id); toast({ title: `You left ${community.name}`, tone: "info" }); } }}
        aria-label={`Leave ${community.name}`}
      >
        <Check className="h-4 w-4 text-teal-700" />Joined
      </Button>
    );
  }
  return (
    <Button size={size} className={className} disabled={!hydrated} onClick={(e) => { e.preventDefault(); e.stopPropagation(); joinCommunity(community.id); toast({ title: `Joined ${community.name}`, body: "Upcoming events now appear on your dashboard." }); }}>
      <Plus className="h-4 w-4" />Join community
    </Button>
  );
}
