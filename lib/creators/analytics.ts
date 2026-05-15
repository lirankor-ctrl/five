import { creatorSessions } from "@/data/creators/sessions";
import { creators } from "@/data/creators/creators";
import { emptyImpactCounts, IMPACT_QUESTIONS } from "./format";
import { allSessions } from "./match";
import type {
  Creator,
  CreatorAnalytics,
  CreatorSession,
  CreatorsState,
  HumanImpactCounts,
  HumanImpactQuestion,
} from "./types";

/**
 * Compute a session's total impact counts: seed counts + counts from
 * user-submitted impact reports persisted in state.
 */
export function impactFor(
  session: CreatorSession,
  state: CreatorsState,
): HumanImpactCounts {
  const counts = { ...emptyImpactCounts(), ...session.seedImpact };
  for (const r of state.impactReports) {
    if (r.sessionId !== session.id) continue;
    for (const q of r.marked) counts[q] = (counts[q] ?? 0) + 1;
  }
  return counts;
}

/** Total number of "yes" marks across all impact questions for a session. */
export function impactTotal(counts: HumanImpactCounts): number {
  let total = 0;
  for (const q of IMPACT_QUESTIONS) total += counts[q] ?? 0;
  return total;
}

/** The most-marked impact question on this session, or null if no data. */
export function topImpact(
  counts: HumanImpactCounts,
): HumanImpactQuestion | null {
  let top: HumanImpactQuestion | null = null;
  let topCount = 0;
  for (const q of IMPACT_QUESTIONS) {
    const c = counts[q] ?? 0;
    if (c > topCount) {
      topCount = c;
      top = q;
    }
  }
  return top;
}

/** Sessions belonging to a given creator (seed + drafts). */
export function sessionsByCreator(
  creatorId: string,
  state: CreatorsState,
): CreatorSession[] {
  return allSessions(state).filter((s) => s.creatorId === creatorId);
}

/** Compute simple per-creator analytics. Numbers are derived, not stored. */
export function analyticsFor(
  creator: Creator,
  state: CreatorsState,
): CreatorAnalytics {
  const sessions = sessionsByCreator(creator.id, state);

  // Aggregate impact across the creator's sessions.
  const agg: HumanImpactCounts = emptyImpactCounts();
  let totalReports = 0;
  for (const s of sessions) {
    const counts = impactFor(s, state);
    for (const q of IMPACT_QUESTIONS) agg[q] += counts[q] ?? 0;
    // Each report has 1+ marks; estimate reports = max mark count for the
    // session, plus user-submitted reports for this session.
    const seedMax = Math.max(...IMPACT_QUESTIONS.map((q) => s.seedImpact?.[q] ?? 0));
    const userReports = state.impactReports.filter((r) => r.sessionId === s.id).length;
    totalReports += seedMax + userReports;
  }

  // Heuristic ratios — entirely deterministic from impact + count.
  // The point is shape and pacing, not accuracy.
  const denom = Math.max(1, totalReports);
  const completionRate = Math.min(1, (agg.consistencyHelpful + agg.returned) / (denom * 2));
  const returnRate = Math.min(1, agg.returned / denom);
  const retentionRate = Math.min(
    1,
    (agg.consistencyHelpful + agg.changedDay + agg.createdMomentum) /
      (denom * 3),
  );

  return {
    creatorId: creator.id,
    totalSessions: sessions.length,
    totalImpactReports: totalReports,
    retentionRate,
    completionRate,
    returnRate,
    topImpact: topImpact(agg),
  };
}

/** Convenience — every seed creator. */
export function allCreators(): Creator[] {
  return creators;
}

/** Convenience — every seed session. */
export function allSeedSessions(): CreatorSession[] {
  return creatorSessions;
}
