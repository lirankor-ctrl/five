"use client";

import type {
  ReflectionDialogueResponse,
  ReflectionReport,
  ReflectionState,
  ReportCadence,
} from "./types";

const KEY = "five.reflection.v1";

const defaultState: ReflectionState = {
  archive: [],
  dialogue: [],
  cadence: "weekly",
  version: 1,
};

export function loadState(): ReflectionState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ReflectionState>;
    return {
      archive: Array.isArray(parsed.archive) ? parsed.archive : [],
      dialogue: Array.isArray(parsed.dialogue) ? parsed.dialogue : [],
      cadence: (parsed.cadence as ReportCadence) ?? "weekly",
      lastGeneratedAt: parsed.lastGeneratedAt,
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: ReflectionState): void {
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

export function archiveReport(
  state: ReflectionState,
  report: ReflectionReport,
): ReflectionState {
  // Keep latest 24 archived reports.
  const archive = [report, ...state.archive].slice(0, 24);
  return {
    ...state,
    archive,
    lastGeneratedAt: report.generatedAt,
  };
}

export function addDialogue(
  state: ReflectionState,
  response: ReflectionDialogueResponse,
): ReflectionState {
  return { ...state, dialogue: [...state.dialogue, response] };
}

export function setCadence(
  state: ReflectionState,
  cadence: ReportCadence,
): ReflectionState {
  return { ...state, cadence };
}

export function clearAll(): ReflectionState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
