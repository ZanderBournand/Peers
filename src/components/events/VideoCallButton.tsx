"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import VideoCall from "./VideoCall";
import { api } from "@/trpc/react";
import { type UserData } from "@/lib/interfaces/userData";

interface VideoCallButtonProps {
  type: "ONLINE_VIDEO" | "ONLINE_AUDIO";
  eventId: string;
  user: UserData;
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  type,
  eventId,
  user,
}) => {
  const { data: roomUrl } = api.dailyapi.fetchEventRoom.useQuery({
    eventId,
  });
  const [shouldJoinCall, setShouldJoinCall] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center">
      {/* Button to join the call */}
      <Button
        variant="default"
        className="text-md h-auto w-auto flex-row"
        onClick={() => setShouldJoinCall(true)}
      >
        {type === "ONLINE_VIDEO" ? (
          <VideoCameraIcon className="mr-2 h-5 w-5" />
        ) : (
          <MicrophoneIcon className="mr-2 h-5 w-5" />
        )}
        Join Call
      </Button>

      {/* Render VideoCall component if roomUrl is valid */}
      {roomUrl && (
        <VideoCall
          roomUrl={roomUrl}
          user={user}
          shouldJoinCall={shouldJoinCall}
        />
      )}
    </div>
  );
};

export default VideoCallButton;
