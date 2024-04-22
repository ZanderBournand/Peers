/*
  File -> Preview card used for display user hosts
  - Used throughout the application to provide a preview of a user's profile
  - Redirects to the user's profile page when clicked
*/

import { type UserData } from "@/lib/interfaces/userData";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PiStudentFill } from "react-icons/pi";

interface UserHostPreviewProps {
  user: UserData;
}

export default function UserHostPreview({ user }: UserHostPreviewProps) {
  return (
    <Link
      href={`/user/${user.id}`}
      className="flex max-w-[400px] flex-row items-center rounded-xl border shadow-sm"
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
        <div className="flex flex-row items-center">
          <p className="font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <CheckBadgeIcon
            className="blue blue-500 ml-1 h-5 w-5"
            color="#6e13c8"
          />
        </div>
        <div className="mt-1 flex flex-row items-center">
          {user?.university?.isLogoUploaded ? (
            <Image
              src={user?.university?.logo ?? ""}
              alt="selected image"
              width={20}
              height={20}
              style={{
                objectFit: "cover",
              }}
              className="mr-1.5 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
            />
          ) : (
            <PiStudentFill className="mr-2" />
          )}
          <p className="text-sm text-gray-600">{user.university?.name}</p>
        </div>
        {user?.interests && (
          <div className="mt-2 flex flex-row">
            {user?.interests?.slice(0, 2).map((interest) => (
              <div
                key={interest.id}
                className="mr-2 rounded-lg bg-purple-100/30 px-2 py-1 text-xs text-slate-600"
              >
                {interest.name}
              </div>
            ))}
            {user?.interests?.length > 2 && (
              <div className="px-2 py-1 text-xs text-slate-800">
                +{user?.interests.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
