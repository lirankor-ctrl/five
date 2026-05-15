import { notFound } from "next/navigation";
import { CreatorProfile } from "@/components/creators/CreatorProfile";
import { creators, getCreator } from "@/data/creators/creators";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return creators.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: Params) {
  const c = getCreator(params.id);
  if (!c) return { title: "five creators — profile" };
  return {
    title: `${c.name} — five creators`,
    description: c.oneLine,
  };
}

export default function CreatorProfilePage({ params }: Params) {
  const creator = getCreator(params.id);
  if (!creator) notFound();
  return <CreatorProfile creator={creator} />;
}
