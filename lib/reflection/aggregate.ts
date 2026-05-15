"use client";

import {
  CUBE_GLYPH,
  CUBE_LABEL,
  isoDay,
  mondayOf,
} from "./format";
import type {
  ActivitySignal,
  CubeId,
  RiverTimelinePoint,
} from "./types";

/**
 * Reads every other cube's localStorage and produces unified ActivitySignals
 * for a given window. The shapes inside each cube are narrow but readable;
 * this module is the only place that knows how to interpret them.
 *
 * A future server backend would replace this entire file with a server-side
 * query — the call site (the generator) consumes ActivitySignals and nothing else.
 */

type StorageKey =
  | "five.solo.v1"
  | "five.tipping.v1"
  | "five.content.v1"
  | "five.family.v1"
  | "five.organizations.v1"
  | "five.creators.v1"
  | "five.live.v1"
  | "five.community.v1"
  | "five.project.v1"
  | "five.your-own.v1";

function read<T>(key: StorageKey): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function inWindow(dateStr: string | undefined, start: Date, end: Date): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

function uniqueDays(items: Array<{ date: string }>, start: Date, end: Date): number {
  const set = new Set<string>();
  for (const it of items) {
    const d = new Date(it.date);
    if (d >= start && d <= end) set.add(it.date);
  }
  return set.size;
}

function makeSignal(
  cubeId: CubeId,
  donesInWindow: number,
  donesInPrior: number,
  activeDaysInWindow: number,
  reflectionsInWindow: number,
  narrative: string,
): ActivitySignal {
  return {
    cubeId,
    cubeLabel: CUBE_LABEL[cubeId],
    glyph: CUBE_GLYPH[cubeId],
    donesInWindow,
    donesInPrior,
    activeDaysInWindow,
    reflectionsInWindow,
    narrative,
  };
}

function delta(a: number, b: number): string {
  if (a === 0 && b === 0) return "no activity";
  if (b === 0) return `${a} this week, none the week before`;
  const change = ((a - b) / b) * 100;
  if (Math.abs(change) < 15) return `roughly even with last week (${a})`;
  if (change > 0) return `${a} this week, up from ${b}`;
  return `${a} this week, down from ${b}`;
}

export function aggregateSignals(windowDays: number): {
  signals: ActivitySignal[];
  windowStart: Date;
  windowEnd: Date;
  priorStart: Date;
  priorEnd: Date;
} {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (windowDays - 1));
  start.setHours(0, 0, 0, 0);
  const priorEnd = new Date(start);
  priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setDate(priorStart.getDate() - (windowDays - 1));
  priorStart.setHours(0, 0, 0, 0);

  const signals: ActivitySignal[] = [];

  // ── Solo ──────────────────────────────────────────────────────
  const solo = read<{ entries: Array<{ date: string; status: string }> }>(
    "five.solo.v1",
  );
  if (solo?.entries) {
    const inW = solo.entries.filter((e) => inWindow(e.date, start, end));
    const inP = solo.entries.filter((e) => inWindow(e.date, priorStart, priorEnd));
    const donesW = inW.filter((e) => e.status === "done" || e.status === "partial").length;
    const donesP = inP.filter((e) => e.status === "done" || e.status === "partial").length;
    const days = uniqueDays(inW, start, end);
    if (donesW + donesP > 0) {
      signals.push(
        makeSignal(
          "solo",
          donesW,
          donesP,
          days,
          0,
          `Solo presence: ${delta(donesW, donesP)}.`,
        ),
      );
    }
  }

  // ── Tipping point ────────────────────────────────────────────
  const tipping = read<{
    checkIns: Array<{ date: string; status: string; reflection?: unknown }>;
  }>("five.tipping.v1");
  if (tipping?.checkIns) {
    const inW = tipping.checkIns.filter((c) => inWindow(c.date, start, end));
    const inP = tipping.checkIns.filter((c) =>
      inWindow(c.date, priorStart, priorEnd),
    );
    const heldW = inW.filter((c) => c.status === "within" || c.status === "partial").length;
    const heldP = inP.filter((c) => c.status === "within" || c.status === "partial").length;
    const reflections = inW.filter((c) => c.reflection).length;
    const days = uniqueDays(inW, start, end);
    if (inW.length + inP.length > 0) {
      signals.push(
        makeSignal(
          "tipping-point",
          heldW,
          heldP,
          days,
          reflections,
          `Tipping point: ${delta(heldW, heldP)} days held inside the boundary.`,
        ),
      );
    }
  }

  // ── Content ───────────────────────────────────────────────────
  const content = read<{
    sessions: Array<{ startedAt: string; status?: string }>;
  }>("five.content.v1");
  if (content?.sessions) {
    const allDoneW = content.sessions.filter(
      (s) => s.status === "done" && inWindow(s.startedAt.slice(0, 10), start, end),
    ).length;
    const allDoneP = content.sessions.filter(
      (s) =>
        s.status === "done" &&
        inWindow(s.startedAt.slice(0, 10), priorStart, priorEnd),
    ).length;
    const sessionsAsDates = content.sessions.map((s) => ({
      date: s.startedAt.slice(0, 10),
    }));
    const days = uniqueDays(sessionsAsDates, start, end);
    if (allDoneW + allDoneP > 0) {
      signals.push(
        makeSignal(
          "content",
          allDoneW,
          allDoneP,
          days,
          0,
          `Content: ${delta(allDoneW, allDoneP)} small sessions completed.`,
        ),
      );
    }
  }

  // ── Family ────────────────────────────────────────────────────
  const family = read<{
    sessions: Array<{ date: string; status: string; note?: string }>;
  }>("five.family.v1");
  if (family?.sessions) {
    const doneW = family.sessions.filter(
      (s) => s.status === "done" && inWindow(s.date, start, end),
    ).length;
    const doneP = family.sessions.filter(
      (s) => s.status === "done" && inWindow(s.date, priorStart, priorEnd),
    ).length;
    const refs = family.sessions.filter(
      (s) => s.note && inWindow(s.date, start, end),
    ).length;
    const days = uniqueDays(
      family.sessions.filter((s) => s.status === "done"),
      start,
      end,
    );
    if (doneW + doneP > 0) {
      signals.push(
        makeSignal(
          "family",
          doneW,
          doneP,
          days,
          refs,
          `Family moments: ${delta(doneW, doneP)}.`,
        ),
      );
    }
  }

  // ── Organizations ─────────────────────────────────────────────
  const orgs = read<{
    actions: Array<{ date: string; status: string }>;
    reflections: Array<{ createdAt: string }>;
  }>("five.organizations.v1");
  if (orgs?.actions) {
    const doneW = orgs.actions.filter(
      (a) => a.status === "done" && inWindow(a.date, start, end),
    ).length;
    const doneP = orgs.actions.filter(
      (a) => a.status === "done" && inWindow(a.date, priorStart, priorEnd),
    ).length;
    const refs =
      orgs.reflections?.filter((r) => inWindow(r.createdAt.slice(0, 10), start, end))
        .length ?? 0;
    const days = uniqueDays(
      orgs.actions.filter((a) => a.status === "done"),
      start,
      end,
    );
    if (doneW + doneP > 0) {
      signals.push(
        makeSignal(
          "organizations",
          doneW,
          doneP,
          days,
          refs,
          `Organizational five: ${delta(doneW, doneP)}.`,
        ),
      );
    }
  }

  // ── Creators (impact reports) ─────────────────────────────────
  const creators = read<{ impactReports: Array<{ reportedAt: string }> }>(
    "five.creators.v1",
  );
  if (creators?.impactReports) {
    const inW = creators.impactReports.filter((r) =>
      inWindow(r.reportedAt.slice(0, 10), start, end),
    ).length;
    const inP = creators.impactReports.filter((r) =>
      inWindow(r.reportedAt.slice(0, 10), priorStart, priorEnd),
    ).length;
    if (inW + inP > 0) {
      signals.push(
        makeSignal(
          "creators",
          inW,
          inP,
          0,
          0,
          `Creators: ${delta(inW, inP)} human-impact reports sent.`,
        ),
      );
    }
  }

  // ── Live events (completions) ─────────────────────────────────
  const live = read<{ completions: Array<{ date: string }> }>("five.live.v1");
  if (live?.completions) {
    const inW = live.completions.filter((c) => inWindow(c.date, start, end)).length;
    const inP = live.completions.filter((c) =>
      inWindow(c.date, priorStart, priorEnd),
    ).length;
    const days = uniqueDays(live.completions, start, end);
    if (inW + inP > 0) {
      signals.push(
        makeSignal(
          "live-event",
          inW,
          inP,
          days,
          0,
          `Live events: ${delta(inW, inP)} confirmed “I did my Five.”`,
        ),
      );
    }
  }

  // ── Community (own drops) ─────────────────────────────────────
  const community = read<{ myDrops: Array<{ createdAt: string }> }>(
    "five.community.v1",
  );
  if (community?.myDrops) {
    const inW = community.myDrops.filter((d) =>
      inWindow(d.createdAt.slice(0, 10), start, end),
    ).length;
    const inP = community.myDrops.filter((d) =>
      inWindow(d.createdAt.slice(0, 10), priorStart, priorEnd),
    ).length;
    if (inW + inP > 0) {
      signals.push(
        makeSignal(
          "community",
          inW,
          inP,
          0,
          0,
          `Community: ${delta(inW, inP)} small drops posted.`,
        ),
      );
    }
  }

  // ── Project (done actions) ────────────────────────────────────
  const proj = read<{
    actions: Array<{ doneAt?: string; status: string }>;
    reflections: Array<{ createdAt: string }>;
  }>("five.project.v1");
  if (proj?.actions) {
    const inW = proj.actions.filter(
      (a) =>
        a.status === "done" &&
        a.doneAt &&
        inWindow(a.doneAt.slice(0, 10), start, end),
    ).length;
    const inP = proj.actions.filter(
      (a) =>
        a.status === "done" &&
        a.doneAt &&
        inWindow(a.doneAt.slice(0, 10), priorStart, priorEnd),
    ).length;
    const refs =
      proj.reflections?.filter((r) =>
        inWindow(r.createdAt.slice(0, 10), start, end),
      ).length ?? 0;
    if (inW + inP > 0) {
      signals.push(
        makeSignal(
          "project",
          inW,
          inP,
          0,
          refs,
          `Project: ${delta(inW, inP)} five-actions completed.`,
        ),
      );
    }
  }

  // ── Your own (sessions) ───────────────────────────────────────
  const yo = read<{ sessions: Array<{ date: string; status: string }> }>(
    "five.your-own.v1",
  );
  if (yo?.sessions) {
    const inW = yo.sessions.filter(
      (s) => s.status === "done" && inWindow(s.date, start, end),
    ).length;
    const inP = yo.sessions.filter(
      (s) => s.status === "done" && inWindow(s.date, priorStart, priorEnd),
    ).length;
    const days = uniqueDays(
      yo.sessions.filter((s) => s.status === "done"),
      start,
      end,
    );
    if (inW + inP > 0) {
      signals.push(
        makeSignal(
          "your-own",
          inW,
          inP,
          days,
          0,
          `Your own cubes: ${delta(inW, inP)}.`,
        ),
      );
    }
  }

  // Sort by intensity (donesInWindow desc).
  signals.sort((a, b) => b.donesInWindow - a.donesInWindow);

  return {
    signals,
    windowStart: start,
    windowEnd: end,
    priorStart,
    priorEnd,
  };
}

/**
 * Long-arc river — weekly aggregate per cube across the last N weeks.
 * Used by the River Timeline page.
 */
export function aggregateRiver(weeks = 26): RiverTimelinePoint[] {
  const today = new Date();
  const firstMonday = mondayOf(today);
  const points: RiverTimelinePoint[] = [];
  // Pre-build empty buckets
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(firstMonday);
    start.setDate(start.getDate() - i * 7);
    points.push({
      weekStart: isoDay(start),
      perCube: {},
      total: 0,
    });
  }
  function bucketFor(dateStr: string): RiverTimelinePoint | null {
    const d = new Date(dateStr);
    const m = mondayOf(d);
    const key = isoDay(m);
    return points.find((p) => p.weekStart === key) ?? null;
  }
  function bump(cubeId: CubeId, dateStr: string) {
    const bucket = bucketFor(dateStr);
    if (!bucket) return;
    bucket.perCube[cubeId] = (bucket.perCube[cubeId] ?? 0) + 1;
    bucket.total++;
  }
  // Solo
  const solo = read<{ entries: Array<{ date: string; status: string }> }>(
    "five.solo.v1",
  );
  for (const e of solo?.entries ?? []) {
    if (e.status === "done" || e.status === "partial") bump("solo", e.date);
  }
  // Tipping
  const t = read<{ checkIns: Array<{ date: string; status: string }> }>(
    "five.tipping.v1",
  );
  for (const c of t?.checkIns ?? []) {
    if (c.status === "within" || c.status === "partial")
      bump("tipping-point", c.date);
  }
  // Content
  const c = read<{ sessions: Array<{ startedAt: string; status?: string }> }>(
    "five.content.v1",
  );
  for (const s of c?.sessions ?? []) {
    if (s.status === "done") bump("content", s.startedAt.slice(0, 10));
  }
  // Family
  const fam = read<{ sessions: Array<{ date: string; status: string }> }>(
    "five.family.v1",
  );
  for (const s of fam?.sessions ?? []) {
    if (s.status === "done") bump("family", s.date);
  }
  // Orgs
  const o = read<{ actions: Array<{ date: string; status: string }> }>(
    "five.organizations.v1",
  );
  for (const a of o?.actions ?? []) {
    if (a.status === "done") bump("organizations", a.date);
  }
  // Creators
  const cr = read<{ impactReports: Array<{ reportedAt: string }> }>(
    "five.creators.v1",
  );
  for (const r of cr?.impactReports ?? []) {
    bump("creators", r.reportedAt.slice(0, 10));
  }
  // Live
  const live = read<{ completions: Array<{ date: string }> }>(
    "five.live.v1",
  );
  for (const x of live?.completions ?? []) {
    bump("live-event", x.date);
  }
  // Community
  const com = read<{ myDrops: Array<{ createdAt: string }> }>(
    "five.community.v1",
  );
  for (const d of com?.myDrops ?? []) {
    bump("community", d.createdAt.slice(0, 10));
  }
  // Project
  const p = read<{ actions: Array<{ doneAt?: string; status: string }> }>(
    "five.project.v1",
  );
  for (const a of p?.actions ?? []) {
    if (a.status === "done" && a.doneAt) bump("project", a.doneAt.slice(0, 10));
  }
  // Your own
  const y = read<{ sessions: Array<{ date: string; status: string }> }>(
    "five.your-own.v1",
  );
  for (const s of y?.sessions ?? []) {
    if (s.status === "done") bump("your-own", s.date);
  }
  return points;
}
