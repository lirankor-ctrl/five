import type { Concept } from "@/lib/manifesto/types";

/**
 * Micro-multipotentiality — Section 3.
 *
 * A small encyclopedia of related concepts. Each entry stands on its own
 * but links to others so a concept-map view can be assembled later.
 */
export const concepts: Concept[] = [
  {
    id: "micro-multipotentiality",
    title: "Micro-multipotentiality",
    oneLine:
      "The right to be more than one thing, in small repeated returns across a lifetime.",
    related: [
      "dynamic-identity",
      "non-linear-growth",
      "lifelong-curiosity",
      "polymath-lineage",
    ],
    references: [
      { kind: "ted", label: "Emilie Wapnick — Why some of us don’t have one true calling" },
      { kind: "book", label: "David Epstein — Range" },
      { kind: "person", label: "Leonardo da Vinci" },
    ],
    blocks: [
      {
        kind: "lead",
        body:
          "Micro-multipotentiality is a small idea with large implications: a human does not have to choose one identity for life. You can move between curiosities — gently, intentionally, in five-minute increments — and over a lifetime become honestly more than one thing.",
      },
      {
        kind: "paragraph",
        body:
          "The classical version of multipotentiality argues that some people are simply built for many interests, and should not be asked to specialise. five extends the idea downward: not just for the rare polymath, and not just for full careers. Anyone, in any week, can hold a quiet second self made of small repeated returns.",
      },
      {
        kind: "pullquote",
        body: "You are allowed to be quietly several people, over time.",
      },
      {
        kind: "paragraph",
        body:
          "What makes this practical, not romantic, is the size of the unit. A career change is enormous. A five-minute return is not. Identity, accessed in drops, becomes something you can rehearse safely before committing to.",
      },
    ],
  },
  {
    id: "dynamic-identity",
    title: "Dynamic identity",
    oneLine: "Identity as something you compose, not something you receive.",
    related: ["micro-multipotentiality", "non-linear-growth"],
    references: [
      { kind: "person", label: "William James — the social selves" },
      { kind: "article", label: "Dan McAdams — narrative identity research" },
    ],
    blocks: [
      {
        kind: "paragraph",
        body:
          "Static identity says: I am a doctor, I am an introvert, I am a writer. Dynamic identity says: today, I am writing. The change is not cosmetic. A static identity must be defended whenever life contradicts it. A dynamic identity can simply update.",
      },
      {
        kind: "paragraph",
        body:
          "five is built around dynamic identity. The cube does not ask who you are. It asks what you are returning to.",
      },
    ],
  },
  {
    id: "non-linear-growth",
    title: "Non-linear growth",
    oneLine: "Why progress that looks flat is often the most important kind.",
    related: ["micro-multipotentiality", "momentum-loops"],
    references: [
      { kind: "article", label: "James Clear — plateau of latent potential" },
      { kind: "book", label: "Anders Ericsson — Peak" },
    ],
    blocks: [
      {
        kind: "paragraph",
        body:
          "Skill does not increase smoothly. Most of it accumulates in quiet, with little visible change, before a sudden step. People give up in the flat part because the flat part looks like failure. It is not. It is the part where the curve is being built.",
      },
    ],
  },
  {
    id: "lifelong-curiosity",
    title: "Lifelong curiosity",
    oneLine: "Curiosity as the only sustainable engine of long-term growth.",
    related: ["dynamic-identity", "polymath-lineage"],
    references: [
      { kind: "ted", label: "Elizabeth Gilbert — Your elusive creative genius" },
      { kind: "person", label: "Richard Feynman" },
    ],
    blocks: [
      {
        kind: "paragraph",
        body:
          "Motivation is a finite, weather-like resource. Curiosity is not. People who continue to grow across decades are almost always more curious than they are disciplined. five treats curiosity as a renewable input, and small returns as the way it is honoured.",
      },
    ],
  },
  {
    id: "polymath-lineage",
    title: "The polymath lineage",
    oneLine:
      "A short lineage of humans who refused to be one thing — and what we can borrow from them.",
    related: ["micro-multipotentiality", "lifelong-curiosity"],
    references: [
      { kind: "person", label: "Leonardo da Vinci" },
      { kind: "person", label: "Maya Angelou" },
      { kind: "person", label: "Hedy Lamarr" },
      { kind: "person", label: "Donald Glover" },
    ],
    blocks: [
      {
        kind: "paragraph",
        body:
          "History’s polymaths are usually presented as untouchable exceptions. five reads them differently — not as heroes, but as evidence. Evidence that the modern insistence on a single identity is a recent and narrow convention, not a human default.",
      },
    ],
  },
  {
    id: "momentum-loops",
    title: "Momentum loops",
    oneLine: "Why a small consistent action beats a large inconsistent one.",
    related: ["non-linear-growth", "micro-multipotentiality"],
    references: [
      { kind: "book", label: "BJ Fogg — Tiny Habits" },
      { kind: "article", label: "Carol Dweck — growth mindset research" },
    ],
    blocks: [
      {
        kind: "paragraph",
        body:
          "A momentum loop has three quiet parts: an action small enough to repeat, a frictionless return path, and a memory that the return happened. Most apps fail at the third. five is, in some ways, just a respectful memory layer for the returns you take.",
      },
    ],
  },
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}
