import React from "react";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import EventPreview from "@/components/events/EventPreview";
import Image from "next/image";

export default async function RecommendedEvents() {
  const userData = await api.users.getUser.query({});
  const recommendedEvents = await api.events.getRecommended.query({});

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
        <div className="flex flex-row items-center">
          <Image
            src={userData.image}
            alt="selected image"
            width={35}
            height={35}
            style={{
              objectFit: "cover",
            }}
            className="mr-3 rounded-full transition-opacity duration-500 group-hover:opacity-70"
          />
          <p className="text-2xl font-bold">Your Recommended Events</p>
        </div>
        <p className="mt-1">
          These are events that have been selected just for you. Discover your
          next learning opportunity!
        </p>
        <Separator className="mt-6" />
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {recommendedEvents.map((event) => (
            <EventPreview key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
