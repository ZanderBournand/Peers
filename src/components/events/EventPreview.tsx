import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  MapPinIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { type EventSchema } from "@/lib/validators/Events";
import { type z } from "zod";

export type EventType = z.infer<typeof EventSchema>;

export default function EventPreview({ event }: { event: EventType }) {
  const eventDate = new Date(event.date);
  const eventEndDate = moment(eventDate).add(event.duration, "minutes");
  const isEventPassed = moment().isAfter(eventEndDate);

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
      <div className="group mx-4 my-4 flex flex-col overflow-hidden rounded-lg border border-transparent transition-all duration-300 hover:border-gray-100 hover:shadow-sm">
        <div className="relative flex aspect-video w-full items-center justify-center bg-gray-50">
          {event.image ? (
            <>
              <Image
                src={event.image}
                alt="selected image"
                fill
                style={{
                  objectFit: "cover",
                }}
                className="rounded-lg transition-opacity duration-500 group-hover:opacity-70"
              />
              {isEventPassed && (
                <div className="absolute inset-0 bg-gray-500/70" />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>
        <div className="mx-4 my-4 flex flex-col">
          <p className="truncate text-lg font-bold">{event.title}</p>
          <p className="my-2 flex flex-row items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {formattedDate} • {formattedTime}
          </p>
          <div className="text-md">
            Hosted by:
            {event.userHostId ? (
              <div className="ml-2 inline-flex items-center rounded-full border border-gray-100 bg-white px-1 text-sm hover:shadow-sm">
                @{event.userHost?.username}
              </div>
            ) : (
              <div className="ml-2 inline-flex items-center rounded-full border border-gray-100 bg-white px-2 py-0.5 text-sm hover:shadow-sm">
                {event.orgHost?.name}
              </div>
            )}
          </div>
          {isEventPassed && (
            <div className="my-2 flex w-max flex-row items-center rounded-md bg-gray-200 bg-opacity-30 px-2 py-1 text-sm text-gray-800">
              <CheckCircleIcon className="mx-1 h-5 w-5" />
              {"Completed"}
            </div>
          )}
          {event.type === "ONLINE_VIDEO" && !isEventPassed && (
            <div className="my-2 flex w-max flex-row items-center rounded-md bg-blue-200 bg-opacity-30 px-2 py-1 text-sm text-cyan-800">
              {"Online -"}
              <VideoCameraIcon className="mx-1 h-5 w-5" />
              {"Video"}
            </div>
          )}
          {event.type === "ONLINE_AUDIO" && !isEventPassed && (
            <div className="my-2 flex w-max flex-row items-center rounded-md bg-purple-300 bg-opacity-30 px-2 py-1 text-sm text-purple-800">
              {"Online -"}
              <MicrophoneIcon className="mx-1 h-5 w-5" />
              {"Audio"}
            </div>
          )}
          {event.type === "IN_PERSON" && !isEventPassed && (
            <div className="flex flex-row items-center">
              <div className="my-2 min-w-[80px] rounded-md bg-green-200 bg-opacity-30 px-2 py-1 text-sm text-green-800">
                In-person
              </div>
              <div className="flex flex-row items-center">
                <MapPinIcon className="mx-2 h-5 w-5" />
                {/* Put the location city, state */}
                <span className="truncate">Gainesville, FL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
