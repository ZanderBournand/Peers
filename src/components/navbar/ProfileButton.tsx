"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { api } from "@/trpc/react";
import { getDisplayName } from "@/lib/utils";

const ProfileButton: React.FC<{ user: User }> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const ref = React.useRef<HTMLDivElement>(null);

  // close the modal if we click outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  const userData = api.users.getUser.useQuery({}).data;
  const userImage = userData?.image ?? "";

  if (!user) return null;
  return (
    <div ref={ref} className="hidden sm:block">
      <Avatar
        className="hover:cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <AvatarImage src={userImage} />
        <AvatarFallback>Peer</AvatarFallback>
      </Avatar>

      {menuOpen && (
        <div className="absolute right-5 top-16 z-50 flex w-72 flex-col rounded-lg bg-secondary bg-opacity-80 p-4">
          <div className="flex items-center">
            <div className="pr-4">
              <Avatar onClick={() => setMenuOpen(!menuOpen)}>
                <AvatarImage src={userImage} />
                <AvatarFallback>Peer</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <p className="text-xl">{userData && getDisplayName(userData)}</p>
              <p className="text-md text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <hr className="my-2 border-t-2 border-slate-600" />
          <p className="py-2 text-lg text-muted-foreground">
            <Link
              onClick={() => setMenuOpen(false)}
              className="hover:text-muted-foreground/70"
              href="/user"
            >
              Profile
            </Link>
          </p>
          <p className="py-2 text-lg text-muted-foreground">
            <Link
              onClick={() => setMenuOpen(false)}
              className="hover:text-muted-foreground/70"
              href="/settings"
            >
              Settings
            </Link>
          </p>

          <div className="py-2 text-lg text-muted-foreground">
            <button
              className="hover:text-muted-foreground/70"
              onClick={() =>
                signOut().then(() => {
                  setMenuOpen(false);
                  router.refresh();
                })
              }
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
