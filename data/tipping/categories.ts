import type { SuggestedCategory } from "@/lib/tipping/types";

/**
 * Suggested patterns shown during onboarding.
 *
 * Copy is intentionally normalising — not clinical, not euphemistic.
 * Each suggestion includes a sensible default boundary so a user can
 * accept the suggestion and move on without configuring details.
 */
export const suggestedCategories: SuggestedCategory[] = [
  {
    id: "tiktok",
    label: "Endless TikTok / short video",
    note: "Millions of people set a soft cap here.",
    defaultBoundary: { kind: "daily-cap", value: 20, unit: "minutes" },
  },
  {
    id: "doomscrolling",
    label: "Doomscrolling the news / feed",
    note: "Not about quitting. About not drowning.",
    defaultBoundary: { kind: "daily-cap", value: 15, unit: "minutes" },
  },
  {
    id: "instagram",
    label: "Instagram / X / Reddit spirals",
    note: "A soft window works better than total off.",
    defaultBoundary: { kind: "daily-cap", value: 30, unit: "minutes" },
  },
  {
    id: "gaming",
    label: "Gaming too long",
    note: "A cap is kinder than an abstinence rule.",
    defaultBoundary: { kind: "daily-cap", value: 90, unit: "minutes" },
  },
  {
    id: "late-screens",
    label: "Late-night screens",
    note: "Most people quietly want this back.",
    defaultBoundary: { kind: "time-window", notAfter: 23 },
  },
  {
    id: "junk-food",
    label: "Junk food",
    note: "Frequency, not perfection.",
    defaultBoundary: { kind: "weekly-cap", value: 2, unit: "times" },
  },
  {
    id: "emotional-eating",
    label: "Emotional eating",
    note: "Awareness first. Reduction second.",
    defaultBoundary: { kind: "weekly-cap", value: 2, unit: "times" },
  },
  {
    id: "alcohol",
    label: "Drinking more than you want",
    note: "A boundary you set, not one imposed.",
    defaultBoundary: { kind: "weekly-cap", value: 4, unit: "times" },
  },
  {
    id: "smoking",
    label: "Smoking / vaping",
    note: "Reduction is real progress.",
    defaultBoundary: { kind: "daily-cap", value: 5, unit: "times" },
  },
  {
    id: "gambling",
    label: "Gambling",
    note: "A cap you choose, not one chosen for you.",
    defaultBoundary: { kind: "weekly-cap", value: 50, unit: "currency" },
  },
  {
    id: "porn",
    label: "Pornography",
    note: "No shame here. Just a chosen rhythm.",
    defaultBoundary: { kind: "weekly-cap", value: 2, unit: "times" },
  },
  {
    id: "online-shopping",
    label: "Impulsive online shopping",
    note: "A monthly cap can be enough.",
    defaultBoundary: { kind: "weekly-cap", value: 50, unit: "currency" },
  },
  {
    id: "news-checking",
    label: "Constant news checking",
    note: "The world will still be there at noon.",
    defaultBoundary: { kind: "daily-cap", value: 3, unit: "times" },
  },
  {
    id: "procrastination",
    label: "Procrastination",
    note: "You are not lazy. The loop is loud.",
    defaultBoundary: { kind: "custom", description: "Notice the pattern" },
  },
  {
    id: "rage",
    label: "Rage reactions",
    note: "A pause is also a win.",
    defaultBoundary: { kind: "weekly-cap", value: 0, unit: "times" },
  },
  {
    id: "toxic-loop",
    label: "Toxic relationship loops",
    note: "Boundaries are not punishment.",
    defaultBoundary: { kind: "custom", description: "Notice the pattern" },
  },
  {
    id: "overworking",
    label: "Overworking",
    note: "Yes — this is one of them.",
    defaultBoundary: { kind: "time-window", notAfter: 19 },
  },
  {
    id: "avoid-conversation",
    label: "Avoiding difficult conversations",
    note: "Naming it is half the work.",
    defaultBoundary: { kind: "weekly-cap", value: 0, unit: "times" },
  },
  {
    id: "sleep-sabotage",
    label: "Sleep sabotage",
    note: "The body keeps a quiet record.",
    defaultBoundary: { kind: "time-window", notAfter: 23 },
  },
  {
    id: "phone-addiction",
    label: "Phone addiction in general",
    note: "Not anti-phone. Just less of it.",
    defaultBoundary: { kind: "daily-cap", value: 90, unit: "minutes" },
  },
  {
    id: "youtube",
    label: "YouTube spirals",
    note: "One video, then home.",
    defaultBoundary: { kind: "daily-cap", value: 30, unit: "minutes" },
  },
  {
    id: "impulsive-spending",
    label: "Impulsive spending",
    note: "A pause before purchase is a win.",
    defaultBoundary: { kind: "weekly-cap", value: 50, unit: "currency" },
  },
  {
    id: "email-anxiety",
    label: "Stress-checking work email",
    note: "The inbox is not the day.",
    defaultBoundary: { kind: "time-window", notAfter: 19 },
  },
];

export function getCategory(id: string): SuggestedCategory | undefined {
  return suggestedCategories.find((c) => c.id === id);
}
