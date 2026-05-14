import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { RiverLine } from "@/components/RiverLine";
import { LinkButton } from "@/components/Button";
import { swot } from "@/data/reflection";

export const metadata = {
  title: "Reflection — five",
  description:
    "A respectful mirror. What is working, what to adjust, what is opening, what is in the way.",
};

export default function ReflectionPage() {
  return (
    <Container size="default" className="pb-20 pt-12 md:pt-16">
      <header className="max-w-prose">
        <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          Reflection
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          Let’s notice what is working.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-base">
          This is not a score and not a streak. It is a respectful mirror —
          a calm place to see yourself clearly, in your own words.
        </p>
        <div className="mt-8 w-24">
          <RiverLine />
        </div>
      </header>

      <section className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
        {swot.map((entry) => (
          <Card key={entry.key}>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              {entry.label}
            </p>
            <h2 className="mt-3 text-lg font-light tracking-brand text-ink">
              {entry.prompt}
            </h2>
            <ul className="mt-5 space-y-3">
              {entry.placeholders.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink/30"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-dashed border-line p-4 text-sm font-light text-ink-mute">
              A space for your own words will live here.
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-16 border-t border-line/70 pt-12 text-center">
        <p className="text-balance text-lg font-light leading-relaxed text-ink-soft">
          You created momentum. Even noticing is a drop.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="/home" variant="primary" size="md">
            Return to your river
          </LinkButton>
          <Link
            href="/cubes"
            className="text-sm font-light text-ink-mute transition-colors hover:text-ink"
          >
            Choose a cube →
          </Link>
        </div>
      </section>
    </Container>
  );
}
