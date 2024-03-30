import Link from "next/link";
import React from "react";
import EventPreview from "./EventPreview";
import { type EventData } from "@/lib/interfaces/eventData";

interface EventSectionProps {
  title: string;
  events: EventData[];
  redirect: string;
}

export default function EventSection({
  title,
  events,
  redirect,
}: EventSectionProps) {
  return (
    <div className="my-4 flex flex-col">
      <div className="mb-4 flex w-full flex-row items-end justify-between">
        <Link href={redirect}>
          <p className="text-2xl font-bold">{title}</p>
        </Link>
        <Link href={redirect}>
          <p className="mb-0.5 text-gray-700 hover:underline">View more</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {events?.map((event) => <EventPreview key={event.id} event={event} />)}
      </div>
    </div>
  );
}
