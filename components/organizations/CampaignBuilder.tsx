"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { campaignTypes, getCampaignType } from "@/data/organizations/campaign-types";
import { sampleOrg } from "@/data/organizations/sample";
import { generateId } from "@/lib/organizations/storage";
import type {
  Campaign,
  CampaignCadence,
  CampaignType,
  Role,
} from "@/lib/organizations/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (campaign: Campaign) => void;
};

export function CampaignBuilder({ open, onClose, onCreate }: Props) {
  const [type, setType] = useState<CampaignType>("empowerment");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [kpi, setKpi] = useState("");
  const [cadence, setCadence] = useState<CampaignCadence>("weekly");
  const [durationDays, setDurationDays] = useState<number>(30);
  const [targetRole, setTargetRole] = useState<Role | "any">("any");
  const [departmentIds, setDepartmentIds] = useState<string[]>([]);

  const meta = useMemo(() => getCampaignType(type), [type]);

  useEffect(() => {
    if (!open) return;
    // Reset when opening
    setType("empowerment");
    setName("");
    setGoal("");
    setKpi("");
    setCadence("weekly");
    setDurationDays(30);
    setTargetRole("any");
    setDepartmentIds([]);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    // When type changes, suggest a default name and target role.
    setName(meta.label);
    setTargetRole(meta.defaultRole ?? "any");
  }, [type, meta]);

  function toggleDept(id: string) {
    setDepartmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function commit() {
    if (!name.trim() || !goal.trim()) return;
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + durationDays);
    const campaign: Campaign = {
      id: generateId("c"),
      type,
      name: name.trim(),
      goal: goal.trim(),
      kpi: kpi.trim() || meta.kpiSuggestions[0],
      cadence,
      durationDays,
      startedAt: now.toISOString(),
      endsAt: end.toISOString(),
      departmentIds,
      targetRole: targetRole === "any" ? undefined : (targetRole as Role),
      active: true,
      createdAt: now.toISOString(),
    };
    onCreate(campaign);
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
        aria-label="Close campaign builder"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto h-[88vh] max-h-[820px] w-full max-w-3xl overflow-y-auto rounded-t-3xl border-t border-line bg-paper px-6 pb-10 pt-6 shadow-soft transition-transform duration-300 ease-calm md:px-10",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line" aria-hidden />
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          new campaign
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-brand text-ink md:text-3xl">
          A small, repeatable practice.
        </h2>

        <Step ordinal="01" label="What kind of campaign?">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {campaignTypes.map((t) => {
              const active = t.id === type;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ease-calm",
                    active
                      ? "border-ink/50 bg-paper"
                      : "border-line bg-surface hover:border-ink/30",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base font-light",
                      active
                        ? "border-ink/50 bg-ink text-paper"
                        : "border-line text-ink-soft",
                    )}
                  >
                    {t.glyph}
                  </span>
                  <div>
                    <p className="text-[14px] font-light text-ink">{t.label}</p>
                    <p className="mt-0.5 text-[11.5px] font-light leading-relaxed text-ink-mute">
                      {t.oneLine}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Step>

        <Step ordinal="02" label="Name it.">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Friday five — team reflection"
            className="w-full border-b border-line bg-transparent pb-2 text-lg font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="03" label="What is it for?">
          <textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="One honest sentence on the outcome."
            className="w-full resize-none rounded-md border border-line bg-transparent p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="04" label="KPI" hint="A single, honest indicator. We will measure this calmly, not aggressively.">
          <div className="flex flex-wrap gap-2">
            {meta.kpiSuggestions.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKpi(k)}
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                  kpi === k
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={kpi}
            onChange={(e) => setKpi(e.target.value)}
            placeholder="Or write your own."
            className="mt-3 w-full border-b border-line bg-transparent pb-2 text-[14px] font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="05" label="How often & how long?">
          <div className="flex flex-wrap items-center gap-3 text-sm font-light text-ink-soft">
            <div className="rounded-full border border-line bg-surface p-1">
              {(["daily", "weekly"] as CampaignCadence[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCadence(c)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full px-3 text-[12px] font-light capitalize transition-colors",
                    cadence === c
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="text-ink-mute">·</span>
            <span>For</span>
            <input
              type="number"
              min={7}
              max={180}
              value={durationDays}
              onChange={(e) =>
                setDurationDays(Math.max(7, Math.min(180, parseInt(e.target.value, 10) || 30)))
              }
              className="h-8 w-20 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
            />
            <span>days.</span>
          </div>
        </Step>

        <Step ordinal="06" label="Who is this for?" hint="Leave the departments empty to include the whole organization.">
          <div className="flex flex-wrap gap-2">
            {(["any", "admin", "manager", "employee"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTargetRole(r)}
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light capitalize transition-colors",
                  targetRole === r
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {r === "any" ? "Any role" : r + "s"}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sampleOrg.departments.map((d) => {
              const active = departmentIds.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDept(d.id)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    active
                      ? "border-ink/50 bg-paper text-ink"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </Step>

        <Step ordinal="07" label="Example actions inside this campaign">
          <ul className="space-y-2 border-l border-line pl-5 text-[14px] font-light leading-relaxed text-ink-soft">
            {meta.actionExamples.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Step>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={commit}
              disabled={!name.trim() || !goal.trim()}
              className={cn(
                (!name.trim() || !goal.trim()) && "cursor-not-allowed opacity-40",
              )}
            >
              Launch campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  ordinal,
  label,
  hint,
  children,
}: {
  ordinal: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-line/60 pt-6 first-of-type:mt-10">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          {ordinal}
        </span>
        <h3 className="text-[15px] font-light tracking-brand text-ink md:text-base">
          {label}
        </h3>
      </div>
      {hint && (
        <p className="mb-3 max-w-prose text-[12.5px] font-light leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
      {children}
    </section>
  );
}
