import type { FamilyFiveWorld } from "@/lib/family/types";

export type WorldMeta = {
  id: FamilyFiveWorld;
  label: string;
  glyph: string;
  oneLine: string;
  body: string;
};

/**
 * The eight Family Five Worlds.
 *
 * Each meta is the only place world copy lives. Cards, dashboards, and
 * the journal read from here so wording stays consistent and warm.
 */
export const familyWorlds: WorldMeta[] = [
  {
    id: "talk",
    label: "Five Talk",
    glyph: "·",
    oneLine: "A short, meaningful conversation.",
    body:
      "Five minutes of real conversation. One open question, no agenda. Often more honest than an hour of small talk.",
  },
  {
    id: "read",
    label: "Five Read",
    glyph: "¶",
    oneLine: "A short story, a paragraph, a poem.",
    body:
      "Read something small together. A bedtime story. A short paragraph. A poem. The point isn’t the page count.",
  },
  {
    id: "play",
    label: "Five Play",
    glyph: "✺",
    oneLine: "A quick game, a silly five.",
    body:
      "A short game, a quiet board moment, a word challenge, a quick round of something. Joy comes back in small doses.",
  },
  {
    id: "learn",
    label: "Five Learn",
    glyph: "✦",
    oneLine: "One small thing, learned together.",
    body:
      "A word, a science fact, a country, a poem, a small new idea. Five minutes is enough to plant a question.",
  },
  {
    id: "move",
    label: "Five Move",
    glyph: "↗",
    oneLine: "Walk, stretch, breathe — together.",
    body:
      "Bodies, gently used, together. A short walk, a stretch, a dance, a few honest breaths. No fitness goals.",
  },
  {
    id: "values",
    label: "Five Values",
    glyph: "♡",
    oneLine: "A small conversation about what matters.",
    body:
      "A short, age-appropriate conversation about one value — courage, kindness, patience, generosity. Without lecturing.",
  },
  {
    id: "couple",
    label: "Five Couple",
    glyph: "◇",
    oneLine: "Five minutes back to each other.",
    body:
      "Five uninterrupted minutes with a partner. One appreciation. One question. One moment without phones.",
  },
  {
    id: "school",
    label: "Five School",
    glyph: "◐",
    oneLine: "About school, without interrogating.",
    body:
      "Five minutes about school that isn’t a homework check. One open question, then listen. Often the best part of the day.",
  },
];

export function getWorld(id: string) {
  return familyWorlds.find((w) => w.id === id);
}
