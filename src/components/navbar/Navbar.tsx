"use client";
import Link from "next/link";
import React, { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { api } from "@/trpc/react";

const routes: { title: string; href: string }[] = [
  { title: "Discover", href: "/discover" },
  { title: "My Events", href: "/myevents" },
  { title: "Profile", href: "/user" },
];

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const user = api.users.getCurrent.useQuery().data;

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
          {user && !user?.firstName && !user?.lastName && (
            <Link
              href="/user/edit"
              className={`inline-flex h-6 w-full items-center px-2 py-2 text-sm transition-colors hover:text-accent-foreground sm:w-auto`}
              style={{
                marginTop: "8px",
                backgroundColor: "#EAD7F0",
                color: "purple",
                borderRadius: "10px",
              }}
            >
              Complete your profile!
            </Link>
          )}
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
