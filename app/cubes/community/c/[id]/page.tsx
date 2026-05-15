import { notFound } from "next/navigation";
import { SingleCommunity } from "@/components/community/SingleCommunity";
import { communities, getCommunity } from "@/data/community/communities";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return communities.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: Params) {
  const c = getCommunity(params.id);
  if (!c) return { title: "five community" };
  return { title: `${c.name} — five community`, description: c.oneLine };
}

export default function CommunityPage({ params }: Params) {
  const c = getCommunity(params.id);
  if (!c) notFound();
  return <SingleCommunity community={c} />;
}
