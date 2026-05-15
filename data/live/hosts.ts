import type { Host } from "@/lib/live/types";

/**
 * Mock event hosts. Deliberately diverse — not influencers.
 * A retired teacher, a movement coach, a clinical psychologist, parents,
 * a researcher, an artist. Hosts here are the same pattern as creators.
 */
export const hosts: Host[] = [
  { id: "h-ana", name: "Ana Marchetti", handle: "ana", oneLine: "Yoga teacher. Quiet mornings." },
  { id: "h-josephine", name: "Josephine Park", handle: "jp", oneLine: "Clinical psychologist." },
  { id: "h-marc", name: "Marc Letellier", handle: "marc", oneLine: "Retired history teacher." },
  { id: "h-david", name: "David Shen", handle: "david", oneLine: "Father of two." },
  { id: "h-iris", name: "Iris Lindberg", handle: "iris", oneLine: "Designer. Calm Fridays." },
  { id: "h-tomas", name: "Tomás Vásquez", handle: "tomas", oneLine: "Communication coach." },
  { id: "h-noor", name: "Noor Ben Amor", handle: "noor", oneLine: "Cognitive science researcher." },
  { id: "h-hugo", name: "Hugo Bauer", handle: "hugo", oneLine: "Jazz pianist." },
  { id: "h-leyla", name: "Leyla Amari", handle: "leyla", oneLine: "Architect. Slow notebooks." },
  { id: "h-sara", name: "Sara Engebretsen", handle: "sara", oneLine: "Retired civil servant." },
];

export function getHost(id: string): Host | undefined {
  return hosts.find((h) => h.id === id);
}
