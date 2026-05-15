"use client";

import type {
  CheckIn,
  TippingPattern,
  TippingState,
} from "./types";

const KEY = "five.tipping.v1";

const empty: TippingState = {
  patterns: [],
  checkIns: [],
  assistantEnabled: false,
  version: 1,
};

export function loadState(): TippingState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<TippingState>;
    return {
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      assistantEnabled: Boolean(parsed.assistantEnabled),
      version: 1,
    };
  } catch {
    return empty;
  }
}

export function saveState(state: TippingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function addPattern(
  state: TippingState,
  pattern: TippingPattern,
): TippingState {
  return { ...state, patterns: [...state.patterns, pattern] };
}

export function updatePattern(
  state: TippingState,
  patternId: string,
  patch: Partial<TippingPattern>,
): TippingState {
  return {
    ...state,
    patterns: state.patterns.map((p) =>
      p.id === patternId ? { ...p, ...patch } : p,
    ),
  };
}

export function archivePattern(
  state: TippingState,
  patternId: string,
): TippingState {
  return updatePattern(state, patternId, {
    archivedAt: new Date().toISOString(),
  });
}

export function deletePattern(
  state: TippingState,
  patternId: string,
): TippingState {
  return {
    ...state,
    patterns: state.patterns.filter((p) => p.id !== patternId),
    checkIns: state.checkIns.filter((c) => c.patternId !== patternId),
  };
}

export function upsertCheckIn(
  state: TippingState,
  entry: CheckIn,
): TippingState {
  const others = state.checkIns.filter(
    (c) => !(c.patternId === entry.patternId && c.date === entry.date),
  );
  return { ...state, checkIns: [...others, entry] };
}

export function setAssistant(
  state: TippingState,
  next: boolean,
): TippingState {
  return { ...state, assistantEnabled: next };
}

export function clearAll(): TippingState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return empty;
}

export function generatePatternId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}
