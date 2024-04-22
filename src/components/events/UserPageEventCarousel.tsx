/*
  File -> Carousel component used in the user page to display events
  - Given a list of events, it displays them in a responsive carousel format
  - Used for both user's hosting events, and events they are attending
*/

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { IoTimeOutline } from "react-icons/io5";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { EventData } from "@/lib/interfaces/eventData";

interface EventCarouselProps {
  events: EventData[];
}

export default function UserPageEventCarousel({ events }: EventCarouselProps) {
  function formatEventDateTime(eventDate: Date) {
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });

    return `${formattedDate}`;
  }

  return (
    <Carousel className="my-2 w-10/12 items-center justify-center">
      <CarouselContent className="mx-2 py-2">
        {events.map((event) => (
          <CarouselItem
            key={event.id}
            className="mx-1 basis-full pl-4 sm:basis-3/5 md:basis-2/5"
          >
            <Link href={`/event/${event.id}`}>
              <div className="items-center justify-center transition-all duration-200 hover:scale-105">
                <div className="flex">
                  <div className="group flex w-48 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:border-gray-100 hover:shadow-sm">
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
                            className="rounded-t-2xl transition-opacity duration-500 group-hover:opacity-85"
                          />
                        </>
                      ) : (
                        <div className="flex items-center justify-center text-gray-500">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mx-4 my-4 flex flex-col">
                  <p className="truncate text-sm font-bold">{event.title}</p>
                  <p className="mt-1 flex flex-row items-center text-xs text-slate-800">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatEventDateTime(event.date)}
                  </p>
                  <p className="mt-1 flex flex-row items-center text-xs text-slate-800">
                    <IoTimeOutline className="mr-2 h-4 w-4" />
                    {event.date.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="mr-4 border-black" />
      <CarouselNext className="ml-4 border-black" />
    </Carousel>
  );
}
