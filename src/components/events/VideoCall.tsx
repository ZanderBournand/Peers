"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";

export const VideoCall = () => {
  const [inst, setInst] = useState(false);
  const callRef = useRef(null);
  const callFrame = useCallFrame({
    parentEl: callRef.current,
    options: {
      url: "https://peers-knowledge.daily.co/demo",
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
    shouldCreateInstance: useCallback(() => inst, [inst]),
  });

  useEffect(() => {
    setInst(true);
  }, []);

  useEffect(() => {
    if (!callFrame) return;
    callFrame?.join().catch((error) => {
      console.error("Error joining call:", error); // Handle
    });
  }, [callFrame]);

  return (
    <DailyProvider callObject={callFrame}>
      <div ref={callRef} />
    </DailyProvider>
  );
};
