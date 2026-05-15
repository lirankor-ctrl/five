/**
 * Content shapes for the five manifesto cube.
 *
 * These mirror what a future CMS (or Supabase content schema) would expose,
 * so swapping the in-repo data files for a content API is a renaming task,
 * not a rewrite.
 */

export type ManifestoBlock =
  | { kind: "lead"; body: string }
  | { kind: "paragraph"; body: string }
  | { kind: "pullquote"; body: string; attribution?: string }
  | { kind: "section"; eyebrow: string; title: string }
  | { kind: "list"; items: string[] }
  | { kind: "rule" };

export type ManifestoSection = {
  id: string;
  eyebrow: string;
  title: string;
  blocks: ManifestoBlock[];
};

export type BookChapter = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** Whether an audio version is (eventually) available. */
  audioAvailable: boolean;
  blocks: ManifestoBlock[];
};

export type Concept = {
  id: string;
  title: string;
  oneLine: string;
  /** Other concepts this one links to — used for a future concept map. */
  related: string[];
  /** Loosely-typed references — kept as plain strings so they survive a CMS swap. */
  references: Array<{ kind: "ted" | "article" | "book" | "person"; label: string }>;
  blocks: ManifestoBlock[];
};

export type ResearchTheme = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  topics: Array<{ title: string; body: string }>;
};

export type Talk = {
  id: string;
  kind: "talk" | "interview" | "podcast" | "film" | "audio" | "mini-manifesto";
  title: string;
  speaker?: string;
  durationMin: number;
  summary: string;
  status: "in-development" | "coming-soon";
};

/** User-level persisted reading state (localStorage today, Supabase later). */
export type ReadingState = {
  /** Map of chapter id to last scroll progress (0..1). */
  progress: Record<string, number>;
  /** Bookmarked chapter ids. */
  bookmarks: string[];
  /** Saved highlights — block index per chapter. */
  highlights: Array<{ chapterId: string; blockIndex: number; savedAt: string }>;
  /** Reader theme preference. */
  theme: "paper" | "ink";
  version: 1;
};
