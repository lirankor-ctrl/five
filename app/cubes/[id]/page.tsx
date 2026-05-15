import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cubes, getCube } from "@/data/cubes";

type Params = { params: { id: string } };

/** Cubes that have their own static routes — exclude from the placeholder. */
const OWN_ROUTE = new Set(["solo", "manifesto", "tipping-point"]);

export function generateStaticParams() {
  return cubes.filter((c) => !OWN_ROUTE.has(c.id)).map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: Params) {
  const cube = getCube(params.id);
  if (!cube) return { title: "Cube — five" };
  return {
    title: `${cube.name} — five`,
    description: cube.shortDescription,
  };
}

const placeholderSections = [
  {
    title: "Purpose",
    body:
      "Why this cube exists, and what it is not. A short, honest description of the emotional outcome we want a user to feel.",
  },
  {
    title: "Suggested flow",
    body:
      "How a typical five-minute session unfolds — gentle, time-bounded, and shaped around presence rather than completion.",
  },
  {
    title: "Future screens",
    body:
      "Companion screens we plan to build: an opening, a quiet doing space, a small closing acknowledgement.",
  },
  {
    title: "Future AI behavior",
    body:
      "How an assistant might quietly support this cube — never pushing, never gamifying. Offering a single suggestion when asked.",
  },
];

export default function CubeDetailPage({ params }: Params) {
  const cube = getCube(params.id);
  if (!cube) notFound();

  return (
    <Container size="default" className="pb-20 pt-10 md:pt-14">
      <Link
        href="/cubes"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Back to the cube map
      </Link>

      <header className="mt-10 max-w-prose md:mt-14">
        <div className="mb-6 flex items-center gap-4">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line text-xl font-light text-ink-soft"
            aria-hidden="true"
          >
            {cube.accent?.glyph ?? "·"}
          </span>
          <span className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            cube
          </span>
        </div>

        <h1 className="text-balance text-4xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          {cube.name}
        </h1>
        <p className="mt-5 text-balance text-lg font-light leading-relaxed text-ink-soft md:text-xl">
          {cube.emotionalPurpose}
        </p>
        <div className="mt-8 w-24">
          <RiverLine />
        </div>
        <p className="mt-8 max-w-prose text-[15px] leading-relaxed text-ink-soft">
          {cube.description}
        </p>
      </header>

      {/* Suggested actions */}
      <section className="mt-16">
        <p className="mb-4 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          Small drops you might take
        </p>
        <ul className="divide-y divide-line border-y border-line">
          {cube.suggestedActions.map((action) => (
            <li
              key={action}
              className="flex items-center gap-4 py-4 text-[15px] font-light text-ink"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40"
              />
              {action}
            </li>
          ))}
        </ul>
      </section>

      {/* Placeholder sections — to be expanded cube by cube. */}
      <section className="mt-16">
        <p className="mb-6 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          What this cube will become
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {placeholderSections.map((s) => (
            <Card key={s.title}>
              <h3 className="text-base font-light tracking-brand text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {s.body}
              </p>
              <p className="mt-6 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
                In development
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <p className="text-sm font-light text-ink-mute">
          One small drop is enough.
        </p>
        <LinkButton href="/cubes" variant="secondary" size="md">
          Back to the cube map
        </LinkButton>
      </div>
    </Container>
  );
}
