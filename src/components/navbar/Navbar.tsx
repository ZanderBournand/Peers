"use client";
import Link from "next/link";
import React, { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { createClient } from "@/utils/supabase/client";

const routes: { title: string; href: string }[] = [
  { title: "My Events", href: "/myevents" },
];

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const supabase = createClient();

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
      window.location.href = `/search?term=${searchValue}`;
    }
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-b-border px-6 lg:px-14">
      <div className="flex items-center">
        <Link href={"/"} className="shrink-0">
          <h1 className="text-2xl font-bold text-accent-foreground">Peers</h1>
        </Link>
        <div className="hidden w-full justify-end gap-1 bg-background px-4 py-2 sm:flex">
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
            className={`inline-flex h-10 w-full items-center px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-accent-foreground sm:w-auto`}
          >
            {"Profile"}
          </Link>
          {user && !user?.firstName && !user?.lastName && (
            <Link
              href="/user/edit"
              className="py-flex-row ml-2 mt-1 flex h-8 items-center rounded-md bg-purple-50 px-2 text-sm text-purple-900"
            >
              <BellAlertIcon className="mr-1 h-5 w-5" />
              Complete your profile!
            </Link>
          )}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search"
            className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Button 
            type="submit"
            className="bg-accent-primary text-white px-4 py-1 rounded-md"
            onClick={() => console.log("Button clicked")}
          >
            Search
          </Button>
          </form>
        </div>
      </div>

      {children}

      {menuOpen && <MobileMenu toggleMenu={toggleMenu}>{children}</MobileMenu>}

      <button onClick={toggleMenu} className="sm:hidden">
        {menuOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

const MobileMenu: React.FC<{
  toggleMenu: () => void;
  children: React.ReactNode;
}> = ({ toggleMenu, children }) => {
  return (
    <div className="absolute right-0 top-16 flex h-[calc(100vh-64px)] w-full flex-col">
      <div className="flex  w-full grow flex-col gap-1 bg-background px-4 pb-2 sm:hidden">
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
        {children}
      </div>
      <div className="h-screen w-full bg-background/60 sm:hidden" />
    </div>
  );
};

export default Navbar;
