"use client";

import React from "react";
import { Button } from "../ui/button";
import { ShareIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface ShareButtonProps {
  textToCopy: string | null;
}

export default function ShareButton({ textToCopy }: ShareButtonProps) {
  return (
    <Button
      variant="outline"
      className="text-md flex-row"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(textToCopy ?? "");
          toast.success("Organization link copied!");
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }
      }}
    >
      <ShareIcon className="mr-2 h-5 w-5" />
      Share
    </Button>
  );
}
