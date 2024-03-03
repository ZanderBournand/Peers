import React from "react";
import EventPreview from "@/components/events/EventPreview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type EventSchema } from "@/lib/validators/Events";
import { type z } from "zod";

export type EventType = z.infer<typeof EventSchema>;

interface EventCarouselProps {
  events: EventType[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  return (
    <Carousel className="mx-auto w-full sm:w-10/12 md:w-full">
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
