/**
 * Domain types for the five tipping point cube.
 *
 * Status vocabulary is intentional: we never say "failed". The third
 * option is "over" (past the boundary today) and is treated as
 * descriptive, not punitive.
 */

export type CheckInStatus = "within" | "partial" | "over";

export type BoundaryUnit = "minutes" | "hours" | "times" | "currency";

export type Boundary =
  | { kind: "daily-cap"; value: number; unit: BoundaryUnit }
  | { kind: "weekly-cap"; value: number; unit: BoundaryUnit }
  | { kind: "weekday-only"; allowedDays: number[] } // 0 = Sun … 6 = Sat
  | { kind: "time-window"; notAfter?: number; notBefore?: number } // hour 0-23
  | { kind: "custom"; description: string };

export type TippingPattern = {
  id: string;
  title: string;
  /** Optional reference to a suggested category (for normalisation copy). */
  categoryId?: string;
  boundary: Boundary;
  trackingCadence: "daily" | "weekly";
  /** Common trigger tags the user pre-selected during setup. */
  triggerTags: string[];
  createdAt: string;
  archivedAt?: string;
};

export type Reflection = {
  text?: string;
  triggers?: string[];
};

export type CheckIn = {
  patternId: string;
  date: string; // YYYY-MM-DD
  status: CheckInStatus;
  reflection?: Reflection;
  reportedAt: string;
};

export type TippingState = {
  patterns: TippingPattern[];
  checkIns: CheckIn[];
  assistantEnabled: boolean;
  version: 1;
};

export type TippingInsight = {
  kind:
    | "early-momentum"
    | "weekday-easier"
    | "weekend-harder"
    | "evening-harder"
    | "morning-easier"
    | "reduction"
    | "trigger-pattern"
    | "gentle-return";
  patternId: string;
  body: string;
};

export type SuggestedCategory = {
  id: string;
  label: string;
  /** A short, non-shaming framing line shown beside the option. */
  note: string;
  /** Suggested default boundary if the user picks this. */
  defaultBoundary?: Boundary;
};
