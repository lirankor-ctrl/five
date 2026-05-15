import type { ReactNode } from "react";
import { ReflectionNav } from "@/components/reflection/ReflectionNav";

export default function ReflectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <ReflectionNav />
      {children}
    </div>
  );
}
