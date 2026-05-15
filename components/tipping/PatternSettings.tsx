"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { describeBoundary } from "@/lib/tipping/format";
import type { TippingPattern } from "@/lib/tipping/types";

type Props = {
  open: boolean;
  pattern: TippingPattern | null;
  onClose: () => void;
  onArchive: (patternId: string) => void;
  onUnarchive: (patternId: string) => void;
  onDelete: (patternId: string) => void;
  onEdit: (patternId: string) => void;
};

/**
 * Per-pattern bottom-sheet settings.
 *
 * Edit re-opens onboarding for now (pattern is then replaced). Archive
 * keeps history, removes the pattern from active check-ins. Delete
 * removes the pattern and its history with a single confirmation gate.
 */
export function PatternSettings({
  open,
  pattern,
  onClose,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmDelete(false);
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!pattern) return null;

  const archived = Boolean(pattern.archivedAt);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-40 transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        aria-label="Close pattern settings"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-3xl border-t border-line bg-paper px-6 pb-10 pt-6 shadow-soft transition-transform duration-300 ease-calm md:px-10",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line" aria-hidden />
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ember-700">
          this pattern
        </p>
        <h2 className="mt-2 text-xl font-light tracking-brand text-ink">
          {pattern.title}
        </h2>
        <p className="mt-1 text-[14px] font-light text-ink-soft">
          {describeBoundary(pattern.boundary)}
        </p>

        <div className="mt-8 space-y-5">
          <Row label="Edit boundary" hint="Adjust the size or kind of the boundary.">
            <button
              type="button"
              onClick={() => onEdit(pattern.id)}
              className="text-sm font-light text-ink underline-offset-4 hover:underline"
            >
              Edit
            </button>
          </Row>

          {!archived ? (
            <Row label="Archive" hint="Stop tracking but keep your history.">
              <button
                type="button"
                onClick={() => onArchive(pattern.id)}
                className="text-sm font-light text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                Archive
              </button>
            </Row>
          ) : (
            <Row label="Unarchive" hint="Resume daily check-ins on this pattern.">
              <button
                type="button"
                onClick={() => onUnarchive(pattern.id)}
                className="text-sm font-light text-ember-700 underline-offset-4 hover:underline"
              >
                Resume
              </button>
            </Row>
          )}

          <Row label="Remove" hint="Delete this pattern and its history on this device.">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs font-light uppercase tracking-[0.18em] text-ink-mute hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(pattern.id)}
                  className="text-xs font-light uppercase tracking-[0.18em] text-ember-700 hover:opacity-70"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm font-light text-ink-mute underline-offset-4 hover:text-ink hover:underline"
              >
                Remove
              </button>
            )}
          </Row>
        </div>

        <div className="mt-10 text-right">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-t border-line/70 pt-5">
      <div>
        <p className="text-[15px] font-light text-ink">{label}</p>
        <p className="mt-1 max-w-[36ch] text-[13px] font-light leading-relaxed text-ink-mute">
          {hint}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
