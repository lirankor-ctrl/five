"use client";

import Link from "next/link";
import { useMemo } from "react";
import { communities } from "@/data/community/communities";
import { COMMUNITY_TYPE_LABEL } from "@/lib/community/format";
import type { Community } from "@/lib/community/types";

/**
 * The River Map.
 *
 * A calm flowing SVG visualization. The "main river" runs across the
 * bottom of the canvas. Each tributary curves into it from above, named
 * with a single word ("letters", "ideas", "make"...). Communities sit
 * along their tributary as small nodes whose size reflects member count.
 *
 * Built deterministically from the seeded community data. A future
 * server-driven River Map would replace this same component with
 * server-shaped nodes — the layout math stays.
 */
export function RiverMap() {
  // Group communities by tributary (default bucket for any without one).
  const tributaryMap = useMemo(() => {
    const map = new Map<string, Community[]>();
    for (const c of communities) {
      const key = c.tributary ?? "other";
      const bucket = map.get(key) ?? [];
      bucket.push(c);
      map.set(key, bucket);
    }
    return map;
  }, []);

  // Stable display order — most-populated tributaries on the outside.
  const tributaries = useMemo(() => {
    return Array.from(tributaryMap.entries())
      .map(([id, comms]) => ({
        id,
        comms,
        weight: comms.reduce((a, c) => a + c.memberCount, 0),
      }))
      .sort((a, b) => b.weight - a.weight);
  }, [tributaryMap]);

  // Layout: canvas 0..1000 wide, 0..560 tall. Main river at y=460.
  const W = 1000;
  const H = 560;
  const RIVER_Y = 460;

  const tributaryCount = tributaries.length;
  const slotWidth = W / (tributaryCount + 1);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="River map of communities"
          className="block h-[60vh] min-h-[420px] w-full"
        >
          {/* Soft horizontal river */}
          <defs>
            <linearGradient id="riverGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(14,14,12,0.04)" />
              <stop offset="50%" stopColor="rgba(14,14,12,0.16)" />
              <stop offset="100%" stopColor="rgba(14,14,12,0.04)" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${RIVER_Y + 14} Q ${W / 2} ${RIVER_Y - 6} ${W} ${RIVER_Y + 14}`}
            stroke="url(#riverGrad)"
            strokeWidth="20"
            fill="none"
          />
          <path
            d={`M 0 ${RIVER_Y + 14} Q ${W / 2} ${RIVER_Y - 6} ${W} ${RIVER_Y + 14}`}
            stroke="rgba(14,14,12,0.22)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Each tributary */}
          {tributaries.map((t, i) => {
            const x = slotWidth * (i + 1);
            const startY = 80 + ((i * 37) % 60); // small varied start altitude
            const meetY = RIVER_Y + 2;
            const controlY = (startY + meetY) / 2 + 30;
            const controlX = x + (i % 2 === 0 ? -40 : 40);

            return (
              <g key={t.id}>
                {/* The tributary stream */}
                <path
                  d={`M ${x} ${startY} Q ${controlX} ${controlY} ${x} ${meetY}`}
                  stroke="rgba(14,14,12,0.18)"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Tributary label */}
                <text
                  x={x}
                  y={startY - 14}
                  textAnchor="middle"
                  className="fill-ink-mute"
                  fontSize="12"
                  fontWeight="300"
                  style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}
                >
                  {t.id}
                </text>

                {/* Community nodes spread along the tributary */}
                {t.comms.map((c, j) => {
                  // Spread nodes along the tributary's vertical span.
                  const total = t.comms.length;
                  const ratio =
                    total === 1 ? 0.5 : 0.2 + (j / (total - 1)) * 0.7;
                  // Quadratic bezier point at param ratio
                  const px = bezier(x, controlX, x, ratio);
                  const py = bezier(startY, controlY, meetY, ratio);
                  // Node radius scaled by member count, log-shape for sanity.
                  const r = Math.max(
                    5,
                    Math.min(12, 4 + Math.log10(Math.max(10, c.memberCount))),
                  );
                  return (
                    <g key={c.id}>
                      <Link href={`/cubes/community/c/${c.id}`}>
                        <circle
                          cx={px}
                          cy={py}
                          r={r}
                          className="fill-ink/80 transition-all hover:fill-ink"
                        />
                        <title>
                          {c.name} — {c.memberCount.toLocaleString()} people
                        </title>
                      </Link>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Main-river label */}
          <text
            x={W / 2}
            y={RIVER_Y + 50}
            textAnchor="middle"
            className="fill-ink-mute"
            fontSize="11"
            fontWeight="300"
            style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
          >
            the river of small momentum
          </text>
        </svg>
      </div>

      {/* Legend / community list under the map */}
      <section className="mt-10">
        <header className="mb-4">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            tributaries
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            Where people are flowing.
          </h2>
        </header>

        <div className="space-y-8">
          {tributaries.map((t) => (
            <div key={t.id}>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {t.id} ·{" "}
                <span className="text-ink">{t.comms.length}</span> communities ·{" "}
                <span className="text-ink">
                  {t.weight.toLocaleString()}
                </span>{" "}
                people
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {t.comms.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-2xl border border-line bg-paper px-4 py-3"
                  >
                    <Link
                      href={`/cubes/community/c/${c.id}`}
                      className="block text-[15px] font-light tracking-brand text-ink hover:underline underline-offset-4"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {COMMUNITY_TYPE_LABEL[c.type]}
                      <span aria-hidden="true"> · </span>
                      {c.memberCount.toLocaleString()} people
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function bezier(p0: number, p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}
