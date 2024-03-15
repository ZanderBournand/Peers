import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface JoinCallButtonProps {
  url: string; // URL to navigate to DailyCall component
  icon: React.ElementType; // Icon component
}

const JoinCallButton: React.FC<JoinCallButtonProps> = ({ url, icon: Icon }) => {
  return (
    <Link href={url} passHref>
      <Button variant="default" className="text-md mx-4 h-auto w-auto flex-row">
        <Icon className="mr-2 h-5 w-5" />
        Join Call
      </Button>
    </Link>
  );
};

export default JoinCallButton;
