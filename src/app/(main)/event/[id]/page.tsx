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
  countdownDays,
  formattedAddressObj,
  formattedDuration,
  type formattedAddress,
} from "@/lib/utils";
import ShareButton from "@/components/events/ShareButton";
import { headers } from "next/headers";
import AttendButton from "@/components/events/AttendButton";
import Link from "next/link";
import { type z } from "zod";
import { type EventSchema } from "@/lib/validators/Events";
import { type UserSchema } from "@/lib/validators/User";
import Map from "@/components/googleMaps/Map";

export type EventType = z.infer<typeof EventSchema>;
export type UserType = z.infer<typeof UserSchema>;

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event: EventData = await api.events.get.query({ id: params.id });
  const user: UserData = await api.users.getUser.query({});
  const user: UserData = await api.users.getUser.query({});

  const countdownDate = countdownDays(event.date);
  const duration = formattedDuration(event.duration);
  const formattedDate = event.date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const eventLink = headers().get("x-url");

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="my-16 flex w-full max-w-screen-xl flex-row self-center">
        <div className="flex w-8/12 flex-col items-start px-20">
          <div className="relative flex aspect-video w-full items-center justify-center rounded-xl bg-gray-50">
          <div className="relative flex aspect-video w-full items-center justify-center rounded-xl bg-gray-50">
            {event.image ? (
              <Image
                src={event.image}
                alt="selected image"
                fill
                sizes="100%"
                sizes="100%"
                style={{
                  objectFit: "cover",
                }}
                className="rounded-xl transition-opacity duration-500 group-hover:opacity-70"
                className="rounded-xl transition-opacity duration-500 group-hover:opacity-70"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
          <div className="mt-8">
            <div className="flex flex-row items-center">
              <div className="relative">
                <div
                  className={`h-3 w-3 rounded-full ${
                    event.type === "ONLINE_VIDEO"
                      ? "bg-blue-300"
                      : event.type === "ONLINE_AUDIO"
                        ? "bg-purple-300"
                        : "bg-green-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-0 top-0 h-3 w-3 animate-slow-ping rounded-full ${
                    event.type === "ONLINE_VIDEO"
                      ? "bg-blue-400"
                      : event.type === "ONLINE_AUDIO"
                        ? "bg-purple-400"
                        : "bg-green-400"
                  }`}
                ></div>
                <div
                  className={`absolute left-0 top-0 h-3 w-3 animate-slow-pulse rounded-full ${
                    event.type === "ONLINE_VIDEO"
                      ? "bg-blue-300"
                      : event.type === "ONLINE_AUDIO"
                        ? "bg-purple-300"
                        : "bg-green-300"
                  }`}
                ></div>
              </div>
              <p className="text-md ml-3 text-xl">{countdownDate}</p>
            </div>
            <div className="mb-5 mt-1 flex flex-row items-center">
              <p className="text-2xl font-bold">{event.title}</p>
              {event.type === "ONLINE_VIDEO" && (
                <div className="ml-4 mt-1 flex w-max flex-row items-center rounded-md bg-blue-200 bg-opacity-30 px-2 py-1 text-sm text-cyan-800">
                  {"Online -"}
                  <VideoCameraIcon className="mx-1 h-5 w-5" />
                  {"Video"}
                </div>
              )}
              {event.type === "ONLINE_AUDIO" && (
                <div className="ml-4 mt-1 flex w-max flex-row items-center rounded-md bg-purple-300 bg-opacity-30 px-2 py-1 text-sm text-purple-800">
                  {"Online -"}
                  <MicrophoneIcon className="mx-1 h-5 w-5" />
                  {"Audio"}
                </div>
              )}
              {event.type === "IN_PERSON" && (
                <div className=" text-md ml-4 mt-1 min-w-[80px] rounded-md bg-green-200 bg-opacity-30 px-2 py-1 text-green-800">
                  In-person
                </div>
              )}
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
                  {event.userHost
                    ? getDisplayName(event.userHost)
                    : event.orgHost?.name}
                </div>
              </div>
              <p className="text-md my-5 whitespace-pre-line font-normal">
                {/* TODO: Display organization bio */}
                {/* TODO: Display organization bio */}
                {event.userHost ? event.userHost?.bio : "[INSERT ORG BIO HERE]"}
              </p>
            </div>
            {event.tags && event.tags.length > 0 && (
              <div className="mt-4 flex flex-col">
                <p className="text-lg font-bold">Tags</p>
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
            <div className="flex flex-row justify-center">
              <ShareButton textToCopy={eventLink} />
              <AttendButton user={user} event={event} />
            </div>
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
                    sizes="100%"
                    sizes="100%"
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
            <div className="mt-6 flex flex-col rounded-xl border shadow-sm">
              <div className="my-4 flex w-full flex-row items-center px-4">
                <ClockIcon className="mr-4 h-6 w-6" color="gray" />
                <div>
                  <p>{formattedDate}</p>
                  <p className="text-sm text-gray-500">Aprox. {duration}</p>
                </div>
              </div>
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
              {event.type === "IN_PERSON" && (
                <div className="flex flex-col">
                  <div className="my-4 flex w-full flex-row items-center px-4">
                    <MapPinIcon
                      className="mr-4 h-6 w-6 flex-shrink-0"
                      color="gray"
                    />
                    <div className="flex-start flex flex-col">
                      <p>{event?.location?.split(",")[0]}</p>
                      <p>{event?.location?.split(",")[0]}</p>
                      <p className="text-sm text-gray-500">
                        {event?.location?.split(",").slice(1).join(",")}
                        {event?.location?.split(",").slice(1).join(",")}
                      </p>
                    </div>
                  </div>
                  {event.locationDetails && (
                    <div className="mb-4 ml-12 flex w-10/12 flex-row rounded-sm">
                      <InformationCircleIcon
                        className="mx-1 h-5 w-5 flex-shrink-0"
                        color="gray"
                      />
                      <p className="mr-1 text-sm  text-gray-600">
                    <div className="mb-4 ml-12 flex w-10/12 flex-row rounded-sm">
                      <InformationCircleIcon
                        className="mx-1 h-5 w-5 flex-shrink-0"
                        color="gray"
                      />
                      <p className="mr-1 text-sm  text-gray-600">
                        {event.locationDetails}
                      </p>
                    </div>
                  )}
                  <div className="flex w-full">
                    <Map address={event.location} width="100%" height="300px" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
