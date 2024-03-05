"use client";

import React from "react";
import EventCarousel from "@/components/events/EventCarousel";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { EventData } from "@/lib/interfaces/eventData";
import moment from "moment";

interface FilteredEventsSectionProps {
  events: EventData[];
  filterType: string;
}

export default function FilteredEventsSection({
  events,
  filterType,
}: FilteredEventsSectionProps) {
  let startDate: Date, endDate: Date;

  if (filterType === "currentWeek") {
    startDate = moment().startOf("isoWeek").toDate();
    endDate = moment().endOf("isoWeek").toDate();
  } else if (filterType === "nextWeek") {
    startDate = moment().startOf("isoWeek").add(1, "weeks").toDate();
    endDate = moment().endOf("isoWeek").add(1, "weeks").toDate();
  } else {
    startDate = moment().startOf("isoWeek").add(2, "weeks").toDate();
  }

  const filteredEvents: EventData[] = events.filter((event) => {
    const eventDate = moment(event.date).utc();
    if (endDate) {
      return (
        eventDate.isSameOrAfter(startDate) && eventDate.isSameOrBefore(endDate)
      );
    } else {
      return eventDate.isSameOrAfter(startDate);
    }
  });

  filteredEvents.sort((a, b) => {
    const aEndDate = moment(a.date).add(a.duration, "minutes");
    const bEndDate = moment(b.date).add(b.duration, "minutes");
    const aIsCompleted = moment().isAfter(aEndDate);
    const bIsCompleted = moment().isAfter(bEndDate);

    if (aIsCompleted !== bIsCompleted) {
      return aIsCompleted ? 1 : -1;
    }

    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const sectionTitle =
    filterType === "currentWeek"
      ? "This Week"
      : filterType === "nextWeek"
        ? "Next Week"
        : "Upcoming";

  return (
    <div className="flex-start my-6 flex flex-col">
      <div className="flex flex-row items-center text-lg font-semibold">
        {sectionTitle}
        <span className="ml-2 text-sm text-gray-700">
          ({filteredEvents.length})
        </span>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="mt-4 flex w-full justify-center">
          <EventCarousel events={filteredEvents} />
        </div>
      ) : (
        <div className="flex-start mt-4 flex h-auto w-max flex-col rounded-lg bg-purple-50/50 px-4 py-2 pr-8 shadow-sm">
          <p className="text-sm font-medium">
            {filterType === "currentWeek"
              ? "Don't miss out! Explore this week's events now"
              : filterType === "nextWeek"
                ? " Get ahead! Uncover next week's events today"
                : " Stay curious! Never too early to plan for the future"}
          </p>
          <div className="flex flex-row items-center">
            {/* TODO: link the button to the discover screen w/ the proper filtering */}
            <Link href="/">
              <Button
                variant="outline"
                className="mt-4 flex flex-row items-center rounded-lg"
              >
                <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                Search events for
                {filterType === "currentWeek"
                  ? " this week"
                  : filterType === "nextWeek"
                    ? " next week"
                    : "... the future!"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
