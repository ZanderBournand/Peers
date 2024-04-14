"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { OrganizationData } from "@/lib/interfaces/organizationData";
import { formatEnumName } from "@/lib/utils";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

interface UserPageOrganizationCarouselProps {
  organizations: OrganizationData[];
}

export default function UserPageOrganizationCarousel({
  organizations,
}: UserPageOrganizationCarouselProps) {
  return (
    <Carousel className="my-2 ml-6 w-11/12 items-center justify-center">
      <CarouselContent className="mx-2 mt-2">
        {organizations.map((organization) => (
          <CarouselItem key={organization.id} className="mr-4 basis-1/2 pl-4">
            <Link
              href={`/organization/${organization.id}`}
              className="flex flex-row items-center transition-all duration-200 hover:scale-105"
            >
              <div className="relative flex aspect-square h-[75px] items-center justify-center ">
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
              <div className="flex-start ml-3 flex flex-col">
                <div className="flex h-10 flex-row items-center">
                  <p className="line-clamp-2 text-sm font-semibold">
                    {organization.name}
                  </p>
                </div>
                <div className="mb-2 mt-2 flex flex-row items-center">
                  <Image
                    src={organization?.university?.logo ?? ""}
                    alt="selected image"
                    width={20}
                    height={20}
                    style={{
                      objectFit: "cover",
                    }}
                    className="mr-2 rounded transition-opacity duration-500 group-hover:opacity-70"
                  />
                  <div className="flex w-max flex-row items-center rounded-sm bg-purple-100/30 px-2 py-0.5 text-xs text-slate-600">
                    <AcademicCapIcon className="mr-1 h-5 w-5" />
                    {formatEnumName(organization.type)}
                  </div>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="mr-4 border-black" />
      <CarouselNext className="ml-4 border-black" />
    </Carousel>
  );
}
