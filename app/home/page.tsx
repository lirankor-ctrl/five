import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { CubeCard } from "@/components/CubeCard";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { Greeting } from "@/components/Greeting";
import { cubes } from "@/data/cubes";

export default function HomePage() {
  const featured = cubes.slice(0, 3);

  return (
    <Container size="wide" className="pb-20 pt-12 md:pt-16">
      {/* Greeting */}
      <header className="mb-12 md:mb-16">
        <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          <Greeting />
        </p>
        <h1 className="mt-4 max-w-2xl text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          What would you like to reclaim today?
        </h1>
        <div className="mt-8 w-24">
          <RiverLine />
        </div>
      </header>

      {/* Today's five */}
      <Section
        eyebrow="Today’s five"
        title="One small drop is enough."
        description="A gentle suggestion for the next five minutes. There is nothing to win, and nothing to break."
        action={
          <LinkButton href="/cubes/solo" variant="primary" size="md">
            Take five
          </LinkButton>
        }
      >
        <Card className="bg-surface">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-prose">
              <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
                from five solo
              </p>
              <p className="mt-3 text-xl font-light leading-relaxed text-ink md:text-2xl">
                Sit quietly for five minutes. Notice the air, then write one
                honest sentence.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-light text-ink-mute">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40" />
              <span>about 5 minutes</span>
            </div>
          </div>
        </Card>
      </Section>

      {/* Your river */}
      <Section
        eyebrow="Your river"
        title="Small drops, gathering."
        description="Not a streak. Not a score. Just a quiet record of the moments you returned to yourself."
      >
        <Card>
          <div className="flex flex-col gap-6">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Your river is just beginning. The first drop is always the
              quietest.
            </p>
            <div className="flex items-end gap-1.5" aria-hidden="true">
              {/* A soft visual of recent days — placeholder, not gamified. */}
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="block w-2 rounded-full bg-line"
                  style={{ height: `${10 + (i % 4) * 4}px` }}
                />
              ))}
            </div>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              the last fourteen days
            </p>
          </div>
        </Card>
      </Section>

      {/* Choose a cube */}
      <Section
        eyebrow="Choose a cube"
        title="Different drops, different rivers."
        description="Each cube is a different way to spend five intentional minutes. Begin where you are drawn."
        action={
          <LinkButton href="/cubes" variant="ghost" size="sm">
            See all →
          </LinkButton>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((cube) => (
            <CubeCard key={cube.id} cube={cube} />
          ))}
        </div>
      </Section>

      {/* Quick report + Reflection */}
      <Section eyebrow="Pause" title="When you are ready.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card href="/reflection" interactive>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              Quick report
            </p>
            <h3 className="mt-3 text-lg font-light tracking-brand text-ink">
              How did today feel?
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              A short, kind check-in. No scores, no streaks — just a sentence
              for your future self.
            </p>
            <p className="mt-6 text-sm font-light text-ink-mute">
              Open report →
            </p>
          </Card>

          <Card href="/reflection" interactive>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              Reflection
            </p>
            <h3 className="mt-3 text-lg font-light tracking-brand text-ink">
              Let’s notice what is working.
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              A respectful mirror — what to keep, what to adjust, what is
              quietly opening for you.
            </p>
            <p className="mt-6 text-sm font-light text-ink-mute">
              Open reflection →
            </p>
          </Card>
        </div>
      </Section>

      <div className="mt-8 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <p className="text-sm font-light text-ink-mute">
          This is not about perfection.
        </p>
        <Link
          href="/"
          className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
        >
          Return to the river
        </Link>
      </div>
    </Container>
  );
}
