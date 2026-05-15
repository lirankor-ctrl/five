import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { familyWorlds } from "@/data/family/worlds";

export const metadata = {
  title: "five family — five minutes back to each other",
  description:
    "Not more family time. More family presence. five family is a soft system for the small repeated moments that quietly make a home feel like home.",
};

const STATEMENTS = [
  "The family happens in the little drops.",
  "Not more family time. More family presence.",
  "Five minutes. One family. A little more together.",
  "The family does not need more pressure. It needs more moments.",
];

export default function FamilyLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-hearth-700">
            five family
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            Five minutes
            <br />
            back to each other.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[46ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            You do not need to reinvent your family. You do not need to be a perfect parent. You only need one small Five that brings you back to each other.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/family/home" variant="primary" size="lg">
              Begin the first five
            </LinkButton>
            <LinkButton href="/cubes/family/journal" variant="secondary" size="lg">
              See the journal
            </LinkButton>
          </div>
        </header>

        {/* Statements */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-28">
          <p className="text-center text-[11px] font-light uppercase tracking-[0.3em] text-hearth-700">
            a few quiet ideas
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {STATEMENTS.map((s) => (
              <li
                key={s}
                className="rounded-3xl border border-hearth-200 bg-hearth-50 p-7 text-[17px] font-light italic leading-relaxed text-ink-soft md:text-lg"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* What it is / isn't */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-hearth-700">
            what this is, and isn’t
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            Not parenting pressure. Connection.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Family life is overloaded — work, school, screens, logistics, exhaustion. People live in the same home but don&rsquo;t always meet each other. We are not adding another task to that load.
            </p>
            <p>
              five family is a soft layer underneath the day. A short conversation. A bedtime story. A walk around the block. One uninterrupted moment with a partner. A small five that, repeated, quietly makes the home feel like home again.
            </p>
          </div>
        </section>

        {/* Eight worlds */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-hearth-700">
              eight small worlds
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Eight ways to come back to each other.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {familyWorlds.map((w) => (
              <Card key={w.id} className="bg-surface">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-hearth-200 bg-hearth-50 text-base font-light text-hearth-700"
                >
                  {w.glyph}
                </span>
                <h3 className="mt-4 text-lg font-light tracking-brand text-ink">
                  {w.label}
                </h3>
                <p className="mt-2 text-[14.5px] font-light leading-relaxed text-ink-soft">
                  {w.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Promise */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-hearth-200 bg-hearth-50 p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-hearth-700">
            our promise to you
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            We will not turn your family into a dashboard.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            No KPIs for your children. No streaks that make you feel like you failed at parenting on Wednesday. No gamification of love. Five family is a calm reminder, not a measurement system. If a week goes by without a single five — that is also a week. Begin again, softly.
          </p>
        </section>

        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            Five minutes a day that help the home feel like home again.
          </p>
          <LinkButton href="/cubes/family/home" variant="primary" size="md">
            Begin →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
