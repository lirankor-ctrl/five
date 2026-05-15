import type {
  Boundary,
  BoundaryUnit,
  CheckInStatus,
} from "./types";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function describeUnit(value: number, unit: BoundaryUnit): string {
  switch (unit) {
    case "minutes":
      return `${value} min`;
    case "hours":
      return `${value} hr`;
    case "times":
      return `${value} ${value === 1 ? "time" : "times"}`;
    case "currency":
      return `$${value}`;
  }
}

export function describeBoundary(b: Boundary): string {
  switch (b.kind) {
    case "daily-cap":
      return `up to ${describeUnit(b.value, b.unit)} a day`;
    case "weekly-cap":
      return `up to ${describeUnit(b.value, b.unit)} a week`;
    case "weekday-only": {
      if (b.allowedDays.length === 0) return "no allowed days yet";
      const sorted = b.allowedDays.slice().sort((a, c) => a - c);
      const isWeekendsOnly =
        sorted.length === 2 && sorted[0] === 0 && sorted[1] === 6;
      if (isWeekendsOnly) return "weekends only";
      return `${sorted.map((d) => WEEKDAY_SHORT[d]).join(" · ")} only`;
    }
    case "time-window": {
      if (b.notAfter !== undefined && b.notBefore !== undefined) {
        return `not between ${formatHour(b.notAfter)} and ${formatHour(b.notBefore)}`;
      }
      if (b.notAfter !== undefined) return `not after ${formatHour(b.notAfter)}`;
      if (b.notBefore !== undefined)
        return `not before ${formatHour(b.notBefore)}`;
      return "any time";
    }
    case "custom":
      return b.description;
  }
}

export function formatHour(h: number): string {
  const safe = ((h % 24) + 24) % 24;
  const suffix = safe < 12 ? "am" : "pm";
  const hour12 = safe % 12 === 0 ? 12 : safe % 12;
  return `${hour12}${suffix}`;
}

export const STATUS_LABEL: Record<CheckInStatus, string> = {
  within: "Stayed within",
  partial: "Closer than before",
  over: "Past the boundary",
};

export const STATUS_HINT: Record<CheckInStatus, string> = {
  within: "Today held.",
  partial: "Direction is what matters.",
  over: "Tomorrow is also a day.",
};
