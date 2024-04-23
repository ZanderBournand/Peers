/*
  File -> Navigation bar component used throughout the appliation's main pages
  - Contains links to different pages, search bar, and user profile dropdown
  - Contains mobile menu for smaller screens
*/

"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import {
  BellAlertIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/trpc/react";
import { type UserData } from "@/lib/interfaces/userData";

const routes: { title: string; href: string }[] = [
  { title: "My Events", href: "/myevents" },
  { title: "Leaderboard", href: "/leaderboard" },
];

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const user = api.users.getUser.useQuery({}).data;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue) {
      window.location.href = `/search?input=${searchValue}`;
    }
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-b-border">
      <div className="relative mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 lg:px-14">
        <div className="flex items-center ">
          <a href={"/"} className="shrink-0">
            <h1 className="text-2xl font-bold text-accent-foreground">Peers</h1>
          </a>
          <div className="hidden w-full flex-row items-center justify-end gap-1 bg-background px-4 py-2 sm:flex">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.href}
                className={`inline-flex h-10 w-full items-center px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-accent-foreground sm:w-auto`}
              >
                {route.title}
              </Link>
            ))}
            <Link
              href={"/user/" + user?.id}
              className={`${
                !user && "pointer-events-none"
              } inline-flex h-10 w-full items-center px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-accent-foreground sm:w-auto`}
            >
              {"Profile"}
            </Link>
            {user && !user?.firstName && !user?.lastName && (
              <Link
                href="/user/edit"
                className="py-flex-row ml-2 mt-1 flex h-8 items-center rounded-md bg-purple-50 px-2 text-sm text-purple-900"
              >
                <BellAlertIcon className="mr-1 h-5 w-5" />
                <span className="hidden lg:inline">Complete your profile!</span>
                <span className="lg:hidden">1</span>
              </Link>
            )}
            <form
              onSubmit={handleSearchSubmit}
              className="ml-8 flex w-36 items-center md:w-72 lg:w-96"
            >
              <div className="flex w-full items-center space-x-2 rounded-lg border border-gray-300">
                <MagnifyingGlassIcon className="ml-3 mr-1 h-5 w-5" />
                <Input
                  className="w-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  placeholder="Search..."
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
        </div>

        {children}

        {menuOpen && (
          <MobileMenu user={user ?? null} toggleMenu={toggleMenu}>
            {children}
          </MobileMenu>
        )}

        <button onClick={toggleMenu} className="sm:hidden">
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>
    </div>
  );
};

const MobileMenu: React.FC<{
  toggleMenu: () => void;
  user: UserData | null;
  children: React.ReactNode;
}> = ({ toggleMenu, user, children }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue) {
      window.location.href = `/search?input=${searchValue}`;
    }
  };

  return (
    <div className="absolute right-0 top-16 z-50 flex h-[calc(100vh-64px)] w-full flex-col">
      <div className="flex w-full grow flex-col gap-1 bg-background px-4 pb-2 sm:hidden">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            onClick={toggleMenu}
            className={`inline-flex h-10 w-full items-center text-sm text-muted-foreground transition-colors hover:text-accent-foreground sm:w-auto`}
          >
            {route.title}
          </Link>
        ))}
        {user && (
          <Link
            href={"/user/" + user?.id}
            className={`${
              !user && "pointer-events-none"
            } inline-flex h-10 w-full items-center text-sm text-muted-foreground transition-colors hover:text-accent-foreground sm:w-auto`}
          >
            {"Profile"}
          </Link>
        )}
        {user && !user?.firstName && !user?.lastName && (
          <Link
            href="/user/edit"
            className="py-flex-row mb-2 flex h-8 w-48 items-center rounded-md bg-purple-50 px-2 text-sm text-purple-900"
          >
            <BellAlertIcon className="mr-1 h-5 w-5" />
            Complete your profile!
          </Link>
        )}
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-10/12 items-center"
        >
          <div className="flex w-full items-center space-x-2 rounded-lg border border-gray-300">
            <MagnifyingGlassIcon className="ml-3 mr-1 h-5 w-5" />
            <Input
              className="w-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Search..."
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </form>
        {children}
      </div>
      <div className="h-screen w-full bg-background/60 sm:hidden" />
    </div>
  );
};

export default Navbar;
