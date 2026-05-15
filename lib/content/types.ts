/**
 * Domain types for the five content cube.
 *
 * The shapes here are designed to outlive the in-repo mock catalog and
 * survive a move to an API / partner-managed content backend. Each
 * ContentItem and ContentProvider carries optional monetization metadata
 * (affiliateUrl, sponsored flag, revenueModel, conversion id) that is
 * intentionally invisible in the UI today.
 */

export type ContentType =
  | "app"
  | "video"
  | "article"
  | "podcast"
  | "course"
  | "website"
  | "audio";

export type Difficulty = "easy" | "medium" | "advanced";

export type Pricing = "free" | "freemium" | "paid";

export type ContentCategoryId =
  | "move"
  | "learn"
  | "breathe"
  | "create"
  | "read"
  | "listen"
  | "focus"
  | "language"
  | "philosophy"
  | "music"
  | "writing"
  | "fitness"
  | "calm"
  | "curiosity";

export type ContentCategory = {
  id: ContentCategoryId;
  label: string;
  glyph: string;
  description: string;
};

export type RevenueModel =
  | "affiliate"
  | "referral"
  | "sponsored"
  | "subscription-share";

export type PartnerTier = "partner" | "affiliate" | "sponsored";

export type ContentProvider = {
  id: string;
  name: string;
  domain?: string;
  /** Future monetization metadata. Empty today by design. */
  affiliateProgram?: string;
  partnerTier?: PartnerTier;
};

export type ContentItem = {
  id: string;
  title: string;
  /** One-line user-facing description. */
  description: string;
  /** Short, explicit "why this fits a five-minute drop". */
  whyItFits: string;
  category: ContentCategoryId;
  contentType: ContentType;
  /** Suggested duration. Defaults to 5; values up to ~10 are acceptable. */
  durationMinutes: number;
  difficulty: Difficulty;
  pricing: Pricing;
  providerId: string;
  /** Placeholder URL — points to the provider's site, not a real deep link. */
  externalUrl: string;
  /** Tokens used by the matcher. */
  tags: string[];
  /** Future monetization metadata. All optional — UI does not key off them today. */
  affiliateUrl?: string;
  sponsored?: boolean;
  revenueModel?: RevenueModel;
  conversionTrackingId?: string;
};

export type SessionStatus = "done" | "not-done";
export type SessionFeeling = "good" | "okay" | "off";

export type ContentSession = {
  id: string;
  contentItemId: string;
  startedAt: string;
  completedAt?: string;
  status?: SessionStatus;
  actualMinutes?: number;
  feeling?: SessionFeeling;
  /** "Continue with this kind of content?" — yes/no answer if reported. */
  continueWithType?: boolean;
};

export type SavedContentPath = {
  id: string;
  label: string;
  /** Any of these may be undefined — the path can be as narrow or as wide as the user wants. */
  categoryId?: ContentCategoryId;
  contentType?: ContentType;
  difficulty?: Difficulty;
  freeOnly?: boolean;
  createdAt: string;
};

export type ContentInsight = {
  kind:
    | "early-momentum"
    | "preferred-type"
    | "preferred-category"
    | "preferred-hour"
    | "weekend-shift"
    | "depth-vs-variety"
    | "gentle-return";
  body: string;
};

export type ContentState = {
  sessions: ContentSession[];
  savedPaths: SavedContentPath[];
  /** Lightweight derived preference snapshot — recomputed on read. */
  preferences?: {
    hourHistogram: Record<number, number>;
    categoryHistogram: Partial<Record<ContentCategoryId, number>>;
    typeHistogram: Partial<Record<ContentType, number>>;
  };
  version: 1;
};
