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
    shortDescription: "Return to the people who matter.",
    emotionalPurpose:
      "Family is often the first thing the day pushes aside. This cube is a soft reminder to return — for five minutes, with full attention.",
    description:
      "five family is not about more time. It is about more presence in the time you already share.",
    status: "start",
    suggestedActions: [
      "Sit with someone for five minutes, phones away.",
      "Send one honest message to a family member.",
      "Ask one question and really listen.",
    ],
    accent: { glyph: "✿" },
  },
  {
    id: "live-event",
    name: "five live event",
    shortDescription: "Five minutes of full attention, together.",
    emotionalPurpose:
      "A shared, time-bound moment with others — quiet, present, real. The opposite of an endless livestream.",
    description:
      "five live event is for small synchronous moments. A group breath, a shared minute of writing, a brief check-in across cities.",
    status: "coming-soon",
    suggestedActions: [
      "Join a five-minute shared pause.",
      "Host a small live moment with friends.",
      "Be present without performing.",
    ],
    accent: { glyph: "◉" },
  },
  {
    id: "community",
    name: "five community",
    shortDescription: "Small drops shared become a river.",
    emotionalPurpose:
      "A gentle way to belong — not a social network, not a feed. A quiet shared space for people who value intentional small moments.",
    description:
      "five community is not for engagement metrics. It is for the felt sense that you are not doing this alone.",
    status: "coming-soon",
    suggestedActions: [
      "Read one thing someone else wrote, without reacting.",
      "Leave one kind, specific note.",
      "Notice that you are not alone in this.",
    ],
    accent: { glyph: "∞" },
  },
  {
    id: "project",
    name: "five project",
    shortDescription: "One step at a time, with intention.",
    emotionalPurpose:
      "For the projects that matter but never seem to move. This cube helps you take one small, real step today.",
    description:
      "five project is not a task manager. It is a way to keep a meaningful project alive through small intentional returns.",
    status: "explore",
    suggestedActions: [
      "Name the next smallest step.",
      "Spend five minutes on it. Stop on time.",
      "Write one note for tomorrow's you.",
    ],
    accent: { glyph: "▢" },
  },
  {
    id: "reflection",
    name: "five reflection",
    shortDescription: "A respectful mirror.",
    emotionalPurpose:
      "A quiet space to notice what is working, what isn't, and what wants attention — without scoring, without judgement.",
    description:
      "five reflection is not analytics. It is a calm mirror you can return to whenever you need to see yourself clearly.",
    status: "start",
    suggestedActions: [
      "Notice one thing that is working.",
      "Name one thing you'd like to adjust.",
      "Acknowledge one drop you took today.",
    ],
    accent: { glyph: "◐" },
  },
];

export function getCube(id: string): Cube | undefined {
  return cubes.find((c) => c.id === id);
}
