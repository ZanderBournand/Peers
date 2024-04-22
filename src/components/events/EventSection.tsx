/*
  File -> Grid component used on the home page to display a certain "section" of events
  - Examples include "recommended events" & "university events"
*/

import Link from "next/link";
import React from "react";
import EventPreview from "./EventPreview";
import { type EventData } from "@/lib/interfaces/eventData";
import { PlusIcon } from "@heroicons/react/24/outline";

interface EventSectionProps {
  title: string;
  titleIcon?: React.ReactNode;
  events: EventData[];
  redirect: string;
}

export default function EventSection({
  title,
  titleIcon,
  events,
  redirect,
}: EventSectionProps) {
  return (
    <div className="my-4 flex flex-col">
      <div className="mb-4 flex w-full flex-col items-start lg:flex-row lg:items-end">
        <Link href={redirect} className="flex flex-row items-center">
          {titleIcon}
          <p className="text-2xl font-bold">{title}</p>
        </Link>
        <Link
          href={redirect}
          className="flex flex-row items-center hover:underline lg:ml-4"
        >
          <PlusIcon className="h-5 w-5 text-gray-700" />
          <p className="mb-0.5 ml-1 text-gray-700 ">View more</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {events
          ?.slice(0, 6)
          .map((event) => <EventPreview key={event.id} event={event} />)}
      </div>
    </div>
  );
}
