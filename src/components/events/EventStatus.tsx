import React from "react";
import type { EventData } from "@/lib/interfaces/eventData";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { eventCountdownTime } from "../../lib/utils";
import StatusPing from "./StatusPing";

interface EventStatusProps {
  event: EventData;
}

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
        {eventCountdownTime(event.date, event.duration)}
      </p>
    </div>
  );
}
