"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import DailyAPI from "../../server/api/routers/dailyapi";
import VideoCall from "./VideoCall";
import { api } from "@/trpc/react";

interface VideoCallButtonProps {
  type: "ONLINE_VIDEO" | "ONLINE_AUDIO";
  eventId: string;
  name: string;
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  type,
  eventId,
  name,
}) => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  const incrementPointsMutation = api.users.updatePoints.useMutation();

  const handleJoinCall = async () => {
    try {
      const dailyAPI = new DailyAPI();
      const roomUrl = await dailyAPI.createRoomForEvent(eventId);

      // Call the mutation to increment user points
      incrementPointsMutation.mutate({
        userName: name,
        pointsToAdd: 1,
      });

      setRoomUrl(roomUrl);
    } catch (error) {
      console.error("Error creating room:", error);
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="default"
        className="text-md h-auto w-auto flex-row"
        onClick={handleJoinCall}
      >
        {type === "ONLINE_VIDEO" ? (
          <VideoCameraIcon className="mr-2 h-5 w-5" />
        ) : (
          <MicrophoneIcon className="mr-2 h-5 w-5" />
        )}
        Join Call
      </Button>
      {roomUrl && <VideoCall roomUrl={roomUrl} userName={name} />}
    </div>
  );
};
