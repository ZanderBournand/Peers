import React from "react";
import type { EventData } from "@/lib/interfaces/eventData";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

interface EventStatusProps {
  event: EventData;
}

const countdownTime = (eventDate: Date, durationInMinutes: number) => {
  const diffMs = eventDate.getTime() - new Date().getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  const countdownTextBuilder = (value: number, unit: string) =>
    `In ${value} ${unit}${value === 1 ? "" : "s"}`;

  return diffMs <= 0
    ? new Date() <= new Date(eventDate.getTime() + durationInMinutes * 60000)
      ? "Live now!"
      : "The event has ended"
    : diffDays === 0
      ? diffHours === 0
        ? countdownTextBuilder(diffMinutes, "minute")
        : countdownTextBuilder(diffHours, "hour")
      : countdownTextBuilder(
          Math.max(1, Math.floor(diffDays / 7)),
          diffDays < 7 ? "day" : "week",
        );
};

export default function EventStatus({ event }: EventStatusProps) {
  const endTime = new Date(event.date.getTime() + event.duration * 60000);
  const typeColorMap = {
    ONLINE_VIDEO: { base: "bg-blue-300", pulse: "bg-blue-400" },
    ONLINE_AUDIO: { base: "bg-purple-300", pulse: "bg-purple-400" },
    IN_PERSON: { base: "bg-green-300", pulse: "bg-green-400" },
  };

  const eventType = typeColorMap[event.type];

  return (
    <div className="flex flex-row items-center">
      {endTime > new Date() ? (
        <div className="relative mr-3">
          <div className={`h-3 w-3 rounded-full ${eventType.base}`}></div>
          <div
            className={`absolute left-0 top-0 h-3 w-3 animate-slow-ping rounded-full ${eventType.pulse}`}
          ></div>
          <div
            className={`absolute left-0 top-0 h-3 w-3 animate-slow-pulse rounded-full ${eventType.base}`}
          ></div>
        </div>
      ) : (
        <NoSymbolIcon className="mr-2 h-5 w-5" color="grey" />
      )}
      <p className="text-md text-xl">
        {countdownTime(event.date, event.duration)}
      </p>
    </div>
  );
}
