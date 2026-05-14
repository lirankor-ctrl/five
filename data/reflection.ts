import type { SwotEntry } from "@/lib/types";

/**
 * SWOT — re-framed as a respectful mirror, not a scoring grid.
 * The labels and prompts intentionally avoid corporate language.
 */
export const swot: SwotEntry[] = [
  {
    key: "strengths",
    label: "Strengths",
    prompt: "What is quietly working for you right now?",
    placeholders: [
      "A small habit that has stayed.",
      "A person you returned to.",
      "A drop you took without overthinking.",
    ],
  },
  {
    key: "adjust",
    label: "Areas to adjust",
    prompt: "What feels a little off, gently?",
    placeholders: [
      "A pattern that no longer fits.",
      "A small friction in your day.",
      "A drop you keep skipping.",
    ],
  },
  {
    key: "opportunities",
    label: "Opportunities",
    prompt: "What is quietly opening?",
    placeholders: [
      "A door that wasn’t there last month.",
      "A conversation worth having.",
      "A direction you’d like to follow further.",
    ],
  },
  {
    key: "blockers",
    label: "Possible blockers",
    prompt: "What is in the way — without blame?",
    placeholders: [
      "An obligation that needs renegotiating.",
      "A fear that wants acknowledgement.",
      "A tool or routine that isn’t helping.",
    ],
  },
];
