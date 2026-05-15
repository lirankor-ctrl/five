import type {
  EventCadence,
  LiveEvent,
  RecurrencePattern,
} from "./types";

/**
 * Recurrence helpers.
 *
 * The world is deterministic — given a current Date and an event's
 * recurrence, we can derive the next start time and live state without
 * any server. When a real realtime backend lands, these functions
 * become the formal interface and stay the same.
 */
export function nextStartFor(
  event: LiveEvent,
  now: Date = new Date(),
): Date {
  const r = event.recurrence;
  switch (r.cadence) {
    case "one-time":
      return atTime(now, r.hour, r.minute);
    case "daily":
      return nextDaily(now, r.hour, r.minute);
    case "weekday":
      return nextWeekday(now, r.hour, r.minute);
    case "weekly":
      return nextWeekly(now, r.dayOfWeek ?? 0, r.hour, r.minute);
  }
}

function atTime(base: Date, h: number, m: number): Date {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function nextDaily(now: Date, h: number, m: number): Date {
  const candidate = atTime(now, h, m);
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

function nextWeekday(now: Date, h: number, m: number): Date {
  let candidate = atTime(now, h, m);
  if (candidate.getTime() <= now.getTime()) {
    candidate = new Date(candidate);
    candidate.setDate(candidate.getDate() + 1);
  }
  // Walk forward until weekday (Mon-Fri = 1..5)
  while (candidate.getDay() === 0 || candidate.getDay() === 6) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

function nextWeekly(now: Date, dayOfWeek: number, h: number, m: number): Date {
  const candidate = atTime(now, h, m);
  const currentDay = candidate.getDay();
  let diff = (dayOfWeek - currentDay + 7) % 7;
  if (diff === 0 && candidate.getTime() <= now.getTime()) diff = 7;
  candidate.setDate(candidate.getDate() + diff);
  return candidate;
}

export type LiveStatus =
  | { kind: "live"; startsAt: Date; endsAt: Date; secondsLeft: number }
  | { kind: "starting-soon"; startsAt: Date; secondsUntil: number }
  | { kind: "later-today"; startsAt: Date }
  | { kind: "later-this-week"; startsAt: Date }
  | { kind: "later"; startsAt: Date };

/** Soon-window thresholds, in minutes. */
const SOON_MIN = 60;

export function statusFor(event: LiveEvent, now: Date = new Date()): LiveStatus {
  // First check: is the current local time inside the most recent occurrence's window?
  const currentWindow = currentOccurrenceWindow(event, now);
  if (currentWindow) {
    return {
      kind: "live",
      startsAt: currentWindow.start,
      endsAt: currentWindow.end,
      secondsLeft: Math.max(
        0,
        Math.floor((currentWindow.end.getTime() - now.getTime()) / 1000),
      ),
    };
  }
  const next = nextStartFor(event, now);
  const diffMin = (next.getTime() - now.getTime()) / 60000;
  if (diffMin <= SOON_MIN) {
    return {
      kind: "starting-soon",
      startsAt: next,
      secondsUntil: Math.floor((next.getTime() - now.getTime()) / 1000),
    };
  }
  if (sameDay(next, now)) {
    return { kind: "later-today", startsAt: next };
  }
  if (within7Days(next, now)) {
    return { kind: "later-this-week", startsAt: next };
  }
  return { kind: "later", startsAt: next };
}

function currentOccurrenceWindow(
  event: LiveEvent,
  now: Date,
): { start: Date; end: Date } | null {
  // Generate the most recent occurrence start at-or-before now.
  const r = event.recurrence;
  const todayAt = atTime(now, r.hour, r.minute);
  let start: Date;
  if (r.cadence === "daily") {
    start = new Date(todayAt);
    if (start.getTime() > now.getTime()) start.setDate(start.getDate() - 1);
  } else if (r.cadence === "weekday") {
    start = new Date(todayAt);
    if (start.getTime() > now.getTime()) start.setDate(start.getDate() - 1);
    while (start.getDay() === 0 || start.getDay() === 6) {
      start.setDate(start.getDate() - 1);
    }
  } else if (r.cadence === "weekly") {
    const target = r.dayOfWeek ?? 0;
    start = new Date(todayAt);
    // walk back to the most recent target day
    while (start.getDay() !== target || start.getTime() > now.getTime()) {
      start.setDate(start.getDate() - 1);
    }
  } else {
    // one-time → start equals scheduled time
    start = new Date(todayAt);
  }
  const end = new Date(start.getTime() + event.durationMinutes * 60000);
  if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
    return { start, end };
  }
  return null;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function within7Days(future: Date, now: Date): boolean {
  return (future.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7;
}

/** Order events by how "alive" they are. */
export function rankByAliveness(
  events: LiveEvent[],
  now: Date = new Date(),
): LiveEvent[] {
  return events
    .slice()
    .sort((a, b) => groupOrder(statusFor(a, now)) - groupOrder(statusFor(b, now)));
}

function groupOrder(s: LiveStatus): number {
  switch (s.kind) {
    case "live":
      return 0;
    case "starting-soon":
      return 1;
    case "later-today":
      return 2;
    case "later-this-week":
      return 3;
    case "later":
      return 4;
  }
}

export const CADENCE_LABEL: Record<EventCadence, string> = {
  "one-time": "Once",
  daily: "Daily",
  weekday: "Weekdays",
  weekly: "Weekly",
};

export function recurrenceLabel(r: RecurrencePattern): string {
  const dayLabel =
    r.cadence === "weekly"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][r.dayOfWeek ?? 0]
      : null;
  const time = formatHourMinute(r.hour, r.minute);
  if (r.cadence === "weekly" && dayLabel) return `Every ${dayLabel} · ${time}`;
  if (r.cadence === "weekday") return `Every weekday · ${time}`;
  if (r.cadence === "daily") return `Every day · ${time}`;
  return time;
}

export function formatHourMinute(h: number, m: number): string {
  const safeH = ((h % 24) + 24) % 24;
  const suffix = safeH < 12 ? "am" : "pm";
  const hour12 = safeH % 12 === 0 ? 12 : safeH % 12;
  const mm = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
  return `${hour12}${mm}${suffix}`;
}
