import type { CubeId } from "./types";

export const CUBE_LABEL: Record<string, string> = {
  solo: "five solo",
  "tipping-point": "five tipping point",
  content: "five content",
  family: "five family",
  organizations: "five organizations",
  creators: "five creators",
  "live-event": "five live event",
  community: "five community",
  project: "five project",
  "your-own": "five your own",
  manifesto: "five manifesto",
  reflection: "five reflection",
};

export const CUBE_GLYPH: Record<string, string> = {
  solo: "·",
  "tipping-point": "/",
  content: "¶",
  family: "✿",
  organizations: "◇",
  creators: "✺",
  "live-event": "◉",
  community: "∞",
  project: "▢",
  "your-own": "✻",
  manifesto: "—",
  reflection: "◐",
};

/** Hrefs to navigate to each cube. */
export const CUBE_HREF: Record<string, string> = {
  solo: "/cubes/solo",
  "tipping-point": "/cubes/tipping-point",
  content: "/cubes/content",
  family: "/cubes/family",
  organizations: "/cubes/organizations",
  creators: "/cubes/creators",
  "live-event": "/cubes/live-event/discover",
  community: "/cubes/community",
  project: "/cubes/project/home",
  "your-own": "/cubes/your-own",
};

export function shortDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function longDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function mondayOf(d: Date): Date {
  const day = d.getDay() || 7; // Sun = 7
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - (day - 1));
  return m;
}

export function cubeLabelFor(id: CubeId): string {
  return CUBE_LABEL[id] ?? id;
}

export function cubeGlyphFor(id: CubeId): string {
  return CUBE_GLYPH[id] ?? "·";
}

export function cubeHrefFor(id: CubeId): string | null {
  return CUBE_HREF[id] ?? null;
}
