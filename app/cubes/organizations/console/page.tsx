import { OrganizationsConsole } from "@/components/organizations/OrganizationsConsole";

export const metadata = {
  title: "console — five organizations",
  description:
    "Run small, repeatable cultural practices: campaigns, daily actions, reflections, and observations — without becoming a productivity tool.",
};

export default function ConsolePage() {
  return <OrganizationsConsole />;
}
