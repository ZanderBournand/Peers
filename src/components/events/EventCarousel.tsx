/*
  File -> Carousel component used to display events in the "My Events" page
  - Given a list of events, it displays them in a responsive carousel format
*/

import React from "react";
import EventPreview from "@/components/events/EventPreview";
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

export default function EventCarousel({ events }: EventCarouselProps) {
  return (
    <Carousel className="mx-auto w-10/12 sm:w-11/12">
      <CarouselContent>
        {events?.map((event) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={event.id}>
            <EventPreview event={event} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
