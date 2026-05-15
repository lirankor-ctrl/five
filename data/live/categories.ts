import type { EventCategory } from "@/lib/live/types";

export type CategoryMeta = {
  id: EventCategory;
  label: string;
  glyph: string;
  oneLine: string;
  body: string;
};

export const eventCategories: CategoryMeta[] = [
  {
    id: "content",
    label: "Content",
    glyph: "¶",
    oneLine: "Shared reading. Shared listening.",
    body:
      "Read a chapter together. Listen to one talk. Sit quietly with the same paragraph. Different homes, same page.",
  },
  {
    id: "growth",
    label: "Growth",
    glyph: "✦",
    oneLine: "Small inner work, with company.",
    body:
      "Meditation. Journaling. Reflection. Gratitude. Tiny growth done alongside other people.",
  },
  {
    id: "fitness",
    label: "Fitness",
    glyph: "↗",
    oneLine: "Move for five — together.",
    body:
      "A stretch, a walk, five push-ups, five sun salutations. No competition. Just shared movement.",
  },
  {
    id: "creative",
    label: "Creative",
    glyph: "✺",
    oneLine: "Make something small, side by side.",
    body:
      "Five minutes of writing, drawing, photography, calligraphy, an idea on paper. The session is the deadline.",
  },
  {
    id: "project",
    label: "Project",
    glyph: "▢",
    oneLine: "Consistency, with other people in the room.",
    body:
      "Studying. Writing the book. Building the startup. Learning the language. Quiet shared focus.",
  },
  {
    id: "family",
    label: "Family",
    glyph: "✿",
    oneLine: "Small shared moments with the people at home.",
    body:
      "Five with the kids. Reading together across households. Light family momentum without obligation.",
  },
  {
    id: "organizational",
    label: "Organizational",
    glyph: "◇",
    oneLine: "Team momentum in five minutes.",
    body:
      "Five reflection. Five innovation. Five lost customer. Team versions of the FIVE Organizations cube.",
  },
];

export function getCategory(id: EventCategory): CategoryMeta {
  return eventCategories.find((c) => c.id === id) ?? eventCategories[0];
}
