import { CATEGORY_LABEL } from "./format";
import type { EventInsight, LiveEvent, LiveState } from "./types";

/**
 * Gentle behavioural patterns.
 *
 * Conservative thresholds: at least 3 completions before any specific
 * pattern surfaces. Tone is "live helps you" — never "you fell behind".
 */
export function generateLiveInsights(
  state: LiveState,
  events: LiveEvent[],
): EventInsight[] {
  const out: EventInsight[] = [];
  const eventMap = new Map(events.map((e) => [e.id, e]));

  if (state.completions.length === 0) {
    out.push({
      kind: "early-momentum",
      body:
        "Once you have completed a few lives, gentle observations about what works will surface here.",
    });
    return out;
  }

  if (state.completions.length >= 3) {
    out.push({
      kind: "live-helps",
      body: "Your consistency seems to lift when you join live, not solo.",
    });
  }

  // Top category
  const catCounts = new Map<string, number>();
  for (const c of state.completions) {
    const e = eventMap.get(c.eventId);
    if (!e) continue;
    catCounts.set(e.category, (catCounts.get(e.category) ?? 0) + 1);
  }
  let topCat: string | null = null;
  let topCount = 0;
  for (const [k, v] of catCounts) {
    if (v > topCount) {
      topCount = v;
      topCat = k;
    }
  }
  if (topCat && topCount >= 3) {
    out.push({
      kind: "category-helps",
      body: `${CATEGORY_LABEL[topCat as keyof typeof CATEGORY_LABEL] ?? topCat} events seem to keep your rhythm.`,
    });
  }

  // Time-of-day bucket
  const hourBuckets = new Map<string, number>();
  for (const c of state.completions) {
    const h = new Date(c.reportedAt).getHours();
    const label = h < 11 ? "morning" : h < 17 ? "afternoon" : "evening";
    hourBuckets.set(label, (hourBuckets.get(label) ?? 0) + 1);
  }
  let bestTime: string | null = null;
  let bestCount = 0;
  for (const [k, v] of hourBuckets) {
    if (v > bestCount) {
      bestCount = v;
      bestTime = k;
    }
  }
  if (bestTime && bestCount >= 3) {
    if (bestTime === "morning") {
      out.push({
        kind: "morning-momentum",
        body: "Morning lives appear to land best for you.",
      });
    } else if (bestTime === "evening") {
      out.push({
        kind: "evening-momentum",
        body: "Evening lives appear to land best for you.",
      });
    }
  }

  if (out.length === 0) {
    out.push({
      kind: "gentle-return",
      body: "A quiet rhythm is forming. Nothing to change.",
    });
  }

  return out;
}
