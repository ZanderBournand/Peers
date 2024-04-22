/*
  File -> Button to control access to event live video/audio room
  - Used on the event page (only for ONLINE_VIDEO and ONLINE_AUDIO events)
*/

"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import VideoCall from "./VideoCall";
import { api } from "@/trpc/react";
import { type UserData } from "@/lib/interfaces/userData";
import { getDisplayName } from "@/lib/utils";
import { type EventData } from "@/lib/interfaces/eventData";

interface VideoCallButtonProps {
  type: "ONLINE_VIDEO" | "ONLINE_AUDIO";
  event: EventData;
  user: UserData;
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  type,
  event,
  user,
}) => {
  const [meetingToken, setMeetingToken] = useState<string | null>(null);

  const { data: room } = api.dailyapi.fetchEventRoom.useQuery({
    eventId: event.id,
    eventDuration: event.duration,
  });
  const createMeetingToken = api.dailyapi.createMeetingToken.useMutation();

  const handleJoinCall = async () => {
    const token = await createMeetingToken.mutateAsync({
      userId: user.id,
      username: getDisplayName(user, true),
      roomName: room?.name ?? "",
    });
    setMeetingToken(token);
  };

  return (
    <div className="flex items-center justify-center">
      {/* Button to join the call */}
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

      {/* Render VideoCall component if roomUrl is valid */}
      {room && (
        <VideoCall
          roomUrl={room?.url}
          roomName={room?.name}
          meetingToken={meetingToken}
          user={user}
        />
      )}
    </div>
  );
};

export default VideoCallButton;
