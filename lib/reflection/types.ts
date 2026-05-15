/**
 * Master types for the five reflection cube.
 *
 * Reflection sits on top of every other cube. Its job is to read the
 * combined picture of how a person is moving across the platform and
 * produce a calm, narrative document about that movement. Shapes here
 * are designed for a future AI-backed generator — but the v1 generator
 * is deterministic and reads from local storage.
 */

import type { Cube as MetaCube } from "@/lib/types";

export type CubeId = MetaCube["id"];

export type ReportCadence =
  | "manual"
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly";

export type ActivitySignal = {
  cubeId: CubeId;
  cubeLabel: string;
  glyph: string;
  /** Done-or-equivalent count in the report's window. */
  donesInWindow: number;
  /** Done-or-equivalent count in the equal-length prior window. */
  donesInPrior: number;
  /** Unique calendar days with activity in the window. */
  activeDaysInWindow: number;
  /** Number of reflection-style notes captured in the window. */
  reflectionsInWindow: number;
  /** Short narrative line summarising this cube's week. */
  narrative: string;
};

export type MomentumSnapshot = {
  windowDays: number;
  totalDonesInWindow: number;
  totalDonesInPrior: number;
  activeCubesCount: number;
  signals: ActivitySignal[];
  /** A paragraph summarising the week, derived from signals. */
  paragraph: string;
};

export type SWOTKind = "strength" | "weakness" | "opportunity" | "threat";

export type SWOTInsight = {
  kind: SWOTKind;
  body: string;
  /** Optional cube reference for theming. */
  cubeId?: CubeId;
};

export type CrossRiverOpportunity = {
  id: string;
  fromCubeId: CubeId;
  toCubeId: CubeId;
  body: string;
  cta?: { label: string; href: string };
};

export type EmotionalSignalKind = "alive" | "fragile" | "steady" | "neutral";

export type EmotionalSignal = {
  kind: EmotionalSignalKind;
  body: string;
};

export type ReflectionReport = {
  id: string;
  generatedAt: string;
  windowDays: number;
  opening: string;
  snapshot: MomentumSnapshot;
  swot: SWOTInsight[];
  crossRiver: CrossRiverOpportunity[];
  emotional: EmotionalSignal[];
  closing: string;
};

export type ReflectionDialogueKind =
  | "accurate"
  | "surprising"
  | "off"
  | "explore-more"
  | "unusual"
  | "matters";

export type ReflectionDialogueResponse = {
  id: string;
  reportId: string;
  kind: ReflectionDialogueKind;
  body?: string;
  createdAt: string;
};

export type ReflectionState = {
  archive: ReflectionReport[];
  dialogue: ReflectionDialogueResponse[];
  cadence: ReportCadence;
  lastGeneratedAt?: string;
  version: 1;
};

/** A point on the long-arc River Timeline. */
export type RiverTimelinePoint = {
  weekStart: string; // YYYY-MM-DD (Monday)
  perCube: Partial<Record<CubeId, number>>;
  total: number;
};
