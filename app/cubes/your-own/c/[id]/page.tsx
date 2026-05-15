import { CubeProfile } from "@/components/your-own/CubeProfile";
import { communityCubes } from "@/data/your-own/community-cubes";

export function generateStaticParams() {
  // Pre-render seeded community cubes. User-created cubes render on-demand.
  return communityCubes.map((c) => ({ id: c.id }));
}

export const dynamicParams = true;

export const metadata = {
  title: "a cube — five your own cube",
  description:
    "A human-built momentum system. Philosophy, action logic, success philosophy.",
};

export default function CubeProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return <CubeProfile cubeId={params.id} />;
}
