"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { participantPresets } from "@/data/family/presets";
import { familyWorlds } from "@/data/family/worlds";
import { generateId } from "@/lib/family/storage";
import { CADENCE_LABEL } from "@/lib/family/format";
import type {
  AgeBand,
  FamilyFiveWorld,
  FamilyGroup,
  FamilyMember,
  FamilyMemberRelation,
  ParticipantPreset,
  Ritual,
  RitualCadence,
} from "@/lib/family/types";

type Props = {
  onComplete: (group: FamilyGroup, ritual: Ritual) => void;
};

const RELATIONS: Array<{ id: FamilyMemberRelation; label: string }> = [
  { id: "parent", label: "Parent" },
  { id: "partner", label: "Partner" },
  { id: "child", label: "Child" },
  { id: "sibling", label: "Sibling" },
  { id: "grandparent", label: "Grandparent" },
  { id: "grandchild", label: "Grandchild" },
  { id: "other", label: "Other" },
];

const AGE_BANDS: Array<{ id: AgeBand; label: string }> = [
  { id: "young-child", label: "Young child" },
  { id: "child", label: "Child" },
  { id: "teen", label: "Teen" },
  { id: "adult", label: "Adult" },
];

const CADENCES: RitualCadence[] = [
  "daily",
  "few-per-week",
  "weekly",
  "weekend-morning",
  "before-sleep",
  "after-dinner",
  "custom",
];

export function FamilySetup({ onComplete }: Props) {
  const [familyLabel, setFamilyLabel] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState<FamilyMemberRelation>("parent");
  const [newAgeBand, setNewAgeBand] = useState<AgeBand>("adult");

  const [world, setWorld] = useState<FamilyFiveWorld>("talk");
  const [preset, setPreset] = useState<ParticipantPreset>("whole-family");
  const [cadence, setCadence] = useState<RitualCadence>("daily");
  const [customCadence, setCustomCadence] = useState("");
  const [duration, setDuration] = useState<number>(5);
  const [ritualLabel, setRitualLabel] = useState("");

  const ready = useMemo(() => {
    return (
      familyLabel.trim().length > 0 &&
      members.length > 0 &&
      ritualLabel.trim().length > 0
    );
  }, [familyLabel, members, ritualLabel]);

  function addMember() {
    if (newName.trim().length === 0) return;
    setMembers((prev) => [
      ...prev,
      {
        id: generateId("m"),
        name: newName.trim(),
        relation: newRelation,
        ageBand: newRelation === "child" || newRelation === "grandchild" ? newAgeBand : "adult",
      },
    ]);
    setNewName("");
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function commit() {
    if (!ready) return;
    const group: FamilyGroup = {
      id: generateId("g"),
      label: familyLabel.trim(),
      members,
      createdAt: new Date().toISOString(),
    };
    const ritual: Ritual = {
      id: generateId("r"),
      label: ritualLabel.trim(),
      world,
      participantPreset: preset,
      participantIds: [],
      cadence,
      customCadenceLabel: cadence === "custom" ? customCadence.trim() : undefined,
      durationMinutes: duration,
      createdAt: new Date().toISOString(),
      active: true,
    };
    onComplete(group, ritual);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
      <header className="mb-10">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-hearth-700">
          five family · begin
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          Who is in this together?
        </h1>
        <div className="mt-6 w-20">
          <RiverLine />
        </div>
        <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink-soft md:text-base">
          Add a name or two — you can do more later. Then pick one small first ritual. Five minutes is enough.
        </p>
      </header>

      <section className="space-y-12">
        {/* 01 family name */}
        <Step ordinal="01" label="What should we call this family?">
          <input
            type="text"
            value={familyLabel}
            onChange={(e) => setFamilyLabel(e.target.value)}
            placeholder="The Garcia family · The two of us · Home"
            className="w-full border-b border-line bg-transparent pb-3 text-2xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-hearth-500 focus:outline-none"
          />
        </Step>

        {/* 02 add members */}
        <Step ordinal="02" label="Add a few people.">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="h-10 rounded-md border border-line bg-paper px-3 text-[15px] font-light text-ink focus:border-hearth-500 focus:outline-none"
              />
              <select
                value={newRelation}
                onChange={(e) =>
                  setNewRelation(e.target.value as FamilyMemberRelation)
                }
                className="h-10 rounded-md border border-line bg-paper px-3 text-[14px] font-light text-ink focus:border-hearth-500 focus:outline-none"
              >
                {RELATIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Button variant="primary" size="md" onClick={addMember}>
                Add
              </Button>
            </div>
            {(newRelation === "child" || newRelation === "grandchild") && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  age, roughly
                </p>
                <div className="flex flex-wrap gap-2">
                  {AGE_BANDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setNewAgeBand(b.id)}
                      className={cn(
                        "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                        newAgeBand === b.id
                          ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                          : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {members.length > 0 && (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-[15px] font-light text-ink">{m.name}</p>
                    <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {RELATIONS.find((r) => r.id === m.relation)?.label}
                      {m.ageBand && m.ageBand !== "adult" && (
                        <>
                          <span aria-hidden="true"> · </span>
                          {AGE_BANDS.find((b) => b.id === m.ageBand)?.label}
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Step>

        {/* 03 first ritual: world */}
        <Step
          ordinal="03"
          label="Which kind of five would feel easiest first?"
        >
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {familyWorlds.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWorld(w.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ease-calm",
                  world === w.id
                    ? "border-hearth-500 bg-hearth-50"
                    : "border-line bg-surface hover:border-hearth-300",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base font-light",
                    world === w.id
                      ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                      : "border-line text-ink-soft",
                  )}
                >
                  {w.glyph}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-light text-ink">{w.label}</p>
                  <p className="truncate text-[11px] font-light text-ink-mute">
                    {w.oneLine}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Step>

        {/* 04 ritual name */}
        <Step ordinal="04" label="Name this small ritual.">
          <input
            type="text"
            value={ritualLabel}
            onChange={(e) => setRitualLabel(e.target.value)}
            placeholder="Before bedtime · Friday night talk · After-dinner walk"
            className="w-full border-b border-line bg-transparent pb-3 text-xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-hearth-500 focus:outline-none"
          />
        </Step>

        {/* 05 who participates */}
        <Step ordinal="05" label="Who is this five for?">
          <div className="flex flex-wrap gap-2">
            {participantPresets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
                  preset === p.id
                    ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                    : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Step>

        {/* 06 cadence */}
        <Step ordinal="06" label="How often, roughly?">
          <div className="flex flex-wrap gap-2">
            {CADENCES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
                  cadence === c
                    ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                    : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                )}
              >
                {CADENCE_LABEL[c]}
              </button>
            ))}
          </div>
          {cadence === "custom" && (
            <input
              type="text"
              value={customCadence}
              onChange={(e) => setCustomCadence(e.target.value)}
              placeholder="When does this fit your week?"
              className="mt-3 w-full border-b border-line bg-transparent pb-2 text-[14px] font-light text-ink placeholder:text-ink-mute/70 focus:border-hearth-500 focus:outline-none"
            />
          )}
        </Step>

        {/* 07 duration */}
        <Step ordinal="07" label="How long, gently?">
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light transition-colors",
                  duration === d
                    ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                    : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                )}
              >
                {d} min
              </button>
            ))}
          </div>
          <p className="mt-3 max-w-prose text-[13px] font-light leading-relaxed text-ink-mute">
            Five minutes is enough. Anything longer is a bonus.
          </p>
        </Step>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={commit}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          Begin the first five
        </Button>
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          You can change everything later.
        </p>
      </div>
    </div>
  );
}

function Step({
  ordinal,
  label,
  children,
}: {
  ordinal: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-[11px] font-light uppercase tracking-[0.25em] text-hearth-700">
          {ordinal}
        </span>
        <h2 className="text-base font-light tracking-brand text-ink md:text-lg">
          {label}
        </h2>
      </div>
      {children}
    </section>
  );
}
