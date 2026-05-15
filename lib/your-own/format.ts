import type {
  CubeAIBehavior,
  CubeEvolutionStatus,
  CubeFrequency,
  CubeReflectionStyle,
  CubeTrackingShape,
  CubeVisibility,
  EmotionalCategory,
} from "./types";

export const FREQUENCY_LABEL: Record<CubeFrequency, string> = {
  daily: "Most days",
  "few-per-week": "A few times a week",
  weekly: "Once a week",
  flexible: "Flexible",
  monthly: "Monthly",
};

export const REFLECTION_LABEL: Record<CubeReflectionStyle, string> = {
  none: "No reflection",
  feeling: "Feeling chips",
  "free-text": "Free text",
  structured: "Structured prompt",
};

export const TRACKING_LABEL: Record<CubeTrackingShape, string> = {
  presence: "Presence",
  duration: "Duration",
  completion: "Completion",
  narrative: "Narrative",
};

export const AI_LABEL: Record<CubeAIBehavior, string> = {
  none: "No AI",
  gentle: "Gentle helper",
  active: "Active helper",
};

export const VISIBILITY_LABEL: Record<CubeVisibility, string> = {
  private: "Private",
  community: "Community",
  public: "Public",
};

export const STATUS_LABEL: Record<CubeEvolutionStatus, string> = {
  draft: "Draft",
  published: "Published",
  "evolution-candidate": "Evolution candidate",
  official: "Official cube",
};

export const CATEGORY_LABEL: Record<EmotionalCategory, string> = {
  calm: "Calm",
  growth: "Growth",
  connection: "Connection",
  creativity: "Creativity",
  recovery: "Recovery",
  learning: "Learning",
  identity: "Identity",
  family: "Family",
  play: "Play",
};

export const EMOTIONAL_CATEGORIES: EmotionalCategory[] = [
  "calm",
  "growth",
  "connection",
  "creativity",
  "recovery",
  "learning",
  "identity",
  "family",
  "play",
];

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
