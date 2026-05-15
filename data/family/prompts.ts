import type { FamilyFiveWorld } from "@/lib/family/types";

/**
 * Suggestion prompts per world.
 *
 * Each prompt is a real five-minute idea, not corporate filler. Tone is
 * warm and low-pressure. The shape (id, label, hint) lets a future CMS
 * replace these without touching components.
 */
export type FamilyPrompt = {
  id: string;
  label: string;
  hint?: string;
};

export const familyPrompts: Record<FamilyFiveWorld, FamilyPrompt[]> = {
  talk: [
    { id: "best-moment", label: "What was your best moment today?" },
    { id: "hard-thing", label: "Was anything hard today?" },
    { id: "laugh", label: "What made you laugh today?" },
    { id: "learn", label: "What did you learn today?" },
    {
      id: "what-together",
      label: "What would you like us to do together this week?",
    },
    {
      id: "one-small-thing",
      label: "What is one small thing I can do for you?",
    },
    { id: "secret-thanks", label: "Who would you like to thank today?" },
    { id: "feeling-color", label: "If today were a colour, what colour was it?" },
  ],
  read: [
    {
      id: "bedtime-story",
      label: "Read one short story together at bedtime.",
      hint: "No need to finish it in one go.",
    },
    {
      id: "one-paragraph",
      label: "Read one paragraph aloud from any book in the house.",
    },
    {
      id: "poem",
      label: "Read one poem together.",
      hint: "Short, even silly, even one we don’t understand.",
    },
    {
      id: "five-pages",
      label: "Read five quiet pages side-by-side.",
      hint: "Two different books is fine.",
    },
    {
      id: "favourite-page",
      label: "Each share one favourite page from anything you’re reading.",
    },
  ],
  play: [
    {
      id: "twenty-questions",
      label: "Play twenty questions — one round.",
    },
    { id: "rhyme-game", label: "A quick rhyme game until five minutes are up." },
    {
      id: "i-spy",
      label: "Play I-spy from the kitchen table.",
    },
    {
      id: "would-you-rather",
      label: "Three rounds of “would you rather…”",
    },
    {
      id: "card-game",
      label: "One round of a card game. Loser tells one funny story.",
    },
    {
      id: "story-line",
      label: "Build a story together, one sentence each.",
    },
  ],
  learn: [
    {
      id: "one-word",
      label: "Teach one new English (or any language) word, in a sentence.",
    },
    {
      id: "science-fact",
      label: "Share one short science fact at the table.",
    },
    {
      id: "country",
      label: "Look at a map. Pick one country. Five minutes of it.",
    },
    {
      id: "history-moment",
      label: "Tell each other about one historical moment in five minutes.",
    },
    {
      id: "nature-fact",
      label: "Share one small thing about an animal, a tree, or the sky.",
    },
    { id: "body-thing", label: "Learn one thing about how the body works." },
    { id: "money-idea", label: "Talk about one small idea about money." },
  ],
  move: [
    {
      id: "short-walk",
      label: "A short walk around the block, together.",
      hint: "Even five minutes counts.",
    },
    {
      id: "stretch",
      label: "Three stretches each, before bed.",
    },
    {
      id: "breath",
      label: "Three slow breaths, side by side, in the kitchen.",
    },
    {
      id: "dance",
      label: "One song, dance any way you want.",
    },
    {
      id: "ball-game",
      label: "Five minutes of catch in the garden or hallway.",
    },
    {
      id: "kitchen-yoga",
      label: "Two yoga shapes each, in pajamas.",
    },
  ],
  values: [
    { id: "courage", label: "Talk about courage. When did one of you do something hard today?" },
    { id: "kindness", label: "Name one kind thing you saw someone do today." },
    {
      id: "patience",
      label: "When were you patient today, even though it was hard?",
    },
    {
      id: "generosity",
      label: "What is one small thing we could give someone this week?",
    },
    {
      id: "responsibility",
      label: "Share one thing each of us is taking care of right now.",
    },
    {
      id: "persistence",
      label: "Tell each other about something you kept doing, even when it was slow.",
    },
    {
      id: "curiosity",
      label: "What question are you carrying around at the moment?",
    },
    {
      id: "respect",
      label: "When did someone treat you with real respect today?",
    },
  ],
  couple: [
    {
      id: "appreciation",
      label: "Tell me one thing you appreciated about me this week.",
    },
    {
      id: "uninterrupted",
      label: "Five uninterrupted minutes. Phones in another room.",
    },
    {
      id: "meaningful-question",
      label: "Ask me one question you have been carrying.",
    },
    {
      id: "checkin",
      label: "How is your inside-life this week?",
      hint: "Not the calendar. The other one.",
    },
    {
      id: "future-five",
      label: "What is one small thing we could do together this week?",
    },
    {
      id: "weeks-best",
      label: "Tell me the best moment of your week, in two sentences.",
    },
  ],
  school: [
    {
      id: "interesting",
      label: "What was interesting today?",
      hint: "Notice we did not say “what did you do”.",
    },
    { id: "boring", label: "Anything boring today?" },
    {
      id: "who-talked",
      label: "Who did you talk to today that was nice?",
    },
    {
      id: "what-difficult",
      label: "Was anything difficult?",
    },
    {
      id: "want-me-to-know",
      label: "Anything you want me to know?",
    },
    {
      id: "small-win",
      label: "What was one small win today?",
    },
  ],
};
