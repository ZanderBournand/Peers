import { type OrganizationData } from "@/lib/interfaces/organizationData";
import { type UserData } from "@/lib/interfaces/userData";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { shuffle } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HostSectionProps {
  hosts: {
    users: UserData[];
    organizations: OrganizationData[];
  };
}

export default function HostSection({ hosts }: HostSectionProps) {
  const hostsList: (UserData | OrganizationData)[] = shuffle([
    ...hosts.users,
    ...hosts.organizations,
  ]);

  const UserRenderCard = ({ user }: { user: UserData }) => (
    <Link
      href={`/user/${user.id}`}
      className="flex flex-row items-center rounded-xl border shadow-sm"
    >
      <div className="relative my-2 ml-4 mr-2 flex aspect-square h-16 items-center justify-center rounded-full">
        <Image
          src={user.image}
          alt="host image"
          fill
          sizes="100%"
          style={{
            objectFit: "cover",
          }}
          className="rounded-full transition-opacity duration-500 group-hover:opacity-70"
        />
      </div>
      <div className="flex-start flex flex-col px-2 py-2">
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>
        <div className="mt-1 flex flex-row items-center">
          <CheckBadgeIcon
            className="blue blue-500 mr-1 h-5 w-5"
            color="#6e13c8"
          />
          <p className="text-sm text-gray-600">{user.university}</p>
        </div>
        <div className="mt-2 flex flex-row">
          {user?.skills?.slice(0, 2).map((skill) => (
            <div
              key={skill}
              className="mr-2 rounded-lg bg-purple-100/30 px-4 py-1 text-xs text-slate-600"
            >
              {skill}
            </div>
          ))}
          {user.skills?.length > 2 && (
            <div className="px-4 py-1 text-xs text-slate-800">
              +{user.skills.length - 2}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  const OrganizationRenderCard = ({
    organization,
  }: {
    organization: OrganizationData;
  }) => (
    <Link
      href={`/organization/${organization.id}`}
      className="flex flex-row items-center rounded-xl border shadow-sm"
    >
      <div className="relative mx-2 ml-4 mr-2 flex aspect-square h-16 items-center justify-center ">
        <Image
          src={organization.image ?? ""}
          alt="host image"
          fill
          sizes="100%"
          style={{
            objectFit: "cover",
          }}
          className="rounded-lg transition-opacity duration-500 group-hover:opacity-70"
        />
      </div>
      <div className="flex-start flex flex-col px-2 py-2">
        <p className="font-semibold">{organization.name}</p>
        <div className="mt-1 flex flex-row items-center">
          <CheckBadgeIcon
            className="blue blue-500 mr-1 h-5 w-5"
            color="#6e13c8"
          />
          <p className="text-sm text-gray-600">{organization.university}</p>
        </div>

        <div className="mt-2 flex w-max flex-row items-center rounded-sm bg-purple-100/30 px-2 py-0.5 text-xs text-slate-600">
          <AcademicCapIcon className="mr-1 h-5 w-5" />
          {organization.type}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="my-8 flex w-full flex-col">
      <div className="flex flex-row items-end justify-between">
        <Link href="/feed/hosts">
          <p className="text-2xl font-bold">Top Hosts for You</p>
        </Link>
        <Link href="/feed/hosts">
          <p className="mb-0.5 ml-4 text-gray-700 hover:underline">View more</p>
        </Link>
      </div>
      <div className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        {hostsList.map((host) =>
          "firstName" in host ? (
            <UserRenderCard user={host} key={host.id} />
          ) : (
            <OrganizationRenderCard organization={host} key={host.id} />
          ),
        )}
      </div>
    </div>
  );
}
