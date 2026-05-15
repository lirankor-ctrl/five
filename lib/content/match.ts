import { contentItems } from "@/data/content/items";
import type {
  ContentCategoryId,
  ContentItem,
  ContentType,
  Difficulty,
  Pricing,
} from "./types";

export type Filters = {
  category?: ContentCategoryId;
  contentType?: ContentType;
  maxDuration?: number;
  difficulty?: Difficulty;
  pricing?: Pricing | "any";
};

/**
 * Naive scoring: token overlap on title + description + tags + category.
 *
 * Intentionally simple — when this moves to a server / vector search,
 * the call site (a single function) is the only thing that needs to change.
 */
export function searchContent(
  query: string,
  filters: Filters,
  limit = 30,
): ContentItem[] {
  const q = query.trim().toLowerCase();
  const tokens = q.length > 0 ? q.split(/\s+/).filter(Boolean) : [];

  const filtered = contentItems.filter((it) => passes(it, filters));

  if (tokens.length === 0) {
    // No query — surface a category-balanced default sort.
    return filtered.slice(0, limit);
  }

  const scored = filtered.map((it) => ({
    it,
    score: scoreItem(it, tokens),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.it);
}

function passes(item: ContentItem, f: Filters): boolean {
  if (f.category && item.category !== f.category) return false;
  if (f.contentType && item.contentType !== f.contentType) return false;
  if (f.maxDuration && item.durationMinutes > f.maxDuration) return false;
  if (f.difficulty && item.difficulty !== f.difficulty) return false;
  if (f.pricing && f.pricing !== "any" && item.pricing !== f.pricing) return false;
  return true;
}

function scoreItem(item: ContentItem, tokens: string[]): number {
  const haystacks: Array<{ text: string; weight: number }> = [
    { text: item.title.toLowerCase(), weight: 6 },
    { text: item.description.toLowerCase(), weight: 2 },
    { text: item.category, weight: 4 },
    { text: item.tags.join(" "), weight: 5 },
    { text: item.whyItFits.toLowerCase(), weight: 1 },
  ];
  let total = 0;
  for (const t of tokens) {
    for (const h of haystacks) {
      if (h.text.includes(t)) total += h.weight;
    }
  }
  return total;
}
