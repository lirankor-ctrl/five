import { notFound } from "next/navigation";
import { ContentExperience } from "@/components/creators/ContentExperience";
import { creatorSessions, getSession } from "@/data/creators/sessions";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return creatorSessions.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: Params) {
  const s = getSession(params.id);
  if (!s) return { title: "five creators — session" };
  return {
    title: `${s.title} — five creators`,
    description: s.hook,
  };
}

export default function SessionPage({ params }: Params) {
  const session = getSession(params.id);
  if (!session) notFound();
  return <ContentExperience session={session} />;
}
