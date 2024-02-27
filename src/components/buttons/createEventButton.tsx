"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useVerificationAlert } from "../../lib/context/VerificationContext";

const EventButton: React.FC<{ userData: any }> = ({ userData }) => {
  const { openAlert } = useVerificationAlert();

  return !userData.isVerifiedStudent ? (
    <Button className="my-8" variant="outline" onClick={openAlert}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Create Event
    </Button>
  ) : (
    <Link href="/event/new">
      <Button className="my-8" variant="outline">
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </Link>
  );
};

export default EventButton;
