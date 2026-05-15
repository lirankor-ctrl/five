import { creatorSessions } from "@/data/creators/sessions";
import type {
  CreatorSession,
  CreatorsState,
  DiscoverFilters,
} from "./types";

/**
 * Discover filtering + scoring.
 *
 * Combined sources: seeded catalog + user-added drafts (so a creator
 * can see their own session appear in discover after publishing).
 */
export function allSessions(state: CreatorsState): CreatorSession[] {
  return [...creatorSessions, ...state.drafts];
}

export function discoverSessions(
  state: CreatorsState,
  filters: DiscoverFilters,
  query = "",
  limit = 60,
): CreatorSession[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const all = allSessions(state);

  const filtered = all.filter((s) => {
    if (filters.category && s.category !== filters.category) return false;
    if (filters.mood && !s.moods.includes(filters.mood)) return false;
    if (filters.type && s.type !== filters.type) return false;
    if (filters.maxDuration && s.durationMinutes > filters.maxDuration)
      return false;
    if (filters.energy && s.energy !== filters.energy) return false;
    if (filters.audience && s.audience !== filters.audience) return false;
    if (
      filters.pricing &&
      filters.pricing !== "any" &&
      s.pricing !== filters.pricing
    )
      return false;
    return true;
  });

  if (tokens.length === 0) {
    return filtered.slice(0, limit);
  }

  const scored = filtered.map((s) => ({
    s,
    score: scoreSession(s, tokens),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((x) => x.score > 0)
    .slice(0, limit)
    .map((x) => x.s);
}

function scoreSession(s: CreatorSession, tokens: string[]): number {
  const haystacks: Array<{ text: string; weight: number }> = [
    { text: s.title.toLowerCase(), weight: 6 },
    { text: s.hook.toLowerCase(), weight: 4 },
    { text: s.description.toLowerCase(), weight: 2 },
    { text: s.category, weight: 3 },
    { text: s.moods.join(" "), weight: 4 },
    { text: s.type, weight: 2 },
  ];
  let total = 0;
  for (const t of tokens) {
    for (const h of haystacks) if (h.text.includes(t)) total += h.weight;
  }
  return total;
}
