import React from "react";
import { api } from "@/trpc/server";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { type UserData } from "@/lib/interfaces/userData";
import { type OrganizationData } from "@/lib/interfaces/organizationData";
import UserHostPreview from "@/components/user/UserHostPreview";
import OrgHostPreview from "@/components/organization/OrgHostPreview";
import { shuffle } from "lodash";
import EventPreview from "@/components/events/EventPreview";

export default async function RecommendedHosts() {
  const userData = await api.users.getUser.query({});
  const recommendedHosts = await api.events.getRecommendedHosts.query({});

  const hostsList: (UserData | OrganizationData)[] = shuffle([
    ...recommendedHosts.users,
    ...recommendedHosts.organizations,
  ]);

  const eventsByHosts = await api.events.getEventsByHosts.query({
    hostIds: hostsList.map((host) => host.id),
  });

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
          <p className="text-2xl font-bold">Top Hosts for You</p>
        </div>
        <p className="mt-1">
          These hosts are like-minded, and have been selected just for you. View
          their profile to learn more!
        </p>
        <Separator className="mt-6" />
        <div className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {hostsList.map((host) =>
            "firstName" in host ? (
              <UserHostPreview user={host} key={host.id} />
            ) : (
              <OrgHostPreview organization={host} key={host.id} />
            ),
          )}
        </div>
        <div className="mt-16 flex flex-col">
          <p className="text-xl font-semibold">Some events by these hosts</p>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {eventsByHosts.slice(0, 10).map((event) => (
              <EventPreview key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
