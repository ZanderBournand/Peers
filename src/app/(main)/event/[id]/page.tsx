/*
  File -> Display page for a specific event
  - Includes event info, host (user & org), countdown timer, map for in-person events
  - Actions include joining the event, sharing the event, marking attendance & editing the event (if)
*/

import React from "react";
import { api } from "@/trpc/server";
import Image from "next/image";
import {
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  InformationCircleIcon,
  SignalIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  getDisplayName,
  getFormattedDuration,
  shouldDisplayJoinButton,
  eventCountdownTime,
} from "@/lib/utils";
import ShareButton from "@/components/events/ShareButton";
import { headers } from "next/headers";
import AttendButton from "@/components/events/AttendButton";
import Link from "next/link";
import type { UserData } from "@/lib/interfaces/userData";
import type { EventData } from "@/lib/interfaces/eventData";
import Map from "@/components/location/Map";
import { VideoCallButton } from "@/components/events/VideoCallButton";
import { PiStudentFill } from "react-icons/pi";
import StatusPing from "@/components/events/StatusPing";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import EventTime from "@/components/events/EventTime";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event: EventData = await api.events.get.query({ id: params.id });
  const user: UserData = await api.users.getUser.query({});

  const duration = getFormattedDuration(event.duration);

  const eventLink = headers().get("x-url");
  const eventJoinStatus = shouldDisplayJoinButton(event.date, event.duration);
  const endTime = new Date(event.date.getTime() + event.duration * 60000);

  const isHost =
    event.orgHost?.admins?.some((admin) => admin.id === user.id) ??
    event.userHost?.id === user.id;
  const host = event.userHost ?? event.orgHost;

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="my-16 flex w-full max-w-screen-xl flex-col items-center self-center lg:flex-row lg:items-start">
        <div className="flex w-full max-w-[875px] flex-col items-start px-4 lg:w-8/12 lg:px-20">
          <div className="relative flex aspect-video w-full items-center justify-center rounded-xl bg-gray-50">
            {event.image ? (
              <Image
                src={event.image}
                alt="selected image"
                fill
                sizes="100%"
                style={{
                  objectFit: "cover",
                }}
                className="rounded-xl transition-opacity duration-500 group-hover:opacity-70"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
          <div className="mt-8 w-full">
            <div className="flex flex-row items-center">
              {endTime > new Date() ? (
                <StatusPing eventType={event.type} />
              ) : (
                <NoSymbolIcon className="mr-2 h-5 w-5" color="grey" />
              )}
              <p className="text-md text-xl">
                {eventCountdownTime(event.date, event.duration)}
              </p>
            </div>
            <div className="mb-5 mt-1 flex flex-col items-start justify-between sm:flex-row lg:items-center">
              <div className="flex flex-row items-center">
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
              {isHost && (
                <Link href={`/event/${params.id}/edit`}>
                  <Button className="mt-2 lg:ml-8 lg:mt-0">
                    <MdEdit color="white" className="mr-2 h-5 w-5" />
                    Edit
                  </Button>
                </Link>
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
                </div>
              </div>
              <p className="text-md my-5 whitespace-pre-line font-normal">
                {event.userHost ? (
                  event.userHost?.bio ? (
                    event.userHost?.bio
                  ) : (
                    <span className="text-center text-sm">
                      {"The host didn't provide a bio"}
                    </span>
                  )
                ) : (
                  event.orgHost?.description
                )}
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
        <div className="sticky top-0 mt-16 flex w-full flex-col px-4 lg:mt-0 lg:w-4/12">
          <div className="sticky top-10 flex flex-col lg:flex-col-reverse">
            <div className="flex w-full max-w-screen-lg flex-col items-center lg:mt-8 lg:items-start">
              <Link
                href={
                  event.userHost
                    ? `/user/${event.userHost?.id}`
                    : `/organization/${event.orgHost?.id}`
                }
                className="flex w-full max-w-[500px] flex-row rounded-xl border shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <div className="relative mx-2 my-2 flex aspect-square h-20 items-center justify-center ">
                    {event.image ? (
                      <Image
                        src={
                          event.userHost
                            ? event?.userHost?.image ?? ""
                            : event?.orgHost?.image ?? ""
                        }
                        alt="selected image"
                        fill
                        sizes="100%"
                        style={{
                          objectFit: "cover",
                        }}
                        className={`${
                          event.userHost ? "rounded-full" : "rounded-lg"
                        } transition-opacity duration-500 group-hover:opacity-70`}
                      />
                    ) : (
                      <div className="flex items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-start flex flex-col px-2 py-2">
                  <div className="mt-2 flex flex-row items-center">
                    <p className="font-semibold">
                      {event.userHost
                        ? getDisplayName(event.userHost)
                        : event.orgHost?.name}
                    </p>
                    <CheckBadgeIcon
                      className="blue blue-500 ml-1 h-6 w-6"
                      color="#6e13c8"
                    />
                  </div>
                  <div className="mt-2 flex flex-row items-center">
                    <>
                      {host?.university?.isLogoUploaded ? (
                        <Image
                          src={host?.university?.logo ?? ""}
                          alt="selected image"
                          width={23}
                          height={23}
                          style={{
                            objectFit: "cover",
                          }}
                          className="mr-1.5 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
                        />
                      ) : (
                        <PiStudentFill className="mr-2" />
                      )}
                      <p className="text-gray-600">{host?.university?.name}</p>
                    </>
                  </div>
                </div>
              </Link>
              <div className="mt-6 flex w-full max-w-[500px] flex-col rounded-xl border shadow-sm">
                <div className="my-4 flex w-full flex-row items-center px-4">
                  <ClockIcon className="mr-4 h-6 w-6" color="gray" />
                  <div>
                    <EventTime date={event.date} mode="full" />
                    <p className="text-sm text-gray-500">Aprox. {duration}</p>
                  </div>
                </div>
                {(event.type === "ONLINE_VIDEO" ||
                  event.type === "ONLINE_AUDIO") && (
                  <div className="my-4 flex w-full flex-row items-center px-4">
                    {eventJoinStatus === "live" ? (
                      <>
                        <SignalIcon
                          className="mr-4 h-6 w-6 flex-shrink-0"
                          color="gray"
                        />
                        <VideoCallButton
                          type={event.type}
                          event={event}
                          user={user}
                        />
                      </>
                    ) : eventJoinStatus === "upcoming" ? (
                      <>
                        {event.type === "ONLINE_VIDEO" ? (
                          <VideoCameraIcon
                            className="mr-4 h-6 w-6 flex-shrink-0"
                            color="gray"
                          />
                        ) : (
                          <MicrophoneIcon
                            className="mr-4 h-6 w-6 flex-shrink-0"
                            color="gray"
                          />
                        )}
                        <p>
                          The live
                          {event.type === "ONLINE_VIDEO"
                            ? " video "
                            : " audio "}
                          stream will become available here
                          <span className="font-bold"> 10 minutes </span>before
                          the event starts
                        </p>
                      </>
                    ) : (
                      <>
                        <NoSymbolIcon
                          className="mr-4 h-6 w-6 flex-shrink-0"
                          color="gray"
                        />
                        <p>This event has ended</p>
                      </>
                    )}
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
                        <p className="text-sm text-gray-500">
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
                          {event.locationDetails}
                        </p>
                      </div>
                    )}
                    <div className="flex w-full">
                      <Map
                        address={event.location}
                        width="100%"
                        height="300px"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              {eventJoinStatus !== "ended" && (
                <div className="flex flex-row justify-center">
                  <ShareButton textToCopy={eventLink} />
                  <AttendButton user={user} event={event} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
