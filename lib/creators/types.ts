/**
 * Domain types for the five creators cube.
 *
 * Shapes are designed to outlive the in-repo mock catalog and survive a
 * move to a real creator backend (Supabase / a content API / payouts).
 * Monetization metadata is declared but intentionally absent from the UI.
 */

export type CreatorKind =
  | "teacher"
  | "coach"
  | "parent"
  | "psychologist"
  | "musician"
  | "researcher"
  | "thoughtful-human"
  | "student"
  | "retiree"
  | "artist";

export type SessionType =
  | "micro-course"
  | "guided-session"
  | "challenge"
  | "thought-drop"
  | "parent-child"
  | "organization-pack";

export type MediaType =
  | "video"
  | "audio"
  | "text"
  | "image"
  | "interactive"
  | "exercise"
  | "reflection-prompt"
  | "ai-guided"
  | "quiz"
  | "assignment";

export type EnergyLevel = "low" | "medium" | "high";
export type DifficultyLevel = "easy" | "medium" | "advanced";
export type Audience = "solo" | "child" | "couple" | "group";
export type WorldContext = "in-app" | "physical-world" | "either";
export type Pricing = "free" | "freemium" | "paid";

export type CreatorRevenueModel =
  | "revenue-share"
  | "pay-per-session"
  | "subscription-pool"
  | "promoted";

export type Creator = {
  id: string;
  name: string;
  handle: string;
  kind: CreatorKind;
  /** One-sentence creator identity, shown on cards + profile header. */
  oneLine: string;
  /** Longer philosophy paragraph shown on creator profile. */
  philosophy: string;
  joinedAt: string; // ISO
  /** Future monetization metadata — invisible today. */
  payoutEnabled?: boolean;
  revenueModel?: CreatorRevenueModel;
};

export type CreatorSession = {
  id: string;
  creatorId: string;
  type: SessionType;
  title: string;
  /** Short hook line shown under the title on cards. */
  hook: string;
  description: string;
  /** Category id (see data/creators/categories.ts). */
  category: string;
  /** Mood / intention ids this session answers well. */
  moods: string[];
  durationMinutes: number;
  energy: EnergyLevel;
  difficulty: DifficultyLevel;
  audience: Audience;
  world: WorldContext;
  mediaTypes: MediaType[];
  /** For micro-courses + challenges. */
  sessionCount?: number;
  totalDays?: number;
  pricing: Pricing;
  /** Future monetization placeholders. */
  sponsored?: boolean;
  revenueModel?: CreatorRevenueModel;
  /** Seeded creator-impact counts. Updated by user reports on top. */
  seedImpact?: Partial<HumanImpactCounts>;
  createdAt: string;
};

/**
 * Human Impact rating — six discrete, momentum-shaped questions, NOT stars.
 *
 * Each one is a binary "yes / no" the user can mark. We surface positives
 * only — there is no negative rating. The total of all yeses is the
 * single visible "impact" number on cards and profiles.
 */
export type HumanImpactQuestion =
  | "consistencyHelpful" // Did this help you stay consistent?
  | "returned" // Did you return to it?
  | "changedDay" // Did it change something small in your day?
  | "createdMomentum" // Did it create momentum?
  | "feltCalmer" // Did it make you feel calmer?
  | "createdCuriosity" // Did it create curiosity?
  | "realWorldAction"; // Did it help real-life action?

export type HumanImpactCounts = Record<HumanImpactQuestion, number>;

export type HumanImpactReport = {
  id: string;
  sessionId: string;
  /** Which positives the user marked. */
  marked: HumanImpactQuestion[];
  /** Optional one-line note (creators see this anonymously). */
  note?: string;
  reportedAt: string; // ISO
};

export type CreatorAnalytics = {
  creatorId: string;
  totalSessions: number;
  totalImpactReports: number;
  retentionRate: number; // 0..1 — share of viewers returning within 14d
  completionRate: number; // 0..1
  returnRate: number; // 0..1
  topImpact: HumanImpactQuestion | null;
};

/** Categories and moods are simple lookup tables. */
export type CreatorCategory = {
  id: string;
  label: string;
  glyph: string;
  description: string;
};

export type Mood = {
  id: string;
  label: string;
  /** First-person phrasing used as a chip on discover. */
  intention: string;
};

export type DiscoverFilters = {
  category?: string;
  mood?: string;
  type?: SessionType;
  maxDuration?: number;
  energy?: EnergyLevel;
  audience?: Audience;
  pricing?: Pricing | "any";
};

/** Locally persisted state for the cube. */
export type CreatorsState = {
  /** "You" in the studio — single-creator demo identity. */
  meCreatorId: string;
  /** User-created sessions (drafts + published, all client-side today). */
  drafts: CreatorSession[];
  /** Impact reports the user has submitted on any session. */
  impactReports: HumanImpactReport[];
  /** Sessions the user has bookmarked. */
  saved: string[];
  version: 1;
};
