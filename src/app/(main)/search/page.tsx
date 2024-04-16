"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EventPreview from "@/components/events/EventPreview";
import OrgHostPreview from "@/components/organizations/OrgHostPreview";
import UserHostPreview from "@/components/user/UserHostPreview";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("events");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const input =
        new URLSearchParams(window.location.search).get("input") ?? "";
      setSearchInput(input);
    }
  }, []);

  const eventSearch = api.events.searchEvents.useQuery({ searchInput });
  const orgSearch = api.organizations.searchOrganizations.useQuery({
    searchInput,
  });
  const userSearch = api.users.searchUsers.useQuery({ searchInput });

  useEffect(() => {
    if (
      eventSearch.status == "success" &&
      orgSearch.status == "success" &&
      userSearch.status == "success"
    ) {
      setIsLoading(false);
    }
  }, [eventSearch.status, orgSearch.status, userSearch.status]);

  const categories = ["events", "organizations", "users"];

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
        <p className="mb-4 text-2xl font-bold">
          Search Results for &lsquo;{searchInput}&rsquo;
        </p>
        <div className="my-2 flex flex-row items-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => {
                setSearchCategory(category);
              }}
              className={`text-md mr-4 flex flex-row items-center border px-4 py-2  ${
                searchCategory === category && "bg-purple-100/50 font-semibold"
              }`}
            >
              {searchCategory === category ? (
                <CheckCircleIcon className="mr-2 h-6 w-6 text-purple-950" />
              ) : (
                <MagnifyingGlassIcon className="mr-2 h-5 w-5 text-purple-950" />
              )}
              {/* {searchCategory === category ? "✔️ " : "⬜️ "} */}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <Separator className="mt-6" style={{ margin: "15px 15px" }} />

        {isLoading ? (
          <p className="text-lg font-semibold">Loading...</p>
        ) : (
          <>
            {searchCategory === "users" &&
              userSearch?.data &&
              (userSearch?.data?.length > 0 ? (
                <div className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                  {userSearch?.data?.map((result, index) => (
                    <UserHostPreview key={index} user={result} />
                  ))}
                </div>
              ) : (
                <p>No users found.</p>
              ))}

            {searchCategory === "organizations" &&
              orgSearch?.data &&
              (orgSearch?.data?.length > 0 ? (
                <div className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {orgSearch?.data?.map((result, index) => (
                    <OrgHostPreview key={index} organization={result} />
                  ))}
                </div>
              ) : (
                <p>No organizations found.</p>
              ))}

            {searchCategory === "events" &&
              eventSearch?.data &&
              (eventSearch?.data?.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {eventSearch?.data?.map((result, index) => (
                    <EventPreview key={index} event={result} />
                  ))}
                </div>
              ) : (
                <p>No events found.</p>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
