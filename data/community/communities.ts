import type { Community } from "@/lib/community/types";

/**
 * Seeded communities across the three types. Member counts are
 * deliberately modest and weekly-drop counts deliberately calm — this
 * is not a viral platform.
 */
export const communities: Community[] = [
  // ─── Interest ────────────────────────────────────────────────────
  {
    id: "co-reading",
    name: "Five Reading",
    oneLine: "People reading a little, most days.",
    description:
      "We meet here to keep a quiet reading rhythm — five honest pages, five honest minutes, a sentence we underlined. No reading challenges. No leaderboards. Returning counts.",
    type: "interest",
    tags: ["read", "books", "calm", "slow"],
    glyph: "¶",
    tributary: "letters",
    memberCount: 4128,
    daysActive: 412,
    weeklyDrops: 217,
    presence: [
      { activity: "reading right now", count: 38 },
      { activity: "reading today", count: 184 },
    ],
  },
  {
    id: "co-philosophy",
    name: "Five Philosophy",
    oneLine: "One short thought, slowly chewed.",
    description:
      "For people who carry around questions. We share five-minute reflections, single passages, and the questions we wake up with. Slow over clever.",
    type: "interest",
    tags: ["philosophy", "thinking", "slow", "ideas"],
    glyph: "Π",
    tributary: "ideas",
    memberCount: 1846,
    daysActive: 318,
    weeklyDrops: 98,
    presence: [
      { activity: "thinking right now", count: 12 },
      { activity: "thinking today", count: 71 },
    ],
  },
  {
    id: "co-drawing",
    name: "Five Drawing",
    oneLine: "One small mark, most days.",
    description:
      "A community for adults who almost forgot they like to draw. Five minutes a day, no comparison, sometimes a quick share, often not.",
    type: "interest",
    tags: ["draw", "art", "creative", "small"],
    glyph: "✺",
    tributary: "make",
    memberCount: 1392,
    daysActive: 264,
    weeklyDrops: 142,
    presence: [
      { activity: "drawing today", count: 56 },
      { activity: "returning this week", count: 18 },
    ],
  },
  {
    id: "co-ai-curious",
    name: "Five AI Curious",
    oneLine: "People learning, not posturing.",
    description:
      "Five minutes a day of someone trying to understand what the tools actually do. Honest beginners welcome. No leaderboards of expertise.",
    type: "interest",
    tags: ["ai", "learn", "curious", "tech"],
    glyph: "✦",
    tributary: "learn",
    memberCount: 3210,
    daysActive: 188,
    weeklyDrops: 196,
    presence: [
      { activity: "learning today", count: 132 },
      { activity: "asking a small question", count: 24 },
    ],
  },
  {
    id: "co-running",
    name: "Five Running",
    oneLine: "Five minutes of running. Sometimes walking. Always returning.",
    description:
      "For people building a quiet running practice. Most days. No PRs required. Walks count.",
    type: "interest",
    tags: ["run", "move", "fitness"],
    glyph: "↗",
    tributary: "move",
    memberCount: 2477,
    daysActive: 333,
    weeklyDrops: 218,
    presence: [
      { activity: "running this morning", count: 41 },
      { activity: "walking today", count: 87 },
    ],
  },
  {
    id: "co-writing",
    name: "Five Writing",
    oneLine: "People returning to the page, briefly.",
    description:
      "Five minutes, three sentences, no audience. We share lines we like and reasons we almost stopped.",
    type: "interest",
    tags: ["write", "create", "small", "honest"],
    glyph: "¶",
    tributary: "make",
    memberCount: 2017,
    daysActive: 296,
    weeklyDrops: 161,
    presence: [
      { activity: "writing right now", count: 19 },
      { activity: "thinking about writing", count: 47 },
    ],
  },
  {
    id: "co-chess",
    name: "Five Chess",
    oneLine: "Daily tactics. No ego.",
    description:
      "A small chess practice — one puzzle, one short post-mortem, five minutes. Often more enjoyable than the rating ladder.",
    type: "interest",
    tags: ["chess", "focus", "play"],
    glyph: "♞",
    tributary: "play",
    memberCount: 982,
    daysActive: 154,
    weeklyDrops: 89,
    presence: [
      { activity: "solving a puzzle", count: 14 },
      { activity: "studying today", count: 32 },
    ],
  },
  {
    id: "co-language",
    name: "Five Languages",
    oneLine: "Five minutes of a language, every day.",
    description:
      "People learning Spanish, French, Swedish, Hebrew, Japanese, anything. Five minutes a day. Imperfect by design.",
    type: "interest",
    tags: ["language", "learn", "small", "daily"],
    glyph: "Aa",
    tributary: "learn",
    memberCount: 3514,
    daysActive: 422,
    weeklyDrops: 311,
    presence: [
      { activity: "five minutes today", count: 219 },
      { activity: "returning after a break", count: 28 },
    ],
  },

  // ─── Identity ────────────────────────────────────────────────────
  {
    id: "co-parents-of-young",
    name: "Five Parents — Young Kids",
    oneLine: "For parents finding five minutes between everything.",
    description:
      "A community for parents of young children. Five minutes is enough to read, to breathe, to write, to walk. No guilt, no parenting optimisation.",
    type: "identity",
    tags: ["parent", "family", "tired"],
    glyph: "✿",
    tributary: "people",
    memberCount: 2614,
    daysActive: 311,
    weeklyDrops: 188,
    presence: [
      { activity: "after the kids went to bed", count: 71 },
      { activity: "before they woke up", count: 39 },
    ],
  },
  {
    id: "co-career-change",
    name: "Five Career Change",
    oneLine: "Quiet five-minute steps toward something else.",
    description:
      "A community for people quietly considering a career change — even when the day job is busy. We share small drops on the side: a question explored, a course five minutes opened, a contact written to.",
    type: "identity",
    tags: ["career", "change", "honest"],
    glyph: "→",
    tributary: "people",
    memberCount: 1283,
    daysActive: 198,
    weeklyDrops: 92,
    presence: [
      { activity: "five minutes on the side today", count: 38 },
      { activity: "writing a short letter", count: 7 },
    ],
  },
  {
    id: "co-forty-plus",
    name: "Five at 40+",
    oneLine: "Quiet five-minute work, mid-life.",
    description:
      "Returning to something. Picking up a new thing. Five minutes a day is plenty. No bucket lists.",
    type: "identity",
    tags: ["midlife", "calm", "return"],
    glyph: "—",
    tributary: "people",
    memberCount: 1714,
    daysActive: 268,
    weeklyDrops: 124,
    presence: [
      { activity: "returning after years", count: 22 },
      { activity: "five minutes today", count: 88 },
    ],
  },
  {
    id: "co-tech-workers",
    name: "Five Tech Workers",
    oneLine: "Five minutes outside the screen.",
    description:
      "For people who spend most of the day at a keyboard and would like a small daily practice that has nothing to do with shipping.",
    type: "identity",
    tags: ["tech", "off-screen", "rest"],
    glyph: "▢",
    tributary: "people",
    memberCount: 2934,
    daysActive: 244,
    weeklyDrops: 173,
    presence: [
      { activity: "five minutes off-screen", count: 102 },
      { activity: "walking between meetings", count: 49 },
    ],
  },

  // ─── Micro-multipotential ──────────────────────────────────────────
  {
    id: "co-micro-mp",
    name: "Five Micro-Multipotential",
    oneLine: "For people who quietly want to be more than one thing.",
    description:
      "A community for people who keep many quiet small interests at once. We share drops across them, without apology. The point is variety with consistency — not a single specialism.",
    type: "micro-multipotential",
    tags: ["variety", "curious", "identity"],
    glyph: "∞",
    tributary: "ideas",
    memberCount: 1146,
    daysActive: 161,
    weeklyDrops: 118,
    presence: [
      { activity: "drops across three rivers today", count: 41 },
      { activity: "starting something new", count: 11 },
    ],
  },
  {
    id: "co-non-linear",
    name: "Five Non-linear",
    oneLine: "People whose lives don't move in straight lines.",
    description:
      "We share small returns after long pauses. We do not romanticise stopping. We do not condemn it either. Five honest minutes a day, even when the bigger picture is moving sideways.",
    type: "micro-multipotential",
    tags: ["non-linear", "return", "honest"],
    glyph: "/",
    tributary: "ideas",
    memberCount: 904,
    daysActive: 127,
    weeklyDrops: 87,
    presence: [
      { activity: "returning today", count: 24 },
      { activity: "starting over kindly", count: 9 },
    ],
  },
];

export function getCommunity(id: string) {
  return communities.find((c) => c.id === id);
}
