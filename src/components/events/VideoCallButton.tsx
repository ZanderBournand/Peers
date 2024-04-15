"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
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

  const [prevThreshold, setPrevThreshold] = useState<number | null>(null);

  const incrementPointsMutation = api.users.updatePoints.useMutation();
  const incrementPrevThreshMutation = api.users.updatePrevThresh.useMutation();
  const createRoomMutation = api.dailyapi.createRoomForEvent.useMutation();

  const userMeetingDurations = api.dailyapi.getUserMeetingDurations.useQuery({
    userName: name,
  });

  // Fetch previous threshold data
  const { data: prevThresholdResult } = api.users.getPrevThresh.useQuery({
    userName: name,
  });

  // Set initial previous threshold when data is available
  useEffect(() => {
    if (prevThresholdResult) {
      const initialPrevThreshold = prevThresholdResult.prevThresh || 0;
      setPrevThreshold(initialPrevThreshold);
    }
  }, [prevThresholdResult]);

  const handleJoinCall = async () => {
    try {
      // Create a room for the event (or use existing)
      const res = await createRoomMutation.mutateAsync({ eventId });

      // If room URL is present in the response, update roomUrl state
      if (res && res.roomUrl) {
        const roomUrlFromMutation = res.roomUrl;
        setRoomUrl(roomUrlFromMutation);

        // Retrieve user meeting duration
        const userDuration = userMeetingDurations.data?.[name] || 0;

        // Point system thresholds and points
        const durationThresholds = [30, 120, 300, 600, 1200]; // in minutes
        const pointsPerThreshold = [1, 2, 3, 4, 5]; // points for each threshold

        let newThresholdReached = false;
        let totalPointsToAdd = 0;

        // Iterate through thresholds to determine points to add
        for (let i = 0; i < durationThresholds.length; i++) {
          if (
            userDuration >= durationThresholds[i] &&
            durationThresholds[i] > (prevThreshold || 0) // Use prevThreshold or default to 0 if null
          ) {
            newThresholdReached = true;
            totalPointsToAdd = pointsPerThreshold[i];
          } else {
            break;
          }
        }

        // If a new threshold is reached, update the previous threshold
        if (newThresholdReached) {
          await incrementPrevThreshMutation.mutate({
            userName: name,
            prevThresh: userDuration,
          });
        }

        // Calculate total points to add
        const totalPoints = 1 + totalPointsToAdd;

        // Update user points with the calculated total points
        await incrementPointsMutation.mutate({
          userName: name,
          pointsToAdd: totalPoints,
        });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      // Handle error
    }
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
      {roomUrl && <VideoCall roomUrl={roomUrl} userName={name} />}
    </div>
  );
};

export default VideoCallButton;
