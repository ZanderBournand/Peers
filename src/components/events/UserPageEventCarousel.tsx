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
import { getFormattedDuration } from "@/lib/utils";

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
    <Carousel className="my-2">
      <CarouselContent className="mx-2">
        {events.map((event) => (
          <CarouselItem className="mx-1 basis-2/5 pl-4">
            <Link href={`/event/${event.id}`}>
              <div className="items-center justify-center">
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
                  <p className="truncate text-base text-sm font-bold">
                    {event.title}
                  </p>
                  <p className="mt-1 flex flex-row items-center text-xs text-slate-800">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatEventDateTime(event.date)}
                  </p>
                  <p className="mt-1 flex flex-row items-center text-xs text-slate-800">
                    <IoTimeOutline className="mr-2 h-4 w-4" />
                    {getFormattedDuration(event.duration)}
                  </p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="mx-5 border-black" />
      <CarouselNext className="mx-5 border-black" />
    </Carousel>
  );
}
