import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TagCategory } from "@prisma/client";
import { formatEnumName } from "@/lib/utils";

export default function EventCategories() {
  const categories = Object.values(TagCategory as Record<string, string>).map(
    (category) => ({
      name: category,
      image: `/assets/categories/${category.toLowerCase()}.png`,
    }),
  );

  return (
    <div className="my-4 flex w-full flex-col">
      <Link href="/feed/categories">
        <p className="text-2xl font-bold">Explore Categories</p>
      </Link>
      <div className="mt-10 grid w-full grid-cols-2 gap-y-4 lg:grid-cols-5 lg:gap-x-8">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/feed/categories?category=${category.name.toLowerCase()}`}
          >
            <div className="flex h-32 w-32 transform flex-col items-center justify-center rounded-lg border px-4 py-2 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <Image
                src={category.image}
                alt={category.name}
                width="48"
                height="48"
              />
              <p className="mt-2 text-center text-base font-semibold">
                {formatEnumName(category.name)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
