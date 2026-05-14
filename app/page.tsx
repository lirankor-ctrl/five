import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";

export default function LandingPage() {
  return (
    <div className="relative">
      <Container size="narrow" className="pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <Logo variant="mark" size="lg" className="mb-10" />

          <h1 className="text-7xl font-thin tracking-brand leading-none text-ink md:text-8xl">
            five
          </h1>

          <p className="mt-6 max-w-md text-balance text-lg font-light leading-relaxed text-ink-soft md:text-xl">
            You don&rsquo;t need more time.
            <br />
            You need five.
          </p>

          <div className="my-12 w-32">
            <RiverLine />
          </div>

          <p className="max-w-prose text-balance text-[15px] leading-relaxed text-ink-soft md:text-base">
            A small space for the drops of time between work, family, and the
            anchors of life. Five quiet minutes can be enough — not to do more,
            but to return to what matters.
          </p>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
            <LinkButton href="/home" variant="primary" size="lg">
              Take five
            </LinkButton>
            <LinkButton href="/cubes" variant="secondary" size="lg">
              Explore the river
            </LinkButton>
          </div>

          <p className="mt-16 text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
            One drop is enough to begin.
          </p>
        </div>
      </Container>
    </div>
  );
}
