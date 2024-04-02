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

export default function VerifyOrNavigateContainer({
  user,
  navigationLink,
  elementId,
  children,
}: VerificationNavigationIconProps) {
  const router = useRouter();
  const verificationAlert = useVerificationAlert();

  const handleClick = () => {
    if (!user?.isVerifiedStudent) {
      verificationAlert?.openAlert();
    } else {
      router.push(navigationLink);
    }
  };

  return (
    <a
      id={elementId}
      className="mx-1 cursor-pointer"
      onClick={handleClick}
      title="Create Event"
    >
      {children}
    </a>
  );
}
