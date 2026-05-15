"use client";

import type {
  CreatorSession,
  CreatorsState,
  HumanImpactReport,
} from "./types";

const KEY = "five.creators.v1";

const defaultState: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

export function loadState(): CreatorsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<CreatorsState>;
    return {
      meCreatorId: parsed.meCreatorId ?? defaultState.meCreatorId,
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
      impactReports: Array.isArray(parsed.impactReports)
        ? parsed.impactReports
        : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: CreatorsState): void {
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

export function addDraft(
  state: CreatorsState,
  draft: CreatorSession,
): CreatorsState {
  return { ...state, drafts: [...state.drafts, draft] };
}

export function deleteDraft(
  state: CreatorsState,
  draftId: string,
): CreatorsState {
  return {
    ...state,
    drafts: state.drafts.filter((d) => d.id !== draftId),
  };
}

export function addImpactReport(
  state: CreatorsState,
  report: HumanImpactReport,
): CreatorsState {
  return { ...state, impactReports: [...state.impactReports, report] };
}

export function toggleSaved(
  state: CreatorsState,
  sessionId: string,
): CreatorsState {
  const has = state.saved.includes(sessionId);
  return {
    ...state,
    saved: has
      ? state.saved.filter((id) => id !== sessionId)
      : [...state.saved, sessionId],
  };
}

export function setMeCreator(
  state: CreatorsState,
  creatorId: string,
): CreatorsState {
  return { ...state, meCreatorId: creatorId };
}

export function clearAll(): CreatorsState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
