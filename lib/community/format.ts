import type { CommunityType } from "./types";

export const COMMUNITY_TYPE_LABEL: Record<CommunityType, string> = {
  interest: "Interest",
  identity: "Identity",
  "micro-multipotential": "Micro-multipotential",
};

export const COMMUNITY_TYPE_HINT: Record<CommunityType, string> = {
  interest: "Built around a thing — a craft, a topic, a practice.",
  identity: "Built around a stage of life — parent, midlife, career change.",
  "micro-multipotential": "For people who keep many small interests at once.",
};

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
