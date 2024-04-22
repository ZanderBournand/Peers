/*
  File -> CSS animation used throughout application to show the status, and typeo of an event
  - Blue for online video events
  - Purple for online audio events
  - Green for in-person events
*/

import React from "react";

interface StatusPingProps {
  eventType: string;
}

export const eventTypeColorMap: Record<string, { base: string; ping: string }> =
  {
    ONLINE_VIDEO: { base: "bg-blue-300", ping: "bg-blue-400" },
    ONLINE_AUDIO: { base: "bg-purple-300", ping: "bg-purple-400" },
    IN_PERSON: { base: "bg-green-300", ping: "bg-green-400" },
  };

export default function StatusPing({ eventType }: StatusPingProps) {
  const color = eventTypeColorMap[eventType];

  return (
    <div className="relative ml-3 mr-2 mt-1 ">
      <div className={`h-3 w-3 rounded-full ${color?.base}`}></div>
      <div
        className={`absolute left-0 top-0 h-3 w-3 animate-slow-ping rounded-full ${color?.ping}`}
      ></div>
      <div
        className={`absolute left-0 top-0 h-3 w-3 animate-slow-pulse rounded-full ${color?.base}`}
      ></div>
    </div>
  );
}
