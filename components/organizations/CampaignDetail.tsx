"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";
import { getCampaignType } from "@/data/organizations/campaign-types";
import {
  campaignAudience,
  engagementSeries,
  todayKey,
  totalParticipation14d,
} from "@/lib/organizations/analytics";
import { generateId } from "@/lib/organizations/storage";
import type {
  Campaign,
  CampaignAction,
  Organization,
  PerceivedImpact,
  ReflectionEntry,
} from "@/lib/organizations/types";

type Props = {
  campaign: Campaign;
  org: Organization;
  actions: CampaignAction[];
  reflections: ReflectionEntry[];
  currentMemberId: string;
  currentMemberName: string;
  onLogAction: (action: CampaignAction) => void;
  onAddReflection: (entry: ReflectionEntry) => void;
  onDelete?: () => void;
  onClose: () => void;
};

const IMPACT_OPTIONS: PerceivedImpact[] = ["low", "medium", "high"];

export function CampaignDetail({
  campaign,
  org,
  actions,
  reflections,
  currentMemberId,
  currentMemberName,
  onLogAction,
  onAddReflection,
  onDelete,
  onClose,
}: Props) {
  const meta = getCampaignType(campaign.type);
  const series = useMemo(
    () => engagementSeries(campaign, actions, org, 14),
    [campaign, actions, org],
  );
  const audience = useMemo(
    () => campaignAudience(campaign, org),
    [campaign, org],
  );
  const participation = useMemo(
    () => totalParticipation14d(campaign, actions, org),
    [campaign, actions, org],
  );

  const today = todayKey();
  const todayMine = actions.find(
    (a) =>
      a.campaignId === campaign.id &&
      a.actorId === currentMemberId &&
      a.date === today,
  );

  const [impact, setImpact] = useState<PerceivedImpact | null>(
    todayMine?.perceivedImpact ?? null,
  );
  const [reflectText, setReflectText] = useState("");

  function logDone() {
    const entry: CampaignAction = {
      id: generateId("a"),
      campaignId: campaign.id,
      actorId: currentMemberId,
      actorName: currentMemberName,
      date: today,
      status: "done",
      durationMinutes: 5,
      perceivedImpact: impact ?? undefined,
      reportedAt: new Date().toISOString(),
    };
    onLogAction(entry);
  }
  function logNot() {
    const entry: CampaignAction = {
      id: generateId("a"),
      campaignId: campaign.id,
      actorId: currentMemberId,
      actorName: currentMemberName,
      date: today,
      status: "not-done",
      reportedAt: new Date().toISOString(),
    };
    onLogAction(entry);
  }

  function submitReflection() {
    const text = reflectText.trim();
    if (text.length === 0) return;
    const action =
      todayMine ??
      ({
        id: generateId("a"),
        campaignId: campaign.id,
        actorId: currentMemberId,
        actorName: currentMemberName,
        date: today,
        status: "done",
        durationMinutes: 5,
        reportedAt: new Date().toISOString(),
      } as CampaignAction);
    if (!todayMine) {
      // Log a done action alongside the reflection so it's anchored to something.
      onLogAction(action);
    }
    const entry: ReflectionEntry = {
      id: generateId("r"),
      actionId: action.id,
      campaignId: campaign.id,
      actorId: currentMemberId,
      text,
      tags: extractTags(text),
      createdAt: new Date().toISOString(),
    };
    onAddReflection(entry);
    setReflectText("");
  }

  const campaignReflections = reflections
    .filter((r) => r.campaignId === campaign.id)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-lg font-light text-ink-soft"
          >
            {meta.glyph}
          </span>
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {meta.label} · {campaign.cadence}
            </p>
            <h3 className="mt-1 text-xl font-light tracking-brand text-ink md:text-2xl">
              {campaign.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              remove
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-ink/30 hover:text-ink"
            aria-label="Close campaign detail"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </header>

      <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
        {campaign.goal}
      </p>
      <p className="mt-3 text-[12px] font-light uppercase tracking-[0.2em] text-ink-mute">
        kpi · {campaign.kpi}
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line/60 pt-6 md:grid-cols-4">
        <Stat label="participation" value={`${Math.round(participation * 100)}%`} hint="14d" />
        <Stat label="actions" value={`${series.reduce((a, s) => a + s.actionsCount, 0)}`} hint="14d" />
        <Stat label="audience" value={`${audience.size}`} hint="people" />
        <Stat
          label="status"
          value={campaign.active ? "active" : "paused"}
          hint=""
        />
      </div>

      {/* Log today */}
      <section className="mt-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          your five today
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionTile
            active={todayMine?.status === "done"}
            tone="done"
            onClick={logDone}
            title="Done — I returned today."
            hint="A real five-minute moment, named below if you want."
          />
          <ActionTile
            active={todayMine?.status === "not-done"}
            tone="missed"
            onClick={logNot}
            title="Not today."
            hint="No judgement. The record matters more than the score."
          />
        </div>

        {todayMine?.status === "done" && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              perceived impact
            </p>
            <div className="flex gap-2">
              {IMPACT_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setImpact(i);
                    onLogAction({
                      ...todayMine,
                      perceivedImpact: i,
                      reportedAt: new Date().toISOString(),
                    });
                  }}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-light capitalize transition-colors",
                    impact === i
                      ? "border-ink/50 bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Reflection */}
      <section className="mt-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          a quick reflection · optional
        </p>
        <textarea
          value={reflectText}
          onChange={(e) => setReflectText(e.target.value)}
          rows={3}
          placeholder="What surprised you? What deserves attention? Tags: write #words to tag."
          className="mt-3 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={submitReflection}
            disabled={reflectText.trim().length === 0}
            className={cn(
              "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent",
              reflectText.trim().length === 0 && "cursor-not-allowed opacity-40",
            )}
          >
            Save reflection
          </button>
        </div>
      </section>

      {campaignReflections.length > 0 && (
        <section className="mt-8 border-t border-line/60 pt-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            recent reflections
          </p>
          <ul className="mt-4 space-y-3">
            {campaignReflections.map((r) => {
              const member = org.members.find((m) => m.id === r.actorId);
              return (
                <li key={r.id} className="rounded-xl border border-line bg-paper/60 p-4">
                  <p className="text-[14px] font-light leading-relaxed text-ink">
                    {r.text}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-ink-mute">
                    <span>{member?.name ?? "someone"}</span>
                    {r.tags && r.tags.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{r.tags.map((t) => `#${t}`).join(" ")}</span>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function ActionTile({
  active,
  tone,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  tone: "done" | "missed";
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 text-left transition-all duration-300 ease-calm",
        active && tone === "done"
          ? "border-ink/50 bg-ink text-paper shadow-soft"
          : active
            ? "border-ink/30 bg-paper text-ink shadow-soft"
            : "border-line bg-paper/70 text-ink hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft",
      )}
    >
      <p className="text-[15px] font-light tracking-brand">{title}</p>
      <p
        className={cn(
          "mt-2 text-[12.5px] font-light leading-relaxed",
          active && tone === "done" ? "text-paper/70" : "text-ink-mute",
        )}
      >
        {hint}
      </p>
    </button>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-1 text-xl font-light tracking-brand text-ink md:text-2xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] font-light text-ink-mute">{hint}</p>
      )}
    </div>
  );
}

function extractTags(text: string): string[] {
  const hashes = text.match(/#([a-zA-Z][\w-]{1,40})/g);
  if (!hashes) return [];
  return Array.from(new Set(hashes.map((h) => h.slice(1).toLowerCase())));
}
// Card import is technically unused but keeps editorial parity with siblings.
void Card;
