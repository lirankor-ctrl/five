import { JournalView } from "@/components/family/JournalView";

export const metadata = {
  title: "journal — five family",
  description:
    "A soft chronological record of the small five-minute moments your family returned to. Nothing to optimise.",
};

export default function FamilyJournalPage() {
  return <JournalView />;
}
