"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { creatorCategories } from "@/data/creators/categories";
import { creators } from "@/data/creators/creators";
import { moods } from "@/data/creators/moods";
import { sessionsByCreator } from "@/lib/creators/analytics";
import {
  AUDIENCE_LABEL,
  ENERGY_LABEL,
  MEDIA_LABEL,
  PRICING_LABEL,
  SESSION_TYPE_LABEL,
  WORLD_LABEL,
} from "@/lib/creators/format";
import {
  addDraft,
  deleteDraft,
  generateId,
  loadState,
  saveState,
  setMeCreator,
} from "@/lib/creators/storage";
import type {
  Audience,
  CreatorSession,
  CreatorsState,
  DifficultyLevel,
  EnergyLevel,
  MediaType,
  Pricing,
  SessionType,
  WorldContext,
} from "@/lib/creators/types";

const DEFAULT_STATE: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

const SESSION_TYPES: SessionType[] = [
  "thought-drop",
  "guided-session",
  "micro-course",
  "challenge",
  "parent-child",
  "organization-pack",
];

const MEDIA_TYPES: MediaType[] = [
  "video",
  "audio",
  "text",
  "image",
  "interactive",
  "exercise",
  "reflection-prompt",
  "ai-guided",
  "quiz",
  "assignment",
];

export function StudioView() {
  const [state, setState] = useState<CreatorsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  const [title, setTitle] = useState("");
  const [hook, setHook] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SessionType>("thought-drop");
  const [category, setCategory] = useState<string>("philosophy");
  const [duration, setDuration] = useState<number>(5);
  const [energy, setEnergy] = useState<EnergyLevel>("low");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [audience, setAudience] = useState<Audience>("solo");
  const [world, setWorld] = useState<WorldContext>("in-app");
  const [pricing, setPricing] = useState<Pricing>("free");
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>(["text"]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [sessionCount, setSessionCount] = useState<number | "">("");
  const [totalDays, setTotalDays] = useState<number | "">("");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CreatorsState) => {
    setState(next);
    saveState(next);
  }, []);

  const meCreator = useMemo(
    () => creators.find((c) => c.id === state.meCreatorId) ?? creators[0],
    [state.meCreatorId],
  );

  const myDrafts = useMemo(
    () => sessionsByCreator(meCreator.id, state).filter((s) => state.drafts.some((d) => d.id === s.id)),
    [meCreator, state],
  );

  const isStructured = type === "micro-course" || type === "challenge" || type === "organization-pack";

  function toggleMedia(m: MediaType) {
    setMediaTypes((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }
  function toggleMood(id: string) {
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const ready =
    title.trim().length > 0 &&
    hook.trim().length > 0 &&
    description.trim().length > 0 &&
    mediaTypes.length > 0;

  function publish() {
    if (!ready) return;
    const draft: CreatorSession = {
      id: generateId("d"),
      creatorId: meCreator.id,
      type,
      title: title.trim(),
      hook: hook.trim(),
      description: description.trim(),
      category,
      moods: selectedMoods,
      durationMinutes: duration,
      energy,
      difficulty,
      audience,
      world,
      mediaTypes,
      sessionCount: isStructured && sessionCount !== "" ? Number(sessionCount) : undefined,
      totalDays: isStructured && totalDays !== "" ? Number(totalDays) : undefined,
      pricing,
      createdAt: new Date().toISOString(),
    };
    persist(addDraft(state, draft));
    // Reset minimal fields
    setTitle("");
    setHook("");
    setDescription("");
    setSelectedMoods([]);
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            creator studio
          </p>
          <h1 className="mt-3 font-serif text-3xl font-light tracking-[-0.01em] text-ink md:text-4xl">
            Build a five.
          </h1>
          <p className="mt-2 max-w-prose text-[14px] font-light text-ink-soft">
            One short session at a time. The structure here mirrors the API a future creator app would talk to.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            you are
          </label>
          <select
            value={state.meCreatorId}
            onChange={(e) => persist(setMeCreator(state, e.target.value))}
            className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-light text-ink focus:border-ink/40 focus:outline-none"
          >
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Builder */}
      <section className="mt-10 space-y-10">
        <Field label="01 · type" hint="The shape of the session. Decides downstream defaults.">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {SESSION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "rounded-2xl border p-3 text-left transition-all duration-300 ease-calm",
                  type === t
                    ? "border-ink/50 bg-paper"
                    : "border-line bg-surface hover:border-ink/30",
                )}
              >
                <p className="text-[14px] font-light text-ink">
                  {SESSION_TYPE_LABEL[t]}
                </p>
              </button>
            ))}
          </div>
        </Field>

        <Field label="02 · title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Three sentences for the morning"
            className="w-full border-b border-line bg-transparent pb-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Field>

        <Field label="03 · hook" hint="One italic line shown under the title on cards.">
          <input
            type="text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="A short, honest hook."
            className="w-full border-b border-line bg-transparent pb-2 font-serif text-lg italic font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Field>

        <Field label="04 · description" hint="One short paragraph describing the session.">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Five honest sentences are enough."
            className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Field>

        <Field label="05 · category">
          <div className="flex flex-wrap gap-2">
            {creatorCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-light transition-colors",
                  category === c.id
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                <span aria-hidden="true">{c.glyph}</span>
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="06 · which intentions does this answer?">
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMood(m.id)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light italic transition-colors",
                  selectedMoods.includes(m.id)
                    ? "border-ink/50 bg-ink text-paper not-italic"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {m.intention}
              </button>
            ))}
          </div>
        </Field>

        <Field label="07 · attributes">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SubField label="duration">
              <div className="flex items-center gap-3 text-sm font-light text-ink-soft">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 5)))
                  }
                  className="h-9 w-20 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
                />
                <span>minutes.</span>
              </div>
            </SubField>
            <SubField label="energy">
              <ToggleRow
                options={["low", "medium", "high"] as const}
                value={energy}
                onChange={(v) => setEnergy(v as EnergyLevel)}
                labels={ENERGY_LABEL}
              />
            </SubField>
            <SubField label="difficulty">
              <ToggleRow
                options={["easy", "medium", "advanced"] as const}
                value={difficulty}
                onChange={(v) => setDifficulty(v as DifficultyLevel)}
              />
            </SubField>
            <SubField label="audience">
              <ToggleRow
                options={["solo", "child", "couple", "group"] as const}
                value={audience}
                onChange={(v) => setAudience(v as Audience)}
                labels={AUDIENCE_LABEL}
              />
            </SubField>
            <SubField label="where">
              <ToggleRow
                options={["in-app", "physical-world", "either"] as const}
                value={world}
                onChange={(v) => setWorld(v as WorldContext)}
                labels={WORLD_LABEL}
              />
            </SubField>
            <SubField label="cost">
              <ToggleRow
                options={["free", "freemium", "paid"] as const}
                value={pricing}
                onChange={(v) => setPricing(v as Pricing)}
                labels={PRICING_LABEL}
              />
            </SubField>
          </div>
        </Field>

        <Field label="08 · media composition" hint="What this session is made of. Multi-select.">
          <div className="flex flex-wrap gap-2">
            {MEDIA_TYPES.map((m) => {
              const active = mediaTypes.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMedia(m)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    active
                      ? "border-ink/50 bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {MEDIA_LABEL[m]}
                </button>
              );
            })}
          </div>
        </Field>

        {isStructured && (
          <Field label="09 · structure" hint="Used for courses, challenges, and packs.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SubField label="number of sessions">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={sessionCount}
                  onChange={(e) =>
                    setSessionCount(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10) || 0))
                  }
                  className="h-9 w-24 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
                />
              </SubField>
              <SubField label="over (days)">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={totalDays}
                  onChange={(e) =>
                    setTotalDays(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10) || 0))
                  }
                  className="h-9 w-24 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
                />
              </SubField>
            </div>
          </Field>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-8">
          <p className="text-[12px] font-light text-ink-mute">
            Saved locally. A real publish flow would route this to a CMS or partner API.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={publish}
            disabled={!ready}
            className={cn(!ready && "cursor-not-allowed opacity-40")}
          >
            Publish draft
          </Button>
        </div>
      </section>

      {/* Drafts list */}
      <section className="mt-16">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            your drafts on this device
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
            {meCreator.name}&rsquo;s small library.
          </h2>
        </header>
        {!hydrated ? null : myDrafts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              Nothing yet. Publish a session above and it will appear here — and in discover.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {myDrafts.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <Link
                    href={`/cubes/creators/content/${s.id}`}
                    className="block truncate font-serif text-[16px] font-light text-ink hover:underline"
                  >
                    {s.title}
                  </Link>
                  <p className="mt-1 text-[11px] font-light uppercase tracking-[0.2em] text-ink-mute">
                    {SESSION_TYPE_LABEL[s.type]}
                    <span aria-hidden="true"> · </span>
                    {s.durationMinutes} min
                    <span aria-hidden="true"> · </span>
                    {s.mediaTypes.length} media types
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => persist(deleteDraft(state, s.id))}
                  className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Premium creator tools, designed to feel calm.
        </p>
      </div>
    </Container>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </p>
      {hint && (
        <p className="mt-1 max-w-prose text-[12.5px] font-light leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SubField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      {children}
    </div>
  );
}

function ToggleRow<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light capitalize transition-colors",
              active
                ? "border-ink/50 bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
            )}
          >
            {labels ? labels[o] : o}
          </button>
        );
      })}
    </div>
  );
}
