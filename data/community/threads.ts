import type { MomentumThread } from "@/lib/community/types";

function iso(daysAgo: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/**
 * Momentum threads — conversations about consistency, restarting,
 * burnout, and balancing many interests. Not "how to win". Not "how to
 * become wildly successful". Useful, calm threads.
 */
export const threads: MomentumThread[] = [
  {
    id: "t-1",
    communityId: "co-non-linear",
    title: "How do you actually restart after a long pause?",
    openerBody:
      "It has been about ten weeks. I keep almost starting and then doing nothing for another evening. Would love to hear small things that worked, not productivity advice.",
    openerAuthorId: "u-anon-100",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(5, 21),
    replies: [
      {
        id: "t-1-r-1",
        authorId: "u-josephine",
        authorName: "Josephine P.",
        authorIsMentor: true,
        body:
          "Smaller than you think — and remove the catch-up framing. Today is day 1, not day 71. Five honest minutes is plenty.",
        createdAt: iso(5, 22),
      },
      {
        id: "t-1-r-2",
        authorId: "u-marc",
        authorName: "Marc L.",
        authorIsMentor: true,
        body:
          "I put the book on my chair every night for a week. That was the whole plan. The reading came back on day 4.",
        createdAt: iso(5, 23),
      },
      {
        id: "t-1-r-3",
        authorId: "u-priya",
        authorName: "Priya S.",
        body:
          "Set a comically small target — 90 seconds. Hit it. Resist the urge to do more. Repeat.",
        createdAt: iso(4, 7),
      },
    ],
  },
  {
    id: "t-2",
    communityId: "co-micro-mp",
    title: "How do you balance multiple interests without dropping them all?",
    openerBody:
      "I want to read, draw, code, and learn Spanish. I usually rotate then collapse. Anyone found a sustainable rhythm with multiple small interests?",
    openerAuthorId: "u-anon-101",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(7, 19),
    replies: [
      {
        id: "t-2-r-1",
        authorId: "u-leyla",
        authorName: "Leyla A.",
        authorIsMentor: true,
        body:
          "I assign one to mornings, one to evenings, one to weekend. The fourth I do not commit to — it arrives when it arrives.",
        createdAt: iso(7, 21),
      },
      {
        id: "t-2-r-2",
        authorId: "u-rafa",
        authorName: "Rafa P.",
        authorIsMentor: true,
        body:
          "Two anchors, two drifters. Anchors are the two things I do most days; drifters rotate. Cuts the guilt of not doing all four every day.",
        createdAt: iso(7, 22),
      },
    ],
  },
  {
    id: "t-3",
    communityId: "co-tech-workers",
    title: "Five minutes off-screen — what actually works mid-workday?",
    openerBody:
      "Looking for five-minute things that aren't just 'go for a walk' (love the walk; not always possible mid-day).",
    openerAuthorId: "u-anon-102",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(3, 13),
    replies: [
      {
        id: "t-3-r-1",
        authorId: "u-ines",
        authorName: "Ines O.",
        authorIsMentor: true,
        body:
          "Five floor minutes between meetings: hand on the floor, feet hip-width, breathe. No yoga vocabulary.",
        createdAt: iso(3, 14),
      },
      {
        id: "t-3-r-2",
        authorId: "u-josephine",
        authorName: "Josephine P.",
        authorIsMentor: true,
        body:
          "Window-staring counts. Five minutes looking at one thing outside without picking up your phone. Restores something.",
        createdAt: iso(3, 14),
      },
    ],
  },
  {
    id: "t-4",
    communityId: "co-reading",
    title: "When the book bores me — finish or move on?",
    openerBody:
      "I have permission-to-quit-a-book guilt. Anyone else?",
    openerAuthorId: "u-anon-103",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(9, 19),
    replies: [
      {
        id: "t-4-r-1",
        authorId: "u-marc",
        authorName: "Marc L.",
        authorIsMentor: true,
        body:
          "Read 50 pages. If you would not recommend it after 50, return it kindly to the shelf. Reading is too important to spend on the wrong book.",
        createdAt: iso(9, 20),
      },
    ],
  },
  {
    id: "t-5",
    communityId: "co-running",
    title: "Mornings or evenings?",
    openerBody:
      "Trying to settle on a time and stop arguing with myself every day.",
    openerAuthorId: "u-anon-104",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(2, 6),
    replies: [
      {
        id: "t-5-r-1",
        authorId: "u-ines",
        authorName: "Ines O.",
        authorIsMentor: true,
        body:
          "Whichever you will not negotiate with. Most people I work with: morning wins on consistency, evening wins on enjoyment. Pick the one you're tired of restarting.",
        createdAt: iso(2, 7),
      },
    ],
  },
  {
    id: "t-6",
    communityId: "co-parents-of-young",
    title: "A five for me, when nothing is mine?",
    openerBody:
      "Two small kids. Most days the only quiet five I get is after 10pm. Anyone else built a practice that runs that late?",
    openerAuthorId: "u-anon-105",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(8, 22),
    replies: [
      {
        id: "t-6-r-1",
        authorId: "u-david",
        authorName: "David S.",
        authorIsMentor: true,
        body:
          "Mine is 10:15pm reading. Five pages, not five chapters. Lights dim. No phone in the bedroom. Survived 8 months of it.",
        createdAt: iso(8, 22),
      },
    ],
  },
  {
    id: "t-7",
    communityId: "co-career-change",
    title: "How small is small enough?",
    openerBody:
      "I keep telling myself the side step needs to be a real course, a real project, a real shift. Then I do nothing. Make it smaller for me?",
    openerAuthorId: "u-anon-106",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(4, 21),
    replies: [
      {
        id: "t-7-r-1",
        authorId: "u-josephine",
        authorName: "Josephine P.",
        authorIsMentor: true,
        body:
          "Open the tab. That is allowed to be the whole step today. The smallest version still counts as a return.",
        createdAt: iso(4, 21),
      },
    ],
  },
  {
    id: "t-8",
    communityId: "co-ai-curious",
    title: "What does a “five-minute AI session” actually look like for you?",
    openerBody:
      "Curious how others structure five minutes when they're learning rather than building.",
    openerAuthorId: "u-anon-107",
    openerAuthorName: "a quiet five-er",
    createdAt: iso(1, 12),
    replies: [
      {
        id: "t-8-r-1",
        authorId: "u-rafa",
        authorName: "Rafa P.",
        authorIsMentor: true,
        body:
          "Pick one specific concept. Ask a model to explain it. Ask one follow-up. Stop on time. Repeat tomorrow with the next concept.",
        createdAt: iso(1, 13),
      },
    ],
  },
];
