import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import {
  COMMUNITY_TYPE_HINT,
  COMMUNITY_TYPE_LABEL,
} from "@/lib/community/format";
import type { CommunityType } from "@/lib/community/types";

export const metadata = {
  title: "five community — quietly, with other humans",
  description:
    "Not Facebook groups. Not Discord. Not a feed. A low-friction community for people quietly building small rivers of meaning inside busy lives.",
};

const TYPES: CommunityType[] = [
  "interest",
  "identity",
  "micro-multipotential",
];

const CONTENT_TYPES = [
  {
    label: "Drop Updates",
    body:
      "Tiny life updates. “I read five minutes today.” The platform makes small drops feel meaningful — without making them perform.",
  },
  {
    label: "Momentum Threads",
    body:
      "Conversations about consistency, restarting, balancing many interests. Not how to win — how to keep going.",
  },
  {
    label: "Human Journals",
    body:
      "Minimalist personal journeys. Not “look at me” — the slow honest documentation of returning to something.",
  },
  {
    label: "Curated Paths",
    body:
      "Small, structured journeys written by long-active members. Six weeks of reading. Five mornings of philosophy.",
  },
];

export default function CommunityLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five community
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            Quietly,
            <br />
            with other humans.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Not Facebook groups. Not Discord. Not a feed. A small community space for people quietly building rivers of meaning inside busy lives — drop after drop.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/community/discover" variant="primary" size="lg">
              Find a quiet community
            </LinkButton>
            <LinkButton href="/cubes/community/river" variant="secondary" size="lg">
              See the river
            </LinkButton>
          </div>
        </header>

        {/* Thesis */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            why this exists
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            I am not the only person in the world doing this.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Modern digital life gave us two extremes. Endless feeds — shallow, addictive, performative. Heavy communities — Slack groups, forums, Discords — which demand permanent presence, expertise, and serious participation. Both exhaust.
            </p>
            <p>
              five community is a third shape. A low-friction space with meaningful depth. You do not need to be an expert. You do not need to be permanently active. You only need to keep dripping.
            </p>
            <p>
              The reputation here is not built on followers, virality, or popularity. It is built on consistency, encouragement, and helping other people sustain. Mentors of momentum, not influencers.
            </p>
          </div>
        </section>

        {/* Three community types */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              three kinds of community
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Three quiet ways to belong.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TYPES.map((t) => (
              <Card key={t} className="bg-surface">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {COMMUNITY_TYPE_LABEL[t]}
                </p>
                <h3 className="mt-3 text-lg font-light tracking-brand text-ink md:text-xl">
                  {labelFor(t)}
                </h3>
                <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                  {COMMUNITY_TYPE_HINT[t]}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Four content types */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              what people share here
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Four ways to keep dripping.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CONTENT_TYPES.map((c) => (
              <Card key={c.label} className="bg-surface">
                <h3 className="text-lg font-light tracking-brand text-ink">
                  {c.label}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-soft">
                  {c.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* What we will not become */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            what we will not become
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            No follower counts. No popularity. No flex culture.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Anonymous mode is welcome. Reputation is shaped only by consistency and helping others continue. There is no leaderboard. The point is staying — not winning.
          </p>
        </section>

        {/* River metaphor */}
        <section className="mx-auto mt-20 max-w-3xl">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the river view
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Every community is a tributary.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            We show communities not as a sidebar list, but as tributaries flowing into one larger river of small human momentum. The river view lives at <em>/cubes/community/river</em> — a soft map of where people are flowing.
          </p>
        </section>

        <section className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            You do not need to become extraordinary. You only need to keep moving — together with other humans.
          </p>
          <LinkButton href="/cubes/community/discover" variant="primary" size="md">
            Find a community →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}

function labelFor(t: CommunityType): string {
  switch (t) {
    case "interest":
      return "Around a thing.";
    case "identity":
      return "Around a life-stage.";
    case "micro-multipotential":
      return "For many quiet interests.";
  }
}
