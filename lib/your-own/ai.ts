import type { DraftCube, EmotionalCategory } from "./types";

/**
 * Deterministic, calm "AI" suggestions. They use the draft's own words to
 * propose names, philosophy lines, and momentum-friendly guard rails.
 *
 * The future LLM-backed assistant replaces these functions; the call sites
 * (the four steps of the builder) stay the same.
 */

export function suggestNames(draft: DraftCube): string[] {
  const seed = (draft.purpose?.whatItImproves ?? draft.subtitle ?? "").trim();
  const words = seed
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
    .slice(0, 3);
  const stems = words.length > 0 ? words : ["practice"];
  const out: string[] = [];
  for (const w of stems) {
    out.push(`Five ${capitalize(w)}`);
  }
  out.push("Five Quiet Returns");
  out.push("Five Small Hours");
  return Array.from(new Set(out)).slice(0, 4);
}

export function suggestPhilosophy(draft: DraftCube): string {
  const goal = draft.purpose?.whatItImproves?.trim() ?? "something quietly meaningful to you";
  const feels = draft.purpose?.whatUsersFeel?.trim() ?? "a little calmer";
  return `A small daily practice around ${goal.toLowerCase()}. Five minutes is the unit. The shape is repetition over intensity. Users finish weeks feeling ${feels.toLowerCase()} — not transformed, not performing.`;
}

export function suggestAvoid(category?: EmotionalCategory): string[] {
  switch (category) {
    case "calm":
      return ["streak shame", "spiritual performance", "comparison"];
    case "recovery":
      return ["catch-up framing", "streak anxiety", "scaling up too soon"];
    case "creativity":
      return ["audience pressure", "perfectionism", "comparison"];
    case "learning":
      return ["intensity worship", "guilt about missed days"];
    case "family":
      return ["parenting guilt", "performance"];
    case "play":
      return ["scoring", "winning narratives"];
    case "growth":
    case "identity":
      return ["streak shame", "comparison", "performance"];
    case "connection":
      return ["pressure", "obligation"];
    default:
      return ["streak shame", "comparison", "performance"];
  }
}

export function suggestEncouragement(
  category?: EmotionalCategory,
): string[] {
  switch (category) {
    case "calm":
      return ["plainness", "no goal", "returning"];
    case "recovery":
      return ["softness", "patience", "permission to be slow"];
    case "creativity":
      return ["showing up", "smallness", "honesty"];
    case "learning":
      return ["smallness", "patience"];
    case "family":
      return ["presence", "softness"];
    case "play":
      return ["lightness", "playfulness"];
    case "connection":
      return ["voluntariness", "small contact"];
    case "growth":
    case "identity":
    default:
      return ["consistency over intensity", "smallness"];
  }
}

const STOPWORDS = new Set([
  "the",
  "and",
  "with",
  "without",
  "into",
  "your",
  "this",
  "that",
  "from",
  "have",
  "what",
  "when",
  "where",
  "more",
  "less",
  "very",
  "really",
  "still",
  "some",
  "every",
  "about",
  "into",
  "five",
  "minute",
  "minutes",
]);

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
