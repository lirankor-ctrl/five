import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";

export default function NotFound() {
  return (
    <Container size="narrow" className="pb-24 pt-20 text-center md:pt-32">
      <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
        Off the river
      </p>
      <h1 className="mt-4 text-4xl font-light tracking-brand text-ink md:text-5xl">
        Nothing here.
      </h1>
      <p className="mt-4 text-balance text-[15px] leading-relaxed text-ink-soft">
        That’s okay. A wrong turn is just another drop. Return to the river
        when you’re ready.
      </p>
      <div className="mx-auto my-10 w-24">
        <RiverLine />
      </div>
      <LinkButton href="/" variant="primary" size="md">
        Return to the river
      </LinkButton>
    </Container>
  );
}
