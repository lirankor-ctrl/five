import type { ManifestoSection } from "@/lib/manifesto/types";

/**
 * The five manifesto — Section 1.
 *
 * Real editorial copy, not lorem. Each section reads as a short essay.
 * Tone: calm, intelligent, never coaching. Built for slow scrolling.
 */
export const manifestoSections: ManifestoSection[] = [
  {
    id: "opening",
    eyebrow: "the manifesto",
    title: "Life happens in the little drops.",
    blocks: [
      {
        kind: "lead",
        body:
          "Between the big anchors of life — work, family, sleep, obligation — there are small openings. Five minutes here. A walk between meetings. A pause before the next thing. Most of us hand these drops to a phone without thinking. five is the gentle return of those drops to you.",
      },
      {
        kind: "paragraph",
        body:
          "This is not a productivity philosophy. There is nothing here to optimise. five is a quieter idea: that a life is not made by the rare large blocks of time you imagine you will one day have, but by what you do with the small ones you already have.",
      },
    ],
  },
  {
    id: "philosophy",
    eyebrow: "01 — philosophy",
    title: "You don’t need more time. You need five.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "The dominant story of the modern self is one of scarcity. There is never enough time. The week is too short, the calendar too full, the day already over before it begins. We respond by trying to win against time — to compress it, multitask through it, hack it into submission.",
      },
      {
        kind: "paragraph",
        body:
          "This story is wrong. Time is not the scarce resource. Intentional attention inside small windows is. The person who plays the guitar for five quiet minutes most days will, in a year, be a guitarist. The person who waits for the perfect free afternoon will not.",
      },
      {
        kind: "pullquote",
        body: "The drops between life’s anchors become the river of your life.",
      },
    ],
  },
  {
    id: "river",
    eyebrow: "02 — the metaphor",
    title: "The river and its tributaries.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "Imagine your life as a river. The anchors — work, sleep, family, commitments — are its banks. They give the river its shape, but they are not the water. The water is everything that flows through, around, and between them: a phone call, a coffee, a moment of stillness, an unread paragraph, a question you almost asked.",
      },
      {
        kind: "paragraph",
        body:
          "Each of these is a tributary. Most of them disappear into a feed. A few, taken intentionally, become the actual current of who you are. five exists to make those few visible, repeatable, and gently your own.",
      },
    ],
  },
  {
    id: "fragmentation",
    eyebrow: "03 — fragmentation",
    title: "The problem is not speed.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "We are told that modernity is too fast. That the answer is to slow down, disconnect, retreat. But humans have always lived inside short moments. The problem is not the length of the moment — it is what fills it.",
      },
      {
        kind: "paragraph",
        body:
          "Notifications, infinite scroll, algorithmic feeds, ambient anxiety — these are not speed. They are direction stolen from you, given to systems whose interests are not yours. five does not ask you to retreat from modern life. It asks you to take back the direction of its smallest moments.",
      },
      {
        kind: "pullquote",
        body: "Momentum is built in micro-movements.",
      },
    ],
  },
  {
    id: "drops",
    eyebrow: "04 — the little drops",
    title: "Small actions, returned to.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "A drop is any small, intentional act. Five minutes with a real book. A short note to someone you love. A moment of breath before a hard conversation. A single sentence written down. A walk, without a podcast.",
      },
      {
        kind: "paragraph",
        body:
          "Individually, drops look like nothing. That is why they are easy to dismiss. Repeated, with attention, they shape everything: skill, relationship, calm, identity. The promise of five is not that small actions feel important in the moment. It is that they accumulate when you are not watching.",
      },
      {
        kind: "list",
        items: [
          "A small action is easier than the version of yourself who would do the big one.",
          "Most lives are decided by what you do on ordinary days, not on rare ones.",
          "A drop you take is also a drop you didn’t give to the feed.",
        ],
      },
    ],
  },
  {
    id: "identity",
    eyebrow: "05 — dynamic identity",
    title: "You are not one fixed thing.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "Modern culture asks you to choose an identity early and defend it forever. Pick a niche. Build a brand. Stay consistent. five rejects this. Humans are not bonsai trees. We are rivers — we change direction, we slow, we widen, we find new ground.",
      },
      {
        kind: "paragraph",
        body:
          "five treats identity as something you visit, not something you are sentenced to. A few minutes a day with music, with writing, with prayer, with a language — and a new identity quietly begins to exist alongside the old one. This is what we call micro-multipotentiality: the right to be more than one thing, lightly, over a lifetime.",
      },
      {
        kind: "pullquote",
        body: "You are not one fixed identity.",
      },
    ],
  },
  {
    id: "closing",
    eyebrow: "06 — closing",
    title: "Return to the drops you already have.",
    blocks: [
      {
        kind: "paragraph",
        body:
          "You do not need to reinvent your life to begin. You do not need a free afternoon, a clear calendar, a perfect setup. The drops are already in your day. five is simply the place where they are remembered.",
      },
      {
        kind: "lead",
        body:
          "Take five. Not to do more. To return to what is already yours.",
      },
      { kind: "rule" },
    ],
  },
];
