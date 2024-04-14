"use client";

import React, { useState, useEffect } from "react";
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
  const incrementPrevThreshMutation = api.users.updatePrevThresh.useMutation();
  const [prevThreshold, setPrevThreshold] = useState<number | null>(null);

  const {
    data: prevThresholdResult,
    error,
    isLoading,
  } = api.users.getPrevThresh.useQuery({
    userName: name,
  });

  useEffect(() => {
    if (prevThresholdResult) {
      setPrevThreshold(prevThresholdResult.prevThresh || 0);
    }
  }, [prevThresholdResult]);

  const handleJoinCall = async () => {
    try {
      const dailyAPI = new DailyAPI();
      const roomUrl = await dailyAPI.createRoomForEvent(eventId);

      // Getting the meeting durations for the current user
      const userMeetingDurations = await dailyAPI.getUserMeetingDurations();
      const userDuration = userMeetingDurations[name] || 0;

      // Point system
      const durationThresholds = [30, 120, 300, 600, 1200]; // in minutes (e.g., 30 mins, 2 hours, 5 hours, 10 hours, 20 hours)
      const pointsPerThreshold = [1, 2, 3, 4, 5]; // points for each threshold

      let newThresholdReached = false;
      let totalPointsToAdd = 0;

      // Iterate through duration thresholds to find the highest threshold reached by userDuration
      for (let i = 0; i < durationThresholds.length; i++) {
        if (
          // If userDuration exceeds a threshold and it's greater than the previous threshold
          userDuration >= durationThresholds[i] &&
          durationThresholds[i] > prevThreshold
        ) {
          newThresholdReached = true;
          totalPointsToAdd = pointsPerThreshold[i];
        } else {
          break;
        }
      }

      // Update db threshold
      if (newThresholdReached) {
        incrementPrevThreshMutation.mutate({
          userName: name,
          prevThresh: userDuration,
        });
      }

      const totalPoints = 1 + totalPointsToAdd;

      // Update db userPoints
      incrementPointsMutation.mutate({
        userName: name,
        pointsToAdd: totalPoints,
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
