import type { ContentCategory } from "@/lib/content/types";

export const contentCategories: ContentCategory[] = [
  {
    id: "move",
    label: "Move",
    glyph: "↗",
    description: "Stretch, walk, micro-strength.",
  },
  {
    id: "fitness",
    label: "Fitness",
    glyph: "▲",
    description: "Short, real workouts.",
  },
  {
    id: "breathe",
    label: "Breathe",
    glyph: "◯",
    description: "A few honest breaths.",
  },
  {
    id: "calm",
    label: "Calm",
    glyph: "·",
    description: "Quiet down the system.",
  },
  {
    id: "focus",
    label: "Focus",
    glyph: "▢",
    description: "Sharpen for the next hour.",
  },
  {
    id: "learn",
    label: "Learn",
    glyph: "✦",
    description: "One small idea, well.",
  },
  {
    id: "language",
    label: "Language",
    glyph: "Aa",
    description: "Five minutes is enough.",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    glyph: "Π",
    description: "Slow thinking, briefly.",
  },
  {
    id: "music",
    label: "Music",
    glyph: "♪",
    description: "Play. Listen well.",
  },
  {
    id: "create",
    label: "Create",
    glyph: "✺",
    description: "Make a small thing.",
  },
  {
    id: "writing",
    label: "Writing",
    glyph: "¶",
    description: "One real sentence.",
  },
  {
    id: "read",
    label: "Read",
    glyph: "📖",
    description: "Five minutes of pages.",
  },
  {
    id: "listen",
    label: "Listen",
    glyph: "▶",
    description: "Short, well-made audio.",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    glyph: "?",
    description: "Open one new door.",
  },
];

export function getCategory(id: string) {
  return contentCategories.find((c) => c.id === id);
}
