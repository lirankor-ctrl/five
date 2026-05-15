import { notFound } from "next/navigation";
import { EventExperience } from "@/components/live/EventExperience";
import { getEvent, liveEvents } from "@/data/live/events";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return liveEvents.map((e) => ({ id: e.id }));
}

export function generateMetadata({ params }: Params) {
  const e = getEvent(params.id);
  if (!e) return { title: "five live event" };
  return {
    title: `${e.name} — five live event`,
    description: e.hook ?? e.description,
  };
}

export default function EventPage({ params }: Params) {
  const event = getEvent(params.id);
  if (!event) notFound();
  return <EventExperience event={event} />;
}
