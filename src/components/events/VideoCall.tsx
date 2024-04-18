"use client";

import { useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface VideoCallProps {
  roomUrl: string;
  roomName: string;
  meetingToken: string | null;
  userId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomUrl,
  roomName,
  meetingToken,
  userId,
}) => {
  const callRef = useRef<HTMLDivElement>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  const updateUserPointsMutation = api.dailyapi.updateUserPoints.useMutation();

  const router = useRouter();

  const callFrame = useCallFrame({
    parentEl: callRef.current,
    options: {
      url: roomUrl, // Use the provided room URL
      iframeStyle: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
      },
      theme: {
        colors: {
          accent: "#6e13c8",
          accentText: "#FFFFFF",
        },
      },
      showLeaveButton: true,
    },
  });

  useEffect(() => {
    if (callFrame && meetingToken) {
      callFrame
        .join({ token: meetingToken })
        .then((result) => {
          setParticipantId(result?.local?.session_id ?? null);
        })
        .catch((error) => {
          console.error("Error joining call:", error);
        });
    }
  }, [callFrame, meetingToken]);

  useEffect(() => {
    if (callFrame) {
      // Set up the 'left-meeting' event handler
      const handleLeftMeeting = () => {
        router.push("/");
        const meetingId = callFrame.meetingSessionSummary().id;

        if (userId && participantId && meetingId) {
          updateUserPointsMutation.mutate({ userId, participantId, meetingId });
        }
      };
      callFrame.on("left-meeting", handleLeftMeeting);

      // Clean up the event handler when the component unmounts
      return () => {
        callFrame.off("left-meeting", handleLeftMeeting);
      };
    }
  }, [
    callFrame,
    router,
    updateUserPointsMutation,
    userId,
    participantId,
    roomName,
  ]);

  return (
    <DailyProvider callObject={callFrame}>
      <div ref={callRef} style={{ width: "100%", height: "100%" }} />
    </DailyProvider>
  );
};

export default VideoCall;
