/*
  File -> Component used to display an event's live video/audio call
  - Uses the Daily.co API to create a video call iframe
  - Displays an event attendance summary upon leaving the call
*/

"use client";

import { useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  BoltIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type UserData } from "@/lib/interfaces/userData";
import Image from "next/image";

interface VideoCallProps {
  roomUrl: string;
  roomName: string;
  meetingToken: string | null;
  user: UserData;
}

interface EventSummaryData {
  points: number;
  duration: number;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomUrl,
  roomName,
  meetingToken,
  user,
}) => {
  const callRef = useRef<HTMLDivElement>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [callOpen, setCallOpen] = useState<boolean>(true);
  const [eventSummaryOpen, setEventSummaryOpen] = useState<boolean>(false);
  const [eventSummaryData, setEventSummaryData] =
    useState<EventSummaryData | null>(null);

  const updateUserPointsMutation = api.dailyapi.updateUserPoints.useMutation();

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
        setCallOpen(false);
        setEventSummaryOpen(true);
        const meetingId = callFrame.meetingSessionSummary().id;

        if (user.id && participantId && meetingId) {
          updateUserPointsMutation.mutate(
            { userId: user.id, participantId, meetingId },
            {
              onSuccess: (data) => {
                setEventSummaryData({
                  points: data.points,
                  duration: data.duration,
                });
              },
            },
          );
        }
      };
      callFrame.on("left-meeting", handleLeftMeeting);

      // Clean up the event handler when the component unmounts
      return () => {
        callFrame.off("left-meeting", handleLeftMeeting);
      };
    }
  }, [callFrame, updateUserPointsMutation, user.id, participantId, roomName]);

  return (
    <>
      {callOpen ? (
        <DailyProvider callObject={callFrame}>
          <div ref={callRef} style={{ width: "100%", height: "100%" }} />
        </DailyProvider>
      ) : (
        <AlertDialog open={eventSummaryOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex flex-row items-center">
                  <Image
                    src={user.image}
                    alt="selected image"
                    width={35}
                    height={35}
                    style={{
                      objectFit: "cover",
                    }}
                    className="mr-3 rounded-full transition-opacity duration-500 group-hover:opacity-70"
                  />
                  Your Attendance Summary
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                {updateUserPointsMutation.isLoading ? (
                  <div className="my-16 flex flex-col items-center justify-center">
                    <ReloadIcon className="h-5 w-5 animate-spin" />
                    <p className="mt-2">Gathering your attendance data...</p>
                  </div>
                ) : (
                  <>
                    <p>
                      We hope you found value in the session and perhaps gained
                      new insights. Keep up the great work!
                    </p>
                    <div className="mt-6 flex flex-col gap-y-4">
                      <div className="flex flex-row items-center text-base">
                        Time in meeting:
                        <div className="ml-2 mt-1 flex w-max flex-row items-center justify-center rounded-lg bg-gray-100/50 px-2 py-1 text-slate-600">
                          <ClockIcon className="mr-1 h-5 w-5" />
                          <p
                            style={{
                              fontSize: "1.01rem",
                            }}
                          >
                            {eventSummaryData?.duration} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center text-base">
                        Points earned:
                        <div className="ml-2 mt-1 flex w-max flex-row items-center justify-center rounded-lg bg-purple-100/30 px-2 py-1 text-purple-900">
                          <BoltIcon className="mr-1 h-5 w-5" />
                          <p
                            style={{
                              fontSize: "1.01rem",
                            }}
                          >
                            {eventSummaryData?.points} PeerPoints
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-row">
                      <InformationCircleIcon className="mr-2 h-6 w-6" />
                      For every 2 minutes you spend in a session, you earn 1
                      PeerPoint
                    </div>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  location.reload();
                }}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default VideoCall;
