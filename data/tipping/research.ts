/**
 * "You Are Not Alone" — the research/community layer.
 *
 * Editorial, non-shaming summaries. References are loose strings so a
 * future CMS / Supabase content layer can attach real URLs and DOIs
 * without changing this shape.
 */

export type ResearchNote = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type ResearchReference = {
  id: string;
  kind: "ted" | "podcast" | "article" | "book" | "study";
  title: string;
  source: string;
};

export const researchNotes: ResearchNote[] = [
  {
    id: "design-not-defect",
    eyebrow: "01",
    title: "It is by design, not by defect.",
    body:
      "Compulsive use of modern platforms is overwhelmingly a product of design — intermittent reinforcement, variable rewards, autoplay, infinite feeds. People are not weak. The systems are highly tuned. Naming the asymmetry is the first move out of shame.",
  },
  {
    id: "reduction-counts",
    eyebrow: "02",
    title: "Reduction is real progress.",
    body:
      "Behavioural research consistently shows that reduction outperforms abstinence for most non-substance compulsions. A daily cap, kept imperfectly, beats a perfect rule kept for two weeks and then collapsed.",
  },
  {
    id: "partial-victory",
    eyebrow: "03",
    title: "A partial day is not a failed day.",
    body:
      "Self-efficacy — the felt sense that your actions matter — is built or destroyed by how you count your own efforts. People who frame a partial day as progress sustain change far longer than people who frame it as failure.",
  },
  {
    id: "stress-loop",
    eyebrow: "04",
    title: "Stress is usually the bigger lever.",
    body:
      "Most compulsive loops are downstream of stress, sleep loss, or unprocessed emotion. A boundary that holds at 7pm can fail at 11pm — not because of weakness, but because the underlying conditions have changed. Notice the conditions, not just the behaviour.",
  },
  {
    id: "neuroplasticity",
    eyebrow: "05",
    title: "The brain is more plastic than you’ve been told.",
    body:
      "Adult brains rewire continuously. The fragmentation caused by short-form feeds is largely reversible by reintroducing intentional, slower windows of attention. five solo and five tipping point are designed to work as a pair.",
  },
];

export const researchReferences: ResearchReference[] = [
  {
    id: "anna-lembke",
    kind: "book",
    title: "Dopamine Nation",
    source: "Anna Lembke",
  },
  {
    id: "huberman-dopamine",
    kind: "podcast",
    title: "Controlling Your Dopamine for Motivation, Focus & Satisfaction",
    source: "Huberman Lab",
  },
  {
    id: "tristan-harris",
    kind: "ted",
    title: "How a handful of tech companies control billions of minds every day",
    source: "Tristan Harris",
  },
  {
    id: "atomic-habits",
    kind: "book",
    title: "Atomic Habits",
    source: "James Clear",
  },
  {
    id: "lembke-ted",
    kind: "ted",
    title: "Why our screens make us less happy",
    source: "Adam Alter",
  },
  {
    id: "hari-stolen-focus",
    kind: "book",
    title: "Stolen Focus",
    source: "Johann Hari",
  },
  {
    id: "newport-deep-work",
    kind: "book",
    title: "Deep Work",
    source: "Cal Newport",
  },
  {
    id: "self-efficacy",
    kind: "study",
    title: "Self-efficacy and behaviour change — a 40-year review",
    source: "Bandura et al.",
  },
];

export const refKindLabel: Record<ResearchReference["kind"], string> = {
  ted: "TED",
  podcast: "Podcast",
  article: "Article",
  book: "Book",
  study: "Study",
};
