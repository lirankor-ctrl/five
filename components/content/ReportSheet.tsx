"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABEL,
  TYPE_LABEL,
} from "@/lib/content/format";
import type {
  ContentItem,
  ContentSession,
  SessionFeeling,
  SessionStatus,
} from "@/lib/content/types";

type Props = {
  open: boolean;
  session: ContentSession | null;
  item: ContentItem | null;
  onClose: () => void;
  onSubmit: (patch: {
    status: SessionStatus;
    actualMinutes?: number;
    feeling?: SessionFeeling;
    continueWithType: boolean;
    savePath: boolean;
  }) => void;
  onDiscard: () => void;
};

/**
 * Return/report sheet.
 *
 * Opens after the user has been pushed out to the external content,
 * collects a small structured report, then writes back to the session.
 * Everything except `status` is optional.
 */
export function ReportSheet({
  open,
  session,
  item,
  onClose,
  onSubmit,
  onDiscard,
}: Props) {
  const [status, setStatus] = useState<SessionStatus>("done");
  const [actualMinutes, setActualMinutes] = useState<number | "">(
    item?.durationMinutes ?? 5,
  );
  const [feeling, setFeeling] = useState<SessionFeeling | null>(null);
  const [continueType, setContinueType] = useState<boolean>(true);
  const [savePath, setSavePath] = useState<boolean>(false);

  useEffect(() => {
    if (open && item) {
      setStatus("done");
      setActualMinutes(item.durationMinutes);
      setFeeling(null);
      setContinueType(true);
      setSavePath(false);
    }
  }, [open, item]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!session || !item) return null;

  function submit() {
    onSubmit({
      status,
      actualMinutes:
        actualMinutes === "" ? undefined : Number(actualMinutes),
      feeling: feeling ?? undefined,
      continueWithType: continueType,
      savePath,
    });
  }

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
        aria-label="Close report"
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
        <div className="flex items-baseline gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span>{TYPE_LABEL[item.contentType]}</span>
          <span aria-hidden="true">·</span>
          <span>{DIFFICULTY_LABEL[item.difficulty]}</span>
          <span aria-hidden="true">·</span>
          <span>{item.durationMinutes} min suggested</span>
        </div>
        <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
          {item.title}
        </h2>
        <p className="mt-1 text-[14px] font-light text-ink-soft">
          How did it go?
        </p>

        <section className="mt-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            outcome
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ToggleCard
              active={status === "done"}
              onClick={() => setStatus("done")}
            >
              <p className="text-[15px] font-light tracking-brand">Done</p>
              <p className="mt-1 text-[12px] font-light text-ink-mute">
                You actually returned.
              </p>
            </ToggleCard>
            <ToggleCard
              active={status === "not-done"}
              onClick={() => setStatus("not-done")}
            >
              <p className="text-[15px] font-light tracking-brand">Not today</p>
              <p className="mt-1 text-[12px] font-light text-ink-mute">
                No judgement. We&rsquo;ll keep the link.
              </p>
            </ToggleCard>
          </div>
        </section>

        {status === "done" && (
          <>
            <section className="mt-6">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                actual minutes
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm font-light text-ink-soft">
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={actualMinutes}
                  onChange={(e) => {
                    const v = e.target.value;
                    setActualMinutes(v === "" ? "" : Math.max(0, parseInt(v, 10) || 0));
                  }}
                  className="h-9 w-20 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
                />
                <span>minutes.</span>
              </div>
            </section>

            <section className="mt-6">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                how did it feel?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["good", "okay", "off"] as SessionFeeling[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFeeling(feeling === f ? null : f)}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light transition-colors",
                      feeling === f
                        ? "border-ink/50 bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    {f === "good" ? "Good" : f === "okay" ? "Okay" : "Off"}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-6 space-y-3">
              <Switch
                label="Continue with this kind of content?"
                value={continueType}
                onChange={setContinueType}
              />
              <Switch
                label="Save as a regular path?"
                value={savePath}
                onChange={setSavePath}
              />
            </section>
          </>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDiscard}
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            Discard session
          </button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" onClick={onClose}>
              Later
            </Button>
            <Button variant="primary" size="md" onClick={submit}>
              Save report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all duration-300 ease-calm",
        active
          ? "border-ink/50 bg-ink text-paper shadow-soft"
          : "border-line bg-surface text-ink hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft",
      )}
    >
      {children}
    </button>
  );
}

function Switch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3">
      <p className="text-[14px] font-light text-ink">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-300",
          value ? "border-ink/60 bg-ink" : "border-line bg-surface",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 inline-block h-4 w-4 -translate-y-1/2 rounded-full transition-transform duration-300",
            value ? "translate-x-6 bg-paper" : "translate-x-1 bg-ink/60",
          )}
        />
      </button>
    </div>
  );
}
