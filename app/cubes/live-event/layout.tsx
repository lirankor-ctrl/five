import type { ReactNode } from "react";
import { LiveNav } from "@/components/live/LiveNav";

export default function LiveEventLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <LiveNav />
      {children}
    </div>
  );
}
