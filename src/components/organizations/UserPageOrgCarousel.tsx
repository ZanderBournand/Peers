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

interface UserPageOrganizationCarouselProps {
  organizations: OrganizationData[];
}

export default function UserPageOrganizationCarousel({
  organizations,
}: UserPageOrganizationCarouselProps) {
  return (
    <Carousel className="my-2 ml-6 w-11/12 items-center justify-center">
      <CarouselContent className="mx-2">
        {organizations.map((organization) => (
          <CarouselItem key={organization.id} className="mx-1 basis-2/5 pl-4">
            <Link href={`/organization/${organization.id}`}>
              <div className="items-center justify-center">
                <div className="flex">
                  <div className="group flex w-48 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:border-gray-100 hover:shadow-sm">
                    <div className="relative flex aspect-video w-full items-center justify-center bg-gray-50">
                      {organization.image ? (
                        <>
                          <Image
                            src={organization.image}
                            alt="selected image"
                            fill
                            style={{
                              objectFit: "cover",
                            }}
                            className="rounded-t-2xl transition-opacity duration-500 group-hover:opacity-85"
                          />
                        </>
                      ) : (
                        <div className="flex items-center justify-center text-gray-500">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mx-4 my-4 flex flex-col">
                  <p className="truncate text-sm font-bold">
                    {organization.name}
                  </p>
                  <p className="truncate text-sm">{organization.type}</p>
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
