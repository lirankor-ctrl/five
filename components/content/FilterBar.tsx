"use client";

import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABEL,
  PRICING_LABEL,
  TYPE_LABEL,
} from "@/lib/content/format";
import type {
  ContentType,
  Difficulty,
  Pricing,
} from "@/lib/content/types";

type Props = {
  contentType?: ContentType;
  difficulty?: Difficulty;
  pricing?: Pricing | "any";
  maxDuration?: number;
  onChange: (patch: {
    contentType?: ContentType;
    difficulty?: Difficulty;
    pricing?: Pricing | "any";
    maxDuration?: number;
  }) => void;
};

const TYPE_OPTIONS: ContentType[] = [
  "app",
  "video",
  "audio",
  "podcast",
  "article",
  "course",
  "website",
];

const DIFFICULTY_OPTIONS: Difficulty[] = ["easy", "medium", "advanced"];

const PRICING_OPTIONS: Array<Pricing | "any"> = [
  "any",
  "free",
  "freemium",
  "paid",
];

const DURATION_OPTIONS: number[] = [3, 5, 7, 10];

export function FilterBar({
  contentType,
  difficulty,
  pricing,
  maxDuration,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 md:p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Group label="Type">
          <ChipRow>
            {TYPE_OPTIONS.map((t) => (
              <Chip
                key={t}
                active={contentType === t}
                onClick={() =>
                  onChange({ contentType: contentType === t ? undefined : t })
                }
              >
                {TYPE_LABEL[t]}
              </Chip>
            ))}
          </ChipRow>
        </Group>

        <Group label="Duration">
          <ChipRow>
            {DURATION_OPTIONS.map((d) => (
              <Chip
                key={d}
                active={maxDuration === d}
                onClick={() =>
                  onChange({ maxDuration: maxDuration === d ? undefined : d })
                }
              >
                ≤ {d} min
              </Chip>
            ))}
          </ChipRow>
        </Group>

        <Group label="Difficulty">
          <ChipRow>
            {DIFFICULTY_OPTIONS.map((d) => (
              <Chip
                key={d}
                active={difficulty === d}
                onClick={() =>
                  onChange({ difficulty: difficulty === d ? undefined : d })
                }
              >
                {DIFFICULTY_LABEL[d]}
              </Chip>
            ))}
          </ChipRow>
        </Group>

        <Group label="Cost">
          <ChipRow>
            {PRICING_OPTIONS.map((p) => (
              <Chip
                key={p}
                active={(pricing ?? "any") === p}
                onClick={() => onChange({ pricing: p })}
              >
                {p === "any" ? "Any" : PRICING_LABEL[p]}
              </Chip>
            ))}
          </ChipRow>
        </Group>
      </div>
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
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
        "inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
        active
          ? "border-ink/50 bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
