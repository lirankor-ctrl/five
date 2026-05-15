import { communities } from "@/data/community/communities";
import { drops } from "@/data/community/drops";
import type {
  Community,
  CommunityState,
  DiscoverFilters,
  DropUpdate,
} from "./types";

export function allCommunities(): Community[] {
  return communities;
}

export function discoverCommunities(
  filters: DiscoverFilters,
  query = "",
): Community[] {
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
  let pool = communities.slice();
  if (filters.type) pool = pool.filter((c) => c.type === filters.type);
  if (filters.tag) pool = pool.filter((c) => c.tags.includes(filters.tag!));
  if (tokens.length > 0) {
    pool = pool.filter((c) => {
      const hay = `${c.name} ${c.oneLine} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }
  // Stable sort: micro-multipotential first if it matches; otherwise alphabetical.
  pool.sort((a, b) => a.name.localeCompare(b.name));
  return pool;
}

/**
 * Compatibility-shaped recommendations.
 *
 * Reads which communities the user has joined and surfaces calm sibling
 * communities — same tributary, overlapping tags, or kindred type.
 */
export function recommendForUser(
  state: CommunityState,
  limit = 4,
): Community[] {
  if (state.joinedCommunities.length === 0) {
    // Cold start — surface one from each type at most.
    const seen = new Set<string>();
    const out: Community[] = [];
    for (const c of communities) {
      if (seen.has(c.type)) continue;
      seen.add(c.type);
      out.push(c);
      if (out.length >= limit) break;
    }
    return out;
  }
  const joined = communities.filter((c) =>
    state.joinedCommunities.includes(c.id),
  );
  const joinedTags = new Set(joined.flatMap((c) => c.tags));
  const joinedTributaries = new Set(
    joined.map((c) => c.tributary).filter(Boolean) as string[],
  );

  const scored = communities
    .filter((c) => !state.joinedCommunities.includes(c.id))
    .map((c) => {
      let score = 0;
      if (c.tributary && joinedTributaries.has(c.tributary)) score += 4;
      const overlap = c.tags.filter((t) => joinedTags.has(t)).length;
      score += overlap * 2;
      // small boost for matching type
      if (joined.some((j) => j.type === c.type)) score += 1;
      return { c, score };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.c);
}

/** Recent drops across a set of community ids. */
export function dropsAcross(
  state: CommunityState,
  communityIds: string[] | "all",
  limit = 20,
): DropUpdate[] {
  const seeded =
    communityIds === "all"
      ? drops
      : drops.filter((d) => communityIds.includes(d.communityId));
  const mine =
    communityIds === "all"
      ? state.myDrops
      : state.myDrops.filter((d) => communityIds.includes(d.communityId));
  return [...seeded, ...mine]
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}
