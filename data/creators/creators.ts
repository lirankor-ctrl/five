import type { Creator } from "@/lib/creators/types";

/**
 * Mock creators. Real-feeling people, deliberately not influencer-shaped:
 * a violinist, a retired teacher, a clinical psychologist, a young father,
 * a researcher. The catalog tells the story that anyone with quiet
 * knowledge can be a creator here.
 */
export const creators: Creator[] = [
  {
    id: "c-aria-veld",
    name: "Aria Veld",
    handle: "ariaveld",
    kind: "musician",
    oneLine: "Violinist. Builds five-minute practice drills for people who haven’t touched their instrument in months.",
    philosophy:
      "I do not believe in the perfect hour-long practice. I believe in coming back, even tired, even briefly. My sessions are made for the third person you've been this year, not the perfect one.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 220).toISOString(),
  },
  {
    id: "c-josephine-park",
    name: "Josephine Park",
    handle: "josephine",
    kind: "psychologist",
    oneLine: "Clinical psychologist. Writes calm reflection prompts and short anxiety resets.",
    philosophy:
      "The work I find most useful with my clients is also the smallest. A single grounded breath. One honest sentence about today. I build sessions in that spirit — not therapy, just quieter attention.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
  },
  {
    id: "c-marc-letellier",
    name: "Marc Letellier",
    handle: "marc",
    kind: "teacher",
    oneLine: "Former secondary-school history teacher. Now: five-minute history clips for curious adults.",
    philosophy:
      "History at school is taught in long arcs. History in life happens in single moments. I write sessions for the second kind — a small story, a real person, a clear ending.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 130).toISOString(),
  },
  {
    id: "c-ines-okafor",
    name: "Ines Okafor",
    handle: "ines",
    kind: "coach",
    oneLine: "Movement coach. Designs five-minute mobility resets for people who sit too much.",
    philosophy:
      "I do not want anyone to start a fitness journey. I want them to put their hand on the floor today and breathe for a minute. That is enough to begin.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 95).toISOString(),
  },
  {
    id: "c-david-shen",
    name: "David Shen",
    handle: "davidshen",
    kind: "parent",
    oneLine: "Father of two. Five-minute curiosity sessions to do with a child.",
    philosophy:
      "Parents do not need another guilt-trip program. They need a single question to ask their child at dinner that isn’t about school. I write those.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
  },
  {
    id: "c-leyla-amari",
    name: "Leyla Amari",
    handle: "leyla",
    kind: "thoughtful-human",
    oneLine: "Architect by day. Writes thought drops about attention, design, and ordinary things.",
    philosophy:
      "I do not have a brand. I have a notebook and a habit of looking at objects too long. The sessions I publish are sentences I would underline in a book.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58).toISOString(),
  },
  {
    id: "c-noor-ben-amor",
    name: "Noor Ben Amor",
    handle: "noor",
    kind: "researcher",
    oneLine: "Cognitive science researcher. Translates one paper a week into five-minute reads.",
    philosophy:
      "Most science writing is too long for life. I take one peer-reviewed result and write it the way I would explain it to a curious friend at dinner — five minutes, honestly.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
  },
  {
    id: "c-hugo-bauer",
    name: "Hugo Bauer",
    handle: "hugo",
    kind: "musician",
    oneLine: "Jazz pianist. Five-minute ear-training drills for people who don’t consider themselves musical.",
    philosophy:
      "Music is not a talent you have. It is attention you give. I build sessions that prove this to people who don’t believe me yet.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: "c-sara-engebretsen",
    name: "Sara Engebretsen",
    handle: "sara",
    kind: "retiree",
    oneLine: "Retired civil servant. Writes calm five-minute language drills for people learning Swedish.",
    philosophy:
      "I learned Swedish in my fifties, badly, over a long time. The best sessions I ever did were the smallest. I make the ones I wish I had then.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: "c-tomas-vasquez",
    name: "Tomás Vásquez",
    handle: "tomas",
    kind: "coach",
    oneLine: "Communication coach. Designs short challenges for managers — recognition, listening, hard conversations.",
    philosophy:
      "Managers do not need a workshop. They need one specific sentence to say to one specific person today. My sessions are built around exactly that unit.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
];

export function getCreator(id: string) {
  return creators.find((c) => c.id === id);
}
