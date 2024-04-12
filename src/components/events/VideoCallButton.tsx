"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import DailyAPI from "../../server/api/routers/dailyapi";
import VideoCall from "./VideoCall";
import { api } from "@/trpc/react";

interface VideoCallButtonProps {
  type: "ONLINE_VIDEO" | "ONLINE_AUDIO"; // Type of call
  eventId: string; // Event ID for room name
  name: string; // User name to be passed to VideoCall
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  type,
  eventId,
  name, // Receive the name prop
}) => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  const incrementPointsMutation = api.users.updatePoints.useMutation(); // No need for a function argument here

  const handleJoinCall = async () => {
    try {
      const dailyAPI = new DailyAPI();
      const url = await dailyAPI.createRoomForEvent(eventId);
      console.log("Room URL:", url); // Log

      // Call the mutation to increment user points
      await incrementPointsMutation.mutate({
        userName: name, // Pass 'name' as the userName
        pointsToAdd: 1, // Points to add when user joins the call
      });

      setRoomUrl(url);
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
      {roomUrl && <VideoCall roomUrl={roomUrl} userName={name} />}{" "}
      {/* Pass roomUrl and userName prop to VideoCall */}
    </div>
  );
};
