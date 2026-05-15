import { SingleProject } from "@/components/project/SingleProject";

/**
 * Projects live in the user's localStorage today. The page is rendered
 * on-demand and reads the project from local state in the client.
 */
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export const metadata = {
  title: "five project — a studio",
  description:
    "A calm studio for one of your living projects. Vision · Milestones · Five Actions.",
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <SingleProject projectId={params.id} />;
}
