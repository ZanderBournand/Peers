import React from "react";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import EventPreview from "@/components/events/EventPreview";
import Image from "next/image";
import { PiStudentFill } from "react-icons/pi";

export default async function UniversityEvents() {
  const userData = await api.users.getUser.query({});
  const universityEvents = await api.events.getUniversity.query({
    university: userData?.universityName ?? "",
  });

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
        <div className="flex flex-row items-center">
          {userData?.university?.isLogoUploaded ? (
            <Image
              src={userData?.university?.logo ?? ""}
              alt="selected image"
              width={35}
              height={35}
              style={{
                objectFit: "cover",
              }}
              className="mr-3 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
            />
          ) : (
            <PiStudentFill className="mr-2" />
          )}
          <p className="text-2xl font-bold">
            Events at {userData?.universityName}
          </p>
        </div>
        <p className="mt-1">
          Check out what&rsquo;s going on at your school&rsquo;s campus. All
          events listed right here for you!
        </p>
        <Separator className="mt-6" />
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {universityEvents.map((event) => (
            <EventPreview key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
