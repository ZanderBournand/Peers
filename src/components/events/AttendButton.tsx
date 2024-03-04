"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserPlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/react";
import type { UserData } from "@/lib/interfaces/userData";
import type { EventData } from "@/lib/interfaces/eventData";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendButtonProps {
  user: UserData;
  event: EventData;
}

export default function AttendButton({ user, event }: AttendButtonProps) {
  const [attending, setAttending] = useState<boolean | null>(null);

  useEffect(() => {
    const isAttending = event.attendees?.some(
      (attendee) => attendee.id === user.id,
    );
    setAttending(isAttending ?? null);
  }, [user, event]);

  const { mutate, isLoading } = api.events.toggleAttendance.useMutation({
    onSuccess: () => {
      // No need to update state here, as it's already updated optimistically
    },
    onError: (e) => {
      console.error("Error changing event attendance:", e);
      // Revert state on error
      setAttending((prev) => !prev);
    },
  });

  const handleOnClick = () => {
    setAttending((prev) => !prev);
    mutate({ eventId: event.id, userId: user.id, attending: !attending });
  };

  return attending === null ? (
    <Skeleton className="h-12 w-1/3 rounded-lg" />
  ) : attending ? (
    <Button
      variant="outline"
      className="text-md mx-4 h-12 flex-row bg-green-200/20"
      onClick={handleOnClick}
      disabled={isLoading}
    >
      <CheckCircleIcon className="mr-1 h-6 w-6" color="green" />
      Attending
    </Button>
  ) : (
    <Button
      variant="default"
      className="text-md mx-4 h-12 w-1/3 flex-row"
      onClick={handleOnClick}
      disabled={isLoading}
    >
      <UserPlusIcon className="mr-2 h-5 w-5" />
      Attend
    </Button>
  );
}
