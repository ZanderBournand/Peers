"use client";

interface EventTimeProps {
  date: Date;
  mode: "preview" | "full" | "day" | "time";
}

export default function EventTime({ date, mode }: EventTimeProps) {
  const getPreviewDate = () => {
    const day = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${day} • ${time}`;
  };

  const getFullDate = () => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getDayDate = () => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
  };

  const getTimeDate = () => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <>
      {mode === "preview" && <>{getPreviewDate()}</>}
      {mode === "full" && <>{getFullDate()}</>}
      {mode === "day" && <>{getDayDate()}</>}
      {mode === "time" && <>{getTimeDate()}</>}
    </>
  );
}
