import type { HumanJournal } from "@/lib/community/types";

function iso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}
function dropDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/**
 * Public human journals — minimalist, NOT performative. Each one tells a
 * small story in a few entries.
 */
export const journals: HumanJournal[] = [
  {
    id: "j-marc-reading",
    authorId: "u-marc",
    authorName: "Marc L.",
    authorIsMentor: true,
    title: "How I returned to reading",
    oneLine: "Six weeks of five-minute returns, from a hard period of not.",
    communityId: "co-reading",
    entries: [
      {
        id: "j-marc-1",
        body:
          "Day 1. I have not read for pleasure in nine months. I am putting one book on my chair tonight.",
        dropDate: dropDate(42),
        createdAt: iso(42),
      },
      {
        id: "j-marc-2",
        body:
          "Day 7. Five minutes most evenings. Sometimes a paragraph, sometimes a page. Surprised by how much that is.",
        dropDate: dropDate(35),
        createdAt: iso(35),
      },
      {
        id: "j-marc-3",
        body:
          "Day 21. Missed three days last week. Did not catch up. Just returned.",
        dropDate: dropDate(21),
        createdAt: iso(21),
      },
      {
        id: "j-marc-4",
        body:
          "Day 42. I am reading again. I do not know how to mark the moment that happened, but it did.",
        dropDate: dropDate(0),
        createdAt: iso(0),
      },
    ],
  },
  {
    id: "j-josephine-restart",
    authorId: "u-josephine",
    authorName: "Josephine P.",
    authorIsMentor: true,
    title: "After burnout, the smallest possible morning",
    oneLine: "What I built after I had to stop everything.",
    communityId: "co-non-linear",
    entries: [
      {
        id: "j-jos-1",
        body:
          "Week 1. Doctor told me to stop everything. I did. It is harder than it sounds.",
        dropDate: dropDate(70),
        createdAt: iso(70),
      },
      {
        id: "j-jos-2",
        body:
          "Week 5. Started again with one thing. Two glasses of water and one short breath cycle. That was the morning.",
        dropDate: dropDate(35),
        createdAt: iso(35),
      },
      {
        id: "j-jos-3",
        body:
          "Week 9. Added one journaling minute. Did not turn it into therapy. Three sentences, three minutes, close the notebook.",
        dropDate: dropDate(14),
        createdAt: iso(14),
      },
      {
        id: "j-jos-4",
        body:
          "Today. Five minutes of practice fits. That is the whole story so far.",
        dropDate: dropDate(0),
        createdAt: iso(0),
      },
    ],
  },
  {
    id: "j-leyla-30",
    authorId: "u-leyla",
    authorName: "Leyla A.",
    authorIsMentor: true,
    title: "30 days of drawing the same lamp",
    oneLine: "A small project. One subject. Thirty very small days.",
    communityId: "co-drawing",
    entries: [
      {
        id: "j-leyla-1",
        body:
          "Day 1. Same lamp. Three minutes. Mostly looked at the shade for two of them.",
        dropDate: dropDate(30),
        createdAt: iso(30),
      },
      {
        id: "j-leyla-2",
        body:
          "Day 14. Started catching the curve of the base. Cannot un-see it now.",
        dropDate: dropDate(16),
        createdAt: iso(16),
      },
      {
        id: "j-leyla-3",
        body:
          "Day 30. The drawings are not better. My attention is.",
        dropDate: dropDate(0),
        createdAt: iso(0),
      },
    ],
  },
  {
    id: "j-tom-career",
    authorId: "u-tom",
    authorName: "Tom F.",
    title: "Five minutes a day toward a quiet career change",
    oneLine: "Working a full job. Building a quiet second river on the side.",
    communityId: "co-career-change",
    entries: [
      {
        id: "j-tom-1",
        body:
          "Day 1. Opened the course tab. Did not click anything. Closed the laptop. Counted it.",
        dropDate: dropDate(28),
        createdAt: iso(28),
      },
      {
        id: "j-tom-2",
        body:
          "Day 9. Five minutes of an introduction module. Slow. Quiet. Surprised it did not feel like a chore.",
        dropDate: dropDate(19),
        createdAt: iso(19),
      },
      {
        id: "j-tom-3",
        body:
          "Day 24. Wrote a short letter to a person whose work I admire. Did not send. Saving it.",
        dropDate: dropDate(4),
        createdAt: iso(4),
      },
    ],
  },
  {
    id: "j-sara-swedish",
    authorId: "u-sara",
    authorName: "Sara E.",
    authorIsMentor: true,
    title: "Swedish in five (and in fifties)",
    oneLine: "Learning a language calmly, late.",
    communityId: "co-language",
    entries: [
      {
        id: "j-sara-1",
        body:
          "Three words a day. Out loud. To nobody. Day 60-ish.",
        dropDate: dropDate(0),
        createdAt: iso(0),
      },
      {
        id: "j-sara-2",
        body:
          "Missed eleven days during the spring. Did not 'catch up'. Just continued.",
        dropDate: dropDate(20),
        createdAt: iso(20),
      },
    ],
  },
  {
    id: "j-david-bedtime",
    authorId: "u-david",
    authorName: "David S.",
    authorIsMentor: true,
    title: "My 10:15pm five minutes",
    oneLine: "The only quiet I get is after the children sleep.",
    communityId: "co-parents-of-young",
    entries: [
      {
        id: "j-david-1",
        body:
          "Some nights I read for five minutes. Some nights I sit. Both are mine.",
        dropDate: dropDate(0),
        createdAt: iso(0),
      },
    ],
  },
];

export function getJournal(id: string) {
  return journals.find((j) => j.id === id);
}
