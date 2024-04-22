/*
  File -> Used to display "temporary" loading skeletons while the home page data is being fetched
  - This is a "placeholder" for the actual home page
*/

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-16 flex max-w-screen-2xl flex-col px-12">
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-6 w-6 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.3s]" />
            <div className="h-6 w-6 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.15s]" />
            <div className="h-6 w-6 animate-bounce rounded-full bg-gray-300/50" />
          </div>
        </div>
        <div className="mt-16 flex w-full flex-col items-center md:flex-row md:items-start">
          <div className="order-2 mt-10 flex w-full flex-shrink-0 flex-col md:order-1 md:w-9/12">
            <div className="flex w-full flex-col md:w-11/12">
              <div className="my-4 flex flex-col">
                <div className="flex w-full flex-col items-start lg:flex-row lg:items-end">
                  <Skeleton className="h-10 w-[250px]" />
                </div>
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-[300px] w-[225px] rounded-xl"
                    />
                  ))}
                </div>
              </div>
              <div className="my-4 mt-8 flex w-full flex-col">
                <div className="flex w-full flex-col items-start lg:flex-row lg:items-end">
                  <Skeleton className="h-10 w-[250px]" />
                </div>
                <div className="mt-8 grid w-full grid-cols-2 gap-y-4 lg:grid-cols-5 lg:gap-x-8">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-[125px] w-[125px] rounded-xl"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 mt-10 flex w-3/12 flex-shrink-0 flex-col items-center md:sticky md:top-24 md:order-2 md:mt-16">
            <Skeleton className="h-[400px] w-[300px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
