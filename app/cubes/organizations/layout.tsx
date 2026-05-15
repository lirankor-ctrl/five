import type { ReactNode } from "react";
import { OrganizationsNav } from "@/components/organizations/OrganizationsNav";

/**
 * Scoped layout for the five organizations cube.
 *
 * Provides the section-level breadcrumb / sub-navigation used by the
 * landing, console, analytics, and research pages.
 */
export default function OrganizationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <OrganizationsNav />
      {children}
    </div>
  );
}
