/*
  File -> Page showing the user's events (events they marked as "attending")
  - Split in 3 sections: (1) events happening this week, (2) events happening next week, (3) upcoming events beyond that
  - Uses "carousels" to display the events
*/

import React from "react";
import { api } from "@/trpc/server";
import type { EventData } from "@/lib/interfaces/eventData";
import FilteredEventsSection from "@/components/events/FilteredEventsSection";

export default async function MyEventsPage() {
  const events: EventData[] = await api.events.getEventsAttending.query({});

  return (
    <div className="flex flex-col items-center justify-center px-8 pb-32">
      <div className="my-12 flex w-full max-w-screen-lg flex-col self-center">
        <p className="mb-4 text-2xl font-bold">Your events</p>
        <FilteredEventsSection events={events} filterType="currentWeek" />
        <FilteredEventsSection events={events} filterType="nextWeek" />
        <FilteredEventsSection events={events} filterType="upcoming" />
      </div>
    </div>
  );
}
