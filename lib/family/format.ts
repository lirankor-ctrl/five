import type {
  Feeling,
  RitualCadence,
  SessionStatus,
  Worked,
} from "./types";

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const CADENCE_LABEL: Record<RitualCadence, string> = {
  daily: "Most days",
  "few-per-week": "A few times a week",
  weekly: "Once a week",
  "weekend-morning": "Weekend morning",
  "before-sleep": "Before sleep",
  "after-dinner": "After dinner",
  custom: "Custom",
};

export const FEELING_LABEL: Record<Feeling, string> = {
  warm: "Warm",
  calm: "Calm",
  joyful: "Joyful",
  tender: "Tender",
  lively: "Lively",
  honest: "Honest",
};

export const STATUS_LABEL: Record<SessionStatus, string> = {
  done: "We had a moment",
  "not-today": "Not today",
};

export const STATUS_HINT: Record<SessionStatus, string> = {
  done: "However small — it counts.",
  "not-today": "That is also okay.",
};

export const WORKED_LABEL: Record<Worked, string> = {
  yes: "Yes — keep it.",
  maybe: "Maybe — let’s see.",
  "not-really": "Not quite for us.",
};

export function dayMonthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function monthLabel(d: Date = new Date()): string {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
