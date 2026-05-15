"use client";

import type { SoloEntry, SoloPlan, SoloState } from "./types";

const KEY = "five.solo.v1";

const empty: SoloState = { plan: null, entries: [], version: 1 };

export function loadState(): SoloState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<SoloState>;
    return {
      plan: parsed.plan ?? null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      version: 1,
    };
  } catch {
    return empty;
  }
}

export function saveState(state: SoloState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode, quota). Silently ignore —
    // the session continues in memory.
  }
}

export function setPlan(state: SoloState, plan: SoloPlan): SoloState {
  return { ...state, plan };
}

export function clearAll(): SoloState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return empty;
}

/** Replace today's entry (if any) with the given one, else append. */
export function upsertEntry(state: SoloState, entry: SoloEntry): SoloState {
  const others = state.entries.filter((e) => e.date !== entry.date);
  return { ...state, entries: [...others, entry] };
}
