import { Container } from "@/components/Container";
import { CubeCard } from "@/components/CubeCard";
import { RiverLine } from "@/components/RiverLine";
import { visibleCubes } from "@/data/cubes";

export const metadata = {
  title: "Cubes — five",
  description: "The cube map: different drops, different rivers.",
};

export default function CubesPage() {
  return (
    <Container size="wide" className="pb-20 pt-12 md:pt-16">
      <header className="mb-12 max-w-prose md:mb-16">
        <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          The cube map
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          Different drops, different rivers.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-base">
          Each cube is a different way to spend five intentional minutes.
          There is no order. Begin where you are drawn.
        </p>
        <div className="mt-8 w-24">
          <RiverLine />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCubes.map((cube) => (
          <CubeCard key={cube.id} cube={cube} />
        ))}
      </div>
    </Container>
  );
}
