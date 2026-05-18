import Link from "next/link";
import { Container } from "@/components/Container";
import { CubeCard } from "@/components/CubeCard";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { getCube } from "@/data/cubes";
import type { Cube } from "@/lib/types";

export const metadata = {
  title: "Home — five",
  description:
    "An introduction to five — small intentional moments between the anchors of your life.",
};

const principles = [
  {
    title: "Five minutes is enough.",
    body: "Not the leftover minutes of your day — the chosen ones. Small drops, taken on purpose.",
  },
  {
    title: "No streaks. No scores.",
    body: "There is nothing to win and nothing to break. Missed days are just days, not failures.",
  },
  {
    title: "A quiet return.",
    body: "Not a productivity system. A way to come back — to yourself, to the people you live with.",
  },
];

const steps = [
  {
    ordinal: "i",
    title: "Choose a cube.",
    body: "Each cube is a doorway into one part of life. Begin where you are most drawn — there is no order.",
  },
  {
    ordinal: "ii",
    title: "Take five.",
    body: "A single intentional drop. A sentence, a breath, a small action — finished in the time it takes to make tea.",
  },
  {
    ordinal: "iii",
    title: "Let it become a river.",
    body: "The drops gather without effort. Reflection is the calm mirror that turns them into a story you can read.",
  },
];

type CubeGroup = {
  eyebrow: string;
  description: string;
  ids: string[];
};

const groups: CubeGroup[] = [
  {
    eyebrow: "For yourself",
    description:
      "The quietest rooms. Solo presence, less chaos, a focused internet.",
    ids: ["solo", "tipping-point", "content"],
  },
  {
    eyebrow: "With the people you share life with",
    description:
      "Family, community, and small live moments — without the noise of a feed.",
    ids: ["family", "community", "live-event"],
  },
  {
    eyebrow: "For what you are making",
    description:
      "For creators, long-dreamed projects, and the cubes you design yourself.",
    ids: ["creators", "project", "your-own"],
  },
];

function cubesFor(ids: string[]): Cube[] {
  return ids
    .map((id) => getCube(id))
    .filter((c): c is Cube => c !== undefined);
}

export default function HomePage() {
  const reflection = getCube("reflection");

  return (
    <div className="relative bg-paper">
      {/* Hero — what is five */}
      <section className="px-6 pb-16 pt-16 text-center md:px-10 md:pb-24 md:pt-24">
        <Container size="narrow">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            an introduction
          </p>
          <h1 className="mt-8 font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:mt-10 md:text-7xl">
            Life happens
            <br />
            in the little drops.
          </h1>
          <div className="mx-auto mt-10 w-20 md:mt-12">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[46ch] text-[15px] font-light leading-relaxed text-ink-soft md:mt-12 md:text-base">
            <span className="lowercase">five</span> is a quiet system of
            five-minute moments. Not productivity — presence. A small space
            for the drops between work, family, and the anchors of life.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/cubes/solo" variant="primary" size="lg">
              Take five
            </LinkButton>
            <LinkButton href="/cubes" variant="secondary" size="lg">
              See the cube map
            </LinkButton>
          </div>
        </Container>
      </section>

      <Divider />

      {/* The methodology */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <Container size="default">
          <header className="mb-12 max-w-prose md:mb-16">
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              the methodology
            </p>
            <h2 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
              Drops, gathering into a river.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-base">
              A single drop is one five-minute moment. The river is the
              rhythm those drops slowly make. The system rests on three
              quiet promises.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-line bg-surface p-7 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/20"
              >
                <span className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
                  {`0${i + 1}`}
                </span>
                <h3 className="mt-5 font-serif text-xl font-light tracking-[-0.01em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      {/* How to use it — the flow */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <Container size="default">
          <header className="mb-12 max-w-prose md:mb-16">
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              the flow
            </p>
            <h2 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
              Three small steps. No app to master.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-base">
              You do not have to use every cube. You do not have to use one
              every day. The flow is the same wherever you begin.
            </p>
          </header>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.ordinal}
                className="rounded-2xl border border-line bg-surface p-7 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/20"
              >
                <p className="font-serif text-3xl font-light italic text-ink-mute">
                  {s.ordinal}
                </p>
                <h3 className="mt-5 font-serif text-xl font-light tracking-[-0.01em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Divider />

      {/* The cubes */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <Container size="wide">
          <header className="mb-12 max-w-prose md:mb-16">
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              the cubes
            </p>
            <h2 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
              Different doorways into the same five minutes.
            </h2>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-soft md:text-base">
              A cube is one corner of life — a place where five minutes can
              mean something specific. Move between them as your life does.
              There is no order; begin where you are drawn.
            </p>
          </header>

          <div className="flex flex-col gap-14 md:gap-20">
            {groups.map((g) => {
              const cubes = cubesFor(g.ids);
              return (
                <div key={g.eyebrow}>
                  <div className="mb-6 flex flex-col gap-1 md:mb-8">
                    <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
                      {g.eyebrow}
                    </p>
                    <p className="max-w-prose text-[15px] leading-relaxed text-ink-soft">
                      {g.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cubes.map((c) => (
                      <CubeCard key={c.id} cube={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center md:mt-20">
            <LinkButton href="/cubes" variant="ghost" size="md">
              See the full cube map →
            </LinkButton>
          </div>
        </Container>
      </section>

      <Divider />

      {/* Reflection — the long view */}
      <section className="bg-surface px-6 py-20 md:px-10 md:py-28">
        <Container size="narrow" className="text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the long view
          </p>
          <h2 className="mt-6 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:mt-8 md:text-4xl">
            Reflection is the river that
            <br className="hidden sm:inline" />
            gives meaning to the drops.
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:mt-8 md:text-base">
            {reflection?.description ??
              "A calm weekly mirror — not analytics, not streaks. Just a quiet letter from someone who is paying attention."}
          </p>
          <div className="mt-10 md:mt-12">
            <LinkButton href="/reflection" variant="secondary" size="md">
              Open reflection
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Closing */}
      <section className="px-6 pb-24 pt-20 text-center md:px-10 md:pb-32 md:pt-24">
        <Container size="narrow">
          <p className="font-serif text-base font-light italic text-ink-mute md:text-lg">
            Take five. Not to do more. To return to what is already yours.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
          >
            Return to the river
          </Link>
        </Container>
      </section>
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px w-12 bg-line"
    />
  );
}
