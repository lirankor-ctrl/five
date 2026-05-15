"use client";

import type { ReadingState } from "./types";

const KEY = "five.manifesto.v1";

const empty: ReadingState = {
  progress: {},
  bookmarks: [],
  highlights: [],
  theme: "paper",
  version: 1,
};

export function loadReadingState(): ReadingState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ReadingState>;
    return {
      progress: parsed.progress ?? {},
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
      theme: parsed.theme === "ink" ? "ink" : "paper",
      version: 1,
    };
  } catch {
    return empty;
  }
}

export function saveReadingState(state: ReadingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function toggleBookmark(
  state: ReadingState,
  chapterId: string,
): ReadingState {
  const has = state.bookmarks.includes(chapterId);
  return {
    ...state,
    bookmarks: has
      ? state.bookmarks.filter((id) => id !== chapterId)
      : [...state.bookmarks, chapterId],
  };
}

export function toggleHighlight(
  state: ReadingState,
  chapterId: string,
  blockIndex: number,
): ReadingState {
  const idx = state.highlights.findIndex(
    (h) => h.chapterId === chapterId && h.blockIndex === blockIndex,
  );
  if (idx >= 0) {
    const next = state.highlights.slice();
    next.splice(idx, 1);
    return { ...state, highlights: next };
  }
  return {
    ...state,
    highlights: [
      ...state.highlights,
      { chapterId, blockIndex, savedAt: new Date().toISOString() },
    ],
  };
}

export function setProgress(
  state: ReadingState,
  chapterId: string,
  progress: number,
): ReadingState {
  const clamped = Math.max(0, Math.min(1, progress));
  return {
    ...state,
    progress: { ...state.progress, [chapterId]: clamped },
  };
}

export function setTheme(
  state: ReadingState,
  theme: ReadingState["theme"],
): ReadingState {
  return { ...state, theme };
}
