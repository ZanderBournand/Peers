import { type OrganizationData } from "@/lib/interfaces/organizationData";
import { type UserData } from "@/lib/interfaces/userData";
import { shuffle } from "lodash";
import Link from "next/link";
import React from "react";
import UserHostPreview from "../user/UserHostPreview";
import OrgHostPreview from "../organizations/OrgHostPreview";
import { PlusIcon } from "@heroicons/react/24/outline";

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

  return (
    <div className="my-8 flex w-full flex-col">
      <div className="flex flex-col items-start lg:flex-row lg:items-end">
        <Link href="/feed/hosts">
          <p className="text-2xl font-bold">Top Hosts for You</p>
        </Link>
        <Link
          href="/feed/hosts"
          className="flex flex-row items-center hover:underline lg:ml-4"
        >
          <PlusIcon className="h-5 w-5 text-gray-700" />
          <p className="mb-0.5 ml-1 text-gray-700 ">View more</p>
        </Link>
      </div>
      <div className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        {hostsList
          ?.slice(0, 6)
          .map((host) =>
            "firstName" in host ? (
              <UserHostPreview user={host} key={host.id} />
            ) : (
              <OrgHostPreview organization={host} key={host.id} />
            ),
          )}
      </div>
    </div>
  );
}
