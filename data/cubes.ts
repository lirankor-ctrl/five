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
    shortDescription: "Where one small turn changes the direction.",
    emotionalPurpose:
      "Some moments are quietly decisive. This cube helps you notice them and act with intention before they pass.",
    description:
      "five tipping point is for the small decisions that compound — the email you almost didn't send, the conversation you almost avoided.",
    status: "coming-soon",
    suggestedActions: [
      "Name one decision you've been postponing.",
      "Take the smallest first step.",
      "Write the message you've been delaying.",
    ],
    accent: { glyph: "/" },
  },
  {
    id: "content",
    name: "five content",
    shortDescription: "Five minutes to say something true.",
    emotionalPurpose:
      "A calm place to express, not perform. One small drop of thought, voice, or writing — without the pressure of an audience.",
    description:
      "five content is not for going viral. It is for the practice of saying something honestly in a short, focused window.",
    status: "explore",
    suggestedActions: [
      "Write a five-minute draft and stop.",
      "Record a voice note for yourself.",
      "Capture one idea you'd otherwise lose.",
    ],
    accent: { glyph: "¶" },
  },
  {
    id: "organizations",
    name: "five organizations",
    shortDescription: "Bring calm into the teams you belong to.",
    emotionalPurpose:
      "Work is one of the loudest anchors of life. This cube is a small practice of bringing intention into the teams you're a part of.",
    description:
      "five organizations is about small, human acts inside companies and teams — not management theory, not productivity hacks.",
    status: "coming-soon",
    suggestedActions: [
      "Send a short thank-you to one teammate.",
      "Name one meeting that could be a message.",
      "Take five minutes before your next call.",
    ],
    accent: { glyph: "◇" },
  },
  {
    id: "creators",
    name: "five creators",
    shortDescription: "A small drop is enough to begin.",
    emotionalPurpose:
      "For people who make things. A reminder that craft is built from tiny, repeated returns — not from waiting for the perfect block of time.",
    description:
      "five creators supports the practice of making. Show up for five minutes. The work continues quietly.",
    status: "explore",
    suggestedActions: [
      "Open the file. That counts.",
      "Make one small edit.",
      "Sketch one idea on paper.",
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
