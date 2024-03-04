"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { useRouter } from "next/navigation";
import type { UserData } from "@/lib/interfaces/userData";

const EventButton: React.FC<{ userData: UserData }> = ({ userData }) => {
  const router = useRouter();

  const verificationAlert = useVerificationAlert();

  const handleClick = () => {
    if (!userData?.isVerifiedStudent) {
      verificationAlert?.openAlert();
    } else {
      router.push("/event/new");
    }
  };

  return (
    <Button className="my-8" variant="outline" onClick={handleClick}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Create Event
    </Button>
  );
};

export default EventButton;
