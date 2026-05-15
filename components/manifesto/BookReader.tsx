"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  loadReadingState,
  saveReadingState,
  setProgress,
  setTheme,
  toggleBookmark,
  toggleHighlight,
} from "@/lib/manifesto/storage";
import type {
  BookChapter,
  ManifestoBlock,
  ReadingState,
} from "@/lib/manifesto/types";
import { Block } from "./Block";

type Props = {
  chapter: BookChapter;
  prev?: BookChapter;
  next?: BookChapter;
};

const emptyState: ReadingState = {
  progress: {},
  bookmarks: [],
  highlights: [],
  theme: "paper",
  version: 1,
};

/**
 * Long-form chapter reader.
 *
 * Behaviour:
 *  - Persists scroll progress (0..1) per chapter to localStorage.
 *  - Bookmark toggle, theme toggle (paper/ink), audio-mode placeholder.
 *  - Highlight infrastructure: a small button on each block toggles a saved
 *    highlight. UI affordances are intentionally subtle.
 */
export function BookReader({ chapter, prev, next }: Props) {
  const [state, setState] = useState<ReadingState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setState(loadReadingState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ReadingState) => {
    setState(next);
    saveReadingState(next);
  }, []);

  // Track read progress as the chapter scrolls past the viewport.
  useEffect(() => {
    function update() {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height - viewport;
      const passed = -rect.top;
      const ratio = total <= 0 ? 1 : Math.max(0, Math.min(1, passed / total));
      setState((current) => {
        const existing = current.progress[chapter.id] ?? 0;
        // Only persist when meaningful jumps happen — keeps writes calm.
        if (Math.abs(existing - ratio) < 0.02) return current;
        const next = setProgress(current, chapter.id, ratio);
        saveReadingState(next);
        return next;
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [chapter.id]);

  const isInk = state.theme === "ink";
  const isBookmarked = state.bookmarks.includes(chapter.id);
  const progress = state.progress[chapter.id] ?? 0;

  const highlightedSet = useMemo(() => {
    return new Set(
      state.highlights
        .filter((h) => h.chapterId === chapter.id)
        .map((h) => h.blockIndex),
    );
  }, [state.highlights, chapter.id]);

  return (
    <div
      className={cn(
        "transition-colors duration-500",
        isInk ? "bg-ink text-paper" : "bg-paper text-ink",
      )}
    >
      {/* Reading progress bar */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-[2px]",
          isInk ? "bg-paper/10" : "bg-line/60",
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            "h-full transition-all duration-150",
            isInk ? "bg-paper/70" : "bg-ink/70",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Sticky reader chrome */}
      <header
        className={cn(
          "sticky top-0 z-30 border-b backdrop-blur-md transition-colors",
          isInk
            ? "border-paper/10 bg-ink/80 text-paper"
            : "border-line/60 bg-paper/80 text-ink",
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-4 md:px-10">
          <Link
            href="/cubes/manifesto/book"
            className={cn(
              "text-xs font-light uppercase tracking-[0.22em] transition-colors",
              isInk ? "text-paper/70 hover:text-paper" : "text-ink-mute hover:text-ink",
            )}
          >
            ← book
          </Link>
          <div className="flex items-center gap-2">
            <ChromeButton
              ariaLabel={isBookmarked ? "Remove bookmark" : "Bookmark"}
              active={isBookmarked}
              ink={isInk}
              onClick={() => persist(toggleBookmark(state, chapter.id))}
              disabled={!hydrated}
            >
              ✦
            </ChromeButton>
            <ChromeButton
              ariaLabel={
                chapter.audioAvailable
                  ? "Audio version (coming soon)"
                  : "Audio not available"
              }
              active={false}
              ink={isInk}
              onClick={() => {
                // Audio mode is intentionally a placeholder for now.
              }}
              disabled
              title={
                chapter.audioAvailable
                  ? "Audio coming soon"
                  : "Audio not available for this chapter"
              }
            >
              ♪
            </ChromeButton>
            <ChromeButton
              ariaLabel="Toggle reading theme"
              active={isInk}
              ink={isInk}
              onClick={() =>
                persist(setTheme(state, isInk ? "paper" : "ink"))
              }
              disabled={!hydrated}
            >
              {isInk ? "○" : "●"}
            </ChromeButton>
          </div>
        </div>
      </header>

      <article
        ref={articleRef}
        className="mx-auto max-w-[64ch] px-6 pb-32 pt-20 md:px-10 md:pt-32"
      >
        <p
          className={cn(
            "text-[11px] font-light uppercase tracking-[0.3em]",
            isInk ? "text-paper/60" : "text-ink-mute",
          )}
        >
          chapter {chapter.number} · {chapter.readingMinutes} min
        </p>
        <h1
          className={cn(
            "mt-6 font-serif text-4xl font-light leading-[1.1] tracking-[-0.02em] md:text-6xl",
            isInk ? "text-paper" : "text-ink",
          )}
        >
          {chapter.title}
        </h1>
        <p
          className={cn(
            "mt-4 font-serif text-lg font-light italic",
            isInk ? "text-paper/70" : "text-ink-soft",
          )}
        >
          {chapter.subtitle}
        </p>

        <div
          aria-hidden="true"
          className={cn(
            "my-14 h-px w-16",
            isInk ? "bg-paper/20" : "bg-line",
          )}
        />

        <div
          className={cn(
            "font-serif text-[18px] font-light leading-[1.8] md:text-[19px]",
            isInk ? "text-paper/90" : "text-ink",
          )}
        >
          {chapter.blocks.map((block, i) => (
            <HighlightableBlock
              key={i}
              block={block}
              highlighted={highlightedSet.has(i)}
              ink={isInk}
              onToggle={() => persist(toggleHighlight(state, chapter.id, i))}
              disabled={!hydrated}
            />
          ))}
        </div>

        {/* Chapter navigation */}
        <nav
          className={cn(
            "mt-24 flex items-center justify-between gap-6 border-t pt-8",
            isInk ? "border-paper/15" : "border-line",
          )}
        >
          {prev ? (
            <Link
              href={`/cubes/manifesto/book/${prev.id}`}
              className={cn(
                "max-w-[40%] text-left",
                isInk ? "text-paper/80 hover:text-paper" : "text-ink-soft hover:text-ink",
              )}
            >
              <span className="block text-[11px] font-light uppercase tracking-[0.22em]">
                previous
              </span>
              <span className="mt-2 block font-serif text-lg font-light leading-snug">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/cubes/manifesto/book/${next.id}`}
              className={cn(
                "max-w-[40%] text-right",
                isInk ? "text-paper/80 hover:text-paper" : "text-ink-soft hover:text-ink",
              )}
            >
              <span className="block text-[11px] font-light uppercase tracking-[0.22em]">
                next
              </span>
              <span className="mt-2 block font-serif text-lg font-light leading-snug">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/cubes/manifesto"
              className={cn(
                "text-right text-[11px] font-light uppercase tracking-[0.22em]",
                isInk ? "text-paper/60 hover:text-paper" : "text-ink-mute hover:text-ink",
              )}
            >
              return to the manifesto →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}

function ChromeButton({
  children,
  active,
  ink,
  ariaLabel,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  ink: boolean;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-light transition-colors duration-300",
        ink
          ? active
            ? "border-paper bg-paper text-ink"
            : "border-paper/20 text-paper/80 hover:border-paper/60 hover:text-paper"
          : active
            ? "border-ink bg-ink text-paper"
            : "border-line text-ink-soft hover:border-ink/40 hover:text-ink",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}

function HighlightableBlock({
  block,
  highlighted,
  ink,
  onToggle,
  disabled,
}: {
  block: ManifestoBlock;
  highlighted: boolean;
  ink: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const supportsHighlight =
    block.kind === "paragraph" ||
    block.kind === "lead" ||
    block.kind === "pullquote";

  if (!supportsHighlight) {
    return <Block block={block} />;
  }

  return (
    <div
      className={cn(
        "group relative -mx-3 rounded-md px-3 transition-colors duration-300",
        highlighted &&
          (ink ? "bg-paper/[0.06]" : "bg-ink/[0.04]"),
      )}
    >
      <Block block={block} />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={highlighted ? "Remove highlight" : "Save highlight"}
        className={cn(
          "absolute -left-9 top-1 hidden h-7 w-7 items-center justify-center rounded-full border text-xs font-light transition-all md:inline-flex",
          highlighted
            ? ink
              ? "border-paper bg-paper text-ink opacity-100"
              : "border-ink bg-ink text-paper opacity-100"
            : ink
              ? "border-paper/20 text-paper/40 opacity-0 group-hover:opacity-100 hover:border-paper/60 hover:text-paper"
              : "border-line text-ink-mute opacity-0 group-hover:opacity-100 hover:border-ink/40 hover:text-ink",
          disabled && "cursor-not-allowed",
        )}
      >
        <span aria-hidden="true">✎</span>
      </button>
    </div>
  );
}
