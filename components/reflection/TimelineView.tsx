"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { aggregateRiver } from "@/lib/reflection/aggregate";
import {
  CUBE_GLYPH,
  CUBE_HREF,
  CUBE_LABEL,
  shortDate,
} from "@/lib/reflection/format";
import type { CubeId, RiverTimelinePoint } from "@/lib/reflection/types";

export function TimelineView() {
  const [hydrated, setHydrated] = useState(false);
  const [points, setPoints] = useState<RiverTimelinePoint[]>([]);

  useEffect(() => {
    setPoints(aggregateRiver(26));
    setHydrated(true);
  }, []);

  const totalAllTime = useMemo(
    () => points.reduce((a, p) => a + p.total, 0),
    [points],
  );

  const activeCubes: CubeId[] = useMemo(() => {
    const seen = new Set<CubeId>();
    for (const p of points) {
      for (const k of Object.keys(p.perCube)) seen.add(k as CubeId);
    }
    return Array.from(seen);
  }, [points]);

  const max = Math.max(1, ...points.map((p) => p.total));

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  return (
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      <header className="mx-auto max-w-3xl border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          river timeline
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          The long arc of your movement.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          Twenty-six weeks of where presence has lived in your life. Tap a cube name to enter it. Hover a bar to see the week.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>
        <p className="mt-6 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {totalAllTime} total presence marks · {activeCubes.length} active cubes
        </p>
      </header>

      {/* Weekly river */}
      <section className="mx-auto mt-10 max-w-5xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          last 26 weeks
        </p>
        <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-end gap-1 overflow-x-auto" role="img" aria-label="Weekly river of activity">
            {points.map((p) => {
              const height = Math.max(2, Math.round((p.total / max) * 80));
              const tooltip = `${shortDate(new Date(p.weekStart))} — ${p.total} drops`;
              return (
                <div
                  key={p.weekStart}
                  className="flex flex-col items-center gap-1"
                  title={tooltip}
                >
                  <span
                    className={cn(
                      "block w-2 rounded-full transition-all",
                      p.total === 0 ? "bg-line/70" : "bg-ink",
                    )}
                    style={{ height: `${height}px`, opacity: p.total === 0 ? 1 : 0.3 + (p.total / max) * 0.7 }}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] font-light italic leading-relaxed text-ink-mute">
            Each bar is one week. Each height is total presence across every cube that week.
          </p>
        </div>
      </section>

      {/* Per-cube small rivers */}
      <section className="mx-auto mt-12 max-w-5xl">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            per-cube rivers
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            Which currents have been running in you.
          </h2>
        </header>
        {activeCubes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
            <p className="text-[14px] font-light italic text-ink-soft">
              No tributary data yet. Activity across the cubes will draw itself here over time.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {activeCubes.map((cubeId) => {
              const cubeMax = Math.max(
                1,
                ...points.map((p) => p.perCube[cubeId] ?? 0),
              );
              const cubeTotal = points.reduce(
                (a, p) => a + (p.perCube[cubeId] ?? 0),
                0,
              );
              return (
                <li
                  key={cubeId}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[14px] font-light tracking-brand text-ink">
                      <span aria-hidden="true">{CUBE_GLYPH[cubeId]}</span>{" "}
                      <Link
                        href={CUBE_HREF[cubeId] ?? "/cubes"}
                        className="hover:underline underline-offset-4"
                      >
                        {CUBE_LABEL[cubeId]}
                      </Link>
                    </p>
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {cubeTotal} total
                    </p>
                  </div>
                  <div className="mt-4 flex items-end gap-1 overflow-x-auto">
                    {points.map((p) => {
                      const v = p.perCube[cubeId] ?? 0;
                      const h = Math.max(2, Math.round((v / cubeMax) * 30));
                      return (
                        <span
                          key={p.weekStart}
                          className={cn(
                            "block w-1.5 rounded-full",
                            v === 0 ? "bg-line/70" : "bg-ink",
                          )}
                          style={{
                            height: `${h}px`,
                            opacity: v === 0 ? 1 : 0.3 + (v / cubeMax) * 0.7,
                          }}
                          title={`${p.weekStart} — ${v}`}
                        />
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          The river that gives meaning to the drops.
        </p>
      </div>
    </Container>
  );
}
