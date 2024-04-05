import { type OrganizationData } from "@/lib/interfaces/organizationData";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OrgHostPreviewProps {
  organization: OrganizationData;
}

export default function OrgHostPreview({ organization }: OrgHostPreviewProps) {
  return (
    <Link
      href={`/organization/${organization.id}`}
      className="flex max-w-[400px] flex-row items-center rounded-xl border shadow-sm"
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
}
