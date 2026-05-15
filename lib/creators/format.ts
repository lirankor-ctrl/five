import type {
  Audience,
  CreatorKind,
  DifficultyLevel,
  EnergyLevel,
  HumanImpactCounts,
  HumanImpactQuestion,
  MediaType,
  Pricing,
  SessionType,
  WorldContext,
} from "./types";

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  "micro-course": "Micro-course",
  "guided-session": "Guided session",
  challenge: "Challenge",
  "thought-drop": "Thought drop",
  "parent-child": "Parent · child",
  "organization-pack": "Organization pack",
};

export const MEDIA_LABEL: Record<MediaType, string> = {
  video: "Video",
  audio: "Audio",
  text: "Text",
  image: "Image",
  interactive: "Interactive",
  exercise: "Exercise",
  "reflection-prompt": "Reflection",
  "ai-guided": "AI-guided",
  quiz: "Quiz",
  assignment: "Assignment",
};

export const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: "Low energy",
  medium: "Medium energy",
  high: "High energy",
};

export const DIFFICULTY_LABEL: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  advanced: "Advanced",
};

export const AUDIENCE_LABEL: Record<Audience, string> = {
  solo: "Solo",
  child: "With a child",
  couple: "With a partner",
  group: "Small group",
};

export const WORLD_LABEL: Record<WorldContext, string> = {
  "in-app": "In-app",
  "physical-world": "Real-world",
  either: "Either",
};

export const PRICING_LABEL: Record<Pricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

export const CREATOR_KIND_LABEL: Record<CreatorKind, string> = {
  teacher: "Teacher",
  coach: "Coach",
  parent: "Parent",
  psychologist: "Psychologist",
  musician: "Musician",
  researcher: "Researcher",
  "thoughtful-human": "Thoughtful human",
  student: "Student",
  retiree: "Retired",
  artist: "Artist",
};

export const IMPACT_QUESTION_LABEL: Record<HumanImpactQuestion, string> = {
  consistencyHelpful: "Helped me stay consistent",
  returned: "I returned to it",
  changedDay: "Changed something small in my day",
  createdMomentum: "Created momentum",
  feltCalmer: "I felt calmer",
  createdCuriosity: "Created curiosity",
  realWorldAction: "Helped a real-life action",
};

export const IMPACT_QUESTIONS: HumanImpactQuestion[] = [
  "consistencyHelpful",
  "returned",
  "changedDay",
  "createdMomentum",
  "feltCalmer",
  "createdCuriosity",
  "realWorldAction",
];

export function emptyImpactCounts(): HumanImpactCounts {
  return {
    consistencyHelpful: 0,
    returned: 0,
    changedDay: 0,
    createdMomentum: 0,
    feltCalmer: 0,
    createdCuriosity: 0,
    realWorldAction: 0,
  };
}
