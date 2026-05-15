/**
 * Domain types for the five solo cube.
 *
 * These types intentionally stay narrow and serializable so the same
 * shapes can later move from localStorage to Supabase without churn.
 */

export type SoloFrequency =
  | { kind: "daily" }
  | { kind: "weekly"; perWeek: number }
  | { kind: "specific-days"; days: number[] } // 0 = Sunday … 6 = Saturday
  | { kind: "flexible" };

export type SoloTimeOfDay =
  | { kind: "morning" }
  | { kind: "afternoon" }
  | { kind: "evening" }
  | { kind: "hour"; hour: number } // 0–23 local
  | { kind: "anchor"; anchor: string };

export type SoloPlan = {
  field: string;
  frequency: SoloFrequency;
  timeOfDay: SoloTimeOfDay;
  durationMin: number;
  assistantEnabled: boolean;
  createdAt: string; // ISO timestamp
};

export type SoloStatus = "done" | "partial" | "missed";

export type SoloEntry = {
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  status: SoloStatus;
  /** Minutes the user reported actually spending (optional). */
  durationMin?: number;
  /** Hour of day (0–23, local) the user reported. */
  hour?: number;
  reportedAt: string; // ISO timestamp
};

export type SoloState = {
  plan: SoloPlan | null;
  entries: SoloEntry[];
  /** Internal schema version — bump only on breaking shape changes. */
  version: 1;
};

export type SoloInsight = {
  /** Stable kind so future UIs can theme or dismiss insights individually. */
  kind:
    | "best-hour"
    | "best-weekday"
    | "shorter-helps"
    | "anchor-helps"
    | "gentle-return"
    | "early-momentum";
  body: string;
};
