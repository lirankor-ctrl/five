import { liveEvents } from "@/data/live/events";
import { rankByAliveness, statusFor } from "./schedule";
import type {
  DiscoverFilters,
  LiveEvent,
  LiveState,
} from "./types";

export function allEvents(state: LiveState): LiveEvent[] {
  return [...liveEvents, ...state.drafts];
}

export function discover(
  state: LiveState,
  filters: DiscoverFilters,
  query = "",
  now: Date = new Date(),
): {
  live: LiveEvent[];
  startingSoon: LiveEvent[];
  laterToday: LiveEvent[];
  laterThisWeek: LiveEvent[];
} {
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  const filtered = allEvents(state).filter((e) => {
    if (filters.category && e.category !== filters.category) return false;
    if (filters.interaction && e.interaction !== filters.interaction)
      return false;
    if (filters.maxDuration && e.durationMinutes > filters.maxDuration)
      return false;
    if (filters.language && e.language !== filters.language) return false;
    if (tokens.length > 0) {
      const hay = `${e.name} ${e.description} ${e.hook ?? ""}`.toLowerCase();
      if (!tokens.every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  const buckets = {
    live: [] as LiveEvent[],
    startingSoon: [] as LiveEvent[],
    laterToday: [] as LiveEvent[],
    laterThisWeek: [] as LiveEvent[],
  };
  for (const e of filtered) {
    const s = statusFor(e, now);
    if (s.kind === "live") buckets.live.push(e);
    else if (s.kind === "starting-soon") buckets.startingSoon.push(e);
    else if (s.kind === "later-today") buckets.laterToday.push(e);
    else buckets.laterThisWeek.push(e);
  }
  buckets.live = rankByAliveness(buckets.live, now);
  buckets.startingSoon = rankByAliveness(buckets.startingSoon, now);
  buckets.laterToday = rankByAliveness(buckets.laterToday, now);
  buckets.laterThisWeek = rankByAliveness(buckets.laterThisWeek, now);
  return buckets;
}

/**
 * Lightweight personalised recommendations. Looks at the user's past
 * completions: most-completed category and most-completed event ids,
 * then surfaces other events in the same category that aren't already
 * the user's regulars.
 */
export function recommend(
  state: LiveState,
  limit = 4,
  now: Date = new Date(),
): LiveEvent[] {
  if (state.completions.length === 0) {
    // Cold start: pick a handful of events broadly distributed across categories
    const seen = new Set<string>();
    const out: LiveEvent[] = [];
    for (const e of rankByAliveness(allEvents(state), now)) {
      if (seen.has(e.category)) continue;
      seen.add(e.category);
      out.push(e);
      if (out.length >= limit) break;
    }
    return out;
  }
  const eventMap = new Map(allEvents(state).map((e) => [e.id, e]));
  // Most-completed event ids
  const eventCounts = new Map<string, number>();
  for (const c of state.completions) {
    eventCounts.set(c.eventId, (eventCounts.get(c.eventId) ?? 0) + 1);
  }
  const myEvents = Array.from(eventCounts.keys());
  const myCategories = new Set(
    myEvents
      .map((id) => eventMap.get(id)?.category)
      .filter((x): x is NonNullable<typeof x> => Boolean(x)),
  );
  const candidates = allEvents(state).filter(
    (e) => myCategories.has(e.category) && !myEvents.includes(e.id),
  );
  return rankByAliveness(candidates, now).slice(0, limit);
}
