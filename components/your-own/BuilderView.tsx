"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { cubeTemplates, getTemplate } from "@/data/your-own/templates";
import {
  suggestAvoid,
  suggestEncouragement,
  suggestNames,
  suggestPhilosophy,
} from "@/lib/your-own/ai";
import {
  AI_LABEL,
  CATEGORY_LABEL,
  EMOTIONAL_CATEGORIES,
  FREQUENCY_LABEL,
  REFLECTION_LABEL,
  STATUS_LABEL,
  TRACKING_LABEL,
  VISIBILITY_LABEL,
  timeAgo,
} from "@/lib/your-own/format";
import {
  clearDraft,
  generateId,
  loadState,
  publishCube,
  removeCube,
  saveDraft,
  saveState,
} from "@/lib/your-own/storage";
import type {
  CubeAIBehavior,
  CubeFrequency,
  CubeMomentumLogic,
  CubePurpose,
  CubeReflectionStyle,
  CubeSuccessPhilosophy,
  CubeTemplateKind,
  CubeTrackingShape,
  CubeVisibility,
  DraftCube,
  EmotionalCategory,
  UserCube,
  YourOwnState,
} from "@/lib/your-own/types";

const DEFAULT_STATE: YourOwnState = {
  myCubes: [],
  sessions: [],
  followedCubes: [],
  draft: {},
  version: 1,
};

const FREQUENCIES: CubeFrequency[] = [
  "daily",
  "few-per-week",
  "weekly",
  "flexible",
  "monthly",
];
const REFLECTION_STYLES: CubeReflectionStyle[] = [
  "none",
  "feeling",
  "free-text",
  "structured",
];
const TRACKING_SHAPES: CubeTrackingShape[] = [
  "presence",
  "duration",
  "completion",
  "narrative",
];
const AI_BEHAVIORS: CubeAIBehavior[] = ["none", "gentle", "active"];
const VISIBILITIES: CubeVisibility[] = ["private", "community", "public"];

export function BuilderView() {
  const [state, setState] = useState<YourOwnState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Draft fields
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [glyph, setGlyph] = useState("·");
  const [category, setCategory] = useState<EmotionalCategory>("growth");

  const [purpose, setPurpose] = useState<CubePurpose>({
    whatItImproves: "",
    momentumType: "",
    whyItMatters: "",
    whatUsersFeel: "",
    consistencyOutcome: "",
  });

  const [logic, setLogic] = useState<CubeMomentumLogic>({
    sessionDurationMinutes: 5,
    frequency: "daily",
    reflectionStyle: "feeling",
    trackingShape: "presence",
    remindersEnabled: false,
    aiBehavior: "gentle",
  });

  const [success, setSuccess] = useState<CubeSuccessPhilosophy>({
    whatSuccessMeans: "",
    toAvoid: [],
    encouragementOver: [],
  });

  const [visibility, setVisibility] = useState<CubeVisibility>("private");
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setHydrated(true);
    // Rehydrate from a saved draft (e.g. from a Remix).
    const d = loaded.draft;
    if (d && Object.keys(d).length > 0) {
      if (d.name) setName(d.name);
      if (d.subtitle) setSubtitle(d.subtitle);
      if (d.philosophy) setPhilosophy(d.philosophy);
      if (d.glyph) setGlyph(d.glyph);
      if (d.category) setCategory(d.category);
      if (d.purpose) setPurpose(d.purpose);
      if (d.momentumLogic) setLogic(d.momentumLogic);
      if (d.successPhilosophy) setSuccess(d.successPhilosophy);
      if (d.visibility) setVisibility(d.visibility);
      if (d.templateKind) {
        // Already came from a template — skip the picker.
        setStep(1);
      }
    }
  }, []);

  const persist = useCallback((next: YourOwnState) => {
    setState(next);
    saveState(next);
  }, []);

  // Auto-save the draft on relevant changes (light).
  useEffect(() => {
    if (!hydrated) return;
    const draft: DraftCube = {
      name,
      subtitle,
      philosophy,
      glyph,
      category,
      purpose,
      momentumLogic: logic,
      successPhilosophy: success,
      visibility,
    };
    setState((current) => {
      const next = saveDraft(current, draft);
      saveState(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    subtitle,
    philosophy,
    glyph,
    category,
    purpose,
    logic,
    success,
    visibility,
    hydrated,
  ]);

  function applyTemplate(id: CubeTemplateKind) {
    const t = getTemplate(id);
    setGlyph(t.defaults.glyph);
    setPurpose(t.defaults.purpose);
    setLogic(t.defaults.momentumLogic);
    setSuccess(t.defaults.successPhilosophy);
    setCategory(t.category);
    setStep(1);
  }

  function publish() {
    if (!name.trim() || !subtitle.trim() || !philosophy.trim()) return;
    const cube: UserCube = {
      id: generateId("u"),
      name: name.trim(),
      subtitle: subtitle.trim(),
      philosophy: philosophy.trim(),
      glyph: glyph.trim() || "·",
      creatorId: "user-me",
      creatorName: "You",
      category,
      templateKind: state.draft.templateKind,
      purpose,
      momentumLogic: logic,
      successPhilosophy: success,
      visibility,
      status: visibility === "private" ? "draft" : "published",
      createdAt: new Date().toISOString(),
    };
    persist(publishCube(state, cube));
    if (typeof window !== "undefined") {
      window.location.assign(`/cubes/your-own/c/${cube.id}`);
    }
  }

  const stepReady = useMemo(() => {
    if (step === 1) return name.trim().length > 0 && subtitle.trim().length > 0;
    if (step === 2)
      return (
        purpose.whatItImproves.trim().length > 0 &&
        purpose.whyItMatters.trim().length > 0
      );
    if (step === 4) return success.whatSuccessMeans.trim().length > 0;
    if (step === 5)
      return (
        name.trim().length > 0 &&
        subtitle.trim().length > 0 &&
        philosophy.trim().length > 0
      );
    return true;
  }, [step, name, subtitle, philosophy, purpose, success]);

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          builder
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
          Design your cube.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light text-ink-soft">
          Five small steps. Save as a draft, keep it private, or publish to the marketplace.
        </p>
      </header>

      {/* Step indicator */}
      <nav className="mt-8 flex flex-wrap gap-2 text-[11px] font-light uppercase tracking-[0.22em]">
        {[
          { i: 0, label: "Template" },
          { i: 1, label: "Name" },
          { i: 2, label: "Purpose" },
          { i: 3, label: "Action logic" },
          { i: 4, label: "Success" },
          { i: 5, label: "Publish" },
        ].map((s) => (
          <button
            key={s.i}
            type="button"
            onClick={() => setStep(s.i as 0 | 1 | 2 | 3 | 4 | 5)}
            className={cn(
              "rounded-full px-3 py-1.5 transition-colors",
              step === s.i
                ? "bg-ink text-paper"
                : "text-ink-mute hover:text-ink",
            )}
          >
            {String(s.i).padStart(2, "0")} · {s.label}
          </button>
        ))}
      </nav>

      <section className="mt-10">
        {/* Step 0: template */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                step 00 · start from
              </p>
              <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
                Pick a starting shape.
              </h2>
              <p className="mt-2 max-w-prose text-[13.5px] font-light italic leading-relaxed text-ink-mute">
                Or skip and pick blank. Templates only fill defaults — every field stays yours to change.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {cubeTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className="rounded-2xl border border-line bg-surface p-5 text-left transition-all hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft"
                    >
                      {t.glyph}
                    </span>
                    <div>
                      <p className="text-[14px] font-light tracking-brand text-ink">
                        {t.label}
                      </p>
                      <p className="mt-1 text-[12.5px] font-light italic leading-relaxed text-ink-soft">
                        {t.oneLine}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-right">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                skip · start blank →
              </button>
            </p>
          </div>
        )}

        {/* Step 1: name */}
        {step === 1 && (
          <StepShell
            eyebrow="step 01 · name your cube"
            title="What is this cube called?"
            onCancel={() => setStep(0)}
            onNext={() => setStep(2)}
            ready={stepReady}
            cancelLabel="← template"
          >
            <Field label="cube name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='"Five Silence", "Five Wisdom", "Five Recovery"…'
                className="w-full border-b border-line bg-transparent pb-2 text-2xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
              />
              {nameSuggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {nameSuggestions.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setName(n)}
                      className="inline-flex h-8 items-center rounded-full border border-line bg-paper px-3 text-[12.5px] font-light text-ink-soft hover:border-ink/40 hover:text-ink"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  setNameSuggestions(
                    suggestNames({ subtitle, purpose, philosophy }),
                  )
                }
                className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                ✦ ai · suggest names from purpose
              </button>
            </Field>
            <Field label="short subtitle">
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="One italic line shown under the title."
                className="w-full border-b border-line bg-transparent pb-2 text-lg italic font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="philosophy" hint="One short paragraph. The voice of the cube.">
              <textarea
                rows={3}
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="The thinking behind why this exists."
                className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setPhilosophy(
                    suggestPhilosophy({ subtitle, purpose }),
                  )
                }
                className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                ✦ ai · draft a philosophy line from purpose
              </button>
            </Field>
            <Field label="glyph" hint="A single character. Replaces the cube icon.">
              <input
                type="text"
                value={glyph}
                onChange={(e) => setGlyph(e.target.value.slice(0, 2))}
                placeholder="·"
                className="h-10 w-20 rounded-md border border-line bg-paper px-3 text-center text-xl font-light text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="emotional category">
              <div className="flex flex-wrap gap-2">
                {EMOTIONAL_CATEGORIES.map((c) => (
                  <Pill
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {CATEGORY_LABEL[c]}
                  </Pill>
                ))}
              </div>
            </Field>
          </StepShell>
        )}

        {/* Step 2: purpose */}
        {step === 2 && (
          <StepShell
            eyebrow="step 02 · purpose"
            title="What is this cube trying to do for someone?"
            onCancel={() => setStep(1)}
            onNext={() => setStep(3)}
            ready={stepReady}
            cancelLabel="← name"
          >
            <Field label="what it improves">
              <textarea
                rows={2}
                value={purpose.whatItImproves}
                onChange={(e) =>
                  setPurpose({ ...purpose, whatItImproves: e.target.value })
                }
                placeholder="Concrete. One sentence."
                className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="momentum type">
              <input
                type="text"
                value={purpose.momentumType}
                onChange={(e) =>
                  setPurpose({ ...purpose, momentumType: e.target.value })
                }
                placeholder="What kind of momentum does it create?"
                className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="why it matters">
              <textarea
                rows={2}
                value={purpose.whyItMatters}
                onChange={(e) =>
                  setPurpose({ ...purpose, whyItMatters: e.target.value })
                }
                placeholder="Honest, not heroic."
                className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="what users feel">
              <input
                type="text"
                value={purpose.whatUsersFeel}
                onChange={(e) =>
                  setPurpose({ ...purpose, whatUsersFeel: e.target.value })
                }
                placeholder="What changes inside them?"
                className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>
            <Field label="consistency outcome">
              <input
                type="text"
                value={purpose.consistencyOutcome}
                onChange={(e) =>
                  setPurpose({
                    ...purpose,
                    consistencyOutcome: e.target.value,
                  })
                }
                placeholder="What does the long-term version look like?"
                className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>
          </StepShell>
        )}

        {/* Step 3: action logic */}
        {step === 3 && (
          <StepShell
            eyebrow="step 03 · action logic"
            title="How does it actually run?"
            onCancel={() => setStep(2)}
            onNext={() => setStep(4)}
            ready
            cancelLabel="← purpose"
          >
            <Field label="session duration">
              <div className="flex flex-wrap gap-2">
                {[3, 5, 10, 15].map((d) => (
                  <Pill
                    key={d}
                    active={logic.sessionDurationMinutes === d}
                    onClick={() =>
                      setLogic({ ...logic, sessionDurationMinutes: d })
                    }
                  >
                    {d} min
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="frequency">
              <div className="flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <Pill
                    key={f}
                    active={logic.frequency === f}
                    onClick={() => setLogic({ ...logic, frequency: f })}
                  >
                    {FREQUENCY_LABEL[f]}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="reflection style">
              <div className="flex flex-wrap gap-2">
                {REFLECTION_STYLES.map((r) => (
                  <Pill
                    key={r}
                    active={logic.reflectionStyle === r}
                    onClick={() =>
                      setLogic({ ...logic, reflectionStyle: r })
                    }
                  >
                    {REFLECTION_LABEL[r]}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="tracking shape">
              <div className="flex flex-wrap gap-2">
                {TRACKING_SHAPES.map((t) => (
                  <Pill
                    key={t}
                    active={logic.trackingShape === t}
                    onClick={() => setLogic({ ...logic, trackingShape: t })}
                  >
                    {TRACKING_LABEL[t]}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="reminders">
              <label className="inline-flex items-center gap-3 text-[14px] font-light text-ink-soft">
                <input
                  type="checkbox"
                  checked={logic.remindersEnabled}
                  onChange={(e) =>
                    setLogic({ ...logic, remindersEnabled: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <span>Send a gentle reminder. (Default off.)</span>
              </label>
            </Field>
            <Field label="ai behavior">
              <div className="flex flex-wrap gap-2">
                {AI_BEHAVIORS.map((a) => (
                  <Pill
                    key={a}
                    active={logic.aiBehavior === a}
                    onClick={() => setLogic({ ...logic, aiBehavior: a })}
                  >
                    {AI_LABEL[a]}
                  </Pill>
                ))}
              </div>
            </Field>
          </StepShell>
        )}

        {/* Step 4: success philosophy */}
        {step === 4 && (
          <StepShell
            eyebrow="step 04 · success philosophy"
            title="What does success mean here — and what must not become toxic?"
            onCancel={() => setStep(3)}
            onNext={() => setStep(5)}
            ready={stepReady}
            cancelLabel="← logic"
          >
            <Field label="what success means">
              <textarea
                rows={2}
                value={success.whatSuccessMeans}
                onChange={(e) =>
                  setSuccess({ ...success, whatSuccessMeans: e.target.value })
                }
                placeholder='e.g. "Returning matters more than feeling good every time."'
                className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
              />
            </Field>

            <Field
              label="to avoid"
              hint="What this cube must not become. Comma-separated anti-patterns."
            >
              <input
                type="text"
                value={success.toAvoid.join(", ")}
                onChange={(e) =>
                  setSuccess({
                    ...success,
                    toAvoid: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="streak shame, comparison, performance"
                className="w-full border-b border-line bg-transparent pb-2 text-[14px] font-light text-ink focus:border-ink/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setSuccess({
                    ...success,
                    toAvoid: suggestAvoid(category),
                  })
                }
                className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                ✦ ai · suggest anti-patterns for {CATEGORY_LABEL[category].toLowerCase()}
              </button>
            </Field>

            <Field
              label="lean on"
              hint="What this cube protects. Comma-separated stances."
            >
              <input
                type="text"
                value={success.encouragementOver.join(", ")}
                onChange={(e) =>
                  setSuccess({
                    ...success,
                    encouragementOver: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="softness, consistency, returning"
                className="w-full border-b border-line bg-transparent pb-2 text-[14px] font-light text-ink focus:border-ink/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setSuccess({
                    ...success,
                    encouragementOver: suggestEncouragement(category),
                  })
                }
                className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                ✦ ai · suggest stances for {CATEGORY_LABEL[category].toLowerCase()}
              </button>
            </Field>
          </StepShell>
        )}

        {/* Step 5: publish */}
        {step === 5 && (
          <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              step 05 · publish or save
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              Almost done. Pick a visibility.
            </h2>

            <div className="mt-6 space-y-2">
              {VISIBILITIES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={cn(
                    "block w-full rounded-2xl border bg-paper p-4 text-left transition-all",
                    visibility === v
                      ? "border-ink/50"
                      : "border-line hover:border-ink/30",
                  )}
                >
                  <p className="text-[14px] font-light tracking-brand text-ink">
                    {VISIBILITY_LABEL[v]}
                  </p>
                  <p className="mt-1 text-[12.5px] font-light italic leading-relaxed text-ink-soft">
                    {visibilityHint(v)}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                what you are publishing
              </p>
              <p className="mt-2 text-[15px] font-light text-ink">
                {glyph} {name.trim() || "Untitled cube"}
              </p>
              <p className="mt-1 text-[14px] font-light italic text-ink-soft">
                {subtitle.trim() || "—"}
              </p>
              <p className="mt-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {CATEGORY_LABEL[category]} · {FREQUENCY_LABEL[logic.frequency]} ·{" "}
                {logic.sessionDurationMinutes} min
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-6">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                ← success
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    persist(clearDraft(state));
                    setStep(0);
                    setName("");
                    setSubtitle("");
                    setPhilosophy("");
                  }}
                  className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                >
                  discard draft
                </button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={publish}
                  disabled={!stepReady}
                  className={cn(!stepReady && "cursor-not-allowed opacity-40")}
                >
                  {visibility === "private" ? "Save as draft" : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* My cubes */}
      <section className="mt-16">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            your cubes on this device
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            What you have built so far.
          </h2>
        </header>
        {!hydrated ? null : state.myCubes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              Nothing yet. The next cube might be the one no app has thought of.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {state.myCubes.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/cubes/your-own/c/${c.id}`}
                    className="block truncate text-[15px] font-light text-ink hover:underline"
                  >
                    {c.glyph} {c.name}
                  </Link>
                  <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    {CATEGORY_LABEL[c.category]} · {STATUS_LABEL[c.status]} ·{" "}
                    {VISIBILITY_LABEL[c.visibility]} · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => persist(removeCube(state, c.id))}
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
          Build something alive that reflects you.
        </p>
      </div>
    </Container>
  );
}

function visibilityHint(v: CubeVisibility): string {
  if (v === "private") return "Just for you, on this device.";
  if (v === "community") return "Visible to people who follow you. Remix-friendly.";
  return "Listed in the marketplace.";
}

function StepShell({
  eyebrow,
  title,
  onCancel,
  onNext,
  ready,
  cancelLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  onCancel: () => void;
  onNext: () => void;
  ready: boolean;
  cancelLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
        {title}
      </h2>
      <div className="mt-6 space-y-7">{children}</div>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line/70 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          {cancelLabel}
        </button>
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          Next →
        </Button>
      </div>
    </div>
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
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      {hint && (
        <p className="mt-1 max-w-prose text-[12.5px] font-light italic leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Pill({
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
        "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
        active
          ? "border-ink/50 bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
