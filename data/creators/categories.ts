import type { CreatorCategory } from "@/lib/creators/types";

export const creatorCategories: CreatorCategory[] = [
  { id: "calm", label: "Calm", glyph: "·", description: "Settle the system." },
  { id: "breath", label: "Breath", glyph: "◯", description: "A few honest breaths." },
  { id: "focus", label: "Focus", glyph: "▢", description: "Sharpen the next hour." },
  { id: "movement", label: "Movement", glyph: "↗", description: "Bodies, gently used." },
  { id: "music", label: "Music", glyph: "♪", description: "Sound as practice." },
  { id: "writing", label: "Writing", glyph: "¶", description: "Words, returned to." },
  { id: "drawing", label: "Drawing", glyph: "✺", description: "One small mark." },
  { id: "language", label: "Language", glyph: "Aa", description: "Five minutes is enough." },
  { id: "philosophy", label: "Philosophy", glyph: "Π", description: "Slow thinking, briefly." },
  { id: "psychology", label: "Psychology", glyph: "◐", description: "Quiet self-understanding." },
  { id: "parenting", label: "Parenting", glyph: "✿", description: "Five with the children." },
  { id: "leadership", label: "Leadership", glyph: "◇", description: "Presence inside work." },
  { id: "curiosity", label: "Curiosity", glyph: "?", description: "Open one new door." },
  { id: "creativity", label: "Creativity", glyph: "*", description: "Small acts of making." },
  { id: "sleep", label: "Sleep", glyph: "☾", description: "Honest endings to days." },
  { id: "reflection", label: "Reflection", glyph: "—", description: "Notice what is working." },
];

export function getCategory(id: string) {
  return creatorCategories.find((c) => c.id === id);
}
