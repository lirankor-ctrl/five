import type { DropUpdate } from "@/lib/community/types";

function iso(daysAgo: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/**
 * Seeded drop updates across communities. Tone is intentionally
 * unperformative — small, honest, often dull. That's the point.
 */
export const drops: DropUpdate[] = [
  // Reading
  {
    id: "d-r-1",
    communityId: "co-reading",
    authorId: "u-marc",
    authorName: "Marc L.",
    authorIsMentor: true,
    body: "Five quiet pages. Same chair. Tea was already cold.",
    tag: "returning",
    createdAt: iso(0, 8),
  },
  {
    id: "d-r-2",
    communityId: "co-reading",
    authorId: "u-david",
    authorName: "David S.",
    authorIsMentor: true,
    body: "Read a paragraph after the kids slept. Re-read it. Underlined the third sentence.",
    createdAt: iso(0, 22),
  },
  {
    id: "d-r-3",
    communityId: "co-reading",
    authorId: "u-priya",
    authorName: "Priya S.",
    body: "Tried to read on the bus. Five honest minutes between two stops.",
    createdAt: iso(1, 18),
  },
  {
    id: "d-r-4",
    communityId: "co-reading",
    authorId: "u-mei",
    authorName: "Mei W.",
    body: "First time finishing a chapter in three weeks. No streak to defend.",
    tag: "after-pause",
    createdAt: iso(2, 21),
  },
  {
    id: "d-r-5",
    communityId: "co-reading",
    authorId: "u-anon-1",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "I am the slowest reader in this community and I am fine with it.",
    createdAt: iso(3, 11),
  },

  // Philosophy
  {
    id: "d-p-1",
    communityId: "co-philosophy",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    body: "Spent five minutes with the sentence “habit is a second nature which destroys the first.” Walking around with it now.",
    createdAt: iso(0, 9),
  },
  {
    id: "d-p-2",
    communityId: "co-philosophy",
    authorId: "u-noor",
    authorName: "Noor B.",
    authorIsMentor: true,
    body: "Tiny finding: people report meaning more from sustained interest than peak intensity. Sitting with it.",
    createdAt: iso(1, 14),
  },
  {
    id: "d-p-3",
    communityId: "co-philosophy",
    authorId: "u-elena",
    authorName: "Elena R.",
    body: "One quote, five minutes, in my notebook. That's the whole post.",
    createdAt: iso(2, 21),
  },

  // Drawing
  {
    id: "d-d-1",
    communityId: "co-drawing",
    authorId: "u-jonas",
    authorName: "Jonas A.",
    body: "One coffee cup. One pencil. Five minutes.",
    createdAt: iso(0, 8),
  },
  {
    id: "d-d-2",
    communityId: "co-drawing",
    authorId: "u-kim",
    authorName: "Kim O.",
    body: "Sketched my desk again. Already getting better at the lamp.",
    tag: "consistency",
    createdAt: iso(1, 19),
  },
  {
    id: "d-d-3",
    communityId: "co-drawing",
    authorId: "u-anon-2",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Drew very badly today. Posting anyway, because that was the point.",
    tag: "returning",
    createdAt: iso(2, 22),
  },

  // AI curious
  {
    id: "d-ai-1",
    communityId: "co-ai-curious",
    authorId: "u-rafa",
    authorName: "Rafa P.",
    authorIsMentor: true,
    body: "Five minutes of prompting practice. Asked a model to explain something I almost understood.",
    createdAt: iso(0, 16),
  },
  {
    id: "d-ai-2",
    communityId: "co-ai-curious",
    authorId: "u-sara",
    authorName: "Sara E.",
    body: "Learning what tokens are. It will take me weeks. That's fine.",
    tag: "honest-beginner",
    createdAt: iso(1, 19),
  },
  {
    id: "d-ai-3",
    communityId: "co-ai-curious",
    authorId: "u-anon-3",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Read one paper abstract over breakfast. Did not understand 30%. Counted anyway.",
    createdAt: iso(2, 8),
  },

  // Running
  {
    id: "d-run-1",
    communityId: "co-running",
    authorId: "u-ines",
    authorName: "Ines O.",
    authorIsMentor: true,
    body: "Five-minute easy jog. Slowest in two months. Most honest run all week.",
    createdAt: iso(0, 7),
  },
  {
    id: "d-run-2",
    communityId: "co-running",
    authorId: "u-tom",
    authorName: "Tom F.",
    body: "Walked. Counted.",
    tag: "walking-counts",
    createdAt: iso(1, 7),
  },
  {
    id: "d-run-3",
    communityId: "co-running",
    authorId: "u-anon-4",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Returning after the calf injury. Three minutes. Zero ego.",
    tag: "returning",
    createdAt: iso(3, 17),
  },

  // Writing
  {
    id: "d-w-1",
    communityId: "co-writing",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    body: "Three sentences before coffee. None of them stayed by lunch. The page did.",
    createdAt: iso(0, 7),
  },
  {
    id: "d-w-2",
    communityId: "co-writing",
    authorId: "u-elena",
    authorName: "Elena R.",
    body: "Wrote a paragraph I almost deleted. Letting it sit.",
    createdAt: iso(2, 22),
  },

  // Chess
  {
    id: "d-c-1",
    communityId: "co-chess",
    authorId: "u-noah",
    authorName: "Noah T.",
    body: "One tactic. Solved in 90 seconds. Felt clear-headed for an hour.",
    createdAt: iso(0, 11),
  },

  // Language
  {
    id: "d-l-1",
    communityId: "co-language",
    authorId: "u-sara",
    authorName: "Sara E.",
    authorIsMentor: true,
    body: "Three Swedish words at the kitchen table. Said them out loud. Apologised to nobody.",
    createdAt: iso(0, 20),
  },
  {
    id: "d-l-2",
    communityId: "co-language",
    authorId: "u-mei",
    authorName: "Mei W.",
    body: "Five minutes of Japanese vocabulary. Forgot half by tomorrow probably. Still counts.",
    createdAt: iso(1, 8),
  },
  {
    id: "d-l-3",
    communityId: "co-language",
    authorId: "u-anon-5",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "First five-minute Spanish session in 6 weeks. No streak. No guilt.",
    tag: "after-pause",
    createdAt: iso(3, 19),
  },

  // Parents of young
  {
    id: "d-par-1",
    communityId: "co-parents-of-young",
    authorId: "u-david",
    authorName: "David S.",
    authorIsMentor: true,
    body: "Five minutes of reading after both kids were finally asleep. Felt like recess.",
    createdAt: iso(0, 23),
  },
  {
    id: "d-par-2",
    communityId: "co-parents-of-young",
    authorId: "u-anon-6",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Sat on the kitchen floor for five minutes before the day began. That was the practice.",
    createdAt: iso(1, 6),
  },

  // Career change
  {
    id: "d-cc-1",
    communityId: "co-career-change",
    authorId: "u-tom",
    authorName: "Tom F.",
    body: "Wrote one short letter to a person whose work I admire. Did not send it yet. Still counts.",
    tag: "small-step",
    createdAt: iso(0, 21),
  },
  {
    id: "d-cc-2",
    communityId: "co-career-change",
    authorId: "u-anon-7",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Took the first course on the side. Five minutes. Closed it. Will be back tomorrow.",
    createdAt: iso(2, 21),
  },

  // Forty plus
  {
    id: "d-fp-1",
    communityId: "co-forty-plus",
    authorId: "u-marc",
    authorName: "Marc L.",
    authorIsMentor: true,
    body: "Picked up the guitar I haven't touched in 18 months. Tuned it. Stopped. Tomorrow: one chord.",
    tag: "returning",
    createdAt: iso(0, 19),
  },

  // Tech workers
  {
    id: "d-tw-1",
    communityId: "co-tech-workers",
    authorId: "u-rafa",
    authorName: "Rafa P.",
    authorIsMentor: true,
    body: "Five minutes outside between two meetings. Did not check Slack. Surprise — nothing broke.",
    createdAt: iso(0, 15),
  },
  {
    id: "d-tw-2",
    communityId: "co-tech-workers",
    authorId: "u-anon-8",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Closed all tabs for five minutes. Stretched. Felt unreasonable.",
    createdAt: iso(1, 12),
  },

  // Micro-multipotential
  {
    id: "d-mm-1",
    communityId: "co-micro-mp",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    body: "Today: five minutes of drawing, then five minutes of writing. Both small. Both mine.",
    createdAt: iso(0, 9),
  },
  {
    id: "d-mm-2",
    communityId: "co-micro-mp",
    authorId: "u-anon-9",
    authorName: "a quiet five-er",
    anonymous: true,
    body: "Read · sketch · code. Five minutes of each. The variety is the engine.",
    createdAt: iso(1, 20),
  },

  // Non-linear
  {
    id: "d-nl-1",
    communityId: "co-non-linear",
    authorId: "u-josephine",
    authorName: "Josephine P.",
    authorIsMentor: true,
    body: "Returning to my morning practice after three quiet weeks. No drama. No catch-up.",
    tag: "returning",
    createdAt: iso(0, 7),
  },
];
