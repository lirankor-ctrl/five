import type { BookChapter } from "@/lib/manifesto/types";

/**
 * The five book — Section 2.
 *
 * Real opening passages for the first chapters; later chapters carry
 * structural placeholders so the reader, progress, and audio scaffolding
 * can be built and tested today.
 */
export const bookMeta = {
  title: "five",
  subtitle: "A small book about the moments between the moments.",
  author: "the five team",
  estimatedTotalMinutes: 95,
};

export const bookChapters: BookChapter[] = [
  {
    id: "the-anchors",
    number: 1,
    title: "The anchors.",
    subtitle: "On the few large things that shape a life.",
    readingMinutes: 7,
    audioAvailable: true,
    blocks: [
      {
        kind: "lead",
        body:
          "Every life has anchors. The hours you must sleep. The hours you sell to work. The people who hold the keys to your evenings. The body that needs to eat. These are not problems to be solved. They are the shape of being a person.",
      },
      {
        kind: "paragraph",
        body:
          "We are told to optimise around the anchors — to wake earlier, work harder, sleep less, love more efficiently. five suggests the opposite: leave the anchors alone. Honour them. They are doing more than they are blamed for. The life you are looking for is not inside the anchors. It is between them.",
      },
      {
        kind: "pullquote",
        body: "The anchors are not the river. They are its banks.",
      },
      {
        kind: "paragraph",
        body:
          "When we stop trying to enlarge the anchors, a different question opens. Not how to make more time, but: what flows through the time I already have?",
      },
    ],
  },
  {
    id: "the-drops",
    number: 2,
    title: "The drops.",
    subtitle: "What lives in the spaces between.",
    readingMinutes: 9,
    audioAvailable: true,
    blocks: [
      {
        kind: "paragraph",
        body:
          "A drop is a small unit of intentional time. Not a habit. Not a task. Not a streak. A single five-minute return to something that matters quietly to you.",
      },
      {
        kind: "paragraph",
        body:
          "The drop is named for what it looks like in a day: small, almost invisible, easy to miss. And for what it does over years: a river.",
      },
      {
        kind: "pullquote",
        body: "Most lives are decided by what you do on ordinary days.",
      },
    ],
  },
  {
    id: "fragmentation",
    number: 3,
    title: "Fragmentation.",
    subtitle: "Why the small moments started disappearing.",
    readingMinutes: 11,
    audioAvailable: true,
    blocks: [
      {
        kind: "paragraph",
        body:
          "For most of human history, the small moments belonged to the person living them. You waited for water to boil. You walked from one place to another. You sat with nothing to do for two minutes. None of this required design.",
      },
      {
        kind: "paragraph",
        body:
          "Then, in roughly fifteen years, the small moments were quietly enclosed. Not by force. By optimisation. The empty two minutes were filled, by default, with a feed engineered for the next two minutes after that. The drops did not vanish. Their ownership transferred.",
      },
    ],
  },
  {
    id: "intentionality",
    number: 4,
    title: "Intentionality, not retreat.",
    subtitle: "Why we are not anti-technology.",
    readingMinutes: 8,
    audioAvailable: true,
    blocks: [
      {
        kind: "paragraph",
        body:
          "There is a familiar response to all of this: throw the phone in a lake. Move to the woods. Quit the internet. five is not that book. The romantic retreat is a fantasy most people cannot afford and, once tried, do not want.",
      },
      {
        kind: "paragraph",
        body:
          "Modern tools are not the enemy. The enemy is direction stolen by default. five is a small practice of giving direction back — not by leaving modernity, but by choosing, in five-minute increments, what your modernity is for.",
      },
    ],
  },
  {
    id: "identity-as-river",
    number: 5,
    title: "Identity as a river.",
    subtitle: "On the right to be more than one thing.",
    readingMinutes: 10,
    audioAvailable: false,
    blocks: [
      {
        kind: "paragraph",
        body:
          "We tend to treat identity like a contract. Sign it once, defend it forever. But identity, in lived experience, behaves more like a river. It changes direction. It picks up new tributaries. It widens. It runs dry in places and refills.",
      },
      {
        kind: "paragraph",
        body:
          "five proposes a quieter way to grow: not by reinvention, but by the slow accumulation of small returns to things you are curious about. A few minutes with a language. With music. With prayer. With prose. With a craft. Identities, like rivers, are made of what passes through them.",
      },
    ],
  },
  {
    id: "momentum",
    number: 6,
    title: "Momentum.",
    subtitle: "Why small actions compound — and why most people miss it.",
    readingMinutes: 9,
    audioAvailable: false,
    blocks: [
      {
        kind: "paragraph",
        body:
          "Momentum is the most underrated force in human life. We talk about willpower, motivation, talent. Momentum is more powerful than any of them, and much quieter.",
      },
      {
        kind: "paragraph",
        body:
          "A small action repeated under low stakes generates momentum. Momentum lowers the cost of the next action. Lower cost makes the action more repeatable. The loop closes. The river forms.",
      },
    ],
  },
  {
    id: "return",
    number: 7,
    title: "The return.",
    subtitle: "Beginning again, gently.",
    readingMinutes: 6,
    audioAvailable: false,
    blocks: [
      {
        kind: "paragraph",
        body:
          "Every river has its dry seasons. Every practice has its missed days. five was built around this honestly: the goal is not to never miss, but to make returning easy.",
      },
      {
        kind: "lead",
        body:
          "You don’t need a new life. You need the next drop, taken on purpose.",
      },
    ],
  },
];

export function getChapter(id: string): BookChapter | undefined {
  return bookChapters.find((c) => c.id === id);
}
