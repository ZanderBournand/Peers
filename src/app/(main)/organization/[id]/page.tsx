import React from "react";
import { api } from "@/trpc/server";
import Image from "next/image";
import {
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  getDisplayName,
  getAddressSections,
  getFormattedDuration,
} from "@/lib/utils";
import ShareButton from "@/components/events/ShareButton";
import { headers } from "next/headers";
import AttendButton from "@/components/events/AttendButton";
import Link from "next/link";
import type { UserData } from "@/lib/interfaces/userData";
import type { EventData, addressSections } from "@/lib/interfaces/eventData";
import Map from "@/components/location/Map";
import EventStatus from "@/components/events/EventStatus";

export default async function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const event: EventData = await api.events.get.query({ id: params.id });
  const user: UserData = await api.users.getCurrent.query();

  const duration = getFormattedDuration(event.duration);
  const formattedDate = event.date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const addressSections: addressSections | null = getAddressSections(
    event?.location,
  );

  const eventLink = headers().get("x-url");

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="my-16 flex w-full max-w-screen-xl flex-row self-center">
        <div className="flex w-8/12 flex-col  items-start px-20">
          <div className="relative flex aspect-video w-full items-center justify-center">
            <div className="relative flex h-60 w-60 flex-col items-center justify-center rounded-2xl bg-gray-50">
              {" "}
              {event.image ? (
                <Image
                  src={event.image}
                  alt="selected image"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  className="rounded-lg transition-opacity duration-500 group-hover:opacity-70"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-5 mt-1 flex flex-row items-center">
              <p className="text-2xl font-bold">{event.title}</p>
            </div>
            <p className="text-md my-5 whitespace-pre-line font-normal">
              {event.description}
            </p>
            <div className="mt-12 flex flex-col border-t border-gray-300"></div>
            <div className="mt-8 flex flex-col">
              <div className="flex flex-row items-center">
                <p className="text-lg font-bold">About the host</p>
                <div className="ml-2 inline-flex flex-row items-center rounded-full border border-gray-100 bg-white px-2 text-sm hover:shadow-sm">
                  <CheckBadgeIcon
                    className="blue blue-500 mr-1 h-5 w-5"
                    color="#6e13c8"
                  />
                  {event.userHost
                    ? getDisplayName(event.userHost)
                    : event.orgHost?.name}
                </div>
              </div>
              <p className="text-md my-5 whitespace-pre-line font-normal">
                {/* TODO: Display organization bio */}
                {event.userHost ? event.userHost?.bio : "[INSERT ORG BIO HERE]"}
              </p>
            </div>
            {event.tags && event.tags.length > 0 && (
              <div className="mt-4 flex flex-col">
                <p className="text-lg font-bold">Type of Organization</p>
                {event.type === "ONLINE_VIDEO" && (
                  <div className="ml-4 mt-1 flex w-max flex-row items-center rounded-md bg-blue-200 bg-opacity-30 px-2 py-1 text-sm text-cyan-800">
                    {"Online -"}
                    <VideoCameraIcon className="mx-1 h-5 w-5" />
                    {"Video"}
                  </div>
                )}
                {
                  //IF ORG.TYPE === ENGINEERING, SAY ENGINEERING, etc.
                  event.type === "ONLINE_AUDIO" && (
                    <div className="ml-4 mt-1 flex w-max flex-row items-center rounded-md bg-purple-300 bg-opacity-30 px-2 py-1 text-sm text-purple-800">
                      {"Online -"}
                      <MicrophoneIcon className="mx-1 h-5 w-5" />
                      {"Audio"}
                    </div>
                  )
                }
                {event.type === "IN_PERSON" && (
                  <div className=" text-md ml-4 mt-1 min-w-[80px] rounded-md bg-green-200 bg-opacity-30 px-2 py-1 text-green-800">
                    In-person
                  </div>
                )}
                <div className="mb-5 mt-1 flex flex-row items-center"></div>

                <p className="text-lg font-bold">Social Media</p>
                <div className="mt-6 flex w-full flex-row flex-wrap gap-x-2 gap-y-4">
                  {event.tags?.map((tag) => (
                    <div
                      key={tag.id}
                      className="rounded-lg bg-purple-100/50 px-4 py-1 text-sm text-slate-800"
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sticky top-0 flex w-4/12 flex-col px-4">
          <div className="sticky top-10 flex flex-col">

            <Link
              href={
                event.userHost
                  ? `/user/${event.userHost?.id}`
                  : `/org/${event.orgHost?.id}`
              }
              className="mt-8 flex flex-row rounded-xl border shadow-sm"
            >
              <div className="relative mx-2 my-2 flex aspect-square h-24 items-center justify-center ">
                {/* TODO: Add user/org image */}
                {event.image ? (
                  <Image
                    src={event.image}
                    alt="selected image"
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    className="rounded-lg transition-opacity duration-500 group-hover:opacity-70"
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <div className="flex-start flex flex-col px-4 py-4">
                <p className="mt-2 font-semibold">
                  {event.userHost
                    ? getDisplayName(event.userHost)
                    : event.orgHost?.name}
                </p>
                <div className="mt-4 flex flex-row items-center">
                  <CheckBadgeIcon
                    className="blue blue-500 mr-1 h-6 w-6"
                    color="#6e13c8"
                  />
                  <p className="text-gray-600">
                    {event.userHost
                      ? "Verified student"
                      : "Verified Organization"}
                  </p>
                </div>
              </div>
            </Link>

              {event.type === "ONLINE_VIDEO" && (
                <div className="my-4 flex w-full flex-row items-center px-4">
                  <VideoCameraIcon
                    className="mr-4 h-6 w-6 flex-shrink-0"
                    color="gray"
                  />
                  <p>
                    The live video stream will become available here{" "}
                    <span className="font-bold">10 minutes</span> before the
                    event starts
                  </p>
                </div>
              )}
              {event.type === "ONLINE_AUDIO" && (
                <div className="my-4 flex w-full flex-row items-center px-4">
                  <MicrophoneIcon
                    className="mr-4 h-6 w-6 flex-shrink-0"
                    color="gray"
                  />
                  <p>
                    The audio video stream will become available here{" "}
                    <span className="font-bold">10 minutes</span> before the
                    event starts
                  </p>
                </div>
              )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
