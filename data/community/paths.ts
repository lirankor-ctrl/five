import type { CuratedPath } from "@/lib/community/types";

/**
 * Curated paths — small structured journeys authored by mentors. Steps are
 * short and self-contained. No final exam, no certificate, no gate.
 */
export const paths: CuratedPath[] = [
  {
    id: "p-return-to-reading",
    communityId: "co-reading",
    authorId: "u-marc",
    authorName: "Marc L.",
    authorIsMentor: true,
    title: "How I returned to reading",
    oneLine: "A six-week, five-minute path back into the habit.",
    description:
      "A gentle path for adults who used to read and have not lately. No quotas, no streaks. Six small weeks of returns. Each step is a single five-minute idea.",
    totalDays: 42,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Place the book on the chair tonight.",
        body:
          "Pick any book you already own and put it where you sit in the evening. That is the whole step.",
        estimatedMinutes: 1,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "Five pages, once.",
        body:
          "Read five pages once this week, whenever it fits. If you cannot, read one. If you cannot, that is also a step.",
        estimatedMinutes: 5,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Underline one sentence.",
        body:
          "Read until you find one sentence you would underline. Underline it. Close the book.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Pick the time, not the page count.",
        body:
          "Decide a soft time of day for reading — before bed, after lunch, with morning coffee. Honour the slot, not the page count.",
        estimatedMinutes: 5,
        optional: true,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Return after a missed week.",
        body:
          "You will miss days. Pick the book up the next day. Do not 'catch up' — just continue.",
        estimatedMinutes: 5,
      },
      {
        id: "s-6",
        ordinal: 6,
        title: "Read in a different chair, just once.",
        body:
          "A small variation. Carry the practice into a new room. Notice how portable it has become.",
        estimatedMinutes: 5,
        optional: true,
      },
    ],
  },
  {
    id: "p-30-days-of-drawing",
    communityId: "co-drawing",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    title: "30 Days of Drawing",
    oneLine: "Same five minutes. Same subject. Surprising results.",
    description:
      "Pick a single subject — a lamp, a mug, a tree outside your window. Five minutes a day, thirty days. No skill goals. Notice attention, not output.",
    totalDays: 30,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Pick the subject.",
        body:
          "Choose one object in your home that you can return to easily. The point is repetition, not novelty.",
        estimatedMinutes: 5,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "Day 1 — quietly bad.",
        body:
          "Draw your subject for five minutes. Resist judgement. Date the corner of the page.",
        estimatedMinutes: 5,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Week 1 — same subject, smaller piece of attention.",
        body:
          "Each day, only attempt one part of the object. Spend five minutes looking, not drawing.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Week 2 — the shadow.",
        body:
          "Look only at where the light isn't. Five minutes. Draw the shadow, not the object.",
        estimatedMinutes: 5,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Day 30 — compare with day one.",
        body:
          "Open day 1. Compare. Resist the urge to grade. Look for the change in attention, not in line quality.",
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: "p-entering-ai",
    communityId: "co-ai-curious",
    authorId: "u-rafa",
    authorName: "Rafa P.",
    authorIsMentor: true,
    title: "Entering the AI world",
    oneLine: "Five minutes a day from honest beginner to comfortable.",
    description:
      "A six-step path for people who keep meaning to learn what these tools actually do. No prerequisites. Each step is one calm idea + one tiny experiment.",
    totalDays: 21,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Ask one specific question of one model.",
        body:
          "Pick any tool — open it. Ask one question you actually have. Read the answer. Note one thing it got wrong.",
        estimatedMinutes: 5,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "Learn what 'tokens' mean — once.",
        body:
          "Read one short explanation. Do not memorise. Notice that text is processed in chunks. That is enough for today.",
        estimatedMinutes: 5,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Compare two answers from two models.",
        body:
          "Same prompt, two different tools. Notice the differences — tone, length, certainty. Stop on time.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Try one tiny rewrite prompt.",
        body:
          "Take a paragraph you wrote. Ask the model to make it shorter without changing the meaning. Read what changed.",
        estimatedMinutes: 5,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Read one short blog post.",
        body:
          "Find one calm post from someone using these tools well. Five minutes. Bookmark it.",
        estimatedMinutes: 5,
        optional: true,
      },
      {
        id: "s-6",
        ordinal: 6,
        title: "Notice one new question.",
        body:
          "Three weeks in, write down one new question you did not have on day 1. That is your real progress.",
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: "p-five-philosophy",
    communityId: "co-philosophy",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    title: "Philosophy in Five Minutes",
    oneLine: "Five short ideas. Five small mornings.",
    description:
      "Five mornings, five ideas, five minutes each. Calm enough to do with coffee. Honest enough to stay with you for the day.",
    totalDays: 5,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Habit as second nature.",
        body:
          "Spend five minutes with the sentence: 'Habit is a second nature which destroys the first.' Notice one habit you carry that is no longer yours.",
        estimatedMinutes: 5,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "The river you do not step into twice.",
        body:
          "Five minutes on Heraclitus. Notice one thing in your day that is not the same thing it was last week.",
        estimatedMinutes: 5,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Negative space.",
        body:
          "Five minutes on what you are choosing not to do today. Notice that the not-doing is also a decision.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Identity as a verb.",
        body:
          "Five minutes on how you describe what you do. Notice when you use nouns and when you use verbs.",
        estimatedMinutes: 5,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Meaning, briefly.",
        body:
          "Five minutes on one moment in the last week that felt meaningful. Try to describe what made it so.",
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: "p-chess-beginners",
    communityId: "co-chess",
    authorId: "u-noah",
    authorName: "Noah T.",
    title: "Chess for Beginners",
    oneLine: "Five tactics, five mornings, no ratings.",
    description:
      "A five-day path of one tactical idea per day. Five-minute exercises. Designed to make tactics click without making you care about your rating.",
    totalDays: 5,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Pins.",
        body:
          "One concept: the pin. Solve five pin tactics. Read no commentary.",
        estimatedMinutes: 5,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "Forks.",
        body: "Five tactics, all forks. Stop on time. Resist 'one more'.",
        estimatedMinutes: 5,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Skewers.",
        body: "Five tactics, all skewers. Pattern-recognition only.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Discovered attacks.",
        body: "Five tactics. Hard. Stop on time.",
        estimatedMinutes: 5,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Mixed.",
        body: "Five tactics, all categories mixed. Notice which one your eye spotted first.",
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: "p-after-burnout",
    communityId: "co-non-linear",
    authorId: "u-josephine",
    authorName: "Josephine P.",
    authorIsMentor: true,
    title: "After burnout — the smallest possible mornings",
    oneLine: "Quiet structure for restarting, written by a clinician.",
    description:
      "A nine-step path back into a small daily practice after a hard period. Designed to never feel like therapy. The point is staying small longer than you think you need to.",
    totalDays: 30,
    steps: [
      {
        id: "s-1",
        ordinal: 1,
        title: "Two glasses of water + three slow breaths.",
        body:
          "That is the whole morning practice this week. Do not add anything yet.",
        estimatedMinutes: 3,
      },
      {
        id: "s-2",
        ordinal: 2,
        title: "Add a window minute.",
        body:
          "One minute of looking at the same thing outside your window. No phone.",
        estimatedMinutes: 1,
      },
      {
        id: "s-3",
        ordinal: 3,
        title: "Add a short walk.",
        body:
          "Five minutes outside, no podcast, no headphones.",
        estimatedMinutes: 5,
      },
      {
        id: "s-4",
        ordinal: 4,
        title: "Notice when you want to skip.",
        body:
          "When you notice you do not want to do the practice today, do an even smaller version of it. Not zero.",
        estimatedMinutes: 5,
      },
      {
        id: "s-5",
        ordinal: 5,
        title: "Resist scaling up.",
        body:
          "If you feel great, do not add anything for one more week.",
        estimatedMinutes: 5,
      },
    ],
  },
];

export function getPath(id: string) {
  return paths.find((p) => p.id === id);
}
