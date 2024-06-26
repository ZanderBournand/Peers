/*
  File -> Button to create an event
  - Uses a "verifciation" wrapper to ensure only verified students can navigate to the event creation page
*/

"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { useRouter } from "next/navigation";
import type { UserData } from "@/lib/interfaces/userData";

const CreateEventButton: React.FC<{ userData: UserData }> = ({ userData }) => {
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

export default CreateEventButton;
