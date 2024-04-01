"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import { VideoCall } from "./VideoCall";

interface VideoCallButtonProps {
  type: "video" | "audio"; // Type of call
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({ type }) => {
  const [showVideoCall, setShowVideoCall] = useState<boolean>(false);

  const handleToggleVideoCall = () => {
    setShowVideoCall((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="default"
        className="text-md h-auto w-auto flex-row"
        onClick={handleToggleVideoCall}
      >
        {type === "video" ? (
          <VideoCameraIcon className="mr-2 h-5 w-5" />
        ) : (
          <MicrophoneIcon className="mr-2 h-5 w-5" />
        )}
        Start {type === "video" ? "Video" : "Audio"} Call
      </Button>
      {showVideoCall && <VideoCall />}
    </div>
  );
};
