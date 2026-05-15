import type {
  ContentType,
  Difficulty,
  Pricing,
} from "./types";

export const TYPE_LABEL: Record<ContentType, string> = {
  app: "App",
  video: "Video",
  article: "Article",
  podcast: "Podcast",
  course: "Course",
  website: "Website",
  audio: "Audio",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  advanced: "Advanced",
};

export const PRICING_LABEL: Record<Pricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
