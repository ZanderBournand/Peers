import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/24/outline";

interface JoinCallButtonProps {
  url: string; // URL to navigate to DailyCall component
  type: string; // Type of event
}

const JoinCallButton: React.FC<JoinCallButtonProps> = ({ url, type }) => {
  return (
    <Link href={url} passHref>
      <Button variant="default" className="text-md h-auto w-auto flex-row">
        {type === "video" ? (
          <VideoCameraIcon className="mr-2 h-5 w-5" />
        ) : (
          <MicrophoneIcon className="mr-2 h-5 w-5" />
        )}
        Join Call
      </Button>
    </Link>
  );
};

export default JoinCallButton;
