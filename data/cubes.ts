import type { Cube } from "@/lib/types";

export const cubes: Cube[] = [
  {
    id: "solo",
    name: "five solo",
    shortDescription: "Quiet drops, just for you.",
    emotionalPurpose:
      "A private corner of the app — small intentional moments you take only for yourself.",
    description:
      "five solo is the personal heart of the app. It is not a productivity routine; it is a way to come back to yourself in five minutes.",
    status: "start",
    suggestedActions: [
      "Sit quietly for five minutes.",
      "Write one honest sentence about your day.",
      "Listen to one song without doing anything else.",
      "Step outside and notice the air.",
    ],
    accent: { glyph: "·" },
  },
  {
    id: "manifesto",
    name: "five manifesto",
    shortDescription: "Words you live by.",
    emotionalPurpose:
      "A space to slowly shape the few words you want to guide your life — not goals, but a quiet compass.",
    description:
      "Most of us never write down what we actually stand for. five manifesto helps you find those words, one drop at a time.",
    status: "explore",
    suggestedActions: [
      "Write one line you want to remember.",
      "Read your manifesto aloud, slowly.",
      "Edit a single word that no longer fits.",
    ],
    accent: { glyph: "—" },
  },
  {
    id: "tipping-point",
    name: "five tipping point",
    shortDescription: "Less chaos. Same life.",
    emotionalPurpose:
      "A calm place to manage the negative — by reducing the chaos, not by demanding perfection.",
    description:
      "five tipping point turns an uncontrolled pattern into a chosen, smaller one. You name the pattern, set a boundary you can actually live with, and notice the days you stayed inside it. There is no failure here — only direction.",
    status: "start",
    suggestedActions: [
      "Name one pattern, gently.",
      "Set a boundary you can live with.",
      "Check in for today.",
    ],
    accent: { glyph: "/" },
  },
  {
    id: "content",
    name: "five content",
    shortDescription: "A focused internet, in five-minute portions.",
    emotionalPurpose:
      "A small discovery engine for the next five minutes. The internet, but quietly arranged.",
    description:
      "five content turns the open web into a five-minute growth engine. Type what you want, or pick a category, and find something existing — an app, a video, a short article, a single drill — small enough to actually finish.",
    status: "start",
    suggestedActions: [
      "Type what you want for the next five minutes.",
      "Pick a category and follow one card.",
      "Save a shape that keeps working.",
    ],
    accent: { glyph: "¶" },
  },
  {
    id: "organizations",
    name: "five organizations",
    shortDescription: "A human momentum operating system.",
    emotionalPurpose:
      "Culture is built in micro-actions. five organizations is the operating layer for the small human moments that make — and unmake — a workplace.",
    description:
      "Not an LMS. Not a task manager. Not workplace surveillance. five organizations runs small, repeated cultural practices — recognition, learning, customer reconnection, reflection — and quietly measures the human momentum they create.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "Enter the console.",
      "See the analytics.",
    ],
    accent: { glyph: "◇" },
  },
  {
    id: "creators",
    name: "five creators",
    shortDescription: "A calm creator economy.",
    emotionalPurpose:
      "Where teachers, coaches, parents, musicians, researchers and ordinary thoughtful humans build five-minute sessions that integrate into life instead of consuming it.",
    description:
      "five creators is the world's micro-growth library. Six content shapes — micro-courses, guided sessions, challenges, thought drops, parent-child sessions, organization packs — built around small consistent exposure instead of overwhelming mastery. A new rating system measures human impact, not engagement.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "Browse discover.",
      "Build a session in the studio.",
    ],
    accent: { glyph: "✺" },
  },
  {
    id: "family",
    name: "five family",
    shortDescription: "Five minutes back to each other.",
    emotionalPurpose:
      "A soft layer underneath the day. Not parenting pressure — connection. Small repeated five-minute moments that quietly make a home feel like home again.",
    description:
      "five family supports the small repeated moments families are actually built from. Eight gentle worlds — talk, read, play, learn, move, values, couple, school — a soft daily prompt, a quiet journal of moments, and observations that never make you feel like you failed at parenting on a Wednesday.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "Begin the first five.",
      "Read the journal.",
    ],
    accent: { glyph: "✿" },
  },
  {
    id: "live-event",
    name: "five live event",
    shortDescription: "Light social momentum.",
    emotionalPurpose:
      "Momentum that moves through people — without the noise of a social platform. People doing their Five together, briefly, quietly, anonymously if they want.",
    description:
      "Not a feed. Not a webinar. Not a community to belong to. Small five-minute rooms where humans do their Five together: silent together, guided, check-in, or a momentum sprint. No likes, no follower counts, no infinite scroll. Default no cameras, default no recording. End every live with one quiet confirmation — I did my Five.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "See who is on right now.",
      "Host a small room.",
    ],
    accent: { glyph: "◉" },
  },
  {
    id: "community",
    name: "five community",
    shortDescription: "Quietly, with other humans.",
    emotionalPurpose:
      "Not Facebook groups. Not Discord. Not a feed. A low-friction community space for people quietly building rivers of meaning inside busy lives.",
    description:
      "five community is built around small momentum, not popularity. Communities by interest, identity, or quiet multipotentiality. Drop updates · momentum threads · human journals · curated paths. A river map shows where people are flowing. No likes. No follower counts. No flex culture. Mentors of momentum, not influencers.",
    status: "start",
    suggestedActions: [
      "Read the manifesto.",
      "Find a compatible community.",
      "See the river map.",
    ],
    accent: { glyph: "∞" },
  },
  {
    id: "project",
    name: "five project",
    shortDescription: "Where the dream becomes a rhythm.",
    emotionalPurpose:
      "For the dream you have quietly carried for years. The book. The startup. The move abroad. Five Project turns dormant dreams into living momentum — five minutes at a time, inside your life.",
    description:
      "Not a task manager. A calm studio for keeping a meaningful project alive between busy weeks. Three layers — vision, milestones, five-actions. Templates for real beginnings. Dream-to-Plan for hazy ideas. Project Rescue for abandoned drafts. An I'm Stuck button that reduces the step instead of demanding more. Sprints, pivots, a companion that protects the momentum.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "Begin from a template.",
      "Rescue an abandoned project.",
    ],
    accent: { glyph: "▢" },
  },
  {
    id: "reflection",
    name: "five reflection",
    shortDescription: "The river that gives meaning to the drops.",
    emotionalPurpose:
      "The master cube. Not a habit tracker. Not analytics. A weekly narrative document about how you are moving across the cubes — written calmly, like a letter from someone who is paying attention.",
    description:
      "five reflection reads every other cube's activity and produces a calm, editorial report: opening reflection, momentum snapshot, SWOT reading, cross-river opportunities, emotional intelligence, dialogue, closing. The river timeline shows where presence has lived in your life across 26 weeks. The deepest difference: it doesn't ask how much you did — it asks what is happening to you inside the movement.",
    status: "start",
    suggestedActions: [
      "Read the manifesto.",
      "Generate this week's report.",
      "See the river timeline.",
    ],
    accent: { glyph: "◐" },
  },
  {
    id: "your-own",
    name: "five your own cube",
    shortDescription: "The system evolves around the human being.",
    emotionalPurpose:
      "The meta cube. If the cube you want does not exist yet — build it. Your rituals, your terminology, your success philosophy. five your own cube turns users into co-creators of five.",
    description:
      "Design your own momentum system: name, purpose, action logic, success philosophy. Eight starting templates. AI helpers along the way. Private, community, or public. The best community cubes evolve into official five cubes — recognised across the platform.",
    status: "start",
    suggestedActions: [
      "Open the manifesto.",
      "Browse the marketplace.",
      "Build your own cube.",
    ],
    accent: { glyph: "✻" },
  },
];

const HIDDEN_FROM_GRID = new Set(["manifesto", "organizations"]);

export const visibleCubes: Cube[] = cubes.filter(
  (c) => !HIDDEN_FROM_GRID.has(c.id),
);

export function getCube(id: string): Cube | undefined {
  return cubes.find((c) => c.id === id);
}
