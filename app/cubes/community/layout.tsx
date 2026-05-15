import type { ReactNode } from "react";
import { CommunityNav } from "@/components/community/CommunityNav";

export default function CommunityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <CommunityNav />
      {children}
    </div>
  );
}
