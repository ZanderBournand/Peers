"use client";

import { useEffect, useRef } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";

interface VideoCallProps {
  roomUrl: string;
  userName: string; // Receive the userName prop
}

const VideoCall: React.FC<VideoCallProps> = ({ roomUrl, userName }) => {
  const callRef = useRef<HTMLDivElement>(null);

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
      userName: userName, // Use the provided userName
    },
  });

  useEffect(() => {
    if (callFrame) {
      callFrame.join().catch((error) => {
        console.error("Error joining call:", error);
        // additional handling if needed
      });
    }
  }, [callFrame]);

  return (
    <DailyProvider callObject={callFrame}>
      <div ref={callRef} style={{ width: "100%", height: "100%" }} />
    </DailyProvider>
  );
};

export default VideoCall;
