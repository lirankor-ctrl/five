/**
 * Domain types for the five live event cube.
 *
 * The shapes are designed for a future live realtime backend (websockets /
 * presence channels / server-pushed timers) but read cleanly today from
 * deterministic recurrence rules + local time. No live infrastructure
 * is required to render the experience.
 */

export type EventCategory =
  | "content"
  | "growth"
  | "fitness"
  | "creative"
  | "project"
  | "family"
  | "organizational";

export type EventCadence = "one-time" | "daily" | "weekly" | "weekday";

export type InteractionStyle =
  | "silent"
  | "guided"
  | "check-in"
  | "momentum-sprint";

export type CameraMode =
  | "no-cameras"
  | "cameras-on"
  | "text-only"
  | "free-discussion"
  | "guided-audio";

export type AccessLevel = "public" | "limited" | "private" | "invite-only";

export type Host = {
  id: string;
  name: string;
  handle: string;
  /** Optional one-line bio shown under host name. */
  oneLine?: string;
};

export type RecurrencePattern = {
  cadence: EventCadence;
  /** 0 = Sunday … 6 = Saturday. Required for "weekly". */
  dayOfWeek?: number;
  hour: number; // 0..23
  minute: number; // 0..59
};

export type LiveEvent = {
  id: string;
  name: string;
  hostId: string;
  category: EventCategory;
  description: string;
  /** Italic one-liner shown on cards. */
  hook?: string;
  durationMinutes: number;
  interaction: InteractionStyle;
  cameraMode: CameraMode;
  access: AccessLevel;
  language: string;
  /** Default false. We almost never record. */
  recorded?: boolean;
  recurrence: RecurrencePattern;
  /** Lightweight static facts about the community attached to this event. */
  community: CommunitySnapshot;
  /** Future monetization. Silent in UI today. */
  isPremium?: boolean;
  sponsoredBy?: string;
};

export type CommunitySnapshot = {
  daysActive: number;
  totalCompletions: number;
  weeklyCompletions: number;
  uniqueParticipants: number;
};

export type EventParticipant = {
  /** Per-device participant pseudonym; never their real id. */
  displayName: string;
  anonymous: boolean;
  joinedAt: string; // ISO
};

export type FiveDoneRecord = {
  id: string;
  eventId: string;
  date: string; // YYYY-MM-DD
  feeling?: "warm" | "calm" | "lively" | "honest";
  reactions: Reaction[];
  reportedAt: string;
};

export type Reaction = "thanks" | "fire" | "next-five" | "with-you";

export type EventInsight = {
  kind:
    | "early-momentum"
    | "live-helps"
    | "category-helps"
    | "morning-momentum"
    | "evening-momentum"
    | "gentle-return";
  body: string;
};

export type LiveState = {
  /** This device's identity inside live events. */
  displayName: string;
  anonymous: boolean;
  /** User-created events. Seeded events live in data/live/events.ts. */
  drafts: LiveEvent[];
  /** Past "I did my Five" confirmations. */
  completions: FiveDoneRecord[];
  /** Saved/Followed event ids. */
  saved: string[];
  version: 1;
};

/** Filters for discover. */
export type DiscoverFilters = {
  category?: EventCategory;
  interaction?: InteractionStyle;
  maxDuration?: number;
  language?: string;
};
