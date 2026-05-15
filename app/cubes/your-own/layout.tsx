import type { ReactNode } from "react";
import { YourOwnNav } from "@/components/your-own/YourOwnNav";

export default function YourOwnLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <YourOwnNav />
      {children}
    </div>
  );
}
