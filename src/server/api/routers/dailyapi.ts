import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import axios from "axios";
import type { AxiosResponse } from "axios";

const DAILY_API_BASE_URL = "https://api.daily.co/v1";
const apiKey = process.env.DAILY_API_KEY;

interface RoomData {
  id: string;
  name: string;
  url: string;
}

interface MeetingToken {
  token: string;
}

interface Participant {
  user_id: string;
  participant_id: string;
  duration: number;
}

interface MeetingResponse {
  data: Participant[];
}

export const dailyApiRouter = createTRPCRouter({
  fetchEventRoom: privateProcedure
    .input(z.object({ eventId: z.string(), eventDuration: z.number() }))
    .query(async ({ input }) => {
      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        try {
          const response: AxiosResponse<RoomData> = await axios.get<RoomData>(
            `${DAILY_API_BASE_URL}/rooms/${input.eventId}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          );

          if (response.data) {
            return response.data; // Return existing room
          }
        } catch (error) {
          // ignore error -> go to room creation if no rooms are found
        }

        // Set expiration time to eventDuration minutes plus 1-hour of buffer time
        const expirationTime =
          Math.floor(Date.now() / 1000) + (input.eventDuration + 60) * 60;

        const createRoomResponse: AxiosResponse<RoomData> =
          await axios.post<RoomData>(
            `${DAILY_API_BASE_URL}/rooms`,
            {
              name: input.eventId,
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
        return createRoomResponse.data; // Return new room
      } catch (error) {
        console.error("Error creating or retrieving room:", error);
        throw new Error("Failed to create or retrieve room");
      }
    }),
  updateUserPoints: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        participantId: z.string(),
        meetingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        const response: AxiosResponse<MeetingResponse> =
          await axios.get<MeetingResponse>(
            `${DAILY_API_BASE_URL}/meetings/${input.meetingId}/participants`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          );

        const participant = response.data.data.find(
          (participant) => participant.participant_id === input.participantId,
        );

        let timeInEvent = participant ? participant.duration : 0;

        // Convert timeInLatestEvent from seconds to minutes and round down to avoid decimals
        timeInEvent = Math.floor(timeInEvent / 60);

        // Point system thresholds and points
        const pointsPerInterval = 1;
        const intervalInMinutes = 2;

        // Calculate the number of intervals in the timeInLatestEvent value
        const intervals = Math.floor(timeInEvent / intervalInMinutes);

        // Calculate the total points
        const totalPoints = intervals * pointsPerInterval;

        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            points: {
              increment: totalPoints,
            },
          },
        });

        return {
          user: updatedUser,
          points: totalPoints,
          duration: timeInEvent,
        };
      } catch (error) {
        console.error("Error fetching user's time in events:", error);
        throw new Error("Failed to fetch user's time in eventss");
      }
    }),
  createMeetingToken: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string(),
        roomName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        if (!apiKey) {
          throw new Error(
            "DAILY_API_KEY is not defined in the environment variables.",
          );
        }

        const createMeetingToken: AxiosResponse<MeetingToken> =
          await axios.post<MeetingToken>(
            `${DAILY_API_BASE_URL}/meeting-tokens`,
            {
              properties: {
                room_name: input.roomName,
                user_id: input.userId,
                user_name: input.username,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            },
          );

        return createMeetingToken.data.token;
      } catch (error) {
        throw new Error("Error creating meeting token");
      }
    }),
});
