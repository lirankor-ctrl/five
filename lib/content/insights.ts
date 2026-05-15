import { contentItems } from "@/data/content/items";
import type {
  ContentCategoryId,
  ContentInsight,
  ContentItem,
  ContentSession,
  ContentState,
  ContentType,
} from "./types";

const CATEGORY_LABEL: Record<ContentCategoryId, string> = {
  move: "movement",
  fitness: "fitness",
  breathe: "breathing",
  create: "creative",
  read: "reading",
  listen: "listening",
  focus: "focus",
  learn: "learning",
  language: "language",
  philosophy: "philosophy",
  music: "music",
  writing: "writing",
  calm: "calm",
  curiosity: "curiosity",
};

const TYPE_LABEL: Record<ContentType, string> = {
  app: "app",
  video: "video",
  article: "article",
  podcast: "podcast",
  course: "course",
  website: "website",
  audio: "audio",
};

function itemMap(): Map<string, ContentItem> {
  return new Map(contentItems.map((it) => [it.id, it]));
}

export function doneSessions(state: ContentState): ContentSession[] {
  return state.sessions.filter((s) => s.status === "done");
}

export function preferenceSnapshot(state: ContentState): {
  hourHistogram: Record<number, number>;
  categoryHistogram: Partial<Record<ContentCategoryId, number>>;
  typeHistogram: Partial<Record<ContentType, number>>;
} {
  const hourHistogram: Record<number, number> = {};
  const categoryHistogram: Partial<Record<ContentCategoryId, number>> = {};
  const typeHistogram: Partial<Record<ContentType, number>> = {};
  const map = itemMap();

  for (const s of doneSessions(state)) {
    const item = map.get(s.contentItemId);
    if (!item) continue;
    const hour = new Date(s.completedAt ?? s.startedAt).getHours();
    hourHistogram[hour] = (hourHistogram[hour] ?? 0) + 1;
    categoryHistogram[item.category] =
      (categoryHistogram[item.category] ?? 0) + 1;
    typeHistogram[item.contentType] =
      (typeHistogram[item.contentType] ?? 0) + 1;
  }
  return { hourHistogram, categoryHistogram, typeHistogram };
}

function topKey<K extends string>(
  bucket: Partial<Record<K, number>>,
  min = 2,
): K | null {
  let best: K | null = null;
  let bestCount = 0;
  for (const [k, v] of Object.entries(bucket) as Array<[K, number]>) {
    if (v > bestCount && v >= min) {
      best = k;
      bestCount = v;
    }
  }
  return best;
}

export function generateContentInsights(
  state: ContentState,
): ContentInsight[] {
  const out: ContentInsight[] = [];
  const done = doneSessions(state);

  if (done.length === 0) {
    return out;
  }

  if (done.length < 3) {
    out.push({
      kind: "early-momentum",
      body:
        "Still early. After a few more sessions, patterns will surface here.",
    });
    return out;
  }

  const { hourHistogram, categoryHistogram, typeHistogram } =
    preferenceSnapshot(state);

  const topCat = topKey<ContentCategoryId>(categoryHistogram);
  if (topCat) {
    out.push({
      kind: "preferred-category",
      body: `A river seems to be forming around ${CATEGORY_LABEL[topCat]}.`,
    });
  }

  const topType = topKey<ContentType>(typeHistogram);
  if (topType) {
    out.push({
      kind: "preferred-type",
      body: `${TYPE_LABEL[topType].charAt(0).toUpperCase()}${TYPE_LABEL[topType].slice(1)} content holds your attention more than other formats.`,
    });
  }

  // Preferred hour window
  let bestHour: number | null = null;
  let bestHourCount = 0;
  for (const [h, c] of Object.entries(hourHistogram)) {
    const hh = parseInt(h, 10);
    if (c >= 3 && c > bestHourCount) {
      bestHour = hh;
      bestHourCount = c;
    }
  }
  if (bestHour !== null) {
    const phrase =
      bestHour < 11 ? "in the morning" : bestHour < 17 ? "in the afternoon" : "in the evening";
    out.push({
      kind: "preferred-hour",
      body: `Most of your completed five-minutes happen ${phrase}.`,
    });
  }

  // Variety vs depth
  const distinctCats = Object.keys(categoryHistogram).length;
  if (done.length >= 6 && distinctCats >= 5) {
    out.push({
      kind: "depth-vs-variety",
      body: "You drift across many topics. Variety seems to be the engine.",
    });
  } else if (done.length >= 6 && distinctCats <= 2) {
    out.push({
      kind: "depth-vs-variety",
      body: "You keep returning to the same one or two themes. Depth, not breadth.",
    });
  }

  if (out.length === 0) {
    out.push({
      kind: "gentle-return",
      body: "A small rhythm is forming. Keep the sessions small.",
    });
  }

  return out;
}
