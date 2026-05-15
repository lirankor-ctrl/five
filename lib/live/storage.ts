"use client";

import type {
  FiveDoneRecord,
  LiveEvent,
  LiveState,
} from "./types";

const KEY = "five.live.v1";

const defaultState: LiveState = {
  displayName: "Quiet five-er",
  anonymous: true,
  drafts: [],
  completions: [],
  saved: [],
  version: 1,
};

export function loadState(): LiveState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<LiveState>;
    return {
      displayName: parsed.displayName ?? defaultState.displayName,
      anonymous: parsed.anonymous ?? true,
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
      completions: Array.isArray(parsed.completions) ? parsed.completions : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: LiveState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function generateId(prefix = "x"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function addDraft(state: LiveState, draft: LiveEvent): LiveState {
  return { ...state, drafts: [...state.drafts, draft] };
}

export function removeDraft(state: LiveState, id: string): LiveState {
  return { ...state, drafts: state.drafts.filter((d) => d.id !== id) };
}

export function toggleSaved(state: LiveState, eventId: string): LiveState {
  const has = state.saved.includes(eventId);
  return {
    ...state,
    saved: has
      ? state.saved.filter((id) => id !== eventId)
      : [...state.saved, eventId],
  };
}

export function addCompletion(
  state: LiveState,
  record: FiveDoneRecord,
): LiveState {
  return { ...state, completions: [...state.completions, record] };
}

export function setIdentity(
  state: LiveState,
  displayName: string,
  anonymous: boolean,
): LiveState {
  return { ...state, displayName, anonymous };
}

export function clearAll(): LiveState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
