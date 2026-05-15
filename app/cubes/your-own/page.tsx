import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cubeTemplates } from "@/data/your-own/templates";

export const metadata = {
  title: "five your own cube — the system evolves around the human being",
  description:
    "The meta cube. Design your own momentum system — name, purpose, action logic, success philosophy — and share it if you want.",
};

const STATEMENTS = [
  "My way of growing does not need to already exist.",
  "Maybe your structure does not exist yet. Build it.",
  "The system evolves around the human being.",
  "Stop being only a user. Become a co-creator.",
];

export default function YourOwnLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five · your own cube
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            The system evolves
            <br />
            around the human being.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Most platforms force you into their categories. five does the opposite. If the cube you want does not exist yet — build it. Your rituals, your terminology, your success philosophy.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/your-own/build" variant="primary" size="lg">
              Build your cube
            </LinkButton>
            <LinkButton href="/cubes/your-own/marketplace" variant="secondary" size="lg">
              Browse the marketplace
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

        {/* The thesis */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            why this exists
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            Humans are too dynamic to be fully contained inside predefined systems.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              The other cubes inside five — solo, manifesto, content, family, organizations, creators, project, community, live event — were designed by people. Real, thoughtful, careful people. But they are still people. And the structures we built will not fit everyone.
            </p>
            <p>
              Some users will invent rituals, momentum models, emotional frameworks and micro-philosophies we never imagined. This cube is the door we hold open for them.
            </p>
            <p>
              You stop being only a user. You become a co-creator of five.
            </p>
          </div>
        </section>

        {/* Templates preview */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              eight starting points
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Begin from a template. Or from nothing.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14.5px] font-light leading-relaxed text-ink-soft">
              Each template is a starting shape, not a constraint. Edit freely. Throw most of it away.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cubeTemplates.map((t) => (
              <Card key={t.id} className="bg-surface">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft"
                  >
                    {t.glyph}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      template
                    </p>
                    <h3 className="mt-1 text-lg font-light tracking-brand text-ink">
                      {t.label}
                    </h3>
                    <p className="mt-2 text-[13.5px] font-light italic leading-relaxed text-ink-soft">
                      {t.oneLine}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Evolution */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            evolution into an official cube
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            The best community cubes become official five cubes.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            When a community-built cube shows emotional resonance, real retention, originality and meaningful momentum, five may feature it, verify the creator, and evolve it into an official cube — recognised across the platform.
          </p>
        </section>

        {/* The promise */}
        <section className="mx-auto mt-24 max-w-3xl">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the design promise
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Most systems ask humans to adapt to the structure.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            five your own cube allows the structure to evolve around the human being.
          </p>
        </section>

        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            Build something alive that reflects you.
          </p>
          <LinkButton href="/cubes/your-own/build" variant="primary" size="md">
            Open the builder →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
