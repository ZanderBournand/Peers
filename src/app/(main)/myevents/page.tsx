import React from "react";
import { api } from "@/trpc/server";
import EventCarousel from "@/components/events/EventCarousel";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { EventData } from "@/lib/interfaces/eventData";

export default async function MyEventsPage() {
  const events: EventData[] = await api.events.getCurrentUserEvents.query();

  const filteredEventsSection = (filterType: string) => {
    const now = new Date();
    let filteredEvents: EventData[];

    if (filterType === "week") {
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (7 - now.getDay()),
      );
      filteredEvents = events.filter(
        (event) =>
          new Date(event.date) >= now && new Date(event.date) <= endOfWeek,
      );
    } else if (filterType === "nextWeek") {
      const startOfNextWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (7 - now.getDay()) + 1,
      );
      const endOfNextWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (14 - now.getDay()),
      );
      filteredEvents = events.filter(
        (event) =>
          new Date(event.date) >= startOfNextWeek &&
          new Date(event.date) <= endOfNextWeek,
      );
    } else {
      const startOfTwoWeeksFromNow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (14 - now.getDay()) + 1,
      );
      filteredEvents = events.filter(
        (event) => new Date(event.date) >= startOfTwoWeeksFromNow,
      );
    }

    filteredEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const sectionTitle =
      filterType === "week"
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
              {filterType === "week"
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
                  {filterType === "week"
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
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 pb-32">
      <div className="my-12 flex w-full max-w-screen-lg flex-col self-center">
        <p className="mb-4 text-2xl font-bold">Your events</p>
        {filteredEventsSection("week")}
        {filteredEventsSection("nextWeek")}
        {filteredEventsSection("upcoming")}
      </div>
    </div>
  );
}
