import type { ProjectType } from "@/lib/project/types";

/**
 * Project templates.
 *
 * Each template ships with milestones + a suggested first five-minute
 * action per milestone. They are real human starting points, not
 * corporate task lists.
 */
export type TemplateMilestone = {
  title: string;
  body?: string;
  firstAction: string;
};

export type ProjectTemplate = {
  id: string;
  name: string;
  type: ProjectType;
  oneLine: string;
  body: string;
  glyph: string;
  defaultBigGoal: string;
  defaultWhyItMatters: string;
  milestones: TemplateMilestone[];
};

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "tpl-book",
    name: "Write a Book",
    type: "writing",
    glyph: "¶",
    oneLine: "A patient five-minute path from idea to manuscript.",
    body:
      "A book is too big to write in any single sitting. It is just small enough to write in five minutes a day, for as long as it takes. This template gives you a calm spine for the parts that are not the writing itself.",
    defaultBigGoal: "Finish a first complete draft of a book I would actually read.",
    defaultWhyItMatters:
      "This is the project I have been postponing for years. I am tired of telling people I will write one day.",
    milestones: [
      {
        title: "Concept",
        body: "Land on the one true thing the book is about.",
        firstAction: "Write five possible book titles. No good ones required.",
      },
      {
        title: "Structure",
        body: "Sketch the book in one page.",
        firstAction: "Draft a one-line summary of each potential chapter.",
      },
      {
        title: "Research",
        body: "Read what already exists.",
        firstAction: "Spend five minutes finding three books in the same space.",
      },
      {
        title: "Chapters",
        body: "Write the chapters, one tiny session at a time.",
        firstAction: "Open the document. Write three sentences of chapter one.",
      },
      {
        title: "Editing",
        body: "A different mode. Calmer.",
        firstAction: "Re-read one paragraph. Make one small edit.",
      },
      {
        title: "Feedback",
        body: "A small circle of trusted readers.",
        firstAction: "Write the names of three people you would trust with chapter one.",
      },
      {
        title: "Publishing",
        body: "Whatever publishing means for this book.",
        firstAction: "Write one sentence about what a finished book looks like.",
      },
    ],
  },
  {
    id: "tpl-startup",
    name: "Build a Startup",
    type: "startup",
    glyph: "▲",
    oneLine: "Five-minute steps from idea to validated startup.",
    body:
      "Most startups die from over-planning before contact with reality, not from under-planning. This template keeps the work honest and small while customer signal arrives.",
    defaultBigGoal:
      "Launch a small first version of my idea to real users I do not personally know.",
    defaultWhyItMatters:
      "I have ideas in a drawer. I want one of them to meet a real human.",
    milestones: [
      {
        title: "Customer & problem",
        body: "Who does this serve? What hurts for them?",
        firstAction: "Write the customer's problem in one honest sentence.",
      },
      {
        title: "Conversations",
        body: "Talk to real humans before you build.",
        firstAction: "List three people you could talk to this week.",
      },
      {
        title: "Tiniest first version",
        body: "What is the smallest thing you can ship that's useful?",
        firstAction: "Draft one sentence describing the smallest useful version.",
      },
      {
        title: "Build",
        body: "Ship the smallest version.",
        firstAction: "Open the project. Make one tiny piece of progress.",
      },
      {
        title: "Real users",
        body: "Outside your circle.",
        firstAction: "Write a short, honest invitation message to one stranger.",
      },
      {
        title: "Iterate or pivot",
        body: "Listen to the signal, then move.",
        firstAction: "Write one sentence about what the last week of feedback said.",
      },
    ],
  },
  {
    id: "tpl-relocation",
    name: "Relocation Plan",
    type: "relocation",
    glyph: "↗",
    oneLine: "Moving is a decision built from many small five-minute decisions.",
    body:
      "Relocation is rarely about logistics first — it is about giving yourself permission to seriously consider it. This template makes the consideration part real.",
    defaultBigGoal: "Move to a different country within the next two years.",
    defaultWhyItMatters:
      "I have been carrying this thought for years. I would like it to become a decision either way.",
    milestones: [
      {
        title: "Permission",
        body: "Allow yourself to consider it seriously.",
        firstAction: "Write three honest fears about relocating.",
      },
      {
        title: "Place",
        body: "Pick two real candidate places.",
        firstAction: "Write two cities or regions you would actually consider.",
      },
      {
        title: "Logistics map",
        body: "Visas. Healthcare. Schools. Money.",
        firstAction: "Write five logistics questions you do not yet know the answer to.",
      },
      {
        title: "Trial visit",
        body: "Try the place before the move.",
        firstAction: "List three weeks in your calendar you could realistically travel.",
      },
      {
        title: "Decision",
        body: "Yes / no / wait.",
        firstAction: "Write the conditions that would make this a real yes.",
      },
    ],
  },
  {
    id: "tpl-university",
    name: "Apply to University",
    type: "learning",
    glyph: "✦",
    oneLine: "A calm path from idea to an actual application.",
    body:
      "Applying is mostly a series of small five-minute steps that look unglamorous one at a time. This template names them honestly.",
    defaultBigGoal:
      "Apply to a degree program I would be proud to be admitted to.",
    defaultWhyItMatters:
      "I want to stop saying 'one day' and submit something real.",
    milestones: [
      {
        title: "Programs",
        body: "Shortlist programs.",
        firstAction: "Write three programs you would honestly consider.",
      },
      {
        title: "Requirements",
        body: "Know what each program actually needs.",
        firstAction: "Open one program's site. Copy the requirements into a doc.",
      },
      {
        title: "Documents",
        body: "CV. Transcripts. References. Statement.",
        firstAction: "Open your CV. Add one updated line.",
      },
      {
        title: "Statement",
        body: "The hardest one. Treat it like a series of five-minute drafts.",
        firstAction: "Write the first three sentences of the personal statement.",
      },
      {
        title: "References",
        body: "Asking is part of the work.",
        firstAction: "Write the names of two referees and the one sentence you'd send.",
      },
      {
        title: "Submit",
        body: "Click the button.",
        firstAction: "Open the application portal. Just open it.",
      },
    ],
  },
  {
    id: "tpl-portfolio",
    name: "Build a Portfolio",
    type: "creative",
    glyph: "✺",
    oneLine: "Five-minute steps from scattered work to a small, real portfolio.",
    body:
      "Portfolios are not a content problem — they are a courage problem. This template helps you collect, choose, and show something true.",
    defaultBigGoal: "Publish a small portfolio I would be proud to send to one person.",
    defaultWhyItMatters:
      "My work is scattered. I would like to feel less invisible.",
    milestones: [
      {
        title: "Audit",
        body: "What already exists?",
        firstAction: "Open the folder where past work lives. Look for five minutes.",
      },
      {
        title: "Pick five pieces",
        body: "Only five. Resist the urge to include everything.",
        firstAction: "Choose five pieces of work you don't hate.",
      },
      {
        title: "Tell the story",
        body: "Three sentences per piece, max.",
        firstAction: "Write three sentences about one piece.",
      },
      {
        title: "Make it real",
        body: "A site, a PDF, a notion page — any visible surface.",
        firstAction: "Open Notion (or your tool of choice). Create the empty page.",
      },
      {
        title: "Send it to one person",
        body: "That's the whole win.",
        firstAction: "Write the name of the one person you would send this to.",
      },
    ],
  },
  {
    id: "tpl-financial",
    name: "Financial Independence",
    type: "financial",
    glyph: "▢",
    oneLine: "A patient project — five-minute steps you can keep for years.",
    body:
      "Money problems compound for the same reason money habits compound. This template is for the project, not the spreadsheet.",
    defaultBigGoal:
      "Build a financial picture I understand and a small surplus I save every month.",
    defaultWhyItMatters:
      "I am tired of avoiding looking at my own money.",
    milestones: [
      {
        title: "See the picture",
        body: "All accounts in one place.",
        firstAction: "Write the names of every account you have.",
      },
      {
        title: "Real numbers",
        body: "Income. Outgoings. The honest version.",
        firstAction: "Look at last month's spending for five minutes. No judgment.",
      },
      {
        title: "One small habit",
        body: "One small change you can keep for a year.",
        firstAction: "Pick one category you'd reduce by 10%.",
      },
      {
        title: "A small surplus",
        body: "Automate it.",
        firstAction: "Open the bank app. Set one transfer rule.",
      },
      {
        title: "A longer view",
        body: "Five years out, calmly.",
        firstAction: "Write one sentence about what you'd like to be true in 5 years.",
      },
    ],
  },
];

export function getTemplate(id: string) {
  return projectTemplates.find((t) => t.id === id);
}
