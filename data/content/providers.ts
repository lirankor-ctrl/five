import type { ContentProvider } from "@/lib/content/types";

/**
 * Content providers. URLs point to the public domain only; affiliate /
 * partnership fields are intentionally empty until a real deal exists.
 */
export const contentProviders: ContentProvider[] = [
  { id: "duolingo", name: "Duolingo", domain: "duolingo.com" },
  { id: "headspace", name: "Headspace", domain: "headspace.com" },
  { id: "calm", name: "Calm", domain: "calm.com" },
  { id: "spotify", name: "Spotify", domain: "spotify.com" },
  { id: "masterclass", name: "MasterClass", domain: "masterclass.com" },
  { id: "youtube", name: "YouTube", domain: "youtube.com" },
  { id: "ted", name: "TED", domain: "ted.com" },
  { id: "nytimes", name: "NYT", domain: "nytimes.com" },
  { id: "down-dog", name: "Down Dog", domain: "downdogapp.com" },
  { id: "insight-timer", name: "Insight Timer", domain: "insighttimer.com" },
  { id: "yousician", name: "Yousician", domain: "yousician.com" },
  { id: "fender-play", name: "Fender Play", domain: "fender.com" },
  { id: "khan-academy", name: "Khan Academy", domain: "khanacademy.org" },
  { id: "blinkist", name: "Blinkist", domain: "blinkist.com" },
  { id: "longreads", name: "Longreads", domain: "longreads.com" },
  { id: "open-culture", name: "Open Culture", domain: "openculture.com" },
  { id: "fitbod", name: "Fitbod", domain: "fitbod.me" },
  { id: "seven", name: "7 Minute Workout", domain: "wahoofitness.com" },
  { id: "procreate-folio", name: "Procreate", domain: "procreate.com" },
  { id: "morning-pages", name: "Morning Pages", domain: "juliacameronlive.com" },
  { id: "nyt-cooking", name: "NYT Cooking", domain: "cooking.nytimes.com" },
  { id: "stanford-encyclopedia", name: "SEP", domain: "plato.stanford.edu" },
];

export function getProvider(id: string) {
  return contentProviders.find((p) => p.id === id);
}
