"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { communityCubes } from "@/data/your-own/community-cubes";
import {
  AI_LABEL,
  CATEGORY_LABEL,
  FREQUENCY_LABEL,
  REFLECTION_LABEL,
  STATUS_LABEL,
  TRACKING_LABEL,
  VISIBILITY_LABEL,
  timeAgo,
} from "@/lib/your-own/format";
import {
  addSession,
  generateId,
  loadState,
  remixCube,
  removeCube,
  saveState,
  toggleFollow,
} from "@/lib/your-own/storage";
import type {
  CubeSession,
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

type Props = { cubeId: string };

export function CubeProfile({ cubeId }: Props) {
  const [state, setState] = useState<YourOwnState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: YourOwnState) => {
    setState(next);
    saveState(next);
  }, []);

  // Look up: seeded community + my own
  const cube: UserCube | undefined = useMemo(() => {
    return (
      communityCubes.find((c) => c.id === cubeId) ??
      state.myCubes.find((c) => c.id === cubeId)
    );
  }, [cubeId, state.myCubes]);

  const isMine = useMemo(
    () => state.myCubes.some((c) => c.id === cubeId),
    [state.myCubes, cubeId],
  );

  const sessions = useMemo(
    () =>
      state.sessions
        .filter((s) => s.cubeId === cubeId)
        .slice()
        .sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1)),
    [state.sessions, cubeId],
  );

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  if (!cube) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <Link
          href="/cubes/your-own/marketplace"
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          ← marketplace
        </Link>
        <h1 className="mt-10 text-2xl font-light tracking-brand text-ink">
          We couldn&rsquo;t find that cube on this device.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-soft">
          User cubes you built live in this browser. Marketplace cubes are seeded.
        </p>
      </Container>
    );
  }

  const followed = state.followedCubes.includes(cube.id);

  function recordSession(status: CubeSession["status"]) {
    persist(
      addSession(state, {
        id: generateId("s"),
        cubeId: cube!.id,
        date: new Date().toISOString().slice(0, 10),
        status,
        reportedAt: new Date().toISOString(),
      }),
    );
  }

  function doRemix() {
    const { state: next } = remixCube(state, cube!);
    persist(next);
    if (typeof window !== "undefined") {
      window.location.assign("/cubes/your-own/build");
    }
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <Link
        href="/cubes/your-own/marketplace"
        className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
      >
        ← marketplace
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-line/60 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-xl font-light text-ink-soft"
            >
              {cube.glyph}
            </span>
            <div>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {CATEGORY_LABEL[cube.category]} · {STATUS_LABEL[cube.status]}
              </p>
              <h1 className="mt-2 text-3xl font-light tracking-brand text-ink md:text-5xl">
                {cube.name}
              </h1>
              <p className="mt-2 max-w-prose text-[16px] font-light italic leading-relaxed text-ink-soft md:text-lg">
                {cube.subtitle}
              </p>
              <p className="mt-3 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
                by {cube.creatorName} · {VISIBILITY_LABEL[cube.visibility]}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => persist(toggleFollow(state, cube.id))}
              className={cn(
                "inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-light transition-colors",
                followed
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink/40",
              )}
            >
              {followed ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              onClick={doRemix}
              className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[13px] font-light text-ink hover:border-ink/40"
            >
              Remix
            </button>
            {isMine && (
              <button
                type="button"
                onClick={() => persist(removeCube(state, cube.id))}
                className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                remove
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Philosophy */}
      <section className="mt-10">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          philosophy
        </p>
        <p className="mt-3 max-w-prose text-[16px] font-light leading-relaxed text-ink md:text-lg">
          {cube.philosophy}
        </p>
      </section>

      {/* Three pillars */}
      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Pillar
          eyebrow="purpose"
          title="What this is trying to improve"
          body={cube.purpose.whatItImproves}
        >
          <Row label="Momentum type" value={cube.purpose.momentumType} />
          <Row label="Why it matters" value={cube.purpose.whyItMatters} />
          <Row label="What users feel" value={cube.purpose.whatUsersFeel} />
          <Row label="Consistency outcome" value={cube.purpose.consistencyOutcome} />
        </Pillar>
        <Pillar
          eyebrow="action logic"
          title="How the practice runs"
          body={`${cube.momentumLogic.sessionDurationMinutes} min, ${FREQUENCY_LABEL[cube.momentumLogic.frequency].toLowerCase()}.`}
        >
          <Row label="Reflection" value={REFLECTION_LABEL[cube.momentumLogic.reflectionStyle]} />
          <Row label="Tracking" value={TRACKING_LABEL[cube.momentumLogic.trackingShape]} />
          <Row label="Reminders" value={cube.momentumLogic.remindersEnabled ? "On" : "Off"} />
          <Row label="AI" value={AI_LABEL[cube.momentumLogic.aiBehavior]} />
        </Pillar>
        <Pillar
          eyebrow="success philosophy"
          title="What success means here"
          body={cube.successPhilosophy.whatSuccessMeans}
        >
          <Row
            label="Avoid"
            value={cube.successPhilosophy.toAvoid.join(", ") || "—"}
          />
          <Row
            label="Lean on"
            value={cube.successPhilosophy.encouragementOver.join(", ") || "—"}
          />
        </Pillar>
      </section>

      {/* Do today */}
      <section className="mt-10 rounded-3xl border border-line bg-surface p-6 md:p-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          your today
        </p>
        <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
          Did you do {cube.name.toLowerCase()} today?
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => recordSession("done")}
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-light text-paper hover:bg-accent"
          >
            Yes — log it
          </button>
          <button
            type="button"
            onClick={() => recordSession("not-today")}
            className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-5 text-[13px] font-light text-ink hover:border-ink/40"
          >
            Not today
          </button>
        </div>
        {sessions.length > 0 && (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {sessions.slice(0, 6).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 py-3 text-[13.5px] font-light text-ink"
              >
                <span>{s.status === "done" ? "Done" : "Not today"}</span>
                <span className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {timeAgo(s.reportedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Built by a human. Held by a human.
        </p>
      </div>
    </Container>
  );
}

function Pillar({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-base font-light tracking-brand text-ink">
        {title}
      </h3>
      {body && (
        <p className="mt-2 text-[14px] font-light italic leading-relaxed text-ink-soft">
          {body}
        </p>
      )}
      {children && <div className="mt-4 space-y-1.5">{children}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-0.5 text-[13.5px] font-light text-ink-soft">{value}</p>
    </div>
  );
}
