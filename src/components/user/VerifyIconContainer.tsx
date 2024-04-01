"use client";

import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { useRouter } from "next/navigation";
import type { UserData } from "@/lib/interfaces/userData";
import { type ReactNode } from "react";

interface VerificationNavigationIconProps {
  user: UserData;
  navigationLink: string;
  elementId?: string;
  children: ReactNode;
}

export default function VerifyIconContainer({
  user,
  navigationLink,
  elementId,
  children,
}: VerificationNavigationIconProps) {
  const router = useRouter();
  const verificationAlert = useVerificationAlert();

  const handleClick = () => {
    console.log(user?.isVerifiedStudent);
    if (!user?.isVerifiedStudent) {
      verificationAlert?.openAlert();
    } else {
      router.push(navigationLink);
    }
  };

  return (
    <a
      id={elementId}
      className="color-grey ml-1.5 mt-1.5 cursor-pointer"
      onClick={handleClick}
      title="Create Event"
    >
      {children}
    </a>
  );
}
