"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addPattern,
  archivePattern,
  deletePattern,
  loadState,
  saveState,
  setAssistant,
  updatePattern,
  upsertCheckIn,
} from "@/lib/tipping/storage";
import type {
  CheckIn,
  TippingPattern,
  TippingState,
} from "@/lib/tipping/types";
import { TippingDashboard } from "./TippingDashboard";
import { TippingOnboarding } from "./TippingOnboarding";

type Mode = "dashboard" | "onboarding" | "edit";

export function TippingApp() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<TippingState>({
    patterns: [],
    checkIns: [],
    assistantEnabled: false,
    version: 1,
  });
  const [mode, setMode] = useState<Mode>("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setMode(loaded.patterns.length === 0 ? "onboarding" : "dashboard");
    setHydrated(true);
  }, []);

  const persist = useCallback((next: TippingState) => {
    setState(next);
    saveState(next);
  }, []);

  const handleCreate = useCallback(
    (pattern: TippingPattern) => {
      if (mode === "edit" && editingId) {
        // Replace boundary/title/tags on the existing pattern, keep id + history.
        const next = updatePattern(state, editingId, {
          title: pattern.title,
          categoryId: pattern.categoryId,
          boundary: pattern.boundary,
          trackingCadence: pattern.trackingCadence,
          triggerTags: pattern.triggerTags,
          archivedAt: undefined,
        });
        persist(next);
        setEditingId(null);
      } else {
        persist(addPattern(state, pattern));
      }
      setMode("dashboard");
    },
    [mode, editingId, state, persist],
  );

  const handleCheckIn = useCallback(
    (entry: CheckIn) => {
      persist(upsertCheckIn(state, entry));
    },
    [persist, state],
  );

  const handleArchive = useCallback(
    (id: string) => {
      persist(archivePattern(state, id));
    },
    [persist, state],
  );

  const handleUnarchive = useCallback(
    (id: string) => {
      persist(updatePattern(state, id, { archivedAt: undefined }));
    },
    [persist, state],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = deletePattern(state, id);
      persist(next);
      if (next.patterns.length === 0) setMode("onboarding");
    },
    [persist, state],
  );

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
    setMode("edit");
  }, []);

  const handleAdd = useCallback(() => {
    setEditingId(null);
    setMode("onboarding");
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setMode("dashboard");
  }, []);

  const handleToggleAssistant = useCallback(
    (next: boolean) => {
      persist(setAssistant(state, next));
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

  if (mode === "onboarding" || mode === "edit") {
    return (
      <TippingOnboarding
        hasExisting={state.patterns.length > 0 || mode === "edit"}
        onCreate={handleCreate}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <TippingDashboard
      state={state}
      onCheckIn={handleCheckIn}
      onReflect={handleCheckIn}
      onAddPattern={handleAdd}
      onArchive={handleArchive}
      onUnarchive={handleUnarchive}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onToggleAssistant={handleToggleAssistant}
    />
  );
}
