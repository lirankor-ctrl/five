import type {
  CubeMomentumLogic,
  CubePurpose,
  CubeSuccessPhilosophy,
  CubeTemplateKind,
  EmotionalCategory,
} from "@/lib/your-own/types";

export type CubeTemplate = {
  id: CubeTemplateKind;
  label: string;
  glyph: string;
  oneLine: string;
  body: string;
  category: EmotionalCategory;
  /** Pre-filled scaffolding the builder uses as a starting point. */
  defaults: {
    glyph: string;
    purpose: CubePurpose;
    momentumLogic: CubeMomentumLogic;
    successPhilosophy: CubeSuccessPhilosophy;
  };
};

export const cubeTemplates: CubeTemplate[] = [
  {
    id: "blank",
    label: "Blank cube",
    glyph: "·",
    oneLine: "Start from nothing. Write your own structure.",
    body:
      "For users who already know exactly what their momentum system should look like. Five empty fields, your hands.",
    category: "growth",
    defaults: {
      glyph: "·",
      purpose: {
        whatItImproves: "",
        momentumType: "",
        whyItMatters: "",
        whatUsersFeel: "",
        consistencyOutcome: "",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "daily",
        reflectionStyle: "feeling",
        trackingShape: "presence",
        remindersEnabled: false,
        aiBehavior: "none",
      },
      successPhilosophy: {
        whatSuccessMeans: "",
        toAvoid: [],
        encouragementOver: [],
      },
    },
  },
  {
    id: "emotional",
    label: "Emotional template",
    glyph: "♡",
    oneLine: "A cube around an inner state — calm, courage, presence.",
    body:
      "For systems built around a quiet inner condition. Reflection is central. Numbers are not.",
    category: "calm",
    defaults: {
      glyph: "♡",
      purpose: {
        whatItImproves: "An inner quality you would like more of.",
        momentumType: "Returning to it briefly, often.",
        whyItMatters: "Because the days it disappears feel different.",
        whatUsersFeel: "Calmer. More grounded. Less reactive.",
        consistencyOutcome: "The state becomes more available, faster.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "daily",
        reflectionStyle: "feeling",
        trackingShape: "presence",
        remindersEnabled: false,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Returning matters more than feeling good every time.",
        toAvoid: ["streak shame", "comparison", "performance"],
        encouragementOver: ["gentle return", "consistency over intensity"],
      },
    },
  },
  {
    id: "learning",
    label: "Learning template",
    glyph: "✦",
    oneLine: "A small repeating learning practice.",
    body:
      "For users building a craft, a skill, a body of knowledge. Five minutes is the unit.",
    category: "learning",
    defaults: {
      glyph: "✦",
      purpose: {
        whatItImproves: "A specific skill or body of knowledge.",
        momentumType: "Daily exposure over heroic study sessions.",
        whyItMatters: "Long-term mastery is decided by what you do on ordinary days.",
        whatUsersFeel: "More competent. Less guilty about the size of what they don't know yet.",
        consistencyOutcome: "Slow, real progress that compounds.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "daily",
        reflectionStyle: "free-text",
        trackingShape: "duration",
        remindersEnabled: true,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Continuing matters more than perfecting any one session.",
        toAvoid: ["intensity worship", "guilt about missed days"],
        encouragementOver: ["smallness", "patience"],
      },
    },
  },
  {
    id: "recovery",
    label: "Recovery template",
    glyph: "◐",
    oneLine: "A gentle rebuilding system. No streak pressure.",
    body:
      "For coming back from something — burnout, illness, a hard period. Designed around patience.",
    category: "recovery",
    defaults: {
      glyph: "◐",
      purpose: {
        whatItImproves: "Quiet recovery and gentle rebuilding.",
        momentumType: "Smaller-than-comfortable steps, on most days.",
        whyItMatters: "You are not at zero. You are restoring flow.",
        whatUsersFeel: "Treated with care. Allowed to be slow.",
        consistencyOutcome: "Capacity returns in its own time.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "flexible",
        reflectionStyle: "feeling",
        trackingShape: "presence",
        remindersEnabled: false,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Restoring flow, not catching up.",
        toAvoid: ["streak anxiety", "self-blame", "intensity"],
        encouragementOver: ["softness", "patience", "permission to be slow"],
      },
    },
  },
  {
    id: "creator",
    label: "Creator template",
    glyph: "✺",
    oneLine: "A small-creation rhythm for makers.",
    body:
      "For people who make things. The session is the unit. Outcomes follow.",
    category: "creativity",
    defaults: {
      glyph: "✺",
      purpose: {
        whatItImproves: "A creative practice.",
        momentumType: "Returning to the work, briefly.",
        whyItMatters: "The work continues quietly between the big sessions.",
        whatUsersFeel: "Like a maker again, even on ordinary days.",
        consistencyOutcome: "A body of small things that becomes a body of work.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "daily",
        reflectionStyle: "free-text",
        trackingShape: "completion",
        remindersEnabled: false,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Showing up beats producing.",
        toAvoid: ["audience pressure", "comparison", "perfectionism"],
        encouragementOver: ["showing up", "small acts of making"],
      },
    },
  },
  {
    id: "organization",
    label: "Organization template",
    glyph: "◇",
    oneLine: "For team-level rituals — recognition, reflection, learning.",
    body:
      "A user-defined organizational practice. Integrates conceptually with five organizations.",
    category: "connection",
    defaults: {
      glyph: "◇",
      purpose: {
        whatItImproves: "A specific small culture habit inside a team.",
        momentumType: "Repeated micro-actions across people.",
        whyItMatters: "Culture is built in micro-actions, not workshops.",
        whatUsersFeel: "Held by a quiet shared rhythm.",
        consistencyOutcome: "The culture habit becomes real.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "weekly",
        reflectionStyle: "structured",
        trackingShape: "completion",
        remindersEnabled: true,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Participation matters more than performance.",
        toAvoid: ["surveillance", "team-level shame", "KPI worship"],
        encouragementOver: ["calm participation", "voluntariness"],
      },
    },
  },
  {
    id: "challenge",
    label: "Challenge template",
    glyph: "↗",
    oneLine: "A short consistency challenge with a real outcome.",
    body:
      "For users running a defined 7 / 14 / 30 day practice. Calm, specific, time-boxed.",
    category: "growth",
    defaults: {
      glyph: "↗",
      purpose: {
        whatItImproves: "A short, specific practice over a fixed window.",
        momentumType: "A short consistent shape with a real ending.",
        whyItMatters: "Bounded challenges land more often than open-ended habits.",
        whatUsersFeel: "Focused, not pressured.",
        consistencyOutcome: "The practice ends with something real to show.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "daily",
        reflectionStyle: "feeling",
        trackingShape: "completion",
        remindersEnabled: true,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Finishing the window, not perfecting every day.",
        toAvoid: ["streak shame", "all-or-nothing thinking"],
        encouragementOver: ["finishing", "partial credit"],
      },
    },
  },
  {
    id: "family",
    label: "Family template",
    glyph: "✿",
    oneLine: "A small ritual for two or more people who share a home.",
    body:
      "A family-shaped rhythm. Inherits five family's vocabulary — not productivity-shaped.",
    category: "family",
    defaults: {
      glyph: "✿",
      purpose: {
        whatItImproves: "Connection at home.",
        momentumType: "Repeated small moments of attention.",
        whyItMatters: "Families are built in micro-moments, not vacations.",
        whatUsersFeel: "A little less alone in their own house.",
        consistencyOutcome: "The home feels like home again.",
      },
      momentumLogic: {
        sessionDurationMinutes: 5,
        frequency: "few-per-week",
        reflectionStyle: "feeling",
        trackingShape: "presence",
        remindersEnabled: false,
        aiBehavior: "gentle",
      },
      successPhilosophy: {
        whatSuccessMeans: "Showing up together briefly is the whole win.",
        toAvoid: ["parenting guilt", "performance"],
        encouragementOver: ["presence", "softness"],
      },
    },
  },
];

export function getTemplate(id: CubeTemplateKind) {
  return cubeTemplates.find((t) => t.id === id) ?? cubeTemplates[0];
}
