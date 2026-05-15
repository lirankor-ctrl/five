import type { Mood } from "@/lib/creators/types";

/**
 * Moods are intentions — what the user wants for the next five minutes.
 * Not emotional states. The discovery surface uses these instead of star
 * ratings or trending lists.
 */
export const moods: Mood[] = [
  { id: "relax", label: "Relax", intention: "I want five minutes to relax." },
  { id: "inspire", label: "Inspire", intention: "I want five minutes of inspiration." },
  { id: "create", label: "Create", intention: "I want to feel creative." },
  { id: "learn", label: "Learn", intention: "I want to learn something small." },
  { id: "reset", label: "Reset focus", intention: "I want to reset my focus." },
  { id: "calm-anxiety", label: "Calm anxiety", intention: "I want to settle a busy mind." },
  { id: "move", label: "Move", intention: "I want to move my body, briefly." },
  { id: "with-child", label: "With a child", intention: "I want five with my child." },
  { id: "end-the-day", label: "End the day", intention: "I want to end the day well." },
  { id: "start-the-day", label: "Start the day", intention: "I want a small honest start." },
  { id: "think-deeper", label: "Think deeper", intention: "I want one real thought to chew on." },
  { id: "with-partner", label: "With a partner", intention: "I want five with someone close." },
];

export function getMood(id: string) {
  return moods.find((m) => m.id === id);
}
