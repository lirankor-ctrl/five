/**
 * Domain types for the five family cube.
 *
 * Designed to outlive the in-repo mock — shapes survive a move to a real
 * multi-user family backend with shared accounts and child-safe layers.
 *
 * Vocabulary note: this cube never says "failed". The internal `status`
 * values are kept literal ("done" / "not-done") only so future analytics
 * remain comparable across cubes, but every UI rendering of those values
 * uses softer wording (see lib/family/format.ts).
 */

export type FamilyMemberRelation =
  | "parent"
  | "child"
  | "partner"
  | "sibling"
  | "grandparent"
  | "grandchild"
  | "other";

export type AgeBand = "young-child" | "child" | "teen" | "adult";

export type FamilyMember = {
  id: string;
  name: string;
  relation: FamilyMemberRelation;
  /** Optional, used for age-appropriate prompt filtering. */
  ageBand?: AgeBand;
};

export type FamilyFiveWorld =
  | "talk"
  | "read"
  | "play"
  | "learn"
  | "move"
  | "values"
  | "couple"
  | "school";

export type ParticipantPreset =
  | "whole-family"
  | "parent-child"
  | "parent-daughter"
  | "parent-son"
  | "couple"
  | "siblings"
  | "grandparent-grandchild"
  | "extended-family"
  | "flexible";

export type RitualCadence =
  | "daily"
  | "few-per-week"
  | "weekly"
  | "weekend-morning"
  | "before-sleep"
  | "after-dinner"
  | "custom";

export type Ritual = {
  id: string;
  label: string;
  world: FamilyFiveWorld;
  participantPreset: ParticipantPreset;
  /** Specific family-member ids. Empty = use preset as the audience. */
  participantIds: string[];
  cadence: RitualCadence;
  customCadenceLabel?: string;
  durationMinutes: number;
  createdAt: string;
  active: boolean;
};

export type SessionStatus = "done" | "not-today";
export type Feeling =
  | "warm"
  | "calm"
  | "joyful"
  | "tender"
  | "lively"
  | "honest";

export type Worked = "yes" | "maybe" | "not-really";

export type FamilySession = {
  id: string;
  ritualId?: string;
  world: FamilyFiveWorld;
  participantIds: string[];
  date: string; // YYYY-MM-DD
  status: SessionStatus;
  feelings?: Feeling[];
  note?: string;
  worked?: Worked;
  durationMinutes?: number;
  reportedAt: string; // ISO
};

export type FamilyGroup = {
  id: string;
  label: string;
  members: FamilyMember[];
  createdAt: string;
};

export type FamilyInsight = {
  id: string;
  kind:
    | "early-momentum"
    | "best-cadence"
    | "best-world"
    | "best-time-of-day"
    | "strong-pairing"
    | "gentle-return"
    | "short-helps";
  body: string;
};

export type FamilyState = {
  group: FamilyGroup | null;
  rituals: Ritual[];
  sessions: FamilySession[];
  /** Whether the user dismissed the gentle "did you have a five today?" once. */
  dismissedTodayPrompt?: string; // YYYY-MM-DD
  version: 1;
};
