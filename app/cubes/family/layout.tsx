import type { ReactNode } from "react";
import { FamilyNav } from "@/components/family/FamilyNav";

export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <FamilyNav />
      {children}
    </div>
  );
}
