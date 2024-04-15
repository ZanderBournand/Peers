import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import axios, { AxiosResponse } from "axios";

const DAILY_API_BASE_URL = "https://api.daily.co/v1";
const apiKey = process.env.DAILY_API_KEY;

export const dailyApiRouter = createTRPCRouter({
  createRoomForEvent: privateProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        const roomName = input.eventId.substring(0, 40); // Room name can only be 40 characters

        // Check if the room already exists
        let existingRoom = null;
        try {
          const response: AxiosResponse<any> = await axios.get(
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
            throw error; // Propagate other errors
          }
        }
        if (existingRoom) {
          console.log("Room already exists:", existingRoom);
          return { roomUrl: existingRoom.url }; // Return the existing room URL
        }

        // Create a new room if it doesn't exist
        const expirationTime = Math.floor(Date.now() / 1000) + 18000; // Current time + 5 hours in seconds
        const response: AxiosResponse<any> = await axios.post(
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
        console.log("New room created:", response.data);
        return { roomUrl: response.data.url }; // New room URL
      } catch (error) {
        console.error("Error creating or retrieving room:", error);
        throw new Error("Failed to create or retrieve room");
      }
    }),

  getUserMeetingDurations: privateProcedure
    .input(z.object({ userName: z.string() }))
    .query(async () => {
      try {
        const response: AxiosResponse<any> = await axios.get(
          `${DAILY_API_BASE_URL}/meetings`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );

        const userDurations: { [userName: string]: number } = {};

        // Process each meeting and calculate total duration for each user
        response.data.data.forEach((meeting: any) => {
          meeting.participants.forEach((participant: any) => {
            const { user_name, duration } = participant;
            if (!userDurations[user_name]) {
              userDurations[user_name] = 0;
            }
            userDurations[user_name] += duration;
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
