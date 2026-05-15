"use client";

import type {
  CommunityState,
  DropUpdate,
  HumanJournal,
  JournalEntry,
} from "./types";

const KEY = "five.community.v1";

const defaultState: CommunityState = {
  joinedCommunities: [],
  myDrops: [],
  myJournal: null,
  followedPaths: [],
  pathProgress: {},
  version: 1,
};

export function loadState(): CommunityState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<CommunityState>;
    return {
      joinedCommunities: Array.isArray(parsed.joinedCommunities)
        ? parsed.joinedCommunities
        : [],
      myDrops: Array.isArray(parsed.myDrops) ? parsed.myDrops : [],
      myJournal: parsed.myJournal ?? null,
      followedPaths: Array.isArray(parsed.followedPaths)
        ? parsed.followedPaths
        : [],
      pathProgress: parsed.pathProgress ?? {},
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: CommunityState): void {
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

export function toggleJoin(
  state: CommunityState,
  id: string,
): CommunityState {
  const has = state.joinedCommunities.includes(id);
  return {
    ...state,
    joinedCommunities: has
      ? state.joinedCommunities.filter((c) => c !== id)
      : [...state.joinedCommunities, id],
  };
}

export function postDrop(
  state: CommunityState,
  drop: DropUpdate,
): CommunityState {
  return { ...state, myDrops: [...state.myDrops, drop] };
}

export function startJournal(
  state: CommunityState,
  journal: HumanJournal,
): CommunityState {
  return { ...state, myJournal: journal };
}

export function addJournalEntry(
  state: CommunityState,
  entry: JournalEntry,
): CommunityState {
  if (!state.myJournal) return state;
  return {
    ...state,
    myJournal: {
      ...state.myJournal,
      entries: [...state.myJournal.entries, entry],
    },
  };
}

export function toggleFollowPath(
  state: CommunityState,
  pathId: string,
): CommunityState {
  const has = state.followedPaths.includes(pathId);
  return {
    ...state,
    followedPaths: has
      ? state.followedPaths.filter((p) => p !== pathId)
      : [...state.followedPaths, pathId],
  };
}

export function togglePathStep(
  state: CommunityState,
  pathId: string,
  stepId: string,
): CommunityState {
  const done = state.pathProgress[pathId] ?? [];
  const has = done.includes(stepId);
  return {
    ...state,
    pathProgress: {
      ...state.pathProgress,
      [pathId]: has ? done.filter((s) => s !== stepId) : [...done, stepId],
    },
  };
}

export function clearAll(): CommunityState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
