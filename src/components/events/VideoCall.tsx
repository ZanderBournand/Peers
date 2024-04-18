"use client";

import { useEffect, useRef } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
import { type UserData } from "@/lib/interfaces/userData";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface VideoCallProps {
  roomUrl: string;
  user: UserData;
  shouldJoinCall: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomUrl,
  user,
  shouldJoinCall,
}) => {
  const callRef = useRef<HTMLDivElement>(null);
  const meetingUsername = user.firstName
    ? `${user.firstName} ${user.lastName} (@${user.username})`
    : `@${user.username}`;

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
      userName: meetingUsername,
    },
  });

  useEffect(() => {
    if (callFrame && shouldJoinCall) {
      callFrame.join().catch((error) => {
        console.error("Error joining call:", error);
        // additional handling if needed
      });
    }
  }, [callFrame, shouldJoinCall]);

  useEffect(() => {
    if (callFrame) {
      // Set up the 'left-meeting' event handler
      const handleLeftMeeting = () => {
        router.push("/");
        updateUserPointsMutation.mutate({ userId: user.id });
      };
      callFrame.on("left-meeting", handleLeftMeeting);

      // Clean up the event handler when the component unmounts
      return () => {
        callFrame.off("left-meeting", handleLeftMeeting);
      };
    }
  }, [callFrame, router, updateUserPointsMutation, user.id]);

  return (
    <DailyProvider callObject={callFrame}>
      <div ref={callRef} style={{ width: "100%", height: "100%" }} />
    </DailyProvider>
  );
};

export default VideoCall;
