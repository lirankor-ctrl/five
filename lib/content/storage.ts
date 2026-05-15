"use client";

import type {
  ContentSession,
  ContentState,
  SavedContentPath,
} from "./types";

const KEY = "five.content.v1";

const empty: ContentState = {
  sessions: [],
  savedPaths: [],
  version: 1,
};

export function loadState(): ContentState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      savedPaths: Array.isArray(parsed.savedPaths) ? parsed.savedPaths : [],
      version: 1,
    };
  } catch {
    return empty;
  }
}

export function saveState(state: ContentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function startSession(
  state: ContentState,
  contentItemId: string,
): { state: ContentState; session: ContentSession } {
  const session: ContentSession = {
    id: generateId(),
    contentItemId,
    startedAt: new Date().toISOString(),
  };
  return {
    state: { ...state, sessions: [...state.sessions, session] },
    session,
  };
}

export function completeSession(
  state: ContentState,
  sessionId: string,
  patch: Partial<ContentSession>,
): ContentState {
  return {
    ...state,
    sessions: state.sessions.map((s) =>
      s.id === sessionId
        ? { ...s, completedAt: new Date().toISOString(), ...patch }
        : s,
    ),
  };
}

export function discardSession(
  state: ContentState,
  sessionId: string,
): ContentState {
  return {
    ...state,
    sessions: state.sessions.filter((s) => s.id !== sessionId),
  };
}

export function addSavedPath(
  state: ContentState,
  path: SavedContentPath,
): ContentState {
  return { ...state, savedPaths: [...state.savedPaths, path] };
}

export function removeSavedPath(
  state: ContentState,
  pathId: string,
): ContentState {
  return {
    ...state,
    savedPaths: state.savedPaths.filter((p) => p.id !== pathId),
  };
}

export function clearAll(): ContentState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return empty;
}

export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}
