"use client";

import { aggregateSignals } from "./aggregate";
import { CUBE_HREF, CUBE_LABEL } from "./format";
import type {
  ActivitySignal,
  CrossRiverOpportunity,
  CubeId,
  EmotionalSignal,
  MomentumSnapshot,
  ReflectionReport,
  SWOTInsight,
} from "./types";

const WINDOW_DAYS = 7;

/**
 * Build a full ReflectionReport from local cube state.
 *
 * Deterministic today, narrative tomorrow — the call surface stays the
 * same when an LLM-backed generator replaces this. Every piece of copy
 * is shaped so it could plausibly come from an emotionally aware reader,
 * not a productivity bot.
 */
export function generateReport(
  windowDays = WINDOW_DAYS,
): ReflectionReport {
  const { signals } = aggregateSignals(windowDays);

  const totalDonesInWindow = signals.reduce((a, s) => a + s.donesInWindow, 0);
  const totalDonesInPrior = signals.reduce((a, s) => a + s.donesInPrior, 0);
  const activeCubesCount = signals.length;

  const snapshot: MomentumSnapshot = {
    windowDays,
    totalDonesInWindow,
    totalDonesInPrior,
    activeCubesCount,
    signals,
    paragraph: buildSnapshotParagraph(signals, totalDonesInWindow, totalDonesInPrior),
  };

  const opening = buildOpening(signals, totalDonesInWindow, totalDonesInPrior);
  const swot = buildSWOT(signals);
  const crossRiver = buildCrossRiver(signals);
  const emotional = buildEmotional(signals);
  const closing = buildClosing(signals, totalDonesInWindow);

  return {
    id: `r-${Date.now().toString(36)}`,
    generatedAt: new Date().toISOString(),
    windowDays,
    opening,
    snapshot,
    swot,
    crossRiver,
    emotional,
    closing,
  };
}

// ── Opening ────────────────────────────────────────────────────────
function buildOpening(
  signals: ActivitySignal[],
  total: number,
  prior: number,
): string {
  if (signals.length === 0) {
    return "This week was quiet across the cubes. That is also a week. The river slows sometimes, and the water is still there.";
  }
  const top = signals[0];
  if (total < 3 && prior < 3) {
    return `Still early days across most cubes. The clearest movement this week sits inside ${top.cubeLabel} — a small but real return.`;
  }
  if (total > prior + 3) {
    return `A noticeably more present week than the one before. The movement sits most strongly in ${top.cubeLabel}, with quieter currents elsewhere.`;
  }
  if (prior > total + 3) {
    return `A quieter week than the one before. ${top.cubeLabel} still held some real presence — that part is worth seeing clearly.`;
  }
  return `A steady week. The strongest current ran through ${top.cubeLabel}, with several quieter tributaries alongside it.`;
}

// ── Snapshot paragraph ─────────────────────────────────────────────
function buildSnapshotParagraph(
  signals: ActivitySignal[],
  total: number,
  prior: number,
): string {
  if (signals.length === 0) {
    return "No activity was recorded across the cubes this week. Reflection is here when you are.";
  }
  const top = signals.slice(0, 3).map((s) => s.cubeLabel);
  const others = signals.slice(3).map((s) => s.cubeLabel);
  const direction =
    total > prior + 2
      ? "up from the previous week"
      : prior > total + 2
        ? "softer than the previous week"
        : "roughly even with the previous week";
  let sentence = `Movement appeared in ${top.join(", ")}`;
  if (others.length > 0) {
    sentence += `, with smaller currents in ${others.join(", ")}`;
  }
  sentence += `. Total presence is ${direction}.`;
  return sentence;
}

// ── SWOT ───────────────────────────────────────────────────────────
function buildSWOT(signals: ActivitySignal[]): SWOTInsight[] {
  const out: SWOTInsight[] = [];

  if (signals.length === 0) {
    out.push({
      kind: "opportunity",
      body: "A clean week is also a starting line. Pick one cube. Pick one five. That is the whole next step.",
    });
    return out;
  }

  // Strengths — top sustained cubes
  for (const s of signals.slice(0, 2)) {
    if (s.donesInWindow >= 3) {
      out.push({
        kind: "strength",
        cubeId: s.cubeId,
        body: `${s.cubeLabel} is your steadiest current right now — ${s.donesInWindow} five-actions in the last ${signals.length === 0 ? "" : "week"}. Returning often, without forcing it.`,
      });
    }
  }

  // Weaknesses — large decline from prior week
  for (const s of signals) {
    if (s.donesInPrior >= 3 && s.donesInWindow <= 1) {
      out.push({
        kind: "weakness",
        cubeId: s.cubeId,
        body: `${s.cubeLabel} was strong last week and is quieter this week. Sometimes that is the body asking for a different time of day or a smaller version.`,
      });
    }
  }

  // Opportunities — emerging signals + reflections
  for (const s of signals) {
    if (s.reflectionsInWindow >= 2 && s.donesInWindow >= 2) {
      out.push({
        kind: "opportunity",
        cubeId: s.cubeId,
        body: `${s.cubeLabel} keeps producing reflection notes alongside its sessions. That combination often means the work is becoming meaningful, not just frequent.`,
      });
    }
  }

  // Threat — fragmentation
  if (signals.length >= 5 && signals.every((s) => s.donesInWindow <= 2)) {
    out.push({
      kind: "threat",
      body:
        "Many cubes had a little movement, none had much. During heavy weeks, narrowing to two or three cubes often protects the practice better than spreading thin.",
    });
  }

  // Threat — fragility (huge fall everywhere)
  const totalNow = signals.reduce((a, s) => a + s.donesInWindow, 0);
  const totalPrior = signals.reduce((a, s) => a + s.donesInPrior, 0);
  if (totalPrior >= 6 && totalNow < totalPrior / 2) {
    out.push({
      kind: "threat",
      body:
        "A sharper drop than usual across the board. Often this signals overload, not failure. The kindest move is a smaller week, not a heroic one.",
    });
  }

  if (out.length === 0) {
    out.push({
      kind: "opportunity",
      body: "Quiet week, real movement. Nothing to optimise. Keep the small actions where they are.",
    });
  }
  return out;
}

// ── Cross-River opportunities ──────────────────────────────────────
function buildCrossRiver(signals: ActivitySignal[]): CrossRiverOpportunity[] {
  const out: CrossRiverOpportunity[] = [];
  const map = new Map<CubeId, ActivitySignal>();
  for (const s of signals) map.set(s.cubeId, s);

  const solo = map.get("solo");
  const tipping = map.get("tipping-point");
  const content = map.get("content");
  const family = map.get("family");
  const live = map.get("live-event");
  const community = map.get("community");
  const project = map.get("project");
  const creators = map.get("creators");

  function add(
    fromId: CubeId,
    toId: CubeId,
    body: string,
    ctaLabel: string,
  ) {
    const href = CUBE_HREF[toId];
    out.push({
      id: `op-${fromId}-${toId}`,
      fromCubeId: fromId,
      toCubeId: toId,
      body,
      cta: href ? { label: ctaLabel, href } : undefined,
    });
  }

  // Solo → Event
  if (solo && solo.donesInWindow >= 4) {
    add(
      "solo",
      "live-event",
      `You've sustained your solo five for several days. It may be the right time to experience it with others — a live room for the same activity.`,
      `See live ${CUBE_LABEL["live-event"]}`,
    );
  }
  // Solo → Community
  if (solo && solo.donesInWindow >= 5 && !(community && community.donesInWindow > 0)) {
    add(
      "solo",
      "community",
      `A small consistent solo practice is the right shape to begin sharing — quietly. A community of others doing the same five might extend the rhythm.`,
      "Find a community",
    );
  }
  // Content → Project
  if (content && content.donesInWindow >= 4) {
    add(
      "content",
      "project",
      `You consumed a real amount of small content this week. If something is taking shape, five project is the place to turn it into a living thread.`,
      "Open five project",
    );
  }
  // Family → Solo
  if (family && family.donesInWindow >= 3) {
    add(
      "family",
      "solo",
      `Family moments seem emotionally meaningful at the moment. A quiet solo five for yourself often pairs well with that kind of week.`,
      "Open five solo",
    );
  }
  // Tipping → Reflection
  if (tipping && tipping.donesInWindow >= 3 && tipping.donesInWindow > tipping.donesInPrior) {
    add(
      "tipping-point",
      "reflection",
      `A real reduction is happening on your tipping-point boundary, without forcing perfection. That is small, durable momentum — worth naming.`,
      "Continue here",
    );
  }
  // Community → Live event
  if (community && community.donesInWindow >= 2 && !(live && live.donesInWindow > 0)) {
    add(
      "community",
      "live-event",
      `Posting in community without joining a live yet — a live room is the next gentle step. Same people, more body in the room.`,
      "See live now",
    );
  }
  // Project → Creators
  if (project && project.donesInWindow >= 4 && !(creators && creators.donesInWindow > 0)) {
    add(
      "project",
      "creators",
      `A real project rhythm is forming. If a small piece is shareable, the creators world is a calm place to publish.`,
      "Open the studio",
    );
  }
  return out;
}

// ── Emotional ───────────────────────────────────────────────────────
function buildEmotional(signals: ActivitySignal[]): EmotionalSignal[] {
  const out: EmotionalSignal[] = [];

  if (signals.length === 0) {
    out.push({
      kind: "neutral",
      body: "No emotional signal to read yet — a few more days of activity will give the reading something to listen to.",
    });
    return out;
  }

  // Alive — reflections alongside dones
  for (const s of signals) {
    if (s.reflectionsInWindow >= 2 && s.donesInWindow >= 2) {
      out.push({
        kind: "alive",
        body: `${s.cubeLabel} feels alive this week — not just frequent, but reflected on. That combination is the difference between a habit and a practice.`,
      });
    }
  }
  // Fragile — high prior, low now
  for (const s of signals) {
    if (s.donesInPrior >= 4 && s.donesInWindow <= 1) {
      out.push({
        kind: "fragile",
        body: `${s.cubeLabel} fell quickly. Sometimes this is a real signal — that the time slot or the size of the practice needs to change.`,
      });
    }
  }
  // Steady — multiple cubes at moderate levels
  if (signals.length >= 2 && signals.every((s) => s.donesInWindow >= 2)) {
    out.push({
      kind: "steady",
      body: "Several cubes moved at the same calm rate this week. Steady weeks like this are usually invisible while they happen and visible afterwards.",
    });
  }

  if (out.length === 0) {
    out.push({
      kind: "neutral",
      body: "A neutral emotional reading this week. Not flat — just quiet. Worth letting be.",
    });
  }
  return out;
}

// ── Closing ─────────────────────────────────────────────────────────
function buildClosing(signals: ActivitySignal[], total: number): string {
  if (signals.length === 0) {
    return "Not every week needs movement. Rivers sometimes slow. The water is still there.";
  }
  if (total < 4) {
    return "A few small drops. Small is the unit. Continue.";
  }
  if (signals.length === 1) {
    return "One steady current this week. That is a quiet kind of success.";
  }
  return "The areas you repeatedly return to may be saying something true about who you are right now. Worth noticing.";
}
