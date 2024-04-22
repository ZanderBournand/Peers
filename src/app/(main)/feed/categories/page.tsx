/*
  File -> Page to search events by categories
  - Extends the home page preview of categories
  - Can multi-select categories to filter events
*/

"use client";

import EventPreview from "@/components/events/EventPreview";
import { Separator } from "@/components/ui/separator";
import { formatEnumName } from "@/lib/utils";
import { api } from "@/trpc/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { TagCategory } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

interface EventCategoriesProps {
  searchParams: {
    category: string;
  };
}

export default function EventCategories({
  searchParams,
}: EventCategoriesProps) {
  const initialCategories: TagCategory[] =
    (searchParams?.category &&
      (
        searchParams?.category
          ?.split(",")
          ?.map((category) => category.toUpperCase()) as TagCategory[]
      ).filter((category) =>
        Object.values(TagCategory).includes(category as TagCategory),
      )) ||
    [];

  const [selectedCategories, setSelectedCategories] =
    useState<TagCategory[]>(initialCategories);

  const {
    data: events,
    refetch,
    isLoading,
  } = api.events.getEventsByCategories.useQuery({
    categories: selectedCategories,
  });

  const allCategories = Object.values(
    TagCategory as Record<string, string>,
  ).map((category) => ({
    name: category as TagCategory,
    image: `/assets/categories/${category.toLowerCase()}.png`,
  }));

  const handleCategoryClick = (category: TagCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  useEffect(() => {
    refetch().catch((error) => {
      console.error(error);
    });
  }, [selectedCategories, refetch]);

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
        <p className="text-2xl font-bold">Explore Categories</p>
        <p className="mt-1">
          Search events by their categories. Start by selecting a few categories
          below!
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-5">
          {allCategories.map((category) => (
            <div
              key={category.name}
              className={`relative flex max-w-[400px] cursor-pointer flex-row items-center rounded-xl border px-4 py-2 shadow-sm ${
                selectedCategories.includes(category.name) &&
                "border-purple-600"
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Image
                src={category.image}
                alt={category.name}
                width="48"
                height="48"
              />
              <p className="ml-4 text-base font-semibold">
                {formatEnumName(category.name)}
              </p>
              {selectedCategories.includes(category.name) && (
                <div className="absolute -right-2 -top-2 rounded-full bg-purple-500 p-1">
                  <CheckIcon className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        <Separator className="mt-6" />
        {!isLoading && events && events?.length > 0 ? (
          <div className="mt-12 grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {events?.map((event) => (
              <EventPreview key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-64 flex w-full flex-col items-center justify-center">
            {isLoading ? (
              <div className="flex flex-row items-center">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <p>Loading events...</p>
              </div>
            ) : (
              <p>No events match your selection. Browse other categories!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
