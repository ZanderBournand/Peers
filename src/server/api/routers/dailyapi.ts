import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import axios from "axios";
import type { AxiosResponse } from "axios";

const DAILY_API_BASE_URL = "https://api.daily.co/v1";
const apiKey = process.env.DAILY_API_KEY;

interface RoomData {
  url: string;
}

interface Participant {
  user_name: string;
  duration: number;
}

interface MeetingResponse {
  data: {
    meetings: {
      participants: Participant[];
    }[];
  };
}

export const dailyApiRouter = createTRPCRouter({
  createRoomForEvent: privateProcedure
    .input(z.object({ eventId: z.string() })) // Input validation for eventId
    .mutation(async ({ input }) => {
      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        const roomName = input.eventId.substring(0, 40); // Limit room name to 40 characters

        let existingRoom: RoomData | null = null;
        try {
          const response: AxiosResponse<RoomData> = await axios.get<RoomData>(
            `${DAILY_API_BASE_URL}/rooms/${roomName}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          );
          existingRoom = response.data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log(`Room "${roomName}" not found.`);
          } else {
            throw error;
          }
        }
        if (existingRoom) {
          console.log("Room already exists:", existingRoom);
          return { roomUrl: existingRoom.url }; // Return existing room URL
        }

        const expirationTime = Math.floor(Date.now() / 1000) + 18000; // Set expiration time to 5 hours
        const createRoomResponse: AxiosResponse<RoomData> =
          await axios.post<RoomData>(
            `${DAILY_API_BASE_URL}/rooms`,
            {
              name: roomName,
              privacy: "public",
              properties: {
                exp: expirationTime,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            },
          );
        console.log("New room created:", createRoomResponse.data);
        return { roomUrl: createRoomResponse.data.url }; // Return new room URL
      } catch (error) {
        console.error("Error creating or retrieving room:", error);
        throw new Error("Failed to create or retrieve room");
      }
    }),

  getUserMeetingDurations: privateProcedure
    .input(z.object({ userName: z.string() })) // Input validation for userName
    .query(async () => {
      try {
        const response: AxiosResponse<MeetingResponse> =
          await axios.get<MeetingResponse>(`${DAILY_API_BASE_URL}/meetings`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });

        const userDurations: Record<string, number> = {};

        response.data.data.meetings.forEach((meeting) => {
          meeting.participants.forEach((participant) => {
            const { user_name, duration } = participant;
            if (!userDurations[user_name]) {
              userDurations[user_name] = 0;
            }
            userDurations[user_name] += duration; // Accumulate duration for each user
          });
        });

        console.log("Meeting Info Response:", userDurations);
        return userDurations;
      } catch (error) {
        console.error("Error fetching meeting durations:", error);
        throw new Error("Failed to fetch meeting durations");
      }
    }),
});
