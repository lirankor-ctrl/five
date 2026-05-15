import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";

export const metadata = {
  title: "five reflection — the river that gives meaning to the drops",
  description:
    "The master cube. Not a habit tracker. Not analytics. A calm, weekly narrative document about how a person is moving across the platform.",
};

const STATEMENTS = [
  "My life is not random drops. There is a river forming beneath them.",
  "Reflection helps humans understand the shape of their becoming.",
  "Where was there movement? Where was there life?",
  "Not a score. Not a streak. A respectful mirror.",
];

const SECTIONS = [
  {
    label: "Opening reflection",
    body:
      "A short personal paragraph that brings you into reflection — not evaluation.",
  },
  {
    label: "Momentum snapshot",
    body:
      "Not only numbers — interpretation. Where presence emerged, where it softened, what shifted.",
  },
  {
    label: "SWOT reflection engine",
    body:
      "Not a corporate matrix. A dynamic human reading: strengths, friction, opportunities, threats — without shame.",
  },
  {
    label: "Cross-river opportunities",
    body:
      "Where the river may naturally flow next. Solo → live · Content → project · Tipping → reflection.",
  },
  {
    label: "Emotional intelligence",
    body:
      "Alive vs dead consistency. Where something feels real — and where it doesn't, gently.",
  },
  {
    label: "Reflection dialogue",
    body:
      "You can answer back. The report is the start of a conversation, not the end.",
  },
  {
    label: "River timeline",
    body:
      "A long-arc map of where presence has lived in your life across weeks and months.",
  },
];

export default function ReflectionLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five reflection · the master cube
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            The river that gives
            <br />
            meaning to the drops.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Not a habit tracker. Not analytics. A weekly narrative document about how you are moving across the cubes — written calmly, like a letter from someone who is paying attention.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/reflection/report" variant="primary" size="lg">
              Generate this week&rsquo;s report
            </LinkButton>
            <LinkButton href="/cubes/reflection/timeline" variant="secondary" size="lg">
              See the river timeline
            </LinkButton>
          </div>
        </header>

        {/* Statements */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {STATEMENTS.map((s) => (
              <li
                key={s}
                className="rounded-3xl border border-line bg-surface p-7 text-[17px] font-light italic leading-relaxed text-ink-soft md:text-lg"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* The deepest differentiator */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the deepest difference
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            Most systems ask how much you did. five asks what is happening to you inside the movement.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Traditional habit apps treat the dropped streak as a failure. five reflection does the opposite — it observes the human being as a whole. Rhythm. Friction. Curiosity. Decay. Rediscovery. Where momentum is alive.
            </p>
            <p>
              Reflection does not ask <em>were you perfect</em>. It asks <em>where was there life</em>.
            </p>
          </div>
        </section>

        {/* Sections of the report */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              what a report contains
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Not a dashboard. A living document.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <Card key={s.label} className="bg-surface">
                <h3 className="text-lg font-light tracking-brand text-ink">
                  {s.label}
                </h3>
                <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* The closing */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            what reflection is for
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Transform data into insight. Insight into momentum. Momentum into real life.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Generated locally today from your activity across every cube. A future AI-backed generator will deepen the language — but the shape, the calmness, and the respect are the spec.
          </p>
        </section>

        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            Your life is not random drops. There is a river forming beneath them.
          </p>
          <LinkButton href="/cubes/reflection/report" variant="primary" size="md">
            Read this week →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
