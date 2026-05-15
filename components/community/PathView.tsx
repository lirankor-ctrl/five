"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { getCommunity } from "@/data/community/communities";
import {
  loadState,
  saveState,
  toggleFollowPath,
  togglePathStep,
} from "@/lib/community/storage";
import type {
  CommunityState,
  CuratedPath,
} from "@/lib/community/types";

const DEFAULT_STATE: CommunityState = {
  joinedCommunities: [],
  myDrops: [],
  myJournal: null,
  followedPaths: [],
  pathProgress: {},
  version: 1,
};

type Props = {
  path: CuratedPath;
};

export function PathView({ path }: Props) {
  const [state, setState] = useState<CommunityState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CommunityState) => {
    setState(next);
    saveState(next);
  }, []);

  const community = path.communityId ? getCommunity(path.communityId) : null;
  const isFollowed = state.followedPaths.includes(path.id);
  const completedSteps = state.pathProgress[path.id] ?? [];

  const requiredSteps = useMemo(
    () => path.steps.filter((s) => !s.optional),
    [path],
  );
  const completedRequired = requiredSteps.filter((s) =>
    completedSteps.includes(s.id),
  ).length;
  const progress =
    requiredSteps.length === 0
      ? 0
      : completedRequired / requiredSteps.length;

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <Link
        href={
          path.communityId
            ? `/cubes/community/c/${path.communityId}`
            : "/cubes/community/discover"
        }
        className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
      >
        ← {community ? community.name : "discover"}
      </Link>

      <header className="mt-8 flex flex-wrap items-start justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            curated path
            {community && (
              <>
                <span aria-hidden="true"> · </span>
                {community.name}
              </>
            )}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-light tracking-brand text-ink md:text-5xl">
            {path.title}
          </h1>
          <p className="mt-3 max-w-prose text-[16px] font-light italic leading-relaxed text-ink-soft md:text-lg">
            {path.oneLine}
          </p>
          <p className="mt-2 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
            by {path.authorName}
            {path.authorIsMentor && (
              <span className="ml-2 rounded-full border border-line bg-paper px-2 py-0.5 text-[10px]">
                mentor of momentum
              </span>
            )}
            {path.totalDays && (
              <>
                <span aria-hidden="true"> · </span>
                {path.totalDays} days
              </>
            )}
            <span aria-hidden="true"> · </span>
            {path.steps.length} steps
          </p>
        </div>
        <button
          type="button"
          onClick={() => persist(toggleFollowPath(state, path.id))}
          disabled={!hydrated}
          className={cn(
            "inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-light transition-colors",
            isFollowed
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink hover:border-ink/40",
          )}
        >
          {isFollowed ? "Following" : "Follow this path"}
        </button>
      </header>

      {/* Description */}
      <section className="mt-8 max-w-prose text-[16px] font-light leading-relaxed text-ink-soft">
        <p>{path.description}</p>
      </section>

      {/* Progress (when followed) */}
      {isFollowed && (
        <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            your soft progress
          </p>
          <div className="mt-3 flex items-baseline gap-4">
            <p className="text-2xl font-thin tracking-brand text-ink md:text-3xl">
              {Math.round(progress * 100)}%
            </p>
            <p className="text-[12.5px] font-light text-ink-mute">
              {completedRequired} / {requiredSteps.length} required steps · keep dripping
            </p>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-ink transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="mt-10">
        <ol className="space-y-4">
          {path.steps.map((step) => {
            const done = completedSteps.includes(step.id);
            return (
              <li
                key={step.id}
                className={cn(
                  "rounded-2xl border bg-surface p-6 transition-colors md:p-7",
                  done ? "border-ink/40 bg-paper" : "border-line",
                )}
              >
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => persist(togglePathStep(state, path.id, step.id))}
                    aria-label={done ? "Mark as not done" : "Mark as done"}
                    disabled={!hydrated}
                    className={cn(
                      "mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-light transition-colors",
                      done
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink/40 hover:text-ink",
                    )}
                  >
                    {done ? "✓" : step.ordinal}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      step {step.ordinal}
                      {step.optional && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span>optional</span>
                        </>
                      )}
                      <span aria-hidden="true"> · </span>
                      ~{step.estimatedMinutes} min
                    </p>
                    <h3
                      className={cn(
                        "mt-2 text-lg font-light leading-snug tracking-brand md:text-xl",
                        done ? "text-ink-soft line-through decoration-ink/40" : "text-ink",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-prose text-[14.5px] font-light leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Drop after drop. Small over heroic.
        </p>
      </div>
    </Container>
  );
}
