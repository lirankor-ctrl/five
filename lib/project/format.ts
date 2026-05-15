import type {
  Frequency,
  GuidanceStyle,
  ProjectStage,
  ProjectType,
  ReflectionFeeling,
} from "./types";

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  writing: "Writing",
  startup: "Startup",
  business: "Business",
  relocation: "Relocation",
  research: "Research",
  product: "Product",
  "career-change": "Career change",
  learning: "Learning",
  creative: "Creative",
  financial: "Financial",
  "family-project": "Family project",
  health: "Health",
};

export const STAGE_LABEL: Record<ProjectStage, string> = {
  idea: "Idea only",
  starting: "Just starting",
  "in-progress": "In progress",
  stuck: "Stuck",
  "near-completion": "Near completion",
  "failed-before": "Failed before",
  restarting: "Restarting",
  rescued: "Rescued",
};

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: "Most days",
  "3-per-week": "Three times a week",
  weekly: "Once a week",
  fridays: "Fridays",
  evenings: "Evenings",
  mornings: "Mornings",
  flexible: "Flexible",
};

export const GUIDANCE_LABEL: Record<GuidanceStyle, string> = {
  gentle: "Gentle",
  strategic: "Strategic",
  creative: "Creative",
  practical: "Practical",
  emotional: "Emotional",
  minimalist: "Minimalist",
  push: "Push mode",
};

export const FEELING_LABEL: Record<ReflectionFeeling, string> = {
  clear: "Clear",
  stuck: "Stuck",
  energised: "Energised",
  tired: "Tired",
  excited: "Excited",
  doubt: "Doubt",
};

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
