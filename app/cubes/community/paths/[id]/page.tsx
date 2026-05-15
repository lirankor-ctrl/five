import { notFound } from "next/navigation";
import { PathView } from "@/components/community/PathView";
import { getPath, paths } from "@/data/community/paths";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return paths.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Params) {
  const p = getPath(params.id);
  if (!p) return { title: "five community — path" };
  return { title: `${p.title} — five community`, description: p.oneLine };
}

export default function PathPage({ params }: Params) {
  const p = getPath(params.id);
  if (!p) notFound();
  return <PathView path={p} />;
}
