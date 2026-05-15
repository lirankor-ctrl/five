import type {
  CameraMode,
  EventCategory,
  InteractionStyle,
  Reaction,
} from "./types";

export const INTERACTION_LABEL: Record<InteractionStyle, string> = {
  silent: "Silent together",
  guided: "Guided",
  "check-in": "Check-in",
  "momentum-sprint": "Momentum sprint",
};

export const INTERACTION_HINT: Record<InteractionStyle, string> = {
  silent: "Everyone does their five quietly.",
  guided: "A host gently leads the session.",
  "check-in": "Quick check-in at the start, “done” at the end.",
  "momentum-sprint": "Shared timer. You all do it at once.",
};

export const CAMERA_LABEL: Record<CameraMode, string> = {
  "no-cameras": "No cameras",
  "cameras-on": "Cameras on",
  "text-only": "Text only",
  "free-discussion": "Free discussion",
  "guided-audio": "Guided audio",
};

export const REACTION_LABEL: Record<Reaction, string> = {
  thanks: "thanks",
  fire: "🔥",
  "next-five": "see you next five",
  "with-you": "with you",
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  content: "Content",
  growth: "Growth",
  fitness: "Fitness",
  creative: "Creative",
  project: "Project",
  family: "Family",
  organizational: "Organizational",
};

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function shortTime(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function shortDay(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function relativeMinutes(seconds: number): string {
  if (seconds <= 0) return "now";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
