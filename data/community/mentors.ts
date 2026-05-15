import type { Mentor } from "@/lib/community/types";

/**
 * "Mentors of Momentum" — not influencers, not staff. Long-active members
 * whose reputation is shaped entirely by consistency and helping others
 * sustain. No followers, no like counts.
 */
export const mentors: Mentor[] = [
  {
    id: "u-marc",
    name: "Marc L.",
    oneLine: "Retired teacher. Still curious. Five minutes every morning.",
    communityIds: ["co-philosophy", "co-reading"],
    daysActive: 612,
    dropsContributed: 487,
    helpedCount: 138,
  },
  {
    id: "u-josephine",
    name: "Josephine P.",
    oneLine: "Clinical psychologist. Calm threads about restarting.",
    communityIds: ["co-non-linear", "co-tech-workers"],
    daysActive: 488,
    dropsContributed: 312,
    helpedCount: 211,
  },
  {
    id: "u-ines",
    name: "Ines O.",
    oneLine: "Moves a little, most days. Sometimes walks.",
    communityIds: ["co-running"],
    daysActive: 422,
    dropsContributed: 401,
    helpedCount: 117,
  },
  {
    id: "u-david",
    name: "David S.",
    oneLine: "Father of two. Posts after the kids are asleep.",
    communityIds: ["co-parents-of-young", "co-reading"],
    daysActive: 364,
    dropsContributed: 298,
    helpedCount: 96,
  },
  {
    id: "u-leyla",
    name: "Leyla A.",
    oneLine: "Architect. Notebooks. Quiet drops about looking at objects.",
    communityIds: ["co-philosophy", "co-writing"],
    daysActive: 311,
    dropsContributed: 251,
    helpedCount: 82,
  },
  {
    id: "u-sara",
    name: "Sara E.",
    oneLine: "Learned Swedish in her fifties. Patient.",
    communityIds: ["co-language", "co-forty-plus"],
    daysActive: 274,
    dropsContributed: 198,
    helpedCount: 68,
  },
  {
    id: "u-rafa",
    name: "Rafa P.",
    oneLine: "Tinkering with AI without performing expertise.",
    communityIds: ["co-ai-curious"],
    daysActive: 142,
    dropsContributed: 88,
    helpedCount: 41,
  },
  {
    id: "u-noor",
    name: "Noor B.",
    oneLine: "Cognitive science researcher. Posts one finding a week.",
    communityIds: ["co-philosophy", "co-ai-curious"],
    daysActive: 196,
    dropsContributed: 102,
    helpedCount: 47,
  },
];

export function getMentor(id: string) {
  return mentors.find((m) => m.id === id);
}
