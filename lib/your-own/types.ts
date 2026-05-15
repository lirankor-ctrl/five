/**
 * Domain types for the five your-own-cube cube.
 *
 * Users design their own momentum systems here. The data model is
 * deliberately rich — purpose, momentum logic, success philosophy,
 * visibility, evolution status — because the cube is itself a
 * design surface. A future server-driven marketplace replaces the
 * seeded community-cubes module behind these same types.
 */

export type CubeTemplateKind =
  | "blank"
  | "emotional"
  | "learning"
  | "recovery"
  | "creator"
  | "organization"
  | "challenge"
  | "family";

export type CubeVisibility = "private" | "community" | "public";

export type CubeEvolutionStatus =
  | "draft"
  | "published"
  | "evolution-candidate"
  | "official";

export type CubeFrequency =
  | "daily"
  | "few-per-week"
  | "weekly"
  | "flexible"
  | "monthly";

export type CubeReflectionStyle =
  | "none"
  | "feeling"
  | "free-text"
  | "structured";

export type CubeTrackingShape =
  | "presence"
  | "duration"
  | "completion"
  | "narrative";

export type CubeAIBehavior = "none" | "gentle" | "active";

export type EmotionalCategory =
  | "calm"
  | "growth"
  | "connection"
  | "creativity"
  | "recovery"
  | "learning"
  | "identity"
  | "family"
  | "play";

export type CubePurpose = {
  whatItImproves: string;
  momentumType: string;
  whyItMatters: string;
  whatUsersFeel: string;
  consistencyOutcome: string;
};

export type CubeMomentumLogic = {
  sessionDurationMinutes: number;
  frequency: CubeFrequency;
  reflectionStyle: CubeReflectionStyle;
  trackingShape: CubeTrackingShape;
  remindersEnabled: boolean;
  aiBehavior: CubeAIBehavior;
};

export type CubeSuccessPhilosophy = {
  whatSuccessMeans: string;
  /** A short list of anti-patterns this cube must never become. */
  toAvoid: string[];
  /** Stances that protect the user emotionally. */
  encouragementOver: string[];
};

export type UserCube = {
  id: string;
  name: string;
  subtitle: string;
  philosophy: string;
  glyph: string;
  creatorId: string;
  creatorName: string;
  category: EmotionalCategory;
  templateKind?: CubeTemplateKind;
  purpose: CubePurpose;
  momentumLogic: CubeMomentumLogic;
  successPhilosophy: CubeSuccessPhilosophy;
  visibility: CubeVisibility;
  status: CubeEvolutionStatus;
  createdAt: string;
  /** Soft marketplace stats. Never used as engagement metrics. */
  followers?: number;
  remixCount?: number;
  evolutionVotes?: number;
};

export type CubeSession = {
  id: string;
  cubeId: string;
  date: string; // YYYY-MM-DD
  status: "done" | "not-today";
  note?: string;
  reportedAt: string;
};

export type DraftCube = Partial<UserCube>;

export type YourOwnState = {
  myCubes: UserCube[];
  sessions: CubeSession[];
  followedCubes: string[];
  draft: DraftCube;
  version: 1;
};
