"use client";

import React from "react";
import { Calendar } from "../ui/calendar";
import { type EventData } from "@/lib/interfaces/eventData";
import moment from "moment";
import {
  CalendarIcon,
  MapPinIcon,
  MicrophoneIcon,
  UserGroupIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { getDisplayName } from "@/lib/utils";
import Link from "next/link";

const css = `
.number-container {
    position: relative;
    display: inline-block;
  }
  
  .number-container::after {
    position: absolute;
    bottom: 0px; /* Adjust this value to position the dot */
    left: 50%;
    transform: translateX(-50%);
    width: 7px; /* Width of the dot */
    height: 7px; /* Height of the dot */
    background-color: #7c3aed; /* Color of the dot - bright purple */
    border-radius: 50%; /* Ensures the dot is circular */
  }
`;

interface EventCalendarProps {
  events: EventData[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const eventDays = events.map((event) => new Date(event.date));

  const selectedDateEvents = events.filter((event) => {
    const eventDate = moment(event.date);
    return eventDate.isSame(date, "day");
  });

  const EventCard = ({ event }: { event: EventData }) => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <Link href={`/event/${event.id}`}>
        <div className="my-2 flex w-full flex-col rounded-lg border px-2 py-2 shadow-sm">
          <p className="truncate text-sm font-semibold">{event.title}</p>
          <p className="mb-2 mt-1 flex flex-row items-center text-sm text-slate-800">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDate} • {formattedTime}
          </p>
          <div className="flex flex-row items-center">
            {event.type === "ONLINE_VIDEO" && (
              <div className="flex w-max flex-row items-center rounded-md bg-blue-200 bg-opacity-30 px-2 py-1 text-xs text-cyan-800">
                <VideoCameraIcon className="mx-1 h-4 w-4" />
                {"Video"}
              </div>
            )}
            {event.type === "ONLINE_AUDIO" && (
              <div className="flex w-max flex-row items-center rounded-md bg-purple-300 bg-opacity-30 px-2 py-1 text-xs text-purple-800">
                <MicrophoneIcon className="mx-1 h-4 w-4" />
                {"Audio"}
              </div>
            )}
            {event.type === "IN_PERSON" && (
              <div className="flex w-max flex-row items-center rounded-md bg-green-200 bg-opacity-30 px-2 py-1 text-xs text-green-800">
                <MapPinIcon className="mr-1 h-4 w-4" />
                {"In-person"}
              </div>
            )}
            <div className="ml-2 inline-flex items-center rounded-full border border-gray-100 bg-white px-1 text-sm hover:shadow-sm">
              {event.userHost ? (
                <div className="flex flex-row items-center">
                  <UserIcon className="mr-1 h-4 w-4" />
                  {getDisplayName(event.userHost)}
                </div>
              ) : (
                <div className="flex flex-row items-center">
                  <UserGroupIcon className="mr-1 h-4 w-4" />
                  {event.orgHost?.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <style>{css}</style>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={{
          events: eventDays,
        }}
        modifiersClassNames={{
          events: "number-container",
          //events: "bg-purple-100/50 text-accent-foreground",
        }}
      />
      <p className="mt-4 font-semibold">Your events</p>
      <div className="mt-1 flex w-full flex-col">
        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))
        ) : (
          <div className="mb-4 mt-2 w-full items-center">
            <p className="text-center text-sm text-gray-800">
              No events scheduled for{" "}
              {date?.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
