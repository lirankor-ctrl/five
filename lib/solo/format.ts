import type {
  SoloFrequency,
  SoloPlan,
  SoloTimeOfDay,
} from "./types";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function describeFrequency(f: SoloFrequency): string {
  switch (f.kind) {
    case "daily":
      return "Every day";
    case "weekly":
      return `${f.perWeek}× a week`;
    case "specific-days":
      if (f.days.length === 0) return "No days yet";
      return f.days
        .slice()
        .sort((a, b) => a - b)
        .map((d) => WEEKDAY_SHORT[d])
        .join(" · ");
    case "flexible":
      return "Whenever it feels right";
  }
}

export function describeTimeOfDay(t: SoloTimeOfDay): string {
  switch (t.kind) {
    case "morning":
      return "Morning";
    case "afternoon":
      return "Afternoon";
    case "evening":
      return "Evening";
    case "hour":
      return formatHour(t.hour);
    case "anchor":
      return `After ${t.anchor}`;
  }
}

export function formatHour(h: number): string {
  const safe = ((h % 24) + 24) % 24;
  const suffix = safe < 12 ? "am" : "pm";
  const hour12 = safe % 12 === 0 ? 12 : safe % 12;
  return `${hour12}:00 ${suffix}`;
}

export function planSummary(plan: SoloPlan): string {
  return `${describeTimeOfDay(plan.timeOfDay)} · ${plan.durationMin} min · ${describeFrequency(plan.frequency)}`;
}

export function isScheduledFor(plan: SoloPlan, d: Date): boolean {
  const f = plan.frequency;
  if (f.kind === "daily") return true;
  if (f.kind === "flexible") return true;
  if (f.kind === "weekly") return true; // any day counts towards the count
  if (f.kind === "specific-days") return f.days.includes(d.getDay());
  return true;
}
