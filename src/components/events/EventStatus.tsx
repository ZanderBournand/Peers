import React from "react";
import type { EventData } from "@/lib/interfaces/eventData";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { pluralize } from "../../lib/utils";
import StatusPing from "./StatusPing";

interface EventStatusProps {
  event: EventData;
}

const countdownTime = (eventDate: Date, durationInMinutes: number) => {
  const diffMs = eventDate.getTime() - new Date().getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return diffMs <= 0
    ? new Date() <= new Date(eventDate.getTime() + durationInMinutes * 60000)
      ? "Live now!"
      : "This event has ended"
    : diffDays === 0
      ? diffHours === 0
        ? `In ${pluralize(diffMinutes, "minute")}`
        : `In ${pluralize(diffHours, "hour")}`
      : `In ${pluralize(
          diffDays < 7 ? diffDays : Math.floor(diffDays / 7),
          diffDays < 7 ? "day" : "week",
        )}`;
};

export default function EventStatus({ event }: EventStatusProps) {
  const endTime = new Date(event.date.getTime() + event.duration * 60000);

  return (
    <div className="flex flex-row items-center">
      {endTime > new Date() ? (
        <StatusPing eventType={event.type} />
      ) : (
        <NoSymbolIcon className="mr-2 h-5 w-5" color="grey" />
      )}
      <p className="text-md text-xl">
        {countdownTime(event.date, event.duration)}
      </p>
    </div>
  );
}
