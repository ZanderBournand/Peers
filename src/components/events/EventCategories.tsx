import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function EventCategories() {
  const categories = [
    { name: "Tech", image: "/assets/categories/tech.png" },
    { name: "Art", image: "/assets/categories/art.png" },
    { name: "Sports", image: "/assets/categories/sports.png" },
    { name: "Language", image: "/assets/categories/language.png" },
    { name: "Business", image: "/assets/categories/business.png" },
    { name: "Education", image: "/assets/categories/education.png" },
    { name: "Social Impact", image: "/assets/categories/social_impact.png" },
    {
      name: "Science & Engineering",
      image: "/assets/categories/science_and_engineering.png",
    },
    {
      name: "Culture & History",
      image: "/assets/categories/culture_and_history.png",
    },
    {
      name: "Personal Development",
      image: "/assets/categories/personal_development.png",
    },
  ];

  return (
    <div className="my-4 flex w-full flex-col">
      <Link href="/feed/categories">
        <p className="text-2xl font-bold">Explore Categories</p>
      </Link>
      <div className="mt-10 grid w-full grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-5">
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
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
