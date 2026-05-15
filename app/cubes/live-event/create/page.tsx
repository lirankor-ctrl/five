import { CreateView } from "@/components/live/CreateView";

export const metadata = {
  title: "host — five live event",
  description:
    "Open a small room. Default settings keep it calm — no cameras, no recording, anonymous mode allowed.",
};

export default function CreateLivePage() {
  return <CreateView />;
}
