import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { ManifestoStrip } from "@/components/organizations/ManifestoStrip";
import { campaignTypes } from "@/data/organizations/campaign-types";

export const metadata = {
  title: "five organizations — a human momentum operating system",
  description:
    "Organizations don’t collapse in one moment. They erode in the absence of small human moments. five organizations is the operating layer for those moments.",
};

export default function OrganizationsLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five organizations
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            A human momentum
            <br />
            operating system.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Not an LMS. Not a task manager. Not a productivity tool. A calm operating layer for the small human moments that quietly make — and quietly unmake — an organization.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/organizations/console" variant="primary" size="lg">
              Enter the console
            </LinkButton>
            <LinkButton href="/cubes/organizations/analytics" variant="secondary" size="lg">
              See the analytics
            </LinkButton>
          </div>
        </header>

        {/* Manifesto */}
        <section className="mt-24 md:mt-32">
          <p className="mb-12 text-center text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute md:mb-16">
            our thesis
          </p>
          <ManifestoStrip />
        </section>

        {/* Core idea */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the philosophy
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            Culture is not built in workshops.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Inside modern organizations, everything becomes urgent. Teams react. Leaders chase the next KPI. Fires replace reflection. Speed replaces presence. In the noise, the small human moments quietly disappear — recognition, feedback, learning pauses, customer attention, reflection, innovation.
            </p>
            <p>
              five organizations is built on a different thesis. You do not need another organizational revolution. You need five minutes of intentional human attention, repeated by enough people, over enough days.
            </p>
            <p>
              The small drops inside organizations become the river of culture. This cube is the operating layer for those drops.
            </p>
          </div>
        </section>

        {/* The six campaign archetypes */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              the six archetypes
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Six small ways to bring a culture back to itself.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaignTypes.map((t) => (
              <Card key={t.id} className="bg-surface">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-lg font-light text-ink-soft"
                  >
                    {t.glyph}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      five
                    </p>
                    <h3 className="mt-1 text-lg font-light tracking-brand text-ink">
                      {t.label}
                    </h3>
                    <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                      {t.body}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Positioning */}
        <section className="mt-24 md:mt-32">
          <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 md:p-12">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              what five organizations is not
            </p>
            <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
              We are not selling productivity software.
            </h2>
            <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft">
              We are not an HR administration tool. We are not workplace surveillance. We are not gamified task tracking. We are a system for managing human momentum inside organizations — measurable, repeatable, and intentionally calm.
            </p>
          </div>
        </section>

        {/* Footer pointers */}
        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light text-ink-mute">
            Organizations are transformed through small repeated moments of human attention.
          </p>
          <LinkButton href="/cubes/organizations/console" variant="primary" size="md">
            Begin in the console →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
