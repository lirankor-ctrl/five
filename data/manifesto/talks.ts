import type { Talk } from "@/lib/manifesto/types";

/**
 * Talks & media — Section 5.
 *
 * A placeholder ecosystem, designed as a premium media world. No content
 * is shipped yet; each entry carries enough metadata to render a real card.
 */
export const talks: Talk[] = [
  {
    id: "the-river-and-the-anchors",
    kind: "talk",
    title: "The river and the anchors.",
    speaker: "Founder of five",
    durationMin: 12,
    summary:
      "A short, on-stage introduction to the central image of five — why the small moments between obligations may be the most decisive part of a modern life.",
    status: "in-development",
  },
  {
    id: "small-units",
    kind: "talk",
    title: "Small units of self.",
    speaker: "five team",
    durationMin: 14,
    summary:
      "On micro-multipotentiality, dynamic identity, and the case for being quietly several people across a lifetime.",
    status: "in-development",
  },
  {
    id: "in-conversation-attention",
    kind: "interview",
    title: "A conversation about attention.",
    speaker: "with a neuroscientist",
    durationMin: 38,
    summary:
      "A long-form discussion on the design of modern feeds, the reversibility of attention damage, and what calm intentional minutes actually do to the brain.",
    status: "coming-soon",
  },
  {
    id: "podcast-drops",
    kind: "podcast",
    title: "Drops — episode one.",
    speaker: "host: the five team",
    durationMin: 32,
    summary:
      "The opening episode of the five podcast. Conversations with people who quietly took back their small moments.",
    status: "coming-soon",
  },
  {
    id: "mini-manifesto-anchors",
    kind: "mini-manifesto",
    title: "A short manifesto on the anchors.",
    durationMin: 3,
    summary:
      "A three-minute spoken essay — for the train, for the walk home, for the empty kettle minute.",
    status: "in-development",
  },
  {
    id: "audio-reflection-evening",
    kind: "audio",
    title: "An evening reflection.",
    durationMin: 5,
    summary:
      "A quiet five-minute audio piece to close the day — not guided meditation, not coaching. A pause.",
    status: "in-development",
  },
  {
    id: "film-the-drops",
    kind: "film",
    title: "The drops — a short film.",
    durationMin: 9,
    summary:
      "A small visual film about ordinary five-minute moments, made the way they feel.",
    status: "coming-soon",
  },
];

export const talkKindLabel: Record<Talk["kind"], string> = {
  talk: "Talk",
  interview: "Interview",
  podcast: "Podcast",
  film: "Short film",
  audio: "Audio reflection",
  "mini-manifesto": "Mini manifesto",
};
