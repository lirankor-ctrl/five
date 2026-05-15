import { getWorld } from "@/data/family/worlds";
import { CADENCE_LABEL, todayKey } from "./format";
import type {
  FamilyFiveWorld,
  FamilyInsight,
  FamilySession,
  FamilyState,
  RitualCadence,
} from "./types";

/**
 * Family-shaped pattern recognition.
 *
 * Strict emotional rules:
 *  - Never punitive. Skipped days are never highlighted.
 *  - Insights describe what is working, not what is missing.
 *  - Thresholds favour silence over speculation.
 */
const MIN_SESSIONS = 4;

function doneOnly(state: FamilyState): FamilySession[] {
  return state.sessions.filter((s) => s.status === "done");
}

export function totalMomentsInMonth(state: FamilyState, d: Date = new Date()): number {
  const month = d.getMonth();
  const year = d.getFullYear();
  return doneOnly(state).filter((s) => {
    const sd = new Date(s.date);
    return sd.getMonth() === month && sd.getFullYear() === year;
  }).length;
}

export function recentDoneDays(
  state: FamilyState,
  n = 14,
): Array<{ date: string; done: boolean }> {
  const map = new Map<string, boolean>();
  for (const s of doneOnly(state)) map.set(s.date, true);
  const out: Array<{ date: string; done: boolean }> = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    out.push({ date: key, done: map.has(key) });
  }
  return out;
}

export function generateFamilyInsights(state: FamilyState): FamilyInsight[] {
  const out: FamilyInsight[] = [];
  const done = doneOnly(state);

  if (done.length < MIN_SESSIONS) {
    if (done.length === 0) {
      out.push({
        id: "early-1",
        kind: "early-momentum",
        body:
          "Once you’ve had a few moments, gentle patterns about what works will show up here.",
      });
    } else {
      out.push({
        id: "early-2",
        kind: "early-momentum",
        body:
          "A few moments in already. After a couple more, observations will start to appear quietly.",
      });
    }
    return out;
  }

  // Best world (most frequent done world)
  const byWorld = new Map<FamilyFiveWorld, number>();
  for (const s of done) byWorld.set(s.world, (byWorld.get(s.world) ?? 0) + 1);
  let bestWorld: FamilyFiveWorld | null = null;
  let bestCount = 0;
  for (const [w, c] of byWorld) {
    if (c > bestCount) {
      bestCount = c;
      bestWorld = w;
    }
  }
  if (bestWorld && bestCount >= 3) {
    const w = getWorld(bestWorld);
    out.push({
      id: `best-world-${bestWorld}`,
      kind: "best-world",
      body: `${w?.label} keeps showing up most often for you. It might be a quiet anchor.`,
    });
  }

  // Best cadence — group ritualIds and find the cadence of the most-used ritual
  const ritualUse = new Map<string, number>();
  for (const s of done) {
    if (s.ritualId) ritualUse.set(s.ritualId, (ritualUse.get(s.ritualId) ?? 0) + 1);
  }
  let topRitualId: string | null = null;
  let topRitualCount = 0;
  for (const [id, c] of ritualUse) {
    if (c > topRitualCount) {
      topRitualCount = c;
      topRitualId = id;
    }
  }
  if (topRitualId && topRitualCount >= 3) {
    const ritual = state.rituals.find((r) => r.id === topRitualId);
    if (ritual) {
      const cadence: RitualCadence = ritual.cadence;
      const label = CADENCE_LABEL[cadence].toLowerCase();
      out.push({
        id: `best-cadence-${ritual.id}`,
        kind: "best-cadence",
        body: `${label} seems to work — “${ritual.label}” has held more than once.`,
      });
    }
  }

  // Strong pairing (most frequent pair of participant ids)
  if (state.group && done.some((s) => s.participantIds.length >= 2)) {
    const pairCount = new Map<string, { ids: [string, string]; count: number }>();
    for (const s of done) {
      const ids = [...s.participantIds].sort();
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const key = `${ids[i]}|${ids[j]}`;
          const entry = pairCount.get(key) ?? {
            ids: [ids[i], ids[j]] as [string, string],
            count: 0,
          };
          entry.count++;
          pairCount.set(key, entry);
        }
      }
    }
    let topPair: { ids: [string, string]; count: number } | null = null;
    for (const v of pairCount.values()) {
      if (!topPair || v.count > topPair.count) topPair = v;
    }
    if (topPair && topPair.count >= 3) {
      const memberA = state.group.members.find((m) => m.id === topPair!.ids[0]);
      const memberB = state.group.members.find((m) => m.id === topPair!.ids[1]);
      if (memberA && memberB) {
        out.push({
          id: `pair-${topPair.ids.join("-")}`,
          kind: "strong-pairing",
          body: `${memberA.name} and ${memberB.name} have shared the most moments lately.`,
        });
      }
    }
  }

  // Short helps — if average duration ≤5 and ratio of done days is good
  const avgDuration =
    done.reduce((a, s) => a + (s.durationMinutes ?? 0), 0) / done.length;
  if (avgDuration > 0 && avgDuration <= 5 && done.length >= 6) {
    out.push({
      id: "short-helps",
      kind: "short-helps",
      body: "Short moments seem to be holding. Keeping them small is working.",
    });
  }

  // Time of day signal — based on reportedAt hour (we don't have an explicit time)
  const hourBucket = new Map<string, number>();
  for (const s of done) {
    const h = new Date(s.reportedAt).getHours();
    const phrase =
      h < 11 ? "in the morning" : h < 17 ? "in the afternoon" : "in the evening";
    hourBucket.set(phrase, (hourBucket.get(phrase) ?? 0) + 1);
  }
  let bestTime: string | null = null;
  let bestTimeCount = 0;
  for (const [k, c] of hourBucket) {
    if (c > bestTimeCount) {
      bestTimeCount = c;
      bestTime = k;
    }
  }
  if (bestTime && bestTimeCount >= 3) {
    out.push({
      id: `time-${bestTime}`,
      kind: "best-time-of-day",
      body: `Most of your moments happen ${bestTime}.`,
    });
  }

  if (out.length === 0) {
    out.push({
      id: "gentle",
      kind: "gentle-return",
      body:
        "A small rhythm is forming. Nothing to optimise — just notice it is there.",
    });
  }

  return out;
}
