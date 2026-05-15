import { describeFrequency, formatHour, todayKey } from "./format";
import type { SoloEntry, SoloInsight, SoloPlan, SoloState } from "./types";

/**
 * Lightweight, deliberately conservative pattern logic.
 *
 * Insights stay observational, never prescriptive — see CLAUDE.md spec.
 * Future replacement: a server-side analyzer over Supabase rows.
 */

const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function currentStreak(entries: SoloEntry[]): number {
  if (entries.length === 0) return 0;
  const map = new Map(entries.map((e) => [e.date, e.status]));
  let streak = 0;
  const d = new Date();
  // Start from today; if today not reported yet, still allow a streak that
  // ran up to yesterday.
  if (!map.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (true) {
    const key = todayKey(d);
    const status = map.get(key);
    if (status === "done" || status === "partial") {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function consistencyRate(entries: SoloEntry[], windowDays = 14): number {
  if (entries.length === 0) return 0;
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (windowDays - 1));
  const inWindow = entries.filter((e) => {
    const d = new Date(e.date);
    return d >= start && d <= today;
  });
  if (inWindow.length === 0) return 0;
  const successes = inWindow.filter(
    (e) => e.status === "done" || e.status === "partial",
  ).length;
  return successes / windowDays;
}

export function bestHour(entries: SoloEntry[]): number | null {
  const buckets = new Map<number, number>();
  for (const e of entries) {
    if (e.status !== "done") continue;
    if (typeof e.hour !== "number") continue;
    buckets.set(e.hour, (buckets.get(e.hour) ?? 0) + 1);
  }
  let best: number | null = null;
  let bestCount = 0;
  for (const [h, c] of buckets) {
    if (c > bestCount) {
      bestCount = c;
      best = h;
    }
  }
  return bestCount >= 3 ? best : null;
}

export function bestWeekday(entries: SoloEntry[]): number | null {
  const buckets = new Array<number>(7).fill(0);
  for (const e of entries) {
    if (e.status !== "done") continue;
    const day = new Date(e.date).getDay();
    buckets[day] += 1;
  }
  let best = -1;
  let bestCount = 0;
  buckets.forEach((c, i) => {
    if (c > bestCount) {
      bestCount = c;
      best = i;
    }
  });
  return bestCount >= 3 ? best : null;
}

export function generateInsights(state: SoloState): SoloInsight[] {
  const insights: SoloInsight[] = [];
  if (!state.plan) return insights;

  const totalReports = state.entries.length;
  const doneCount = state.entries.filter((e) => e.status === "done").length;

  if (totalReports < 3) {
    insights.push({
      kind: "early-momentum",
      body:
        "The patterns will appear as you return. There is nothing to optimise yet.",
    });
    return insights;
  }

  const hour = bestHour(state.entries);
  if (hour !== null) {
    insights.push({
      kind: "best-hour",
      body: `Most of your done days happen around ${formatHour(hour)}.`,
    });
  }

  const weekday = bestWeekday(state.entries);
  if (weekday !== null) {
    insights.push({
      kind: "best-weekday",
      body: `${WEEKDAY_LONG[weekday]} has been your steadiest day.`,
    });
  }

  if (state.plan.timeOfDay.kind === "anchor" && doneCount >= 3) {
    insights.push({
      kind: "anchor-helps",
      body: `Returning after ${state.plan.timeOfDay.anchor} seems to help you start.`,
    });
  }

  if (state.plan.durationMin <= 5 && doneCount >= 5) {
    insights.push({
      kind: "shorter-helps",
      body: "Small sessions seem to be holding. Keep them small.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      kind: "gentle-return",
      body: `A quiet ${describeFrequency(state.plan.frequency).toLowerCase()} rhythm — keep it light.`,
    });
  }

  return insights;
}

/**
 * The last N days, oldest-first, with the recorded status for each
 * (or `null` for days the user didn't report). Used by the river strip.
 */
export function recentDays(
  entries: SoloEntry[],
  n: number,
): Array<{ date: string; status: SoloEntry["status"] | null }> {
  const map = new Map(entries.map((e) => [e.date, e.status]));
  const out: Array<{ date: string; status: SoloEntry["status"] | null }> = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = todayKeyFor(d);
    out.push({ date: key, status: map.get(key) ?? null });
  }
  return out;
}

function todayKeyFor(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
