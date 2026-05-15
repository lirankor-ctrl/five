import { todayKey } from "./format";
import type {
  CheckIn,
  CheckInStatus,
  TippingInsight,
  TippingPattern,
  TippingState,
} from "./types";

/**
 * Lightweight, deliberately gentle pattern logic.
 *
 * The cube must never feel clinical. These functions exist to surface
 * realistic observations only — and only when there is enough data to
 * say something honest. Thresholds favour silence over speculation.
 */

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Success-leaning score: within = 1, partial = 0.5, over = 0. */
function score(status: CheckInStatus): number {
  if (status === "within") return 1;
  if (status === "partial") return 0.5;
  return 0;
}

export function checkInsFor(
  state: TippingState,
  patternId: string,
): CheckIn[] {
  return state.checkIns
    .filter((c) => c.patternId === patternId)
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function currentStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;
  const map = new Map(checkIns.map((c) => [c.date, c.status]));
  let streak = 0;
  const d = new Date();
  if (!map.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (true) {
    const key = todayKey(d);
    const status = map.get(key);
    if (status === "within" || status === "partial") {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function consistency(checkIns: CheckIn[], windowDays = 14): number {
  if (checkIns.length === 0) return 0;
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (windowDays - 1));
  const inWindow = checkIns.filter((c) => {
    const d = new Date(c.date);
    return d >= start && d <= end;
  });
  if (inWindow.length === 0) return 0;
  return (
    inWindow.reduce((acc, c) => acc + score(c.status), 0) / windowDays
  );
}

/** True if the recent half of the window scores better than the older half. */
export function trendingBetter(
  checkIns: CheckIn[],
  windowDays = 14,
): boolean | null {
  if (checkIns.length < 4) return null;
  const today = new Date();
  const half = Math.floor(windowDays / 2);
  const recent: CheckIn[] = [];
  const older: CheckIn[] = [];
  for (const c of checkIns) {
    const d = new Date(c.date);
    const diff = Math.round(
      (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff >= 0 && diff < half) recent.push(c);
    else if (diff >= half && diff < windowDays) older.push(c);
  }
  if (recent.length < 2 || older.length < 2) return null;
  const avg = (xs: CheckIn[]) =>
    xs.reduce((a, c) => a + score(c.status), 0) / xs.length;
  return avg(recent) > avg(older) + 0.1;
}

/** Recent N days, oldest-first, status or null. */
export function recentStatuses(
  checkIns: CheckIn[],
  n: number,
): Array<{ date: string; status: CheckInStatus | null }> {
  const map = new Map(checkIns.map((c) => [c.date, c.status]));
  const out: Array<{ date: string; status: CheckInStatus | null }> = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    out.push({ date: key, status: map.get(key) ?? null });
  }
  return out;
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

export function generateInsights(
  pattern: TippingPattern,
  checkIns: CheckIn[],
): TippingInsight[] {
  const out: TippingInsight[] = [];
  if (checkIns.length === 0) return out;

  if (checkIns.length < 4) {
    out.push({
      kind: "early-momentum",
      patternId: pattern.id,
      body:
        "Still early. The patterns will surface after a few more check-ins.",
    });
    return out;
  }

  const better = trendingBetter(checkIns, 14);
  if (better === true) {
    out.push({
      kind: "reduction",
      patternId: pattern.id,
      body:
        "The last week is gentler than the week before. Reduction is happening.",
    });
  }

  // Weekend vs weekday split
  const weekend = checkIns.filter((c) => isWeekend(c.date));
  const weekday = checkIns.filter((c) => !isWeekend(c.date));
  if (weekend.length >= 3 && weekday.length >= 3) {
    const avgWe = weekend.reduce((a, c) => a + score(c.status), 0) / weekend.length;
    const avgWd = weekday.reduce((a, c) => a + score(c.status), 0) / weekday.length;
    if (avgWd - avgWe > 0.2) {
      out.push({
        kind: "weekend-harder",
        patternId: pattern.id,
        body: "Weekends seem harder than weekdays for this one.",
      });
    } else if (avgWe - avgWd > 0.2) {
      out.push({
        kind: "weekday-easier",
        patternId: pattern.id,
        body:
          "You hold more steadily on workdays than weekends. Worth noticing.",
      });
    }
  }

  // Most common trigger across reflections
  const triggerCounts = new Map<string, number>();
  for (const c of checkIns) {
    for (const t of c.reflection?.triggers ?? []) {
      triggerCounts.set(t, (triggerCounts.get(t) ?? 0) + 1);
    }
  }
  if (triggerCounts.size > 0) {
    let topTrigger = "";
    let topCount = 0;
    for (const [k, v] of triggerCounts) {
      if (v > topCount) {
        topCount = v;
        topTrigger = k;
      }
    }
    if (topCount >= 3) {
      out.push({
        kind: "trigger-pattern",
        patternId: pattern.id,
        body: `“${topTrigger}” shows up most often when the day goes over.`,
      });
    }
  }

  // Most common weekday for "within" days
  const dayScores = new Array<number>(7).fill(0);
  const dayCounts = new Array<number>(7).fill(0);
  for (const c of checkIns) {
    const day = new Date(c.date).getDay();
    dayScores[day] += score(c.status);
    dayCounts[day] += 1;
  }
  let bestDay = -1;
  let bestAvg = 0;
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] >= 2) {
      const avg = dayScores[i] / dayCounts[i];
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = i;
      }
    }
  }
  if (bestDay >= 0 && bestAvg >= 0.75) {
    out.push({
      kind: "weekday-easier",
      patternId: pattern.id,
      body: `${WEEKDAY[bestDay]}s have been your steadiest day so far.`,
    });
  }

  if (out.length === 0) {
    out.push({
      kind: "gentle-return",
      patternId: pattern.id,
      body: "A quiet rhythm is forming. Keep the boundary the same size.",
    });
  }

  return out;
}
