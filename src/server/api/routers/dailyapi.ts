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
    participants: Participant[];
    id: string;
  }[];
}

export const dailyApiRouter = createTRPCRouter({
  fetchEventRoom: privateProcedure
    .input(z.object({ eventId: z.string() })) // Input validation for eventId
    .query(async ({ ctx, input }) => {
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
          // ignore error -> go to room creation
        }

        if (existingRoom) {
          return existingRoom.url; // Return existing room URL
        }

        const event = await ctx.db.event.findUnique({
          where: { id: input.eventId },
        });

        if (!event) {
          throw new Error("Event not found");
        }

        // Set expiration time to event.duration minutes plus buffer time
        const expirationTime =
          Math.floor(Date.now() / 1000) + (event.duration + 60) * 60;

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
        return createRoomResponse.data.url; // Return new room URL
      } catch (error) {
        console.error("Error creating or retrieving room:", error);
        throw new Error("Failed to create or retrieve room");
      }
    }),
  updateUserPoints: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        let timeInEvents = 0;
        let starting_after: string | undefined;

        do {
          const response: AxiosResponse<MeetingResponse> =
            await axios.get<MeetingResponse>(`${DAILY_API_BASE_URL}/meetings`, {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
              params: {
                limit: 100, // Fetch 100 results at a time
                starting_after, // Fetch the next page of results
              },
            });

          response.data.data.forEach((meeting) => {
            meeting.participants.forEach((participant) => {
              const { user_name, duration } = participant;

              if (user_name && user_name.includes(`@${user.username}`)) {
                timeInEvents += duration;
              }
            });
          });

          // Set starting_after to the id of the last meeting after the loop
          if (response.data.data && response.data.data.length > 0) {
            starting_after =
              response.data.data[response.data.data.length - 1]?.id ??
              undefined;
          } else {
            starting_after = undefined;
          }
        } while (starting_after);

        // Convert timeInEvents from seconds to minutes and round down to avoid decimals
        timeInEvents = Math.floor(timeInEvents / 60);

        // Point system thresholds and points
        const pointsPerInterval = 5;
        const intervalInMinutes = 10;

        // Calculate the number of intervals in the timeInMeetings value
        const intervals = Math.floor(timeInEvents / intervalInMinutes);

        // Calculate the total points
        const totalPoints = intervals * pointsPerInterval;

        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            points: totalPoints > user.points ? totalPoints : user.points,
          },
        });

        return updatedUser;
      } catch (error) {
        console.error("Error fetching user's time in events:", error);
        throw new Error("Failed to fetch user's time in eventss");
      }
    }),
});
