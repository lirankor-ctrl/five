"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearAll,
  loadState,
  saveState,
  setPlan as setPlanOnState,
  upsertEntry,
} from "@/lib/solo/storage";
import type { SoloEntry, SoloPlan, SoloState } from "@/lib/solo/types";
import { SoloDashboard } from "./SoloDashboard";
import { SoloOnboarding } from "./SoloOnboarding";

type Mode = "dashboard" | "onboarding";

export function SoloApp() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<SoloState>({
    plan: null,
    entries: [],
    version: 1,
  });
  const [mode, setMode] = useState<Mode>("dashboard");

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setMode(loaded.plan ? "dashboard" : "onboarding");
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SoloState) => {
    setState(next);
    saveState(next);
  }, []);

  const handleBegin = useCallback(
    (plan: SoloPlan) => {
      persist(setPlanOnState(state, plan));
      setMode("dashboard");
    },
    [persist, state],
  );

  const handleReport = useCallback(
    (entry: SoloEntry) => {
      persist(upsertEntry(state, entry));
    },
    [persist, state],
  );

  const handleEditPlan = useCallback(() => {
    setMode("onboarding");
  }, []);

  const handleReset = useCallback(() => {
    const cleared = clearAll();
    setState(cleared);
    setMode("onboarding");
  }, []);

  const handleToggleAssistant = useCallback(
    (next: boolean) => {
      if (!state.plan) return;
      const updated: SoloState = {
        ...state,
        plan: { ...state.plan, assistantEnabled: next },
      };
      persist(updated);
    },
    [persist, state],
  );

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-2xl items-center justify-center px-6 py-16">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </div>
    );
  }

  if (mode === "onboarding" || !state.plan) {
    return <SoloOnboarding onBegin={handleBegin} />;
  }

  return (
    <SoloDashboard
      state={state as SoloState & { plan: SoloPlan }}
      onReport={handleReport}
      onEditPlan={handleEditPlan}
      onReset={handleReset}
      onToggleAssistant={handleToggleAssistant}
    />
  );
}
