import type { LiveEvent } from "@/lib/live/types";

/**
 * ~20 seeded live events distributed across the 7 categories and a
 * deliberate spread of times-of-day, so any visit to /discover has
 * both "live now" and "starting soon" candidates.
 *
 * Recurrence is computed against the user's local clock — `nextStartsAt`
 * is derived from `recurrence` at render time (see lib/live/match.ts).
 */
export const liveEvents: LiveEvent[] = [
  // ─── Growth ─────────────────────────────────────────────────────
  {
    id: "e-morning-meditation",
    name: "Five Morning Meditation",
    hostId: "h-ana",
    category: "growth",
    description:
      "A silent five-minute meditation, every weekday morning. Bell, breath, bell. No talking.",
    hook: "Bell. Five minutes. Bell.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekday", hour: 7, minute: 30 },
    community: {
      daysActive: 142,
      totalCompletions: 2174,
      weeklyCompletions: 96,
      uniqueParticipants: 312,
    },
  },
  {
    id: "e-evening-reflection",
    name: "Five Evening Reflection",
    hostId: "h-josephine",
    category: "growth",
    description:
      "Three sentences, three minutes of silence, two minutes of typed reflection. Closes the day kindly.",
    hook: "Three sentences. Two minutes of quiet.",
    durationMinutes: 5,
    interaction: "check-in",
    cameraMode: "text-only",
    access: "public",
    language: "en",
    recurrence: { cadence: "daily", hour: 21, minute: 30 },
    community: {
      daysActive: 88,
      totalCompletions: 1244,
      weeklyCompletions: 58,
      uniqueParticipants: 187,
    },
  },
  {
    id: "e-gratitude-short",
    name: "Five Gratitude",
    hostId: "h-josephine",
    category: "growth",
    description:
      "Five minutes of writing one specific thank-you to one specific person. Each Sunday.",
    hook: "One specific thank-you. One specific person.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 0, hour: 19, minute: 0 },
    community: {
      daysActive: 56,
      totalCompletions: 312,
      weeklyCompletions: 24,
      uniqueParticipants: 71,
    },
  },

  // ─── Content ───────────────────────────────────────────────────
  {
    id: "e-hemingway-thursdays",
    name: "Five Hemingway Thursdays",
    hostId: "h-marc",
    category: "content",
    description:
      "Read one chapter of The Old Man and the Sea together every Thursday evening. No discussion required.",
    hook: "Same page. Different homes.",
    durationMinutes: 15,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 4, hour: 20, minute: 0 },
    community: {
      daysActive: 41,
      totalCompletions: 187,
      weeklyCompletions: 22,
      uniqueParticipants: 38,
    },
  },
  {
    id: "e-ted-shorts",
    name: "Five TED Shorts",
    hostId: "h-noor",
    category: "content",
    description:
      "One short TED-style clip, watched together. Three minutes of typed reflection at the end.",
    hook: "One short talk. Three minutes of quiet writing.",
    durationMinutes: 10,
    interaction: "guided",
    cameraMode: "text-only",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 2, hour: 12, minute: 15 },
    community: {
      daysActive: 28,
      totalCompletions: 96,
      weeklyCompletions: 18,
      uniqueParticipants: 41,
    },
  },
  {
    id: "e-podcast-pause",
    name: "Five Podcast Pause",
    hostId: "h-noor",
    category: "content",
    description:
      "Pick a single five-minute podcast excerpt, listen at the same time. Quiet ending.",
    hook: "Same ears, same five minutes.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "daily", hour: 8, minute: 15 },
    community: {
      daysActive: 31,
      totalCompletions: 421,
      weeklyCompletions: 34,
      uniqueParticipants: 84,
    },
  },

  // ─── Fitness ───────────────────────────────────────────────────
  {
    id: "e-stretch-break",
    name: "Five Stretch Break",
    hostId: "h-ana",
    category: "fitness",
    description:
      "A short follow-along stretch sequence for desk humans. Three times a week at midday.",
    hook: "Stand up. Open the hips. Sit down kinder.",
    durationMinutes: 5,
    interaction: "guided",
    cameraMode: "guided-audio",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekday", hour: 13, minute: 0 },
    community: {
      daysActive: 97,
      totalCompletions: 1820,
      weeklyCompletions: 71,
      uniqueParticipants: 246,
    },
  },
  {
    id: "e-five-pushups",
    name: "Five Pushups",
    hostId: "h-ana",
    category: "fitness",
    description:
      "Shared timer. Five minutes. Do what you can, rest when you need. That counts too.",
    hook: "Shared timer. Whatever you can do, counts.",
    durationMinutes: 5,
    interaction: "momentum-sprint",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekday", hour: 18, minute: 0 },
    community: {
      daysActive: 64,
      totalCompletions: 940,
      weeklyCompletions: 52,
      uniqueParticipants: 138,
    },
  },
  {
    id: "e-walk-after-work",
    name: "Five Walk After Work",
    hostId: "h-ana",
    category: "fitness",
    description:
      "Step outside, walk somewhere — anywhere — for five quiet minutes. Phones in pockets.",
    hook: "Five minutes outside. Phone in pocket.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekday", hour: 17, minute: 30 },
    community: {
      daysActive: 49,
      totalCompletions: 612,
      weeklyCompletions: 39,
      uniqueParticipants: 95,
    },
  },

  // ─── Creative ──────────────────────────────────────────────────
  {
    id: "e-writing-prompt",
    name: "Five Writing Prompt",
    hostId: "h-leyla",
    category: "creative",
    description:
      "One prompt, five minutes, silence, no sharing. Daily, early morning.",
    hook: "One prompt. No sharing. Just the page.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "daily", hour: 6, minute: 30 },
    community: {
      daysActive: 110,
      totalCompletions: 1389,
      weeklyCompletions: 64,
      uniqueParticipants: 198,
    },
  },
  {
    id: "e-five-sketch",
    name: "Five Sketch",
    hostId: "h-iris",
    category: "creative",
    description:
      "Open a notebook. Draw one small thing in five minutes. Friday lunch.",
    hook: "One small thing. Five minutes.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 5, hour: 12, minute: 30 },
    community: {
      daysActive: 33,
      totalCompletions: 89,
      weeklyCompletions: 17,
      uniqueParticipants: 36,
    },
  },
  {
    id: "e-music-ear",
    name: "Five Slow Listening",
    hostId: "h-hugo",
    category: "creative",
    description:
      "One short piece of music, listened to once, on purpose. Followed by silence.",
    hook: "One piece. One ear, on purpose.",
    durationMinutes: 10,
    interaction: "guided",
    cameraMode: "guided-audio",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 3, hour: 22, minute: 0 },
    community: {
      daysActive: 22,
      totalCompletions: 71,
      weeklyCompletions: 11,
      uniqueParticipants: 24,
    },
  },

  // ─── Project ───────────────────────────────────────────────────
  {
    id: "e-startup-momentum",
    name: "Five Startup Momentum",
    hostId: "h-tomas",
    category: "project",
    description:
      "Silent five-minute focus sprint for people building something. Three sprints back-to-back on Wednesdays.",
    hook: "Three sprints. One screen. No talking.",
    durationMinutes: 15,
    interaction: "momentum-sprint",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 3, hour: 19, minute: 0 },
    community: {
      daysActive: 53,
      totalCompletions: 248,
      weeklyCompletions: 31,
      uniqueParticipants: 47,
    },
  },
  {
    id: "e-five-swedish",
    name: "Five Swedish",
    hostId: "h-sara",
    category: "project",
    description:
      "Three Swedish words a day. Calm. Patient. Begin where you are.",
    hook: "Three words. Five minutes. Patient.",
    durationMinutes: 5,
    interaction: "guided",
    cameraMode: "text-only",
    access: "public",
    language: "en",
    recurrence: { cadence: "daily", hour: 20, minute: 0 },
    community: {
      daysActive: 76,
      totalCompletions: 689,
      weeklyCompletions: 43,
      uniqueParticipants: 102,
    },
  },
  {
    id: "e-book-writing",
    name: "Five Book Writing",
    hostId: "h-leyla",
    category: "project",
    description:
      "A weekly silent fifteen-minute writing session for anyone trying to finish a book.",
    hook: "Fifteen minutes. Your manuscript. Other people writing too.",
    durationMinutes: 15,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 6, hour: 9, minute: 0 },
    community: {
      daysActive: 44,
      totalCompletions: 138,
      weeklyCompletions: 19,
      uniqueParticipants: 32,
    },
  },

  // ─── Family ────────────────────────────────────────────────────
  {
    id: "e-family-science",
    name: "Five Science with Kids",
    hostId: "h-david",
    category: "family",
    description:
      "One small kitchen-table experiment. With the kids. Saturday morning.",
    hook: "One experiment. Five minutes. With the kids.",
    durationMinutes: 10,
    interaction: "guided",
    cameraMode: "guided-audio",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 6, hour: 10, minute: 30 },
    community: {
      daysActive: 38,
      totalCompletions: 142,
      weeklyCompletions: 23,
      uniqueParticipants: 41,
    },
  },
  {
    id: "e-family-reading",
    name: "Five Reading Together",
    hostId: "h-david",
    category: "family",
    description:
      "Five quiet minutes of reading. Parent and child, in the same room. Sunday evenings.",
    hook: "Two books. Same couch.",
    durationMinutes: 5,
    interaction: "silent",
    cameraMode: "no-cameras",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 0, hour: 18, minute: 30 },
    community: {
      daysActive: 47,
      totalCompletions: 184,
      weeklyCompletions: 28,
      uniqueParticipants: 55,
    },
  },

  // ─── Organizational ────────────────────────────────────────────
  {
    id: "e-team-reflection",
    name: "Five Team Reflection",
    hostId: "h-tomas",
    category: "organizational",
    description:
      "End-of-week shared reflection: kept · changed · learned. For teams that don't want a retro.",
    hook: "Kept · changed · learned. Five minutes.",
    durationMinutes: 5,
    interaction: "check-in",
    cameraMode: "text-only",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 5, hour: 16, minute: 30 },
    community: {
      daysActive: 39,
      totalCompletions: 142,
      weeklyCompletions: 21,
      uniqueParticipants: 36,
    },
  },
  {
    id: "e-team-innovation",
    name: "Five Innovation",
    hostId: "h-tomas",
    category: "organizational",
    description:
      "One friction noticed. One small idea. Five minutes. Wednesday mornings.",
    hook: "One friction. One idea. Five minutes.",
    durationMinutes: 5,
    interaction: "check-in",
    cameraMode: "text-only",
    access: "public",
    language: "en",
    recurrence: { cadence: "weekly", dayOfWeek: 3, hour: 9, minute: 30 },
    community: {
      daysActive: 22,
      totalCompletions: 71,
      weeklyCompletions: 14,
      uniqueParticipants: 23,
    },
  },
  {
    id: "e-lost-customer",
    name: "Five Lost Customer",
    hostId: "h-tomas",
    category: "organizational",
    description:
      "Customer-facing teams call one quiet account each. Together, on the same five minutes.",
    hook: "One real call. One real human.",
    durationMinutes: 5,
    interaction: "check-in",
    cameraMode: "text-only",
    access: "limited",
    language: "en",
    recurrence: { cadence: "weekday", hour: 11, minute: 0 },
    community: {
      daysActive: 18,
      totalCompletions: 58,
      weeklyCompletions: 12,
      uniqueParticipants: 17,
    },
  },
];

export function getEvent(id: string) {
  return liveEvents.find((e) => e.id === id);
}
