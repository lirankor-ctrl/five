import type { ReactNode } from "react";
import { ProjectNav } from "@/components/project/ProjectNav";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <ProjectNav />
      {children}
    </div>
  );
}
