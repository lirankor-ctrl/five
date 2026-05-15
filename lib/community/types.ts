/**
 * Domain types for the five community cube.
 *
 * Designed for a future community backend with real members, moderation,
 * and AI compatibility matching. Today the cube is fully readable from
 * seeded data + the user's local overlay (joins, own drops, own journal,
 * followed paths). No follower counts, no likes, no popularity — by
 * design.
 */

export type CommunityType = "interest" | "identity" | "micro-multipotential";

export type Community = {
  id: string;
  name: string;
  oneLine: string;
  description: string;
  type: CommunityType;
  /** Search/match tags. */
  tags: string[];
  glyph: string;
  memberCount: number;
  daysActive: number;
  weeklyDrops: number;
  /** Optional river-map tributary id. */
  tributary?: string;
  /**
   * Quiet presence signals shown subtly inside the community — “47 people are
   * currently reading right now.” Strings, deterministic per-render today.
   */
  presence: Array<{ activity: string; count: number }>;
};

export type DropUpdate = {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorIsMentor?: boolean;
  /** Anonymous flag — author shown as “a quiet five-er”. */
  anonymous?: boolean;
  body: string;
  /** Tiny tag like "returning", "started", "after-burnout". */
  tag?: string;
  createdAt: string;
};

export type ThreadReply = {
  id: string;
  authorId: string;
  authorName: string;
  authorIsMentor?: boolean;
  body: string;
  createdAt: string;
};

export type MomentumThread = {
  id: string;
  communityId: string;
  title: string;
  openerBody: string;
  openerAuthorId: string;
  openerAuthorName: string;
  openerAuthorIsMentor?: boolean;
  createdAt: string;
  replies: ThreadReply[];
};

export type JournalEntry = {
  id: string;
  body: string;
  dropDate: string; // YYYY-MM-DD
  createdAt: string;
};

export type HumanJournal = {
  id: string;
  authorId: string;
  authorName: string;
  authorIsMentor?: boolean;
  title: string;
  oneLine: string;
  communityId?: string;
  entries: JournalEntry[];
};

export type PathStep = {
  id: string;
  ordinal: number;
  title: string;
  body: string;
  estimatedMinutes: number;
  optional?: boolean;
};

export type CuratedPath = {
  id: string;
  communityId?: string;
  authorId: string;
  authorName: string;
  authorIsMentor?: boolean;
  title: string;
  oneLine: string;
  description: string;
  totalDays?: number;
  steps: PathStep[];
};

/** Momentum-shaped reputation — never follower-count-shaped. */
export type Mentor = {
  id: string;
  name: string;
  oneLine: string;
  /** Communities the mentor cares for. */
  communityIds: string[];
  daysActive: number;
  dropsContributed: number;
  helpedCount: number;
};

export type CommunityInsight = {
  kind:
    | "early-momentum"
    | "compatibility"
    | "depth-leaning"
    | "variety-leaning"
    | "returning-many"
    | "quiet-presence"
    | "gentle-return";
  body: string;
  communityId?: string;
};

export type CommunityState = {
  /** Communities the user has joined on this device. */
  joinedCommunities: string[];
  /** User-authored drop updates (overlay seeded drops). */
  myDrops: DropUpdate[];
  /** A single user journal, if started. */
  myJournal: HumanJournal | null;
  /** Path ids the user is following. */
  followedPaths: string[];
  /** Per-path completed step ids. */
  pathProgress: Record<string, string[]>;
  version: 1;
};

/** Filters for discovery. */
export type DiscoverFilters = {
  type?: CommunityType;
  tag?: string;
};
